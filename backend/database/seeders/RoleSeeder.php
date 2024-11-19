<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
         // Create permissions
        $permissions = [
            'user_management',
            'order_create_and_index',
            'order_management',
            'product_management',
            'print_management',
        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        // Create roles
        $superAdminRole = Role::create(['name' => 'super_admin']);
        $adminRole = Role::create(['name' => 'admin']);
        $customerRole = Role::create(['name' => 'customer']);

        // Super Admin gets all permissions
        $superAdminRole->givePermissionTo(Permission::all());
         // Admin gets specific permissions
        $adminRole->givePermissionTo([
            'order_create_and_index',
            'product_management',
            'print_management',
            'user_management'
        ]);
        $customerRole->givePermissionTo([
            'order_create_and_index',
        ]);
        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Muh Furqan Supriadi',
            'username' => 'muhfurqans35',
            'email' => 'muhfurqans35@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('12345678'),
            'address' => 'Btn Tabaria Tower Blok E10 No.9',
            'province' => 'Sulawesi Selatan',
            'city' => 'Makassar',
            'district' => 'Tamalate',
            'subdistrict' => 'Mannuruki',
            'postcode' => '90221',
            'phone' => '085796845934',
            'image' => null,
            'longitude' => '-5.181465633742733',
            'latitude' => '-119.42991251963204',
            'remember_token' => Str::random(10),
        ]);

        // Assign role to super admin and token
        $superAdmin->assignRole($superAdminRole);

        // Create Regular Admin
        $admin = User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'),
            'address' => 'Jl. Admin No. 1',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'subdistrict' => 'Senayan',
            'postcode' => '12190',
            'phone' => '081234567891',
            'image' => null,
            'longitude' => '106.8456',
            'latitude' => '-6.2088',
            'remember_token' => Str::random(10),
        ]);

        // Assign role to admin and token
        $admin->assignRole($adminRole);
    }
}
