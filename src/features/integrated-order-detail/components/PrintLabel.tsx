"use client";

import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useState, useCallback, useRef } from "react";

interface PrintLabelProps {
  shipmentNo: string;
  shipmentStatus: string;
  orderId: string;
  recipientName: string;
  recipientCompany: string;
  recipientAddress: string;
  recipientCityStateZip: string;
  recipientCountry: string;
  recipientPhone: string;
  trackingNo: string;
  onStatusUpdate?: () => void;
}

export default function PrintLabel({
  shipmentNo,
  shipmentStatus,
  orderId,
  recipientName,
  recipientCompany,
  recipientAddress,
  recipientCityStateZip,
  recipientCountry,
  recipientPhone,
  trackingNo,
  onStatusUpdate,
}: PrintLabelProps) {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = useCallback(() => {
    setOpen(true);

    // Picking Requested -> Picked 상태 업데이트 (최초 출력)
    if (shipmentStatus === "PICKING_REQUESTED" && onStatusUpdate) {
      onStatusUpdate();
    }
  }, [shipmentStatus, onStatusUpdate]);

  const handlePrintAction = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  }, []);

  // 라벨 HTML 생성
  const labelHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: 4in 6in; margin: 0; }
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 16px; width: 4in; box-sizing: border-box; }
        .label { border: 2px solid #000; padding: 0; }
        .header { display: flex; border-bottom: 2px solid #000; }
        .header-left { flex: 1; padding: 8px 10px; font-size: 9px; line-height: 1.4; border-right: 2px solid #000; }
        .header-right { width: 45%; padding: 8px 10px; font-size: 9px; line-height: 1.4; }
        .header-left strong { font-size: 10px; }
        .to-section { padding: 12px 14px; border-bottom: 2px solid #000; }
        .to-label { font-size: 9px; color: #666; }
        .to-name { font-size: 16px; font-weight: bold; margin: 4px 0 2px; }
        .to-company { font-size: 13px; font-weight: bold; }
        .to-address { font-size: 14px; font-weight: bold; margin-top: 8px; }
        .to-city { font-size: 14px; font-weight: bold; margin-top: 6px; }
        .to-phone { font-size: 13px; font-weight: bold; margin-top: 2px; }
        .to-ref { font-size: 10px; margin-top: 6px; color: #333; }
        .country-badge { float: right; font-size: 18px; font-weight: bold; margin-top: -60px; }
        .barcode-section { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #000; }
        .barcode-placeholder { flex: 1; background: repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px); height: 60px; margin-right: 16px; }
        .fedex-logo { text-align: right; }
        .fedex-logo .fedex { font-size: 22px; font-weight: 900; letter-spacing: -1px; }
        .fedex-logo .ground { font-size: 10px; display: block; text-align: right; }
        .trk-section { padding: 10px 14px; }
        .trk-label { font-size: 10px; font-weight: bold; }
        .trk-number { font-size: 24px; font-weight: bold; letter-spacing: 2px; margin-top: 2px; }
        .intl { float: right; font-size: 20px; font-weight: bold; margin-top: -30px; }
        .postal { font-size: 28px; font-weight: bold; text-align: center; margin-top: 8px; letter-spacing: 4px; }
        .bottom-barcode { text-align: center; margin-top: 10px; padding: 8px 14px; }
        .bottom-barcode-text { font-size: 10px; letter-spacing: 1px; }
        .bottom-barcode-bar { background: repeating-linear-gradient(90deg, #000 0px, #000 1.5px, #fff 1.5px, #fff 3px); height: 50px; margin-top: 4px; }
        .etd-badge { font-size: 14px; font-weight: 900; border: 3px solid #000; display: inline-block; padding: 2px 10px; margin-top: 4px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <div class="header-left">
            <strong>FROM:</strong><br/>
            <strong>GENTLE MONSTER</strong><br/>
            GENTLE MONSTER<br/>
            16221 HERON AVE<br/><br/>
            La Mirada CA 90638<br/>
            US<br/>
            17143371224
          </div>
          <div class="header-right">
            SHIP DATE: 25MAR26<br/>
            ACTWGT: 1.54 LB<br/>
            CAD: 264137732/WSXI3700<br/>
            DIMMED: 15 X 11 X 7 IN<br/><br/>
            BILL SENDER<br/>
            EEI : NO EEI 30.37(f)
          </div>
        </div>
        <div class="to-section">
          <span class="to-label">TO</span>
          <div class="to-name">${recipientName}</div>
          <div class="to-company">${recipientCompany}</div>
          <div class="to-address">${recipientAddress}</div>
          <div class="to-city">${recipientCityStateZip}</div>
          <div class="to-phone">${recipientPhone}</div>
          <div class="to-ref">REF: ${orderId}</div>
          <div class="country-badge">(${recipientCountry})</div>
          <div style="font-size:9px; margin-top:4px;">INV:<br/>PO: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DEPT:</div>
        </div>
        <div class="barcode-section">
          <div class="barcode-placeholder"></div>
          <div class="fedex-logo">
            <span class="fedex">FedEx</span><span class="ground">Ground</span>
            <div class="etd-badge">ETD</div>
          </div>
        </div>
        <div class="trk-section">
          <span class="trk-label">TRK#</span>
          <div class="trk-number">${trackingNo}</div>
          <span class="intl">INTL</span>
          <div class="postal">${recipientCityStateZip.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d|[A-Z0-9 ]+$/)?.[0] ?? ""}</div>
        </div>
        <div class="bottom-barcode">
          <div class="bottom-barcode-text">9632 0026 6 (000 000 0000) 0 00 ${trackingNo}</div>
          <div class="bottom-barcode-bar"></div>
        </div>
      </div>
    </body>
    </html>
  `;

  return (
    <>
      <Button color="primary" size="small" onClick={handlePrint}>
        Print Label
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        PaperProps={{ sx: { width: 520, height: 750 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
            px: 2.5,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            Shipping Label - {shipmentNo}
          </span>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          <iframe
            ref={iframeRef}
            srcDoc={labelHtml}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Shipping Label"
          />
        </DialogContent>
        <DialogActions
          sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #E0E0E0" }}
        >
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrintAction}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
