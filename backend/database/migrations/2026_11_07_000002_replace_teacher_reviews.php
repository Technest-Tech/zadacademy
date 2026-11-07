<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;

/**
 * Hide every review currently on the teacher profiles: none of them came from
 * real students. They are hidden (approved = false), not deleted.
 *
 * Profiles will show reviews again as soon as real students leave one through
 * the review form on the teacher's page, or the team adds and approves one in
 * the admin panel.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('teacher_reviews')->update(['approved' => false, 'updated_at' => now()]);
    }

    /** Hidden reviews stay hidden; re-approve any genuine one from the admin panel. */
    public function down(): void {}
};
