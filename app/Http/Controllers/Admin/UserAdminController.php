<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
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