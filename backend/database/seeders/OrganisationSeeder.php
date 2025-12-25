<?php

namespace Database\Seeders;

use App\Models\Organisation;
use Illuminate\Database\Seeder;

class OrganisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create national/federal level organisation
        $national = Organisation::create([
            'name' => 'National Health Organization',
            'slug' => 'national-health-org',
            'description' => 'National level health organization',
            'administrative_level' => 'national',
            'location' => [
                'country' => 'Global',
                'administrative_level_1' => null,
                'administrative_level_2' => null,
                'city' => null,
            ],
            'is_active' => true,
        ]);

        // Create regional/state level organisation
        $regional = Organisation::create([
            'name' => 'Regional Health Department',
            'slug' => 'regional-health-dept',
            'description' => 'Regional level health department',
            'administrative_level' => 'regional',
            'parent_id' => $national->id,
            'location' => [
                'country' => 'Example Country',
                'administrative_level_1' => 'Region A',
                'administrative_level_2' => null,
                'city' => null,
            ],
            'is_active' => true,
        ]);

        // Create district/LGA level organisation
        $district = Organisation::create([
            'name' => 'District Health Office',
            'slug' => 'district-health-office',
            'description' => 'District level health office',
            'administrative_level' => 'district',
            'parent_id' => $regional->id,
            'location' => [
                'country' => 'Example Country',
                'administrative_level_1' => 'Region A',
                'administrative_level_2' => 'District 1',
                'city' => 'City X',
            ],
            'is_active' => true,
        ]);

        // Create local/municipal level organisation
        $local = Organisation::create([
            'name' => 'Local Health Center',
            'slug' => 'local-health-center',
            'description' => 'Local health center',
            'administrative_level' => 'local',
            'parent_id' => $district->id,
            'location' => [
                'country' => 'Example Country',
                'administrative_level_1' => 'Region A',
                'administrative_level_2' => 'District 1',
                'city' => 'City X',
            ],
            'is_active' => true,
        ]);

        // Create community level organisation
        $community = Organisation::create([
            'name' => 'Community Health Initiative',
            'slug' => 'community-health-initiative',
            'description' => 'Community level health initiative',
            'administrative_level' => 'community',
            'parent_id' => $local->id,
            'location' => [
                'country' => 'Example Country',
                'administrative_level_1' => 'Region A',
                'administrative_level_2' => 'District 1',
                'city' => 'City X',
            ],
            'is_active' => true,
        ]);
    }
}
