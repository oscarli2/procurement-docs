import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const createEmptyItem = () => ({
  description: '',
  type: '',
  quantity: '',
  size: '',
  mode: '',
  pre_procurement: 'No',
  start: '',
  end: '',
  delivery: '',
  source: '',
  budget: '',
  supporting: '',
  remarks: '',
});

const stripHtml = (value) => (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const mapMaItemToPpmpItem = (item, marketAnalysis) => {
  const quantity = Number(item.qty) || 0;
  const adjustedPrice = Number(item.adjusted_price) || 0;

  return {
    description: stripHtml(item.item_description),
    type: 'Goods',
    quantity: quantity ? String(quantity) : '',
    size: item.unit || '',
    mode: 'Market Analysis',
    pre_procurement: 'Yes',
    start: '',
    end: '',
    delivery: '',
    source: `Completed MA #${marketAnalysis.id}`,
    budget: quantity * adjustedPrice,
    supporting: marketAnalysis.title || marketAnalysis.company_name || 'Completed market analysis',
    remarks: `Imported from completed MA item ${item.id || ''}`.trim(),
  };
};

export default function CreatePPMP({ ppmp = null, mas = [] }) {
  const isEditing = Boolean(ppmp?.id);
  const [selectedMaId, setSelectedMaId] = useState('');

  const [ppmpHeader, setPpmpHeader] = useState(() => ({
    fiscal_year: ppmp?.fiscal_year || new Date().getFullYear(),
    end_user: ppmp?.end_user || '',
    prepared_by_name: ppmp?.prepared_by_name || localStorage.getItem('ppmp_prepared_name') || '',
    prepared_by_designation:
      ppmp?.prepared_by_designation || localStorage.getItem('ppmp_prepared_designation') || '',
    submitted_by_name: ppmp?.submitted_by_name || localStorage.getItem('ppmp_submitted_name') || '',
    submitted_by_designation:
      ppmp?.submitted_by_designation || localStorage.getItem('ppmp_submitted_designation') || '',
  }));

  const [items, setItems] = useState(() => {
    const mappedItems = (ppmp?.items || []).map((item) => ({
      description: item.description || '',
      type: item.type || '',
      quantity: item.quantity || '',
      size: item.size || '',
      mode: item.mode || '',
      pre_procurement: item.pre_procurement || 'No',
      start: item.start || '',
      end: item.end || '',
      delivery: item.delivery || '',
      source: item.source || '',
      budget: item.budget || '',
      supporting: item.supporting || '',
      remarks: item.remarks || '',
    }));

    return mappedItems.length > 0 ? mappedItems : [createEmptyItem()];
  });

  const selectedMa = mas.find((ma) => String(ma.id) === String(selectedMaId)) || null;

  const importCompletedMa = (maId) => {
    setSelectedMaId(maId);

    const matchedMa = mas.find((ma) => String(ma.id) === String(maId));

    if (!matchedMa?.items?.length) {
      return;
    }

    setItems(matchedMa.items.map((item) => mapMaItemToPpmpItem(item, matchedMa)));
  };

  const addItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeItem = (index) => {
    const copy = [...items];
    copy.splice(index, 1);
    setItems(copy.length > 0 ? copy : [createEmptyItem()]);
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const handleSubmit = () => {
    const payload = {
      ...ppmpHeader,
      items,
    };

    if (isEditing) {
      router.put(`/ppmps/${ppmp.id}`, payload);
      return;
    }

    router.post('/ppmps', payload);
  };

  const savePreparedDefault = () => {
    localStorage.setItem('ppmp_prepared_name', ppmpHeader.prepared_by_name);
    localStorage.setItem('ppmp_prepared_designation', ppmpHeader.prepared_by_designation);
    localStorage.setItem('ppmp_submitted_name', ppmpHeader.submitted_by_name);
    localStorage.setItem('ppmp_submitted_designation', ppmpHeader.submitted_by_designation);
    alert('Prepared and submitted signatories saved! These will now load automatically next time.');
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {isEditing ? 'Edit PPMP' : 'Create PPMP'}
        </h2>
      }
    >
      <Head title={isEditing ? 'Edit PPMP' : 'Create PPMP'} />

      <div className="min-h-screen bg-slate-100/80 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Procurement Form
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {isEditing ? 'Edit Project Procurement Management Plan' : 'Create Project Procurement Management Plan'}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Keep the PPMP workflow intact while presenting the sections in a cleaner, more deliberate layout.
              </p>
            </div>

            <Link
              href="/ppmps"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
            >
              Retrieve Existing PPMP
            </Link>
          </div>
        </div>

        <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Header Details</h3>
              <p className="text-sm text-slate-600">Basic PPMP information and default signatory actions.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Fiscal Year</label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  value={ppmpHeader.fiscal_year}
                  onChange={(e) => setPpmpHeader({ ...ppmpHeader, fiscal_year: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">End-User / Implementing Unit</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  value={ppmpHeader.end_user}
                  onChange={(e) => setPpmpHeader({ ...ppmpHeader, end_user: e.target.value })}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={savePreparedDefault}
                  type="button"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Save Prepared Default
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Import Completed Market Analysis</h3>
              <p className="text-sm text-slate-600">Load adjusted MA items into the PPMP item cards.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Completed MA</label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  value={selectedMaId}
                  onChange={(e) => importCompletedMa(e.target.value)}
                >
                  <option value="">-- Select a completed MA --</option>
                  {mas.map((ma) => (
                    <option key={ma.id} value={ma.id}>
                      MA #{ma.id} | {ma.title || ma.company_name || 'Completed MA'} | {ma.items?.length || 0} items
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {selectedMa ? (
                  <>
                    <div className="font-semibold text-slate-900">Imported MA #{selectedMa.id}</div>
                    <div>{selectedMa.items?.length || 0} items mapped into the PPMP grid.</div>
                  </>
                ) : (
                  'Select a completed MA to prefill the PPMP rows.'
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h3 className="text-lg font-semibold text-slate-900">Prepared By</h3>
              <p className="mt-1 text-sm text-slate-600">These details are used in the PDF signature block.</p>

              <label className="mt-4 mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={ppmpHeader.prepared_by_name}
                onChange={(e) => setPpmpHeader({ ...ppmpHeader, prepared_by_name: e.target.value })}
              />
              <label className="mb-1.5 mt-3 block text-sm font-semibold text-slate-700">Designation</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={ppmpHeader.prepared_by_designation}
                onChange={(e) => setPpmpHeader({ ...ppmpHeader, prepared_by_designation: e.target.value })}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h3 className="text-lg font-semibold text-slate-900">Submitted By</h3>
              <p className="mt-1 text-sm text-slate-600">These details are also used in the PDF signature block.</p>

              <label className="mt-4 mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={ppmpHeader.submitted_by_name}
                onChange={(e) => setPpmpHeader({ ...ppmpHeader, submitted_by_name: e.target.value })}
              />
              <label className="mb-1.5 mt-3 block text-sm font-semibold text-slate-700">Designation</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={ppmpHeader.submitted_by_designation}
                onChange={(e) => setPpmpHeader({ ...ppmpHeader, submitted_by_designation: e.target.value })}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Procurement Items</h3>
                <p className="text-sm text-slate-600">Use one card per procurement line item.</p>
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Items: {items.length}
              </div>
            </div>

            <div className="space-y-4">
              {items.map((it, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="font-semibold text-slate-800">Item {idx + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">Description</label>
                      <textarea
                        className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        value={it.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      />
                    </div>

                    <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Type</label>
                        <input
                          value={it.type}
                          onChange={(e) => updateItem(idx, 'type', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Size</label>
                        <input
                          value={it.size}
                          onChange={(e) => updateItem(idx, 'size', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mode</label>
                        <input
                          value={it.mode}
                          onChange={(e) => updateItem(idx, 'mode', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Pre-Proc</label>
                        <select
                          value={it.pre_procurement}
                          onChange={(e) => updateItem(idx, 'pre_procurement', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Start</label>
                        <input
                          type="month"
                          value={it.start}
                          onChange={(e) => updateItem(idx, 'start', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">End</label>
                        <input
                          type="month"
                          value={it.end}
                          onChange={(e) => updateItem(idx, 'end', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Delivery</label>
                        <input
                          type="month"
                          value={it.delivery}
                          onChange={(e) => updateItem(idx, 'delivery', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Source</label>
                        <input
                          value={it.source}
                          onChange={(e) => updateItem(idx, 'source', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-12 grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Budget (PHP)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={it.budget}
                          onChange={(e) => updateItem(idx, 'budget', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Supporting</label>
                        <input
                          value={it.supporting}
                          onChange={(e) => updateItem(idx, 'supporting', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Remarks</label>
                        <input
                          value={it.remarks}
                          onChange={(e) => updateItem(idx, 'remarks', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
              >
                Add Item
              </button>

              <button
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!items.length || !ppmpHeader.fiscal_year}
              >
                {isEditing ? 'Update & Generate PDF' : 'Save & Generate PDF'}
              </button>
            </div>
          </section>
        </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}