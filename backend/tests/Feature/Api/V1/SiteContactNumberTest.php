<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteContactNumberTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_footer_is_given_the_academys_whatsapp_number(): void
    {
        $this->getJson('/api/v1/site-settings')
            ->assertOk()
            ->assertJsonPath('data.contact.whatsapp', '33780933087')
            ->assertJsonPath('data.contact.phone', '+33 7 80 93 30 87');
    }
}
