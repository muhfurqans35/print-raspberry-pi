<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $cacheKey = 'user_roles_permissions_' . $user->id;

        $data = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($user) {

            $user->load('roles.permissions');

            $directPermissions = $user->getDirectPermissions()->pluck('name');
            $permissionsViaRoles = $user->getPermissionsViaRoles()->pluck('name');

            return [
                'user' => $user,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $directPermissions->merge($permissionsViaRoles)->unique()
            ];
        });

        return response()->json($data);
    }
}
