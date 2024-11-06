<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
    $user = $request->user();
    $user->load('roles'); // Load roles with the user

    return response()->json([
        'user' => $user,
        'roles' => $user->roles->pluck('name'), // Return only role names
    ]);
    }
}
