import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function UserForm({ user = null }) {
  const isEditing = Boolean(user?.id);

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    is_admin: Boolean(user?.is_admin),
  });

  const submit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(route('users.update', user.id));
      return;
    }

    post(route('users.store'));
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>
      }
    >
      <Head title={isEditing ? 'Edit User' : 'Add New User'} />

      <div className="min-h-screen bg-slate-100/80 px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {isEditing
                  ? 'Update the account details below. Leave password blank if you do not want to change it.'
                  : 'Create a new user account and set the initial password.'}
              </p>
            </div>
            <Link href={route('users.index')} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              Back to Users
            </Link>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && <div className="mt-1 text-sm text-rose-600">{errors.name}</div>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && <div className="mt-1 text-sm text-rose-600">{errors.email}</div>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder={isEditing ? 'Leave blank to keep the current password' : 'Enter password'}
              />
              {errors.password && <div className="mt-1 text-sm text-rose-600">{errors.password}</div>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={data.is_admin}
                onChange={(e) => setData('is_admin', e.target.checked)}
              />
              <span className="text-sm font-semibold text-slate-700">Grant admin access</span>
            </label>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
              <Link href={route('users.index')} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isEditing ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}