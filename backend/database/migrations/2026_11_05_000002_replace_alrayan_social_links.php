<?php

use App\Support\System\Setting;
use Illuminate\Database\Migrations\Migration;

/**
 * The site settings were seeded with Al Rayan Academy's social accounts, and
 * the footer prefers these settings over the frontend config, so every visitor
 * clicking Facebook or Instagram on zadacademiq.com landed on another brand.
 *
 * Only values still pointing at Al Rayan are replaced, so a link the team has
 * already changed from the admin panel is left alone.
 */
return new class extends Migration
{
    private const ZAD = [
        'site.social_facebook'  => 'https://www.facebook.com/profile.php?id=61591750688347',
        'site.social_instagram' => 'https://www.instagram.com/zadacademiq414/',
        // No Zad channel yet — an empty value hides the icon in the footer.
        'site.social_youtube'   => '',
        'site.social_twitter'   => '',
    ];

    public function up(): void
    {
        foreach (self::ZAD as $key => $value) {
            $current = (string) Setting::get($key, '');
            if (stripos($current, 'rayan') !== false) {
                Setting::set($key, $value);
            }
        }
    }

    /** Nothing to restore: Al Rayan's links should not come back. */
    public function down(): void {}
};
