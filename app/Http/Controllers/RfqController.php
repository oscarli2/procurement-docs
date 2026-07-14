<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\MarketAnalysis;
use App\Models\Rfq;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class RfqController extends Controller
{
    private function canViewAll(): bool
    {
        return (bool) auth()->user()?->is_admin;
    }

    private function completedMarketAnalyses()
    {
        $query = MarketAnalysis::with('items')->where('status', 'priced')->latest();

        if (! $this->canViewAll()) {
            $query->where('user_id', auth()->id());
        }

        return $query->get();
    }

    public function create()
    {
        $prsQuery = PurchaseRequest::with('items')->orderBy('id', 'desc');

        if (! $this->canViewAll()) {
            $prsQuery->where('user_id', auth()->id());
        }

        $prs = $prsQuery->get();
        return Inertia::render('Procurement/CreateRFQ', [
            'prs' => $prs,
            'mas' => $this->completedMarketAnalyses(),
        ]);
    }

    public function index()
    {
        $query = Rfq::with(['purchaseRequest'])->withCount('items')->latest();

        if (! $this->canViewAll()) {
            $query->where('user_id', auth()->id());
        }

        $rfqs = $query->get();

        return Inertia::render('Procurement/ManageRFQ', [
            'rfqs' => $rfqs,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'selectedPrId' => 'nullable|integer|exists:purchase_requests,id',
            'selectedMaId' => 'nullable|integer|exists:market_analyses,id',
            'mode_of_procurement' => 'nullable|string',
            'date' => 'nullable|date',
            'submission_deadline' => 'nullable|date',
            'authorized_signatory' => 'nullable|string',
            'abc_words' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.unit' => 'nullable|string',
            'items.*.item_description' => 'required|string',
            'items.*.qty' => 'required|numeric',
            'items.*.abc_per_item' => 'required|numeric',
            'items.*.total_abc' => 'required|numeric',
        ]);

        abort_unless(! empty($data['selectedPrId']) || ! empty($data['selectedMaId']), 422, 'Select a PR or a completed MA first.');

        $purchaseRequestId = $data['selectedPrId'] ?? null;

        if (! $purchaseRequestId && ! empty($data['selectedMaId'])) {
            $marketAnalysis = MarketAnalysis::with('items')->findOrFail($data['selectedMaId']);
            abort_unless($this->canViewAll() || $marketAnalysis->user_id === auth()->id(), 403);

            $purchaseRequest = PurchaseRequest::create([
                'user_id' => auth()->id(),
                'office_section' => $marketAnalysis->company_name,
                'date' => $data['date'] ?? null,
                'purpose' => $marketAnalysis->title ?: 'Generated from Market Analysis #' . $marketAnalysis->id,
            ]);

            foreach ($marketAnalysis->items as $item) {
                $quantity = (float) ($item->qty ?? 0);
                $unitCost = (float) ($item->adjusted_price ?? 0);

                $purchaseRequest->items()->create([
                    'unit' => $item->unit,
                    'item_description' => $item->item_description,
                    'quantity' => $quantity,
                    'unit_cost' => $unitCost,
                    'total_cost' => $quantity * $unitCost,
                ]);
            }

            $purchaseRequestId = $purchaseRequest->id;
        }

        // 1. Create the Main RFQ Record
        $rfq = Rfq::create([
            'user_id' => auth()->id(),
            'purchase_request_id' => $purchaseRequestId,
            'mode_of_procurement' => $data['mode_of_procurement'] ?? null,
            'date' => $data['date'] ?? null,
            'submission_deadline' => $data['submission_deadline'] ?? null,
            'authorized_signatory' => $data['authorized_signatory'] ?? null,
            // Store the Approved Budget in words (sent from the frontend)
            'abc_words' => $data['abc_words'] ?? null,
        ]);

        // 2. Loop through and save the items pulled from the PR
        foreach ($data['items'] as $item) {
            $rfq->items()->create([
                'unit' => $item['unit'],
                'item_description' => $item['item_description'],
                'qty' => $item['qty'],
                'abc_per_item' => $item['abc_per_item'],
                'total_abc' => $item['total_abc'],
            ]);
        }

        // 3. Force the browser to download the file
        return Inertia::location('/download-rfq/' . $rfq->id);
    }

    public function download($id)
    {
        $rfq = Rfq::with(['items', 'purchaseRequest'])->findOrFail($id);
        abort_unless($this->canViewAll() || $rfq->user_id === auth()->id(), 403);
        
        // Load the PDF layout we are about to make
        $pdf = Pdf::loadView('pdf.rfq', compact('rfq'))->setPaper('a4', 'portrait');

        return $pdf->download('Request-for-Quotation-' . $rfq->id . '.pdf');
    }

    public function destroy($id)
    {
        $rfq = Rfq::findOrFail($id);
        abort_unless($this->canViewAll() || $rfq->user_id === auth()->id(), 403);

        $rfq->delete();

        return redirect('/rfqs');
    }
}