<?php

use App\Support\System\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = [
            'site.contact_email'    => 'zadacademiq@gmail.com',
            'site.contact_phone'    => '+33 7 80 93 30 87',
            'site.contact_whatsapp' => '33780933087',
            'site.contact_address'  => 'Online — Serving students worldwide',
            'site.social_facebook'  => 'https://www.facebook.com/profile.php?id=61591750688347',
            'site.social_instagram' => 'https://www.instagram.com/zadacademiq414/',
            'site.social_youtube'   => '',
            'site.social_twitter'   => '',
            'site.social_tiktok'    => '',
            'site.social_telegram'  => '',
        ];

        foreach ($defaults as $key => $value) {
            if (Setting::get($key) === null) {
                Setting::set($key, $value);
            }
        }
    }

    public function down(): void
    {
        \Illuminate\Support\Facades\DB::table('sys_settings')->where('key', 'like', 'site.%')->delete();
    }
};
