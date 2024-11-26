<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserManagementStoreRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UserManagementUpdateRequest;
use Illuminate\Support\Facades\Auth;

class UserManagementController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('role:super_admin|admin'); // Using role middleware for better access control
    // }

    public function index()
    {
        $users = Auth::user()->hasRole('super_admin')
            ? User::with('roles')->get()
            : User::role('user')->get();

        return response()->json($users);
    }

    public function store(UserManagementStoreRequest $request)
    {
        if (!Auth::user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $userData = $request->validated();
        $userData['password'] = Hash::make($userData['password']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $userData['image'] = $file->storeAs('images', uniqid() . '.' . $file->extension(), 'public');
        }

        $user = User::create($userData);
        $user->assignRole('admin');

        return response()->json($user, 201);
    }

    public function update(UserManagementUpdateRequest $request, $id)
    {

        $user = User::findOrFail($id);

        if (!Auth::user()->hasRole('super_admin') && !Auth::user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $userData = $request->validated();

        if ($request->has('password') && $request->password !== '') {
            $userData['password'] = Hash::make($userData['password']);
        }

        if ($request->hasFile('image')) {
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }
            $file = $request->file('image');
            $userData['image'] = $file->storeAs('images', uniqid() . '.' . $file->extension(), 'public');
        }

        $user->update($userData);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (!Auth::user()->hasRole('super_admin') && !Auth::user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($user->id === Auth::id()) {
            return response()->json(['error' => 'Cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
