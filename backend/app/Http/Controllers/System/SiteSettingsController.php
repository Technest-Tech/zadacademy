<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Support\System\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{
    /** Public-site contact details + social links, stored as flat `site.*` keys. */
    private array $keys = [
        'site.contact_email',
        'site.contact_phone',
        'site.contact_whatsapp',
        'site.contact_address',
        'site.social_facebook',
        'site.social_instagram',
        'site.social_youtube',
        'site.social_twitter',
        'site.social_tiktok',
        'site.social_telegram',
    ];

    public function show(): JsonResponse
    {
        $data = [];
        foreach ($this->keys as $key) {
            $data[$key] = Setting::get($key, '');
        }

        return response()->json(['data' => $data]);
    }

    public function update(Request $request): JsonResponse
    {
        $incoming = array_intersect_key($request->all(), array_flip($this->keys));

        $validated = validator($incoming, [
            'site.contact_email'    => ['sometimes', 'nullable', 'email', 'max:255'],
            'site.contact_phone'    => ['sometimes', 'nullable', 'string', 'max:40'],
            'site.contact_whatsapp' => ['sometimes', 'nullable', 'string', 'max:40'],
            'site.contact_address'  => ['sometimes', 'nullable', 'string', 'max:500'],
            'site.social_facebook'  => ['sometimes', 'nullable', 'url', 'max:255'],
            'site.social_instagram' => ['sometimes', 'nullable', 'url', 'max:255'],
            'site.social_youtube'   => ['sometimes', 'nullable', 'url', 'max:255'],
            'site.social_twitter'   => ['sometimes', 'nullable', 'url', 'max:255'],
            'site.social_tiktok'    => ['sometimes', 'nullable', 'url', 'max:255'],
            'site.social_telegram'  => ['sometimes', 'nullable', 'url', 'max:255'],
        ])->validate();

        foreach ($validated as $key => $value) {
            Setting::set($key, $value ?? '');
        }

        return response()->json(['message' => 'Site settings saved.']);
    }
}
