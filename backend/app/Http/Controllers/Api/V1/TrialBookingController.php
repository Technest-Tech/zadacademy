<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\TrialBookingCreated;
use App\Http\Controllers\Controller;
use App\Mail\TrialBookingConfirmation;
use App\Models\System\Lead;
use App\Models\TrialBooking;
use App\Services\BookingReferenceGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TrialBookingController extends Controller
{
    public function store(Request $request, BookingReferenceGenerator $refs): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:100',
            'email'          => 'required|email|max:255',
            'country'        => 'required|string|max:100',
            'phone'          => 'nullable|string|max:30',
            'ageGroup'       => 'required|in:kid-5-8,kid-9-12,teen,adult',
            'courseInterest' => 'required|string|max:100',
            'preferredTime'  => 'required|string|max:50',
            'timezone'       => 'required|string|max:100',
            'message'        => 'nullable|string|max:500',
        ]);

        $booking = TrialBooking::create([
            'reference'       => $refs->forTrialBooking(),
            'name'            => $validated['name'],
            'email'           => $validated['email'],
            'country'         => $validated['country'],
            'phone'           => $validated['phone'] ?? null,
            'age_group'       => $validated['ageGroup'],
            'course_interest' => $validated['courseInterest'],
            'preferred_time'  => $validated['preferredTime'],
            'timezone'        => $validated['timezone'],
            'message'         => $validated['message'] ?? null,
        ]);

        // A trial booking is a hot inquiry — surface it in the CRM as a new lead.
        try {
            Lead::create([
                'name'             => $booking->name,
                'email'            => $booking->email,
                'phone'            => $booking->phone,
                'country'          => $booking->country,
                'source'           => 'website_form',
                'source_detail'    => 'Free trial booking · ' . $booking->reference,
                'platform'         => 'website',
                'status'           => 'new_lead',
                'notes'            => trim(
                    ($booking->message ? $booking->message . "\n\n" : '') .
                    "Course: {$booking->course_interest} · Age: {$booking->age_group} · " .
                    "Preferred: {$booking->preferred_time} ({$booking->timezone})"
                ),
                'trial_booking_id' => $booking->id,
                'payload'          => [
                    'age_group'       => $booking->age_group,
                    'course_interest' => $booking->course_interest,
                    'preferred_time'  => $booking->preferred_time,
                    'timezone'        => $booking->timezone,
                    'reference'       => $booking->reference,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to create lead from trial booking', ['booking' => $booking->id, 'error' => $e->getMessage()]);
        }

        TrialBookingCreated::dispatch($booking);

        // The website sends the admin notification through Web3Forms after
        // this response confirms the booking was saved successfully.
        Mail::to($booking->email)
            ->queue(new TrialBookingConfirmation($booking));

        return response()->json([
            'reference' => $booking->reference,
            'message'   => 'Your trial class has been booked! Check your email for confirmation.',
        ], 201);
    }
}
