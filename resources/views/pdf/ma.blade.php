<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Market Analysis</title>
    <style>
        @page { margin: 15mm 25.4mm 25.4mm 25.4mm; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; margin: 0; color: #000; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #000; padding: 4px 6px; vertical-align: middle; font-size: 11px; }
        .no-border { border: none !important; }
        .border-bottom { border-bottom: 1px solid #000 !important; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .item-cell ul,
        .item-cell ol,
        .item-cell p { margin: 0; padding: 0; }
        .item-cell ul { padding-left: 14px; }
        .item-cell ol { padding-left: 14px; }
        .item-cell ul li,
        .item-cell ol li { margin: 0 0 3px 0; }
        .header-wrap { text-align: center; margin-bottom: 6px; }
        .header-logos { margin-bottom: 6px; }
        .header-logos img { height: 58px; margin: 0 4px; vertical-align: middle; }
        .title { font-size: 19px; font-weight: 700; margin: 18px 0 18px; }
        .line-row { width: 100%; margin: 6px 0; }
        .line-label { width: 26%; display: inline-block; font-weight: 700; font-size: 13px; }
        .line-fill { display: inline-block; width: 72%; border-bottom: 1px solid #000; height: 14px; vertical-align: bottom; }
        .line-fill.short { width: 58%; }
        .company-block { margin-top: 10px; margin-bottom: 28px; }
        .signature-row { margin-top: 10px; margin-bottom: 24px; }
        .signature-row .line-fill { height: 22px; }
        .items-table-wrap { margin-top: 42px; }
        .qty-col { width: 10%; }
        .quoted-col { width: 22%; }
        .item-col { width: 68%; }
        .item-row { height: 34px; }
        .item-row td { height: 34px; }
        .signature-line { display: inline-block; width: 74%; border-bottom: 1px solid #000; height: 12px; }
        .blank { color: transparent; }
    </style>
</head>
<body>
    @php
        $logoOne = file_exists(public_path('images/office-logo.png'))
            ? public_path('images/office-logo.png')
            : public_path('images/dilg-logo.png');
        $logoTwo = file_exists(public_path('images/lgrc-logo.png'))
            ? public_path('images/lgrc-logo.png')
            : (file_exists(public_path('images/office-logo.png')) ? public_path('images/office-logo.png') : public_path('images/dilg-logo.png'));
        $rows = $ma->items->filter(function ($item) {
            return filled($item->item_description)
                || filled($item->qty)
                || filled($item->supplier_price);
        })->values();
    @endphp

    <div class="header-wrap">
        <div class="header-logos">
            <img src="{{ $logoOne }}" alt="DILG Logo">
            <img src="{{ $logoTwo }}" alt="LGRC Logo">
        </div>
        <div>Republic of the Philippines</div>
        <div class="font-bold" style="font-size: 15px; margin-top: 2px;">DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT</div>
        <div class="font-bold" style="font-size: 12px;">REGION VIII - Eastern Visayas</div>
        <div style="font-size: 11px;">Kanhuraw Hill, Tacloban City</div>
        <div style="font-size: 11px;">dilg_r8@yahoo.com</div>

        <div class="title">MARKET ANALYSIS</div>
    </div>

    <div class="company-block">
        <div class="line-row"><span class="line-label">Company Name:</span><span class="line-fill">{{ $ma->company_name ?: '' }}</span></div>
        <div class="line-row"><span class="line-label">Address:</span><span class="line-fill">{{ $ma->address ?: '' }}</span></div>
        <div class="line-row"><span class="line-label">&nbsp;</span><span class="line-fill">&nbsp;</span></div>
        <div class="line-row"><span class="line-label">BIR Registration:</span><span class="line-fill short">{{ $ma->bir_registration ?: '' }}</span></div>
        <div class="line-row"><span class="line-label">PHILGEPS:</span><span class="line-fill short">{{ $ma->philgeps ?: '' }}</span></div>
        <div class="line-row"><span class="line-label">Contact Person:</span><span class="line-fill short">{{ $ma->contact_person ?: '' }}</span></div>
        <div class="line-row"><span class="line-label">Mobile No:</span><span class="line-fill short">{{ $ma->mobile_no ?: '' }}</span></div>
        <div class="line-row signature-row"><span class="line-label">Signature:</span><span class="line-fill short">{{ $ma->signature ?: '' }}</span></div>
    </div>

    <table class="items-table-wrap">
        <thead>
            <tr>
                <th class="item-col">ITEM</th>
                <th class="qty-col">QTY</th>
                <th class="quoted-col">QUOTED PRICE</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $item)
                <tr class="item-row">
                    <td class="item-cell">{!! $item->item_description !!}</td>
                    <td class="text-center">{{ $item->qty !== null ? $item->qty : '' }}</td>
                    <td class="text-center">{{ $item->supplier_price !== null ? '₱ ' . number_format($item->supplier_price, 2) : '' }}</td>
                </tr>
            @empty
                <tr class="item-row">
                    <td colspan="3" class="text-center">No items available.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>