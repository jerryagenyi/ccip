<?php

namespace Database\Factories;

use App\Models\Organisation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password123'), // Default password for testing
            'phone_number' => fake()->phoneNumber(),
            'profile_picture' => null,
            'role' => 'user',
            'organisation_id' => null,
            'is_active' => true,
            'preferences' => null,
            'team' => null,
            'avatar_id' => null,
            'last_login' => null,
            'status' => 'active',
        ];
    }

    /**
     * Indicate that the user should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the user should have a specific role.
     */
    public function role(string $role): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => $role,
        ]);
    }

    /**
     * Indicate that the user should belong to an organisation.
     */
    public function withOrganisation(?Organisation $organisation = null): static
    {
        return $this->state(fn (array $attributes) => [
            'organisation_id' => $organisation?->id ?? Organisation::factory(),
        ]);
    }
}
