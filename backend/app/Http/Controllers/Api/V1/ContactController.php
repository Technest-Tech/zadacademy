<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\ContactConfirmation;
use App\Mail\ContactReceived;
use App\Models\ContactMessage;
use App\Models\System\Lead;
use App\Services\BookingReferenceGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request, BookingReferenceGenerator $refs): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $contact = ContactMessage::create([
            'reference' => $refs->forContact(),
            ...$validated,
        ]);

        // Surface every contact message in the CRM as a new lead.
        try {
            Lead::create([
                'name'          => $contact->name,
                'email'         => $contact->email,
                'source'        => 'website_form',
                'source_detail' => 'Contact form · ' . $contact->subject,
                'platform'      => 'website',
                'status'        => 'new_lead',
                'notes'         => $contact->message,
                'payload'       => ['subject' => $contact->subject, 'reference' => $contact->reference],
            ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to create lead from contact message', ['contact' => $contact->id, 'error' => $e->getMessage()]);
        }

        Mail::to(config('mail.admin_address', 'info@zadacademiq.com'))
            ->queue(new ContactReceived($contact));
        Mail::to($contact->email)
            ->queue(new ContactConfirmation($contact));

        return response()->json([
            'reference' => $contact->reference,
            'message'   => 'Your message has been received! We will reply within 24 hours.',
        ], 201);
    }
}
