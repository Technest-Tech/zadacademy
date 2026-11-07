<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\TrialBookingCreated;
use App\Http\Controllers\Controller;
use App\Mail\TrialBookingConfirmation;
use App\Models\TrialBooking;
use App\Services\BookingReferenceGenerator;
use App\Services\System\LeadFromTrialBookingConverter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TrialBookingController extends Controller
{
    public function store(
        Request $request,
        BookingReferenceGenerator $refs,
        LeadFromTrialBookingConverter $leads,
    ): JsonResponse {
        $validated = $request->validate([
            'name'           => 'required|string|max:100',
            // The short form sends a WhatsApp number instead of an email; one of the two is required.
            'email'          => 'nullable|required_without:phone|email|max:255',
            'country'        => 'required|string|max:100',
            'phone'          => 'nullable|required_without:email|string|max:30',
            'ageGroup'       => 'required|in:kid-5-8,kid-9-12,teen,adult',
            'courseInterest' => 'required|string|max:100',
            'preferredTime'  => 'required|string|max:50',
            'timezone'       => 'required|string|max:100',
            'message'        => 'nullable|string|max:500',
        ]);

        $booking = TrialBooking::create([
            'reference'       => $refs->forTrialBooking(),
            'name'            => $validated['name'],
            'email'           => $validated['email'] ?? null,
            'country'         => $validated['country'],
            'phone'           => $validated['phone'] ?? null,
            'age_group'       => $validated['ageGroup'],
            'course_interest' => $validated['courseInterest'],
            'preferred_time'  => $validated['preferredTime'],
            'timezone'        => $validated['timezone'],
            'message'         => $validated['message'] ?? null,
        ]);

        // A trial booking is a hot inquiry — surface it in the CRM as a new lead.
        // The converter owns the mapping (notably country name → 2-char code,
        // which sys_leads.country requires) and is idempotent, so the queued
        // listener below finds this lead instead of creating a second one.
        try {
            $leads->convert($booking);
        } catch (\Throwable $e) {
            Log::warning('Failed to create lead from trial booking', ['booking' => $booking->id, 'error' => $e->getMessage()]);
        }

        TrialBookingCreated::dispatch($booking);

        // The website sends the admin notification through Web3Forms after
        // this response confirms the booking was saved successfully.
        // Bookings from the short WhatsApp form carry no email to confirm to.
        if ($booking->email) {
            Mail::to($booking->email)
                ->queue(new TrialBookingConfirmation($booking));
        }

        return response()->json([
            'reference' => $booking->reference,
            'message'   => 'Your trial class has been booked! Check your email for confirmation.',
        ], 201);
    }
}
