import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function CompletedMA({ mas = [] }) {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Completed Market Analysis</h2>}>
      <Head title="Completed Market Analysis" />

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Completed MA Records</h3>
            <p className="text-sm text-slate-600">These are the priced market analyses available for import.</p>
          </div>
          <Link href="/mas/create" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            New MA
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total Adjusted</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">
                    No completed MA records yet.
                  </td>
                </tr>
              ) : (
                mas.map((ma) => (
                  <tr key={ma.id} className="border-t">
                    <td className="px-4 py-3">#{ma.id}</td>
                    <td className="px-4 py-3">{ma.title || '-'}</td>
                    <td className="px-4 py-3">{ma.company_name || '-'}</td>
                    <td className="px-4 py-3">{ma.items_count ?? ma.items?.length ?? 0}</td>
                    <td className="px-4 py-3">₱ {Number(ma.total_adjusted || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/mas/${ma.id}/edit`} className="rounded-lg bg-amber-500 px-3 py-1.5 text-white">
                          Edit
                        </Link>
                        <a href={`/download-ma/${ma.id}`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white">
                          PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}