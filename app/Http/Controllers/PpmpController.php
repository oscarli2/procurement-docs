<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Ppmp;
use App\Models\PpmpItem;
use Inertia\Inertia;

class PpmpController extends Controller
{
    private function canViewAll(): bool
    {
        return (bool) auth()->user()?->is_admin;
    }

    public function index()
    {
        $query = Ppmp::withCount('items')->latest();

        if (! $this->canViewAll()) {
            $query->where('user_id', auth()->id());
        }

        $ppmps = $query->get();

        return Inertia::render('Procurement/ManagePPMP', [
            'ppmps' => $ppmps,
        ]);
    }

    public function edit($id)
    {
        $ppmp = Ppmp::with('items')->findOrFail($id);
        abort_unless($this->canViewAll() || $ppmp->user_id === auth()->id(), 403);

        return Inertia::render('Procurement/CreatePPMP', [
            'ppmp' => $ppmp,
        ]);
    }

    /**
     * Generate a demo PPMP PDF using the attached sample data.
     */
    public function downloadDemo()
    {
        $ppmp = [
            'fiscal_year' => 2026,
            'end_user' => 'RICTU',
            'items' => [
                [
                    'description' => 'Google One with 2TB Storage Annual Plan',
                    'type' => 'Goods',
                    'quantity' => '2pcs',
                    'size' => 'Google One with 2TB Storage Annual Plan',
                    'mode' => 'Small Value Procurement',
                    'pre_procurement' => 'No',
                    'start' => 'June -2026',
                    'end' => 'June -2026',
                    'delivery' => 'June -2026',
                    'source' => 'GAA Current Funds (OP/GMS)',
                    'budget' => '2026',
                    'supporting' => 'Market scoping checklist',
                    'remarks' => ''
                ],
                [
                    'description' => 'AutoCAD Annual Plan',
                    'type' => 'Goods',
                    'quantity' => '1pc',
                    'size' => 'AutoCAD Annual Plan',
                    'mode' => 'Small Value Procurement',
                    'pre_procurement' => 'No',
                    'start' => 'June -2026',
                    'end' => 'June -2026',
                    'delivery' => 'June -2026',
                    'source' => 'GAA Current Funds (OP/GMS)',
                    'budget' => '2026',
                    'supporting' => 'Market scoping checklist',
                    'remarks' => ''
                ],
                [
                    'description' => 'Starlink Roam Unlimited Plan (1-Month)',
                    'type' => 'Goods',
                    'quantity' => '1pc',
                    'size' => 'Starlink Roam Unlimited 1-month Plan',
                    'mode' => 'Small Value Procurement',
                    'pre_procurement' => 'No',
                    'start' => 'June -2026',
                    'end' => 'June -2026',
                    'delivery' => 'June -2026',
                    'source' => 'GAA Current Funds (OP/GMS)',
                    'budget' => '2026',
                    'supporting' => 'Market scoping checklist',
                    'remarks' => ''
                ],
            ],
            'prepared_by' => [
                'name' => 'OSCARLITO C. OBALLO JR.',
                'designation' => 'ISA I, RICTU'
            ],
            'submitted_by' => [
                'name' => 'ENGR. ABELARDO LUIS D. DE ASIS',
                'designation' => 'ITO I, UNIT HEAD-RICTU'
            ]
        ];

        $pdf = Pdf::loadView('pdf.ppmp', compact('ppmp'))->setPaper('folio', 'landscape');

        return $pdf->download('PPMP-' . $ppmp['fiscal_year'] . '.pdf');
    }

    /**
     * Show the Create PPMP Inertia page.
     */
    public function create()
    {
        return Inertia::render('Procurement/CreatePPMP');
    }

