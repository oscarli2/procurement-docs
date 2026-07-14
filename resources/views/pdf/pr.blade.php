<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Purchase Request</title>
    <style>
        /* Base Styles */
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; }
        
        /* Helper Classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        
        /* Typography */
        .appendix-text { text-align: right; font-style: italic; font-size: 10px; margin-bottom: 5px; }
        .doc-title { text-align: center; font-size: 22px; font-weight: bold; margin: 10px 0; letter-spacing: 1px; }
        
        /* Table Configurations */
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid black; padding: 5px; vertical-align: top; }
        
        /* Removing specific borders to merge sections seamlessly */
        .border-none { border: none !important; }
        .border-bottom-none { border-bottom: none !important; }
        .border-top-none { border-top: none !important; }
        .border-left-none { border-left: none !important; }
        .border-right-none { border-right: none !important; }

        /* Negative margin pulls the tables together so their borders overlap perfectly into 1 line */
        .seamless-table { margin-top: -1px; }
    </style>
</head>
<body>

    <div class="appendix-text">Appendix 60</div>

    <div class="doc-title">PURCHASE REQUEST</div>

    <table class="border-none" style="margin-bottom: 10px;">
        <tr>
            <td class="border-none font-bold" style="width: 12%; padding: 2px;">Entity Name:</td>
            <td class="border-none font-bold" style="width: 53%; border-bottom: 1px solid black !important; padding: 2px;">
                DEPARTMENT OF THE INTERIOR & LOCAL GOVERNMENT
            </td>
            <td class="border-none font-bold" style="width: 15%; padding: 2px;">Fund Cluster:</td>
            <td class="border-none" style="width: 20%; border-bottom: 1px solid black !important; padding: 2px;"></td>
        </tr>
        <tr>
            <td class="border-none"></td>
            <td class="border-none font-bold" style="border-bottom: 1px solid black !important; padding: 2px;">
                Region 08, Tacloban City
            </td>
            <td class="border-none" colspan="2"></td>
        </tr>
    </table>

    <table>
        <tr>
            <td style="width: 30%; height: 25px;" class="font-bold border-bottom-none">
                Office/Section: &nbsp;&nbsp;&nbsp; <span style="font-weight: normal;">{{ $pr->office_section }}</span>
            </td>
            <td style="width: 45%;" class="font-bold border-bottom-none">
                PR NO.:
            </td>
            <td style="width: 25%;" class="font-bold" rowspan="2">
                Date: <span style="font-weight: normal;">{{ $pr->date ? \Carbon\Carbon::parse($pr->date)->format('m/d/Y') : '____________' }}</span>
            </td>
        </tr>
        <tr>
            <td class="border-top-none"></td>
            <td class="font-bold border-top-none" style="height: 25px;">
                Responsibility Center Code: _____________________
            </td>
        </tr>
    </table>

    <table class="seamless-table">
        <thead>
            <tr class="text-center font-bold">
                <td style="width: 12%;">Stock/ Property<br>No.</td>
                <td style="width: 8%;">Unit</td>
                <td style="width: 40%;">Item Description</td>
                <td style="width: 10%;">Quantity</td>
                <td style="width: 15%;">Unit Cost</td>
                <td style="width: 15%;">Total Cost</td>
            </tr>
        </thead>
        <tbody>
            @foreach($pr->items as $item)
            <tr>
                <td class="text-center"></td>
                <td class="text-center">{{ $item->unit }}</td>
                <td>{!! $item->item_description !!}</td>
                <td class="text-center">{{ $item->quantity }}</td>
                <td class="text-right">P {{ number_format($item->unit_cost, 2) }}</td>
                <td class="text-right">P {{ number_format($item->total_cost, 2) }}</td>
            </tr>
            @endforeach
            
            <tr>
                <td colspan="4" class="border-right-none border-bottom-none"></td>
                <td class="text-right font-bold border-left-none">TOTAL</td>
                <td class="text-right font-bold">P {{ number_format($pr->items->sum('total_cost'), 2) }}</td>
            </tr>
        </tbody>
    </table>

    <table class="seamless-table">
        <tr>
            <td class="border-right-none" style="width: 12%; height: 50px;">Purpose:</td>
            <td class="border-left-none" style="width: 88%; vertical-align: middle;">
                {{ $pr->purpose }}
            </td>
        </tr>
    </table>

    <table class="seamless-table">
        <tr>
            <td class="border-right-none border-bottom-none" style="width: 15%;"></td>
            <td class="border-left-none border-bottom-none" style="width: 30%;">Requested by:</td>
            <td class="border-bottom-none" style="width: 45%;">Approved by:</td>
        </tr>
        <tr>
            <td class="border-right-none border-top-none border-bottom-none" style="height: 35px;">Signature:</td>
            <td class="border-left-none border-top-none border-bottom-none"></td>
            <td class="border-top-none border-bottom-none"></td>
        </tr>
        <tr>
            <td class="border-right-none border-top-none border-bottom-none">Printed Name:</td>
            <td class="border-left-none border-top-none border-bottom-none text-center font-bold">
                {{ $pr->requested_by_name }}
            </td>
            <td class="border-top-none border-bottom-none text-center font-bold">
                {{ $pr->approved_by_name }}
            </td>
        </tr>
        <tr>
            <td class="border-right-none border-top-none">Designation:</td>
            <td class="border-left-none border-top-none text-center italic">
                {{ $pr->requested_by_designation }}
            </td>
            <td class="border-top-none text-center italic">
                {{ $pr->approved_by_designation }}
            </td>
        </tr>
    </table>

</body>
</html>