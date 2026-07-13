<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Request for Quotation</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            font-size: 9px; /* Slightly smaller to fit all elements */
            margin: 0; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        th, td { 
            border: 1px solid black; 
            padding: 3px 5px; 
            vertical-align: top; 
        }
        .no-border { border: none !important; }
        .border-bottom { border-bottom: 1px solid black !important; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .font-italic { font-style: italic; }
        
        /* Specific section styling */
        .header-section td { border: none; vertical-align: middle; }
        .doc-control { font-size: 8px; border-collapse: collapse; margin-left: auto; width: 180px;}
        .doc-control td { border: 1px solid black; padding: 2px; text-align: center; font-weight: bold;}
        .doc-control .bg-black { background-color: black; color: white; }
        
        .terms-table td { border: none; width: 50%; font-size: 8px; padding: 8px 12px; }
        .terms-header { text-align: center; font-weight: bold; font-size: 9px; color: black; border-bottom: 1px solid black !important; border-top: 1px solid black !important;}

        /* Make the PhilGEPS label larger than the base document font */
        .philgeps {
            font-size: 12px;
            font-weight: bold;
        }
        
        .main-table th { text-align: center; font-weight: bold; vertical-align: middle; font-size: 8px;}

        /* Reset default margins for lists/paragraphs inside item description cells
           to prevent extra white space above content (DOMPDF default margins). */
        .main-table td ul,
        .main-table td ol,
        .main-table td p {
            margin: 0;
            padding: 0;
        }
        .main-table td ul {
            padding-left: 12px;
        }
        .main-table td ul li {
            margin: 0 0 4px 0;
            padding: 0;
        }
        /* Header title should not wrap and stay centered between logo and doc control */
        .header-section .header-title {
            display: block;
            white-space: nowrap;
            font-size: 10px;
            font-weight: bold;
            line-height: 1.1;
        }
        
        .signature-line { border-bottom: 1px solid black; width: 100%; display: inline-block; margin-top: 15px; }
    </style>
</head>
<body>

    <table class="header-section" style="margin-bottom: 5px; table-layout: fixed;">
        <tr>
            <td style="width: 180px; text-align: left; vertical-align: middle; padding-left: 8px;">
                @php
                    $officeLogo = file_exists(public_path('images/office-logo.png'))
                        ? public_path('images/office-logo.png')
                        : (file_exists(public_path('images/office_logo.png'))
                            ? public_path('images/office_logo.png')
                            : public_path('images/dilg-logo.png'));
                @endphp
                <img src="{{ $officeLogo }}" style="width: 60px; height: 60px;" alt="Office Logo">
            </td>
            <td style="text-align: center; line-height: 1.2; padding: 0 8px;">
                <div>Republic of the Philippines</div>
                <span class="header-title">DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT</span>
                <div>Region VIII</div>
            </td>
            <td style="width: 180px; text-align: right; vertical-align: top;">
                <table class="doc-control">
                    <tr><td colspan="3" class="bg-black">Document Code</td></tr>
                    <tr><td colspan="3">FM-QP-DILG-AS-RO-10-07</td></tr>
                    <tr>
                        <td style="width: 33%;">Rev. No.</td>
                        <td style="width: 33%;">Eff. Date</td>
                        <td style="width: 34%;">Page</td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>06.01.23</td>
                        <td>1 of 1</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td class="font-bold" style="width: 25%;">MODE OF PROCUREMENT:</td>
            <td style="width: 45%;">{{ $rfq->mode_of_procurement }}</td>
            <td style="width: 10%;">RFQ No. :</td>
            <td style="width: 20%;">{{ $rfq->rfq_no }}</td>
        </tr>
        <tr>
            <td>Name of Procuring Entity:</td>
            <td>DILG Region VIII</td>
            <td>Date:</td>
            <td>{{ now()->format('m/d/Y') }}</td>
        </tr>
        <tr>
            <td>Office/End User:</td>
            <td colspan="3">{{ $rfq->end_user }}</td>
        </tr>
        <tr>
            <td>Company Name :</td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td>Address:</td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td colspan="4" class="philgeps">*PhilGEPS Registration No.</td>
        </tr>
        <tr>
            <td colspan="4" style="padding-top: 5px; padding-bottom: 5px;">
                Please quote your lowest price for the requirements listed hereunder subject to the Terms and Conditions stated below and submit to this office duly signed:
            </td>
        </tr>
        <tr>
            <td colspan="4" class="terms-header" style="padding: 2px;">TERMS AND CONDITIONS:</td>
        </tr>
        <tr>
            <td colspan="4" style="padding: 0;">
                <table class="terms-table">
                    <tr>
                        <td>
                            1. Bidders shall provide correct and accurate information required in this form.<br><br>
                            2. Bidders may quote for any or all items.<br><br>
                            3. Price quotation(s) to be denominated in Philippine Peso shall include all taxes duties and/or levies payable.<br><br>
                            4. Quotations exceeding the Approved Budget for the Contract (ABC) shall be rejected.<br><br>
                            5. Award of contract shall be made to the lowest quotation (for goods) or the highest rated offer (for consulting services) which complies with the minimum technical specifications and other terms and conditions stated herein.
                        </td>
                        <td>
                            6. Any interlineations, erasures, or overwriting shall be valid only if they are signed or initialed by the supplier or its authorized representative(s).<br><br>
                            7. The DILG shall have the right to inspect and/or to test the goods to confirm their conformity to the technical specifications.<br><br>
                            8. Liquidated damages equivalent to one-tenth of one percent (0.1%) of the value of the goods not delivered within the prescribed delivery period shall be imposed per day of delay. The DILG shall rescind the contract once the cumulative amount of liquidated damages reaches ten (10) percent of the amount of the contract, without prejudice to other courses of action and remedies open to it.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table style="border-top: none;">
        <tr>
            <td style="width: 50%; height: 80px; text-align: center; vertical-align: middle; border-top: none;">
                <span class="font-bold">APPROVED BUDGET FOR THE CONTRACT (ABC):</span><br><br><br>
                <span class="font-italic">{{ $rfq->abc_words ?? '' }}</span> (P {{ number_format($rfq->total_abc, 2) }})
            </td>
            <td style="width: 50%; text-align: center; vertical-align: bottom; border-top: none; padding-bottom: 10px;">
                <span class="font-bold">JHONEL M. AÑAVESA</span><br>
                <span style="border-top: 1px solid black; display: inline-block; width: 80%; padding-top: 2px;">Authorized Signatory</span>
            </td>
        </tr>
    </table>

    <table class="main-table" style="border-top: none;">
        <thead>
            <tr>
                <th rowspan="2" style="width: 5%;">ITEM NO.</th>
                <th rowspan="2" style="width: 33%;">ITEM DESCRIPTION</th>
                <th rowspan="2" style="width: 5%;">QTY.</th>
                <th rowspan="2" style="width: 5%;">UNIT</th>
                <th colspan="2" style="width: 18%;">APPROVED BUDGET FOR THE CONTRACT (ABC)</th>
                <th rowspan="2" style="width: 8%;">STATEMENT OF COMPLIANCE</th>
                <th colspan="2" style="width: 26%;">PRICE OFFER FROM SUPPLIER/ SERVICE PROVIDER</th>
            </tr>
            <tr>
                <th style="width: 9%;">ABC PER ITEM</th>
                <th style="width: 9%;">TOTAL ABC</th>
                <th style="width: 13%;">OFFER PER ITEM</th>
                <th style="width: 13%;">TOTAL OFFER</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rfq->items as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{!! $item->item_description !!}</td>
                <td class="text-center">{{ $item->qty }}</td>
                <td class="text-center">{{ $item->unit }}</td>
                <td class="text-right">{{ number_format($item->abc_per_item, 2) }}</td>
                <td class="text-right">{{ number_format($item->total_abc, 2) }}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            @endforeach
            
            <tr>
                <td></td>
                <td class="font-italic">
                    *RFQ must be submitted seal together with the required documents to the address above on or BEFORE <strong>{{ $rfq->submission_deadline ? \Carbon\Carbon::parse($rfq->submission_deadline)->format('F j, Y') : '___________________' }}</strong><br>
                    Deliverables:<br>
                    *Bidder must be operating within Tacloban City Only<br>
                    *Must have updated Philgeps Registration<br>
                    *Must have recent Mayor's Business Permit
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-bold text-center" style="vertical-align: bottom;">GRAND TOTAL</td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <table style="border-top: none;">
        <tr>
            <td style="width: 10%; border-right: none;" class="font-bold">Warranty</td>
            <td style="width: 40%; border-left: none; border-bottom: 1px solid black;"></td>
            <td style="width: 10%; border-right: none;" class="font-bold text-center">Price Validity</td>
            <td style="width: 40%; border-left: none; border-bottom: 1px solid black;"></td>
        </tr>
        <tr>
            <td colspan="4" style="height: 95px; text-align: center; vertical-align: top; padding-top: 15px; padding-bottom: 15px;">
                <span class="font-bold">After having carefully read and accepted your General Conditions, I/WE quote on the item(s) at prices noted above.</span>
                
                <div style="width: 30%; float: right; text-align: center; margin-top: 35px;">
                    <div class="signature-line"></div>
                    <span class="font-bold">Printed Name/Signature/Date</span><br>
                    <div class="signature-line"></div>
                    <span class="font-bold">Tel. No./Cellphone No.</span>
                </div>
            </td>
        </tr>
    </table>

</body>
</html>