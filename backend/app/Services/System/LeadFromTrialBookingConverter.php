<?php

namespace App\Services\System;

use App\Models\System\Lead;
use App\Models\TrialBooking;

class LeadFromTrialBookingConverter
{
    /**
     * Country name → ISO-3166 alpha-2 code. Trial bookings store the full
     * country name (varchar 100), but sys_leads.country is a 2-char code, so
     * we translate at this boundary. Covers every country the public trial
     * form offers; anything else falls back to null.
     */
    private const COUNTRY_CODES = [
        'france' => 'FR', 'united states' => 'US', 'united kingdom' => 'GB',
        'canada' => 'CA', 'australia' => 'AU', 'germany' => 'DE',
        'netherlands' => 'NL', 'belgium' => 'BE', 'sweden' => 'SE',
        'norway' => 'NO', 'denmark' => 'DK', 'uae' => 'AE',
        'saudi arabia' => 'SA', 'qatar' => 'QA', 'kuwait' => 'KW',
        'bahrain' => 'BH', 'malaysia' => 'MY', 'pakistan' => 'PK',
        'egypt' => 'EG', 'turkey' => 'TR', 'south africa' => 'ZA',
    ];

    private function countryCode(?string $country): ?string
    {
        if ($country === null || $country === '') return null;
        // Already a 2-letter code
        if (strlen($country) === 2) return strtoupper($country);
        return self::COUNTRY_CODES[strtolower(trim($country))] ?? null;
    }

    public function convert(TrialBooking $tb): Lead
    {
        // Idempotent — return existing lead if already created
        $existing = Lead::where('trial_booking_id', $tb->id)->first();
        if ($existing) return $existing;

        return Lead::create([
            'name'             => $tb->name,
            'email'            => $tb->email ?? null,
            'phone'            => $tb->phone ?? null,
            'whatsapp'         => $tb->whatsapp ?? $tb->phone ?? null,
            'country'          => $this->countryCode($tb->country),
            'source'           => 'website_form',
            'source_detail'    => $tb->meta['utm_source'] ?? null,
            'status'           => 'new_lead',
            'trial_booking_id' => $tb->id,
            'payload'          => array_filter([
                'preferred_time' => $tb->preferred_time ?? null,
                'age_group'      => $tb->age_group ?? null,
                'message'        => $tb->message ?? null,
                'utm_source'     => $tb->meta['utm_source'] ?? null,
                'utm_campaign'   => $tb->meta['utm_campaign'] ?? null,
            ]),
        ]);
    }
}
