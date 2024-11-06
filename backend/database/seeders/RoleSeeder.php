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
            'order_creats',
            'order_management',
            'service_management',
            'product_management',
        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        // Create roles
        $superAdminRole = Role::create(['name' => 'super_admin']);
        $adminRole = Role::create(['name' => 'admin']);
        $customerRole = Role::create(['name' => 'customer']);
        $serviceOwnerRole = Role::create(['name' => 'service_owner']);

        // Super Admin gets all permissions
        $superAdminRole->givePermissionTo(Permission::all());
         // Admin gets specific permissions
        $adminRole->givePermissionTo([
            'user_management',
            'order_creats',
            'service_management',
            'product_management',
        ]);
        $serviceOwnerRole->givePermissionTo([
            'service_management',
        ]);
        $customerRole->givePermissionTo([
            'order_creats',
        ]);
        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Muh Furqan Supriadi',
            'username' => 'muhfurqans35',
            'company_name' => 'Super Admin Company',
            'email' => 'muhfurqans35@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('supriadi99'),
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

        // Assign role to super admin
        $superAdmin->assignRole($superAdminRole);

        // Create Regular Admin
        $admin = User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'company_name' => 'Admin Company',
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

        // Assign role to admin
        $admin->assignRole($adminRole);
    }
}
