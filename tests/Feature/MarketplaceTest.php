<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    public function test_unverified_visitors_are_redirected_to_the_age_gate(): void
    {
        $this->get(route('marketplace.index'))
            ->assertRedirect(route('age-gate.create'));
    }

    public function test_an_adult_is_sent_to_registration_after_age_validation(): void
    {
        $this->post(route('age-gate.store'), [
            'birth_date' => now()->subYears(18)->toDateString(),
            'country' => 'CO',
            'terms_accepted' => true,
        ])->assertRedirect(route('register.create'));

        $this->get(route('marketplace.index'))
            ->assertRedirect(route('login'));
    }

    public function test_an_expired_registration_cookie_returns_to_the_age_gate_without_a_redirect_loop(): void
    {
        $this->withSession(['age_verified_at' => now()->toIso8601String()])
            ->get(route('register.create'))
            ->assertRedirect(route('age-gate.create'));

        $this->get(route('age-gate.create'))
            ->assertOk();
    }

    public function test_a_minor_cannot_validate_access(): void
    {
        $this->post(route('age-gate.store'), [
            'birth_date' => now()->subYears(18)->addDay()->toDateString(),
            'country' => 'CO',
            'terms_accepted' => true,
        ])->assertSessionHasErrors('birth_date');
    }

    public function test_only_an_authenticated_adult_can_access_the_dashboard(): void
    {
        $user = User::factory()->make();

        $this->actingAs($user)
            ->withSession(['age_verified_at' => now()->toIso8601String()])
            ->get(route('marketplace.index'))
            ->assertOk()
            ->assertViewIs('app');
    }

    public function test_user_roles_can_be_checked_without_relying_on_the_legacy_flag(): void
    {
        $user = User::factory()->make(['role' => UserRole::Moderator]);

        $this->assertTrue($user->hasRole(UserRole::Moderator));
        $this->assertTrue($user->hasRole('moderator'));
        $this->assertFalse($user->isSuperAdmin());
    }

    public function test_only_registration_fields_are_fillable(): void
    {
        $user = new User;

        $this->assertContains('name', $user->getFillable());
        $this->assertContains('email', $user->getFillable());
        $this->assertContains('password', $user->getFillable());
        $this->assertContains('country', $user->getFillable());
        $this->assertNotContains('role', $user->getFillable());
        $this->assertNotContains('is_super_admin', $user->getFillable());
    }
}
