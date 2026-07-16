<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserAdminController extends Controller
{
    private function ensureAdmin(): void
    {
        abort_unless((bool) auth()->user()?->is_admin, 403);
    }

    public function index(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('Admin/Users', [
            'users' => User::query()->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('Admin/UserForm', [
            'user' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'is_admin' => ['nullable', 'boolean'],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_admin' => (bool) ($data['is_admin'] ?? false),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        $this->ensureAdmin();

        return Inertia::render('Admin/UserForm', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'is_admin' => ['nullable', 'boolean'],
        ]);

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'is_admin' => (bool) ($data['is_admin'] ?? false),
        ];

        if (! empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $user->update($payload);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function toggleAdmin(User $user): RedirectResponse
    {
        $this->ensureAdmin();
        abort_if($user->is(auth()->user()), 403);

        $user->update([
            'is_admin' => ! $user->is_admin,
        ]);

        return back();
    }
}