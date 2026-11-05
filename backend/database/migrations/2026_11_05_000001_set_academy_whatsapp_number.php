<?php

use App\Support\System\Setting;
use Illuminate\Database\Migrations\Migration;

/**
 * The footer reads its number from these settings, not from the frontend's
 * config, so changing the academy's WhatsApp number in code alone would leave
 * the footer showing and opening the old one.
 */
return new class extends Migration
{
    public function up(): void
    {
        Setting::set('site.contact_phone', '+33 7 80 93 30 87');
        Setting::set('site.contact_whatsapp', '33780933087');
    }

    /** Nothing to restore: the previous value is not known here. */
    public function down(): void {}
};
