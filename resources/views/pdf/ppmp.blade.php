<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Procurement Management Plan</title>
    <style>
        @page { margin: 8mm 12mm 14mm; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 10px; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed !important; border-spacing: 0; }
        .ppmp-table { width: 306mm !important; table-layout: fixed !important; }
        th { border: 1px solid #000; padding: 4px 3px; vertical-align: middle; font-size: 8px; font-weight: 700; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.1; }
        td { border: 1px solid #000; padding: 6px 4px; vertical-align: top; font-size: 9px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; }
        thead { display: table-header-group; }
        tbody { display: table-row-group; }
        tr { page-break-inside: auto; break-inside: auto; }
        .ppmp-item-row { page-break-inside: auto; break-inside: auto; }
        .ppmp-long-text { white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
        .column-sizing td {
            height: 1px;
            min-height: 1px;
            padding: 0;
            border: 0;
            color: #fff;
            font-size: 1px;
            line-height: 1px;
        }
        .no-border { border: none !important; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }

        /* Header */
        .header-section td { border: none; vertical-align: middle; }
        .header-logo { width: 90px; padding-left: 8px; }
        .header-center { text-align: center; }
        .header-title { font-size: 13px; font-weight: 800; letter-spacing: 0.5px; white-space: nowrap; }
        .header-sub { font-size: 10px; }
        .header-wrap { position: relative; width: 100%; min-height: 92px; }
        .header-logo-inline { position: absolute; left: -100px; top: -15px; width: 70px; }
        .header-logo-inline img { display: block; width: 70px; height: 70px; }
        .header-text { width: 100%; text-align: center; }
        .check-row { margin-top: 12px; line-height: 1; }
        .check-item { display: inline-block; vertical-align: middle; margin-right: 22px; font-size: 10px; }
        .check-item input { vertical-align: middle; margin: 0 4px 0 0; }

        /* Group heading row */
        .group-heading { font-weight: 800; text-align: center; font-size: 10px; padding: 10px 4px; }

        /* Smaller text for column body */
        .col-small { font-size: 8.5px; }

        /* Signature area */
            .sign-row { width: 100%; text-align: center; margin-top: 30px; }
            .sign-area { width: 35%; display: inline-block; vertical-align: top; text-align: center; }
            .signature-space { height: 18px; }
            .signature-line { border-top: 1px solid black; display: block; width: 70%; margin: 0 auto; }
            .sign-name { font-size: 9px; font-weight: bold; margin-top: 0; text-transform: uppercase; }
            .sign-label { font-size: 9px; margin-top: 4px; }
            .sign-position { font-size: 9px; margin-top: 4px; }
    </style>
</head>
<body>

    <table class="header-section" style="margin: 0 0 0 0;">
        <tr>
            <td class="header-logo" style="width:140px; text-align:left; vertical-align:middle; padding-left:6px;"></td>
            <td style="text-align:center;">
                @php
                    $logo = file_exists(public_path('images/office-logo.png')) ? public_path('images/office-logo.png') : public_path('images/dilg-logo.png');
                @endphp
                <div class="header-wrap">
                    <div class="header-logo-inline">
                        <img src="{{ $logo }}" alt="logo">
                    </div>
                    <div class="header-text">
                        <div style="font-size:10px;">Republic of the Philippines</div>
                        <div class="header-title">DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT</div>
                        <div style="font-size:10px;">Kanhiaruw Hill. Tacloban City</div>
                        <div style="margin-top:14px; font-weight:bold;">PROJECT PROCUREMENT MANAGEMENT PLAN (PPMP) NO. ___</div>
                        <div class="check-row">
                            <label class="check-item"><input type="checkbox"> INDICATIVE</label>
                            <label class="check-item"><input type="checkbox"> FINAL</label>
                        </div>
                    </div>
                </div>
            </td>
            <td class="no-border" style="width:140px;"></td>
        </tr>
    </table>

    <div style="width:100%; margin-bottom:0;">
        <div style="text-align:left; font-size:10px;">Fiscal Year : <strong>{{ $ppmp['fiscal_year'] }}</strong></div>
        <div style="text-align:left; font-size:10px;">End-User or Implementing Unit: <strong>{{ $ppmp['end_user'] }}</strong></div>
    </div>

    <table class="ppmp-table" style="margin-top:0; margin-bottom:8px;">
        <thead>
            {{-- Dompdf requires non-empty TD widths in the first row for fixed table layout. --}}
            <tr class="column-sizing">
                <td width="23%" style="width:23%;">&nbsp;</td>
                <td width="8%" style="width:8%;">&nbsp;</td>
                <td width="18%" style="width:18%;">&nbsp;</td>
                <td width="10%" style="width:10%;">&nbsp;</td>
                <td width="4%" style="width:4%;">&nbsp;</td>
                <td width="5%" style="width:5%;">&nbsp;</td>
                <td width="5%" style="width:5%;">&nbsp;</td>
                <td width="7%" style="width:7%;">&nbsp;</td>
                <td width="6%" style="width:6%;">&nbsp;</td>
                <td width="8%" style="width:8%;">&nbsp;</td>
                <td width="3%" style="width:3%;">&nbsp;</td>
                <td width="3%" style="width:3%;">&nbsp;</td>
            </tr>
            <tr>
                <th class="group-heading" colspan="5">PROCUREMENT PROJECT DETAILS</th>
                <th class="group-heading" colspan="3">PROJECTED TIMELINE (MM/YYYY)</th>
                <th class="group-heading" colspan="2">FUNDING DETAILS</th>
                <th class="group-heading" rowspan="2">ATTACHED SUPPORTING DOCUMENTS</th>
                <th class="group-heading" rowspan="2">REMARKS</th>
            </tr>
            <tr>
                <th>General Description and Objective of the Project to be Procured</th>
                <th>Type of the Project to be Procured</th>
                <th>Quantity and Size of the Project to be Procured</th>
                <th>Recommended Mode of Procurement</th>
                <th>Pre-Procurement Conference (Yes/No)</th>
                <th>Start of Procurement Activity</th>
                <th>End of Procurement Activity</th>
                <th>Expected Delivery/Implementation Period</th>
                <th>Source of Funds</th>
                <th>Estimated Budget / Authorized Budgetary Allocation (PhP)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ppmp['items'] as $index => $item)
            <tr class="ppmp-item-row">
                <td class="ppmp-long-text">{!! $item['description'] !!}</td>
                <td class="text-center">{{ $item['type'] }}</td>
                <td class="text-center ppmp-long-text">
                    {!! nl2br(e($item['quantity'])) !!}
                    @if(!empty($item['size']))
                        <div style="margin-top:4px; text-align:left;">{!! $item['size'] !!}</div>
                    @endif
                </td>
                <td class="text-center">{{ $item['mode'] }}</td>
                <td class="text-center">{{ $item['pre_procurement'] }}</td>
                <td class="text-center">{{ $item['start'] }}</td>
                <td class="text-center">{{ $item['end'] }}</td>
                <td class="text-center">{{ $item['delivery'] }}</td>
                <td class="text-center">{{ $item['source'] }}</td>
                <td class="text-center">{{ $item['budget'] }}</td>
                <td class="text-center">{{ $item['supporting'] }}</td>
                <td class="text-center">{{ $item['remarks'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="sign-row">
        <div class="sign-area">
            <div style="margin-bottom:8px; font-size:11px;">Prepared by:</div>
            <div class="signature-space"></div>
            <div class="sign-name">{{ $ppmp['prepared_by']['name'] }}</div>
            <div class="signature-line"></div>
            <div class="sign-label">Signature over Printed Name</div>
            <div class="sign-position">POSITION/DESIGNATION</div>
            <div class="sign-label">{{ $ppmp['prepared_by']['designation'] }}</div>
            <div style="margin-top:6px;">Date : ___________</div>
        </div>

        <div class="sign-area">
            <div style="margin-bottom:8px; font-size:11px;">Submitted by:</div>
            <div class="signature-space"></div>
            <div class="sign-name">{{ $ppmp['submitted_by']['name'] }}</div>
            <div class="signature-line"></div>
            <div class="sign-label">Signature over Printed Name</div>
            <div class="sign-position">POSITION/DESIGNATION</div>
            <div class="sign-label">{{ $ppmp['submitted_by']['designation'] }}</div>
            <div style="margin-top:6px;">Date : ___________</div>
        </div>
    </div>

</body>
</html>
