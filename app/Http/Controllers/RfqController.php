<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\Rfq;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class RfqController extends Controller
{
    private function canViewAll(): bool
    {
        return (bool) auth()->user()?->is_admin;
    }

    public function create()
    {
        $prsQuery = PurchaseRequest::with('items')->orderBy('id', 'desc');

        if (! $this->canViewAll()) {
            $prsQuery->where('user_id', auth()->id());
        }

        $prs = $prsQuery->get();
        return Inertia::render('Procurement/CreateRFQ', ['prs' => $prs]);
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
        // 1. Create the Main RFQ Record
        $rfq = Rfq::create([
            'user_id' => auth()->id(),
            'purchase_request_id' => $request->selectedPrId,
            'mode_of_procurement' => $request->mode_of_procurement,
            'submission_deadline' => $request->submission_deadline,
            'authorized_signatory' => $request->authorized_signatory,
            // Store the Approved Budget in words (sent from the frontend)
            'abc_words' => $request->abc_words ?? null,
            'date' => now(), // Stamps today's date
        ]);

        // 2. Loop through and save the items pulled from the PR
        foreach ($request->items as $item) {
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