    /**
     * Store a PPMP and its items in the database and redirect to download.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'fiscal_year' => 'required|integer',
            'end_user' => 'nullable|string',
            'prepared_by_name' => 'nullable|string',
            'prepared_by_designation' => 'nullable|string',
            'submitted_by_name' => 'nullable|string',
            'submitted_by_designation' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.type' => 'nullable|string',
            'items.*.quantity' => 'nullable|numeric',
            'items.*.size' => 'nullable|string',
            'items.*.mode' => 'nullable|string',
            'items.*.pre_procurement' => 'nullable|in:Yes,No',
            'items.*.start' => 'nullable|string',
            'items.*.end' => 'nullable|string',
            'items.*.delivery' => 'nullable|string',
            'items.*.source' => 'nullable|string',
            'items.*.budget' => 'nullable|numeric',
            'items.*.supporting' => 'nullable|string',
            'items.*.remarks' => 'nullable|string',
        ]);

        $ppmp = DB::transaction(function () use ($data) {
            $ppmp = Ppmp::create([
                'user_id' => auth()->id(),
                'fiscal_year' => $data['fiscal_year'],
                'end_user' => $data['end_user'] ?? null,
                'prepared_by_name' => $data['prepared_by_name'] ?? null,
                'prepared_by_designation' => $data['prepared_by_designation'] ?? null,
                'submitted_by_name' => $data['submitted_by_name'] ?? null,
                'submitted_by_designation' => $data['submitted_by_designation'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $ppmp->items()->create([
                    'description' => $item['description'] ?? null,
                    'type' => $item['type'] ?? null,
                    'quantity' => $item['quantity'] ?? null,
                    'size' => $item['size'] ?? null,
                    'mode' => $item['mode'] ?? null,
                    'pre_procurement' => $item['pre_procurement'] ?? null,
                    'start' => $item['start'] ?? null,
                    'end' => $item['end'] ?? null,
                    'delivery' => $item['delivery'] ?? null,
                    'source' => $item['source'] ?? null,
                    'budget' => $item['budget'] ?? null,
                    'supporting' => $item['supporting'] ?? null,
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }

            return $ppmp;
        });

        // Use a full-page redirect so the browser will download the PDF
        return Inertia::location('/ppmps/' . $ppmp->id . '/download');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'fiscal_year' => 'required|integer',
            'end_user' => 'nullable|string',
            'prepared_by_name' => 'nullable|string',
            'prepared_by_designation' => 'nullable|string',
            'submitted_by_name' => 'nullable|string',
            'submitted_by_designation' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.type' => 'nullable|string',
            'items.*.quantity' => 'nullable|numeric',
            'items.*.size' => 'nullable|string',
            'items.*.mode' => 'nullable|string',
            'items.*.pre_procurement' => 'nullable|in:Yes,No',
            'items.*.start' => 'nullable|string',
            'items.*.end' => 'nullable|string',
            'items.*.delivery' => 'nullable|string',
            'items.*.source' => 'nullable|string',
            'items.*.budget' => 'nullable|numeric',
            'items.*.supporting' => 'nullable|string',
            'items.*.remarks' => 'nullable|string',
        ]);

        $ppmp = Ppmp::findOrFail($id);
    abort_unless($this->canViewAll() || $ppmp->user_id === auth()->id(), 403);

        DB::transaction(function () use ($ppmp, $data) {
            $ppmp->update([
                'fiscal_year' => $data['fiscal_year'],
                'end_user' => $data['end_user'] ?? null,
                'prepared_by_name' => $data['prepared_by_name'] ?? null,
                'prepared_by_designation' => $data['prepared_by_designation'] ?? null,
                'submitted_by_name' => $data['submitted_by_name'] ?? null,
                'submitted_by_designation' => $data['submitted_by_designation'] ?? null,
            ]);

            $ppmp->items()->delete();

            foreach ($data['items'] as $item) {
                $ppmp->items()->create([
                    'description' => $item['description'] ?? null,
                    'type' => $item['type'] ?? null,
                    'quantity' => $item['quantity'] ?? null,
                    'size' => $item['size'] ?? null,
                    'mode' => $item['mode'] ?? null,
                    'pre_procurement' => $item['pre_procurement'] ?? null,
                    'start' => $item['start'] ?? null,
                    'end' => $item['end'] ?? null,
                    'delivery' => $item['delivery'] ?? null,
                    'source' => $item['source'] ?? null,
                    'budget' => $item['budget'] ?? null,
                    'supporting' => $item['supporting'] ?? null,
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }
        });

        return Inertia::location('/ppmps/' . $ppmp->id . '/download');
    }

    public function destroy($id)
    {
        $ppmp = Ppmp::findOrFail($id);
        abort_unless($this->canViewAll() || $ppmp->user_id === auth()->id(), 403);

        $ppmp->delete();

        return redirect('/ppmps');
    }

    /**
     * Download a PPMP PDF generated from the database record.
     */
    public function download($id)
    {
        $ppmp = Ppmp::with('items')->findOrFail($id);
        abort_unless($this->canViewAll() || $ppmp->user_id === auth()->id(), 403);
        // helper to format month/year values to MM/YYYY
        $fmtMonthYear = function ($val) {
            if (empty($val)) return '';
            // try strtotime
            $ts = strtotime($val);
            if ($ts !== false) {
                return date('m/Y', $ts);
            }
            // handle YYYY-MM pattern
            if (preg_match('/^(\d{4})-(\d{2})/', $val, $m)) {
                return $m[2] . '/' . $m[1];
            }
            return $val;
        };

        $fmtQuantity = function ($q) {
            if ($q === null) return '';
            $num = preg_replace('/[^0-9.\-]/', '', (string)$q);
            return $num === '' ? '' : $num;
        };

        $fmtCurrency = function ($v) {
            if ($v === null || $v === '') return '';
            $num = preg_replace('/[^0-9.\-]/', '', (string)$v);
            $float = (float)$num;
            return 'PHP ' . number_format($float, 2);
        };

        // Map the model to the view structure used by the PDF
        $viewData = [
            'fiscal_year' => $ppmp->fiscal_year,
            'end_user' => $ppmp->end_user,
            'items' => $ppmp->items->map(function ($it) use ($fmtMonthYear, $fmtQuantity, $fmtCurrency) {
                $quantity = $fmtQuantity($it->quantity);
                $size = trim((string) $it->size);

                return [
                    'description' => $it->description,
                    'type' => $it->type,
                    'quantity' => $size !== '' && $quantity !== ''
                        ? $quantity . "\n" . $size
                        : ($size !== '' ? $size : $quantity),
                    'size' => $it->size,
                    'mode' => $it->mode,
                    'pre_procurement' => $it->pre_procurement ? ucfirst($it->pre_procurement) : '',
                    'start' => $fmtMonthYear($it->start),
                    'end' => $fmtMonthYear($it->end),
                    'delivery' => $fmtMonthYear($it->delivery),
                    'source' => $it->source,
                    'budget' => $fmtCurrency($it->budget),
                    'supporting' => $it->supporting,
                    'remarks' => $it->remarks,
                ];
            })->toArray(),
            'prepared_by' => [
                'name' => $ppmp->prepared_by_name,
                'designation' => $ppmp->prepared_by_designation,
            ],
            'submitted_by' => [
                'name' => $ppmp->submitted_by_name,
                'designation' => $ppmp->submitted_by_designation,
            ],
        ];

        $pdf = Pdf::loadView('pdf.ppmp', ['ppmp' => $viewData])->setPaper('folio', 'landscape');

        return $pdf->download('PPMP-' . $ppmp->id . '-' . $ppmp->fiscal_year . '.pdf');
    }
}
