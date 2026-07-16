<?php

namespace App\Http\Controllers;

use App\Models\MarketAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class MarketAnalysisController extends Controller
{
    private function canViewAll(): bool
    {
        return (bool) auth()->user()?->is_admin;
    }

    private function randomMarkup(): int
    {
        return [100, 150, 200, 250, 300][array_rand([100, 150, 200, 250, 300])];
    }

    public function create()
    {
        return Inertia::render('Procurement/CreateMA');
    }

    public function index()
    {
        $query = MarketAnalysis::withCount('items')->latest();

        if (! $this->canViewAll()) {
            $query->where('user_id', auth()->id());
        }

        return Inertia::render('Procurement/ManageMA', [
            'mas' => $query->get(),
        ]);
    }

    public function completed()
    {
        $query = MarketAnalysis::with(['items'])->where('status', 'priced')->latest();

        if (! $this->canViewAll()) {
            $query->where('user_id', auth()->id());
        }

        return Inertia::render('Procurement/CompletedMA', [
            'mas' => $query->get()->map(function (MarketAnalysis $ma) {
                return [
                    'id' => $ma->id,
                    'title' => $ma->title,
                    'date' => $ma->date,
                    'company_name' => $ma->company_name,
                    'address' => $ma->address,
                    'bir_registration' => $ma->bir_registration,
                    'philgeps' => $ma->philgeps,
                    'contact_person' => $ma->contact_person,
                    'mobile_no' => $ma->mobile_no,
                    'signature' => $ma->signature,
                    'items_count' => $ma->items->count(),
                    'items' => $ma->items->map(fn ($item) => [
                        'unit' => $item->unit,
                        'item_description' => $item->item_description,
                        'qty' => $item->qty,
                        'supplier_price' => $item->supplier_price,
                        'markup_amount' => $item->markup_amount,
                        'adjusted_price' => $item->adjusted_price,
                    ]),
                    'total_adjusted' => $ma->total_adjusted,
                ];
            }),
        ]);
    }

    public function edit($id)
    {
        $ma = MarketAnalysis::with('items')->findOrFail($id);
        abort_unless($this->canViewAll() || $ma->user_id === auth()->id(), 403);

        return Inertia::render('Procurement/CreateMA', [
            'ma' => $ma,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'nullable|string',
            'date' => 'nullable|date',
            'company_name' => 'nullable|string',
            'address' => 'nullable|string',
            'bir_registration' => 'nullable|string',
            'philgeps' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'mobile_no' => 'nullable|string',
            'signature' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.unit' => 'nullable|string',
            'items.*.item_description' => 'required|string',
            'items.*.qty' => 'nullable|integer',
        ]);

        $ma = DB::transaction(function () use ($data) {
            $ma = MarketAnalysis::create([
                'user_id' => auth()->id(),
                'title' => $data['title'] ?? null,
                'date' => $data['date'] ?? null,
                'company_name' => $data['company_name'] ?? null,
                'address' => $data['address'] ?? null,
                'bir_registration' => $data['bir_registration'] ?? null,
                'philgeps' => $data['philgeps'] ?? null,
                'contact_person' => $data['contact_person'] ?? null,
                'mobile_no' => $data['mobile_no'] ?? null,
                'signature' => $data['signature'] ?? null,
                'status' => 'draft',
            ]);

            foreach ($data['items'] as $item) {
                $ma->items()->create([
                    'unit' => $item['unit'] ?? null,
                    'item_description' => $item['item_description'] ?? null,
                    'qty' => $item['qty'] ?? null,
                ]);
            }

            return $ma;
        });

        return redirect()->route('mas.completed')->with('success', 'Market Analysis marked as completed.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => 'nullable|string',
            'date' => 'nullable|date',
            'company_name' => 'nullable|string',
            'address' => 'nullable|string',
            'bir_registration' => 'nullable|string',
            'philgeps' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'mobile_no' => 'nullable|string',
            'signature' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.unit' => 'nullable|string',
            'items.*.item_description' => 'required|string',
            'items.*.qty' => 'nullable|integer',
            'items.*.supplier_price' => 'nullable|numeric',
        ]);

        $ma = MarketAnalysis::findOrFail($id);
        abort_unless($this->canViewAll() || $ma->user_id === auth()->id(), 403);

        DB::transaction(function () use ($ma, $data) {
            $ma->update([
                'title' => $data['title'] ?? null,
                'date' => $data['date'] ?? null,
                'company_name' => $data['company_name'] ?? null,
                'address' => $data['address'] ?? null,
                'bir_registration' => $data['bir_registration'] ?? null,
                'philgeps' => $data['philgeps'] ?? null,
                'contact_person' => $data['contact_person'] ?? null,
                'mobile_no' => $data['mobile_no'] ?? null,
                'signature' => $data['signature'] ?? null,
                'status' => 'priced',
            ]);

            $ma->items()->delete();

            foreach ($data['items'] as $item) {
                $supplierPrice = isset($item['supplier_price']) && $item['supplier_price'] !== ''
                    ? (float) $item['supplier_price']
                    : null;

                $markup = $supplierPrice === null ? null : [100, 150, 200, 250, 300][array_rand([100, 150, 200, 250, 300])];

                $ma->items()->create([
                    'unit' => $item['unit'] ?? null,
                    'item_description' => $item['item_description'] ?? null,
                    'qty' => $item['qty'] ?? null,
                    'supplier_price' => $supplierPrice,
                    'markup_amount' => $markup,
                    'adjusted_price' => $supplierPrice === null ? null : $supplierPrice + $markup,
                ]);
            }
        });

        return Inertia::location('/download-ma/' . $ma->id);
    }

    public function download($id)
    {
        $ma = MarketAnalysis::with('items')->findOrFail($id);
        abort_unless($this->canViewAll() || $ma->user_id === auth()->id(), 403);

        $pdf = Pdf::loadView('pdf.ma', compact('ma'));

        return $pdf->download('Market-Analysis-' . $ma->id . '.pdf');
    }

    public function destroy($id)
    {
        $ma = MarketAnalysis::findOrFail($id);
        abort_unless($this->canViewAll() || $ma->user_id === auth()->id(), 403);

        $ma->delete();

        return redirect('/mas');
    }
}