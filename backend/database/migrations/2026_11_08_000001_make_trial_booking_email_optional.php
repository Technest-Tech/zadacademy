<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The website's booking form now asks only for a first name and a WhatsApp
 * number, then continues the conversation on WhatsApp, so a booking may arrive
 * without an email address.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trial_bookings', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('trial_bookings', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
        });
    }
};
