<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Buat peran 'customer' untuk pengujian
    Role::create(['name' => 'customer']);
});

it('registers a user and assigns the customer role', function () {
    $response = $this->postJson('/register', [
        'name' => 'John Doe',
        'username' => 'johndoe',
        'email' => 'johndoe@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(204);

    $user = User::where('email', 'johndoe@example.com')->first();

    expect($user)->not()->toBeNull();
    expect($user->hasRole('customer'))->toBeTrue();
});
