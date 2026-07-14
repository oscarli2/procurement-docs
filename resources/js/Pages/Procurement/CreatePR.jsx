import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const createEmptyItem = () => ({
  unit: 'pc',
  item_description: '',
  quantity: 1,
  unit_cost: 0,
});

const mapMaItemToPrItem = (item) => ({
  unit: item.unit || 'pc',
  item_description: item.item_description || '',
  quantity: Number(item.qty) || 0,
  unit_cost: Number(item.adjusted_price) || 0,
  total_cost: (Number(item.qty) || 0) * (Number(item.adjusted_price) || 0),
});

export default function CreatePR({ pr = null, mas = [] }) {
  const isEditing = Boolean(pr?.id);
  const [selectedMaId, setSelectedMaId] = useState('');

  const [headerData, setHeaderData] = useState(() => ({
    office_section: pr?.office_section || '',
    date: pr?.date || '',
    purpose: pr?.purpose || '',
    requested_by_name: pr?.requested_by_name || localStorage.getItem('pr_req_name') || '',
    requested_by_designation: pr?.requested_by_designation || localStorage.getItem('pr_req_desig') || '',
    approved_by_name: pr?.approved_by_name || localStorage.getItem('pr_app_name') || '',
    approved_by_designation: pr?.approved_by_designation || localStorage.getItem('pr_app_desig') || '',
  }));

  const [items, setItems] = useState(() =>
    (pr?.items || []).map((item) => ({
      unit: item.unit || 'pc',
      item_description: item.item_description || '',
      quantity: Number(item.quantity) || 0,
      unit_cost: Number(item.unit_cost) || 0,
      total_cost:
        Number(item.total_cost) ||
        (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0),
    })),
  );

  const [newItem, setNewItem] = useState(() => createEmptyItem());
  const [editingIndex, setEditingIndex] = useState(null);

  const selectedMa = useMemo(
    () => mas.find((ma) => String(ma.id) === String(selectedMaId)) || null,
    [mas, selectedMaId],
  );

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0),
    [items],
  );

  const resetNewItem = () => {
    setNewItem(createEmptyItem());
  };

  const importCompletedMa = (maId) => {
    setSelectedMaId(maId);

    const matchedMa = mas.find((ma) => String(ma.id) === String(maId));

    if (!matchedMa?.items?.length) {
      return;
    }

    setItems(matchedMa.items.map(mapMaItemToPrItem));
    setEditingIndex(null);
    resetNewItem();
    setHeaderData((current) => ({
      ...current,
      purpose: current.purpose || `Imported from completed Market Analysis #${matchedMa.id}`,
    }));
  };

  const handleSaveItem = () => {
    if (!newItem.item_description || newItem.item_description === '<p><br></p>') {
      alert('Please enter an item description.');
      return;
    }

    const itemToSave = {
      ...newItem,
      total_cost: newItem.quantity * newItem.unit_cost,
    };

    if (editingIndex === null) {
      setItems([...items, itemToSave]);
    } else {
      const copy = [...items];
      copy[editingIndex] = itemToSave;
      setItems(copy);
      setEditingIndex(null);
    }

    resetNewItem();
  };

  const handleEditItem = (index) => {
    const item = items[index];
    setNewItem({
      unit: item.unit,
      item_description: item.item_description,
      quantity: Number(item.quantity) || 0,
      unit_cost: Number(item.unit_cost) || 0,
    });
    setEditingIndex(index);
  };

  const handleRemoveItem = (index) => {
    const copy = [...items];
    copy.splice(index, 1);
    setItems(copy);

    if (editingIndex === index) {
      setEditingIndex(null);
      resetNewItem();
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...headerData,
      items,
    };

    if (isEditing) {
      router.put(`/prs/${pr.id}`, payload);
      return;
    }

    router.post('/store-pr', payload);
  };

  const saveSignatoriesAsDefault = () => {
    localStorage.setItem('pr_req_name', headerData.requested_by_name);
    localStorage.setItem('pr_req_desig', headerData.requested_by_designation);
    localStorage.setItem('pr_app_name', headerData.approved_by_name);
    localStorage.setItem('pr_app_desig', headerData.approved_by_designation);
    alert('Signatories saved! These will now load automatically next time.');
  };

  const quillModules = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'bullet' }], ['clean']],
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {isEditing ? 'Edit Purchase Request' : 'Create Purchase Request'}
        </h2>
      }
    >
      <Head title={isEditing ? 'Edit Purchase Request' : 'Create Purchase Request'} />

      <div className="min-h-screen bg-slate-100/80 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Procurement Form
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {isEditing ? 'Edit Purchase Request' : 'Create Purchase Request'}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Keep the current workflow intact while giving the form a cleaner, more structured appearance.
              </p>
            </div>

            <Link
              href="/prs"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
            >
              Retrieve Existing PR
            </Link>
          </div>
        </div>

        <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Header Details</h3>
              <p className="text-sm text-slate-600">Basic PR information and routing details.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Office/Section</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={headerData.office_section}
                  onChange={(e) => setHeaderData({ ...headerData, office_section: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={headerData.date}
                  onChange={(e) => setHeaderData({ ...headerData, date: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Import Completed Market Analysis</h3>
              <p className="text-sm text-slate-600">Optionally replace the current line items with adjusted MA items.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Completed MA</label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                    <div>{selectedMa.items?.length || 0} adjusted items loaded into the PR.</div>
                  </>
                ) : (
                  'Select a completed MA to prefill the item list.'
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Item Builder</h3>
                <p className="text-sm text-slate-600">Add one procurement line item at a time.</p>
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Current items: {items.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-1">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Unit</label>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  >
                    <option value="pc">pc</option>
                    <option value="box">box</option>
                    <option value="set">set</option>
                    <option value="pack">pack</option>
                  </select>
                </div>

                <div className="lg:col-span-6">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Description</label>
                  <div className="rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                    <ReactQuill
                      theme="snow"
                      value={newItem.item_description}
                      onChange={(content) => setNewItem({ ...newItem, item_description: content })}
                      modules={quillModules}
                      className="min-h-[160px]"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Qty</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Unit Cost (₱)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={newItem.unit_cost}
                    onChange={(e) => setNewItem({ ...newItem, unit_cost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSaveItem}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {editingIndex === null ? '+ Add to List' : 'Update Item'}
                </button>

                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      resetNewItem();
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Added Items</h3>
                <p className="text-sm text-slate-600">Review the list before generating the PDF.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Grand Total: ₱ {grandTotal.toLocaleString()}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="w-20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Unit</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Description</th>
                    <th className="w-20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Qty</th>
                    <th className="w-36 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Unit Cost</th>
                    <th className="w-36 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Total Cost</th>
                    <th className="w-36 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-sm italic text-slate-500">
                        No items added yet.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="align-top hover:bg-slate-50/80">
                        <td className="px-4 py-4 text-center text-sm font-medium text-slate-700">{item.unit}</td>
                        <td
                          className="px-4 py-4 text-sm leading-6 text-slate-700 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal"
                          dangerouslySetInnerHTML={{ __html: item.item_description }}
                        />
                        <td className="px-4 py-4 text-center text-sm text-slate-700">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">₱ {item.unit_cost.toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                          ₱ {item.total_cost.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-wrap justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditItem(index)}
                              className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-slate-50">
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-wide text-slate-700"
                    >
                      Grand Total
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-rose-600">₱ {grandTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm md:p-6">
              <h3 className="text-lg font-semibold text-slate-900">Purpose</h3>
              <p className="mt-1 text-sm text-slate-600">State the reason for the request clearly and briefly.</p>
              <textarea
                className="mt-4 h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={headerData.purpose}
                onChange={(e) => setHeaderData({ ...headerData, purpose: e.target.value })}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Signatories</h3>
                  <p className="text-sm text-slate-600">Save and reuse the people who sign PRs.</p>
                </div>
                <button
                  type="button"
                  onClick={saveSignatoriesAsDefault}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  Save as Default Signatories
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Requested By
                  </h4>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Printed Name</label>
                  <input
                    type="text"
                    placeholder="Printed Name"
                    className="mb-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={headerData.requested_by_name}
                    onChange={(e) => setHeaderData({ ...headerData, requested_by_name: e.target.value })}
                  />
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Designation</label>
                  <input
                    type="text"
                    placeholder="Designation"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 italic shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={headerData.requested_by_designation}
                    onChange={(e) => setHeaderData({ ...headerData, requested_by_designation: e.target.value })}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Approved By
                  </h4>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Printed Name</label>
                  <input
                    type="text"
                    placeholder="Printed Name"
                    className="mb-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={headerData.approved_by_name}
                    onChange={(e) => setHeaderData({ ...headerData, approved_by_name: e.target.value })}
                  />
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Designation</label>
                  <input
                    type="text"
                    placeholder="Designation"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 italic shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={headerData.approved_by_designation}
                    onChange={(e) => setHeaderData({ ...headerData, approved_by_designation: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="text-sm text-slate-500">
              {isEditing
                ? 'Updating this PR will replace the stored items.'
                : 'This will save the PR and generate the PDF.'}
            </div>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {isEditing ? 'Update PR & Generate PDF' : 'Save PR & Generate PDF'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}