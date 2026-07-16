import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const emptyItem = () => ({
  unit: 'pc',
  item_description: '',
  qty: '',
  supplier_price: '',
});

export default function CreateMA({ ma = null }) {
  const isEditing = Boolean(ma?.id);

  const [headerData, setHeaderData] = useState(() => ({
    date: ma?.date || '',
    company_name: ma?.company_name || '',
    address: ma?.address || '',
    bir_registration: ma?.bir_registration || '',
    philgeps: ma?.philgeps || '',
    contact_person: ma?.contact_person || '',
    mobile_no: ma?.mobile_no || '',
    signature: ma?.signature || '',
  }));

  const [items, setItems] = useState(() => {
    const mapped = (ma?.items || []).map((item) => ({
      unit: item.unit || 'pc',
      item_description: item.item_description || '',
      qty: item.qty ?? '',
      supplier_price: item.supplier_price ?? '',
    }));

    return mapped.length > 0 ? mapped : [emptyItem()];
  });

  const totalAdjusted = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.supplier_price || 0), 0),
    [items],
  );

  const quillModules = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'bullet' }], ['clean']],
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const addItem = () => setItems([...items, emptyItem()]);

  const removeItem = (index) => {
    setItems(items.length > 1 ? items.filter((_, i) => i !== index) : [emptyItem()]);
  };

  const handleInitialSubmit = () => {
    router.post('/mas', {
      ...headerData,
      items: items.map(({ unit, item_description, qty }) => ({ unit, item_description, qty })),
      }, {
        preserveScroll: true,
        onError: (errors) => {
          console.error('MA create failed', errors);
          alert('Could not save the MA. Please check the inputs and try again.');
        },
    });
  };

  const handlePricingSubmit = () => {
    router.put(`/mas/${ma.id}`, { ...headerData, items }, {
      preserveScroll: true,
      onError: (errors) => {
        console.error('MA update failed', errors);
        alert('Could not save the MA pricing. Please check the inputs and try again.');
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {isEditing ? 'Price Market Analysis' : 'Create Market Analysis'}
        </h2>
      }
    >
      <Head title={isEditing ? 'Price Market Analysis' : 'Create Market Analysis'} />

      <div className="min-h-screen bg-slate-100/80 px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Market Analysis</h3>
              <p className="text-sm text-slate-600">
                Initial creation collects item descriptions and quantities. Pricing is added in the update step.
              </p>
            </div>
            <Link href="/mas" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              Manage MA
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="Company Name"
              value={headerData.company_name}
              onChange={(e) => setHeaderData({ ...headerData, company_name: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="Address"
              value={headerData.address}
              onChange={(e) => setHeaderData({ ...headerData, address: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              type="date"
              value={headerData.date}
              onChange={(e) => setHeaderData({ ...headerData, date: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="BIR Registration"
              value={headerData.bir_registration}
              onChange={(e) => setHeaderData({ ...headerData, bir_registration: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="PHILGEPS"
              value={headerData.philgeps}
              onChange={(e) => setHeaderData({ ...headerData, philgeps: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="Contact Person"
              value={headerData.contact_person}
              onChange={(e) => setHeaderData({ ...headerData, contact_person: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="Mobile No."
              value={headerData.mobile_no}
              onChange={(e) => setHeaderData({ ...headerData, mobile_no: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5"
              placeholder="Signature"
              value={headerData.signature}
              onChange={(e) => setHeaderData({ ...headerData, signature: e.target.value })}
            />
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid items-start gap-4 md:grid-cols-12">
                  <input
                    className="self-start rounded-xl border border-slate-300 px-3 py-2.5 md:col-span-2"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    placeholder="Unit"
                  />
                  <div className="self-start md:col-span-7">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Item Description</label>
                    <div className="rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                      <ReactQuill
                        theme="snow"
                        value={item.item_description}
                        onChange={(content) => updateItem(index, 'item_description', content)}
                        modules={quillModules}
                        className="min-h-[160px]"
                      />
                    </div>
                  </div>
                  <input
                    className="self-start rounded-xl border border-slate-300 px-3 py-2.5 md:col-span-1"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', e.target.value.replace(/\D/g, ''))}
                    placeholder="Qty"
                  />
                  <input
                    className="self-start rounded-xl border border-slate-300 px-3 py-2.5 md:col-span-2"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={item.supplier_price}
                    onChange={(e) => updateItem(index, 'supplier_price', e.target.value)}
                    placeholder="Quoted Price (₱)"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={() => removeItem(index)} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={addItem} className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              Add Item
            </button>
            <button type="button" onClick={isEditing ? handlePricingSubmit : handleInitialSubmit} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
              {isEditing ? 'Save Prices & Generate PDF' : 'Save MA & Generate PDF'}
            </button>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            Current encoded total preview: ₱ {totalAdjusted.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
