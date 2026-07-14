<?php

namespace App\Http\Controllers;

use App\Models\MarketAnalysis;
use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia; // We need this to tell React to force a download

class PurchaseRequestController extends Controller
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
        return Inertia::render('Procurement/CreatePR', [
            'mas' => $this->completedMarketAnalyses(),
        ]);
    }

    public function index()
    {
        $query = PurchaseRequest::withCount('items')->latest();

        if (! $this->canViewAll()) {
            $query->where('user_id', auth()->id());
        }

        $prs = $query->get();

        return Inertia::render('Procurement/ManagePR', [
            'prs' => $prs,
        ]);
    }

    public function edit($id)
    {
        $pr = PurchaseRequest::with('items')->findOrFail($id);
        abort_unless($this->canViewAll() || $pr->user_id === auth()->id(), 403);

        return Inertia::render('Procurement/CreatePR', [
            'pr' => $pr,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'office_section' => 'nullable|string',
            'date' => 'nullable|date',
            'purpose' => 'nullable|string',
            'requested_by_name' => 'nullable|string',
            'requested_by_designation' => 'nullable|string',
            'approved_by_name' => 'nullable|string',
            'approved_by_designation' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.unit' => 'nullable|string',
            'items.*.item_description' => 'required|string',
            'items.*.quantity' => 'required|numeric',
            'items.*.unit_cost' => 'required|numeric',
            'items.*.total_cost' => 'required|numeric',
        ]);

        $pr = DB::transaction(function () use ($data) {
            $pr = PurchaseRequest::create([
                'user_id' => auth()->id(),
                'office_section' => $data['office_section'] ?? null,
                'date' => $data['date'] ?? null,
                'purpose' => $data['purpose'] ?? null,
                'requested_by_name' => $data['requested_by_name'] ?? null,
                'requested_by_designation' => $data['requested_by_designation'] ?? null,
                'approved_by_name' => $data['approved_by_name'] ?? null,
                'approved_by_designation' => $data['approved_by_designation'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $pr->items()->create([
                    'unit' => $item['unit'] ?? null,
                    'item_description' => $item['item_description'] ?? null,
                    'quantity' => $item['quantity'] ?? null,
                    'unit_cost' => $item['unit_cost'] ?? null,
                    'total_cost' => $item['total_cost'] ?? null,
                ]);
            }

            return $pr;
        });

        return Inertia::location('/download-pr/' . $pr->id);
    }

    public function update(Request $request, $id)
    {
        // 1. Create the Main PR
        $data = $request->validate([
            'office_section' => 'nullable|string',
            'date' => 'nullable|date',
            'purpose' => 'nullable|string',
            'requested_by_name' => 'nullable|string',
            'requested_by_designation' => 'nullable|string',
            'approved_by_name' => 'nullable|string',
            'approved_by_designation' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.unit' => 'nullable|string',
            'items.*.item_description' => 'required|string',
            'items.*.quantity' => 'required|numeric',
            'items.*.unit_cost' => 'required|numeric',
            'items.*.total_cost' => 'required|numeric',
        ]);

        $pr = PurchaseRequest::findOrFail($id);
    abort_unless($this->canViewAll() || $pr->user_id === auth()->id(), 403);

        DB::transaction(function () use ($pr, $data) {
            $pr->update([
                'office_section' => $data['office_section'] ?? null,
                'date' => $data['date'] ?? null,
                'purpose' => $data['purpose'] ?? null,
                'requested_by_name' => $data['requested_by_name'] ?? null,
                'requested_by_designation' => $data['requested_by_designation'] ?? null,
                'approved_by_name' => $data['approved_by_name'] ?? null,
                'approved_by_designation' => $data['approved_by_designation'] ?? null,
            ]);

            $pr->items()->delete();

            foreach ($data['items'] as $item) {
                $pr->items()->create([
                    'unit' => $item['unit'] ?? null,
                    'item_description' => $item['item_description'] ?? null,
                    'quantity' => $item['quantity'] ?? null,
                    'unit_cost' => $item['unit_cost'] ?? null,
                    'total_cost' => $item['total_cost'] ?? null,
                ]);
            }
        });

        return Inertia::location('/download-pr/' . $pr->id);
    }

    public function destroy($id)
    {
        $pr = PurchaseRequest::findOrFail($id);
        abort_unless($this->canViewAll() || $pr->user_id === auth()->id(), 403);

        $pr->delete();

        return redirect('/prs');
    }

    // New Function to handle the actual PDF Generation
    public function download($id)
    {
        // Find the PR in the database, and pull its linked items too
        $pr = PurchaseRequest::with('items')->findOrFail($id);
        abort_unless($this->canViewAll() || $pr->user_id === auth()->id(), 403);

        // Send the data to the layout we just made
        $pdf = Pdf::loadView('pdf.pr', compact('pr'));

        // Download the finished document!
        return $pdf->download('Purchase-Request-' . $pr->id . '.pdf');
    }
}