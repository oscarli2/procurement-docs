import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManagePPMP({ ppmps = [] }) {
  const handleDelete = (id) => {
    if (!confirm('Delete this PPMP? This cannot be undone.')) {
      return;
    }

    router.delete(`/ppmps/${id}`);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Manage PPMP
        </h2>
      }
    >
    <div className="min-h-screen bg-slate-100/80 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-6 md:px-8 md:py-10">
      <Head title="Manage PPMP" />

      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Management View
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Manage PPMP</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              Retrieve, update, or download existing PPMP records from a cleaner table view.
            </p>
          </div>
            <Link href="/create-ppmp" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
              Create New PPMP
            </Link>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8">
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total PPMPs</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{ppmps.length}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Latest Fiscal Year</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{ppmps[0]?.fiscal_year || '-'}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ready for Update</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{ppmps.length > 0 ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Fiscal Year</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">End-User</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Items</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Prepared By</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {ppmps.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center text-sm italic text-slate-500">
                        No PPMP records found.
                      </td>
                    </tr>
                  ) : (
                    ppmps.map((ppmp) => (
                      <tr key={ppmp.id} className="align-top hover:bg-slate-50/80">
                        <td className="px-4 py-4 text-sm font-medium text-slate-700">#{ppmp.id}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{ppmp.fiscal_year || '-'}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{ppmp.end_user || '-'}</td>
                        <td className="px-4 py-4 text-center text-sm font-semibold text-slate-700">{ppmp.items_count ?? 0}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-700">{ppmp.prepared_by_name || '-'}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap justify-center gap-2">
                            <Link href={`/ppmps/${ppmp.id}/edit`} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600">
                              Edit
                            </Link>
                            <a href={`/ppmps/${ppmp.id}/download`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                              Download
                            </a>
                            <button type="button" onClick={() => handleDelete(ppmp.id)} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700">
                              Delete
                            </button>
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
    </div>
    </AuthenticatedLayout>
  );
}
