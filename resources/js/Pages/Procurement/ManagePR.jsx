import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManagePR({ prs = [] }) {
  const handleDelete = (id) => {
    if (!confirm('Delete this PR? This cannot be undone.')) {
      return;
    }

    router.delete(`/prs/${id}`);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Manage Purchase Requests
        </h2>
      }
    >
    <div className="min-h-screen bg-slate-100/80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-6 md:px-8 md:py-10">
      <Head title="Manage Purchase Requests" />

      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Management View
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Manage Purchase Requests</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              Retrieve, update, or download existing PR records from a cleaner table view.
            </p>
          </div>
            <Link href="/create-pr" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Create New PR
            </Link>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8">
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total PRs</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{prs.length}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Latest Office</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{prs[0]?.office_section || '-'}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ready for Update</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{prs.length > 0 ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Office/Section</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Purpose</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Items</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {prs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center text-sm italic text-slate-500">
                        No purchase requests found.
                      </td>
                    </tr>
                  ) : (
                    prs.map((pr) => (
                      <tr key={pr.id} className="align-top hover:bg-slate-50/80">
                        <td className="px-4 py-4 text-sm font-medium text-slate-700">#{pr.id}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{pr.office_section || '-'}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{pr.date || '-'}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{pr.purpose || '-'}</td>
                        <td className="px-4 py-4 text-center text-sm font-semibold text-slate-700">{pr.items_count ?? 0}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap justify-center gap-2">
                            <Link href={`/prs/${pr.id}/edit`} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600">
                              Edit
                            </Link>
                            <a href={`/download-pr/${pr.id}`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                              Download
                            </a>
                            <button type="button" onClick={() => handleDelete(pr.id)} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700">
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
