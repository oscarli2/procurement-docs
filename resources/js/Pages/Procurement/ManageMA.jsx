import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function ManageMA({ mas = [] }) {
  const handleDelete = (id) => {
    if (!confirm('Delete this MA?')) return;
    router.delete(`/mas/${id}`);
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manage Market Analysis</h2>}>
      <Head title="Manage Market Analysis" />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Market Analyses</h3>
          <Link href="/mas/create" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">New MA</Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {mas.map((ma) => (
                <tr key={ma.id} className="border-t">
                  <td className="px-4 py-3">#{ma.id}</td>
                  <td className="px-4 py-3">{ma.title || '-'}</td>
                  <td className="px-4 py-3">{ma.status}</td>
                  <td className="px-4 py-3">{ma.items_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/mas/${ma.id}/edit`} className="rounded-lg bg-amber-500 px-3 py-1.5 text-white">Edit</Link>
                      <a href={`/download-ma/${ma.id}`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white">PDF</a>
                      <button type="button" onClick={() => handleDelete(ma.id)} className="rounded-lg bg-rose-600 px-3 py-1.5 text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}