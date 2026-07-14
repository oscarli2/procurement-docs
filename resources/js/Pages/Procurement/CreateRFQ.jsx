import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const mapMaItemToRfqItem = (item) => ({
  unit: item.unit || 'pc',
  item_description: item.item_description || '',
  qty: Number(item.qty) || 0,
  abc_per_item: Number(item.adjusted_price) || 0,
  total_abc: (Number(item.qty) || 0) * (Number(item.adjusted_price) || 0),
});

export default function CreateRFQ({ prs = [], mas = [] }) {
  const [selectedPrId, setSelectedPrId] = useState('');
  const [selectedMaId, setSelectedMaId] = useState('');

  const [rfqHeader, setRfqHeader] = useState(() => ({
    mode_of_procurement: 'Small Value Procurement',
    date: '',
    submission_deadline: '',
    authorized_signatory: localStorage.getItem('rfq_signatory') || '',
    abc_words: '',
  }));

  const [rfqItems, setRfqItems] = useState([]);

  const selectedPr = useMemo(
    () => prs.find((pr) => String(pr.id) === String(selectedPrId)) || null,
    [prs, selectedPrId],
  );

  const selectedMa = useMemo(
    () => mas.find((ma) => String(ma.id) === String(selectedMaId)) || null,
    [mas, selectedMaId],
  );

  const grandTotal = useMemo(
    () => rfqItems.reduce((sum, item) => sum + Number.parseFloat(item.total_abc || 0), 0),
    [rfqItems],
  );

  const handlePrSelection = (e) => {
    const prId = e.target.value;
    setSelectedPrId(prId);
    setSelectedMaId('');

    const matchedPr = prs.find((pr) => String(pr.id) === String(prId));

    if (matchedPr?.items?.length) {
      const mappedItems = matchedPr.items.map((item) => ({
        unit: item.unit,
        item_description: item.item_description,
        qty: item.quantity,
        abc_per_item: item.unit_cost,
        total_abc: item.total_cost,
      }));
      setRfqItems(mappedItems);
      return;
    }

    setRfqItems([]);
  };

  const handleMaSelection = (e) => {
    const maId = e.target.value;
    setSelectedMaId(maId);
    setSelectedPrId('');

    const matchedMa = mas.find((ma) => String(ma.id) === String(maId));

    if (matchedMa?.items?.length) {
      setRfqItems(matchedMa.items.map(mapMaItemToRfqItem));
      return;
    }

    setRfqItems([]);
  };

  const saveSignatoryDefault = () => {
    localStorage.setItem('rfq_signatory', rfqHeader.authorized_signatory);
    alert('Signatory saved as default!');
  };

  const handleSubmit = () => {
    const payload = {
      selectedPrId,
      selectedMaId,
      ...rfqHeader,
      items: rfqItems,
    };

    router.post('/store-rfq', payload);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Create Request for Quotation
        </h2>
      }
    >
      <Head title="Create Request for Quotation" />

      <div className="min-h-screen bg-slate-100/80 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Procurement Form
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Generate Request for Quotation
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Choose an approved PR, review the imported items, and generate the RFQ PDF with the same workflow.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected Source</div>
              <div className="mt-2 text-xl font-bold text-slate-900">
                {selectedPr ? `PR #${selectedPr.id}` : selectedMa ? `MA #${selectedMa.id}` : 'None'}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {selectedPr?.office_section || selectedMa?.company_name || 'Choose a PR or a completed MA to begin'}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Loaded Items</div>
              <div className="mt-2 text-xl font-bold text-slate-900">{rfqItems.length}</div>
              <div className="mt-1 text-sm text-slate-600">Pulled from the selected PR or completed MA</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total ABC</div>
              <div className="mt-2 text-xl font-bold text-slate-900">
                ₱ {grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="mt-1 text-sm text-slate-600">Used in the figure and word form</div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Step 1: Select Source</h3>
              <p className="text-sm text-slate-600">Use an approved PR or a completed MA to populate the RFQ items automatically.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Select an Approved Purchase Request</label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  value={selectedPrId}
                  onChange={handlePrSelection}
                >
                  <option value="">-- Choose a PR to pull data from --</option>
                  {prs.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      PR ID: {pr.id} | Office: {pr.office_section || 'N/A'} | Date: {pr.date || 'N/A'} | Purpose:{' '}
                      {(pr.purpose || '').substring(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Or select a completed MA</label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  value={selectedMaId}
                  onChange={handleMaSelection}
                >
                  <option value="">-- Choose a completed MA to pull data from --</option>
                  {mas.map((ma) => (
                    <option key={ma.id} value={ma.id}>
                      MA ID: {ma.id} | Title: {ma.title || ma.company_name || 'N/A'} | Date: {ma.date || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected PR</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{selectedPr ? `PR #${selectedPr.id}` : 'None'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected MA</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{selectedMa ? `MA #${selectedMa.id}` : 'None'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Items Loaded</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{rfqItems.length}</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Step 2: RFQ Document Details</h3>
              <p className="text-sm text-slate-600">These values are carried into the generated RFQ PDF.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mode of Procurement</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  value={rfqHeader.mode_of_procurement}
                  onChange={(e) => setRfqHeader({ ...rfqHeader, mode_of_procurement: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  value={rfqHeader.date}
                  onChange={(e) => setRfqHeader({ ...rfqHeader, date: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Submission Deadline (On or Before)</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  value={rfqHeader.submission_deadline}
                  onChange={(e) => setRfqHeader({ ...rfqHeader, submission_deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 md:p-5">
              <label className="mb-1.5 block text-sm font-semibold text-amber-900">
                Approved Budget for the Contract (ABC)
              </label>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <input
                  type="text"
                  className="flex-1 rounded-xl border border-amber-200 bg-white px-3 py-3 italic shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Type budget in words (e.g., One Hundred Thousand Pesos)"
                  value={rfqHeader.abc_words}
                  onChange={(e) => setRfqHeader({ ...rfqHeader, abc_words: e.target.value })}
                />
                <div className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-base font-bold text-slate-900 shadow-sm whitespace-nowrap">
                  (₱ {grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Ensure the word form matches the calculated figure form exactly. This maps directly to the DILG Region 8 RFQ layout.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Imported Procurement Items</h3>
                <p className="text-sm text-slate-600">These are pulled from the selected PR.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Total ABC: ₱ {grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="w-20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Unit</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Item Description</th>
                    <th className="w-20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Qty</th>
                    <th className="w-36 px-4 py-3 text-xs font-semibold uppercase tracking-wide">ABC per Item</th>
                    <th className="w-36 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Total ABC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {rfqItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-sm italic text-slate-500">
                        Select a PR above to load items.
                      </td>
                    </tr>
                  ) : (
                    rfqItems.map((item, index) => (
                      <tr key={index} className="align-top hover:bg-slate-50/80">
                        <td className="px-4 py-4 text-center text-sm font-medium text-slate-700">{item.unit}</td>
                        <td
                          className="px-4 py-4 text-sm leading-6 text-slate-700 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal"
                          dangerouslySetInnerHTML={{ __html: item.item_description }}
                        />
                        <td className="px-4 py-4 text-center text-sm text-slate-700">{item.qty}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          ₱ {Number.parseFloat(item.abc_per_item || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                          ₱ {Number.parseFloat(item.total_abc || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-slate-50">
                    <td colSpan="4" className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-wide text-slate-700">
                      TOTAL ABC
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-rose-600">
                      ₱ {grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm md:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Authorized Signatory</h3>
                <p className="text-sm text-slate-600">Store the signatory once and reuse it for future RFQs.</p>
              </div>
              <button
                type="button"
                onClick={saveSignatoryDefault}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Save Default
              </button>
            </div>

            <input
              type="text"
              placeholder="Signatory Name"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-semibold shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              value={rfqHeader.authorized_signatory}
              onChange={(e) => setRfqHeader({ ...rfqHeader, authorized_signatory: e.target.value })}
            />
          </section>

          <button
            onClick={handleSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedPrId && !selectedMaId}
          >
            Generate RFQ PDF
          </button>
        </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}