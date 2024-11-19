<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Eager load roles with their permissions
        $user->load('roles.permissions');

        // Get direct permissions
        $directPermissions = $user->getDirectPermissions()->pluck('name');

        // Get permissions inherited through roles
        $permissionsViaRoles = $user->getPermissionsViaRoles()->pluck('name');

        // Merge both direct and role permissions
        $allPermissions = $directPermissions->merge($permissionsViaRoles)->unique();

        return response()->json([
            'user' => $user,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $allPermissions,
        ]);
    }
}
