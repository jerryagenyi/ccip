<?php

namespace Database\Factories;

use App\Models\Organisation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organisation>
 */
class OrganisationFactory extends Factory
{
    protected $model = Organisation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();
        
        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->paragraph(),
            'logo' => null,
            'website' => fake()->url(),
            'email' => fake()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'administrative_level' => fake()->randomElement(['national', 'regional', 'district', 'local', 'community']),
            'parent_id' => null,
            'location' => [
                'country' => 'Nigeria',
                'administrative_level_1' => fake()->state(),
                'administrative_level_2' => fake()->city(),
                'city' => fake()->city(),
            ],
            'metadata' => null,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the organisation should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the organisation should have a parent.
     */
    public function withParent(?Organisation $parent = null): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent?->id ?? Organisation::factory(),
        ]);
    }
}

