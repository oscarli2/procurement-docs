import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Users({ users = [] }) {
    const currentUser = usePage().props.auth.user;

    const handleToggle = (user) => {
        if (!confirm(`Toggle admin access for ${user.name}?`)) {
            return;
        }

        router.patch(route('users.toggle-admin', user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manage Users
                </h2>
            }
        >
            <Head title="Manage Users" />

            <div className="min-h-screen bg-slate-100/80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-6 md:px-8 md:py-10">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 md:px-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                                    Admin View
                                </div>
                                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Manage Users</h2>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                                    Toggle admin access for existing users. Current admins cannot demote themselves from this screen.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6 md:px-8 md:py-8">
                        <div className="mb-4 grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total Users</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">{users.length}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Admins</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">{users.filter((user) => user.is_admin).length}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Non-Admins</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">{users.filter((user) => !user.is_admin).length}</div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead className="bg-slate-900 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">ID</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Name</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Email</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Status</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-10 text-center text-sm italic text-slate-500">
                                                    No users found.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id} className="align-top hover:bg-slate-50/80">
                                                    <td className="px-4 py-4 text-sm font-medium text-slate-700">#{user.id}</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700">{user.name}</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700">{user.email}</td>
                                                    <td className="px-4 py-4 text-center text-sm">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${user.is_admin ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                            {user.is_admin ? 'Admin' : 'User'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap justify-center gap-2">
                                                            <Link
                                                                href={route('users.edit', user.id)}
                                                                className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                                                            >
                                                                Edit
                                                            </Link>
                                                            {user.id === currentUser.id ? (
                                                                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-500">
                                                                    Current Admin
                                                                </span>
                                                            ) : user.is_admin ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggle(user)}
                                                                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                                                                >
                                                                    Remove Admin
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggle(user)}
                                                                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                                                >
                                                                    Make Admin
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link
                        href={route('users.create')}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        Add New User
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}