"use client";

import React, { forwardRef, useRef } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/registry/new-york-v4/ui/dialog";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Printer, Mail, MessageSquare, Copy } from "lucide-react";

interface ReceiptProps {
  transaction: {
    invoice_number: string;
    created_at: string;
    cashier_name: string;
    customer_name?: string;
    customer_phone?: string;
    items: Array<{
      name: string;
      sku: string;
      quantity: number;
      unit_price: number;
      discount: number;
      total: number;
    }>;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    tendered_amount?: number;
    change_amount?: number;
    loyalty_points_earned?: number;
    loyalty_points_redeemed?: number;
  };
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeTax?: string;
}

export const ThermalReceipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ transaction, storeName = "Beauty Store Jakarta", storeAddress = "Jl. Sudirman No. 123", storePhone = "+62-21-1234-5678", storeTax = "01.234.567.8-901.000" }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div
        ref={ref}
        className="receipt-thermal"
        style={{
          width: "80mm",
          maxWidth: "302px",
          fontFamily: "monospace",
          fontSize: "12px",
          padding: "10mm",
          backgroundColor: "white",
          color: "black",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5mm" }}>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>{storeName}</div>
          <div style={{ fontSize: "10px", marginTop: "2mm" }}>{storeAddress}</div>
          <div style={{ fontSize: "10px" }}>Tel: {storePhone}</div>
          <div style={{ fontSize: "10px" }}>NPWP: {storeTax}</div>
        </div>

        <div style={{ borderTop: "1px dashed black", margin: "3mm 0" }} />

        {/* Transaction Info */}
        <div style={{ fontSize: "10px", marginBottom: "3mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Invoice:</span>
            <span style={{ fontWeight: "bold" }}>{transaction.invoice_number}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Date:</span>
            <span>{formatDate(transaction.created_at)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Cashier:</span>
            <span>{transaction.cashier_name}</span>
          </div>
          {transaction.customer_name && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Customer:</span>
              <span>{transaction.customer_name}</span>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px dashed black", margin: "3mm 0" }} />

        {/* Items */}
        <div style={{ marginBottom: "3mm" }}>
          {transaction.items.map((item, index) => (
            <div key={index} style={{ marginBottom: "2mm" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold" }}>{item.name}</div>
              <div style={{ fontSize: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>
                  {item.quantity} x {formatCurrency(item.unit_price)}
                </span>
                <span style={{ fontWeight: "bold" }}>{formatCurrency(item.total)}</span>
              </div>
              {item.discount > 0 && (
                <div style={{ fontSize: "9px", color: "#666", paddingLeft: "5mm" }}>
                  Discount: -{formatCurrency(item.discount)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px dashed black", margin: "3mm 0" }} />

        {/* Totals */}
        <div style={{ fontSize: "11px", marginBottom: "3mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm" }}>
            <span>Subtotal:</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          {transaction.discount_amount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm", color: "#d32f2f" }}>
              <span>Discount:</span>
              <span>-{formatCurrency(transaction.discount_amount)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm" }}>
            <span>PPN 11%:</span>
            <span>{formatCurrency(transaction.tax_amount)}</span>
          </div>
          <div style={{ borderTop: "1px solid black", paddingTop: "2mm", marginTop: "2mm" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "bold" }}>
              <span>TOTAL:</span>
              <span>{formatCurrency(transaction.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        {transaction.payment_method && (
          <div style={{ fontSize: "11px", marginBottom: "3mm" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm" }}>
              <span>Payment:</span>
              <span style={{ fontWeight: "bold" }}>{transaction.payment_method}</span>
            </div>
            {transaction.tendered_amount && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm" }}>
                  <span>Tendered:</span>
                  <span>{formatCurrency(transaction.tendered_amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold" }}>
                  <span>Change:</span>
                  <span>{formatCurrency(transaction.change_amount || 0)}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Loyalty */}
        {(transaction.loyalty_points_earned || transaction.loyalty_points_redeemed) && (
          <>
            <div style={{ borderTop: "1px dashed black", margin: "3mm 0" }} />
            <div style={{ fontSize: "10px", marginBottom: "3mm" }}>
              {transaction.loyalty_points_redeemed && transaction.loyalty_points_redeemed > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm" }}>
                  <span>Points Redeemed:</span>
                  <span style={{ color: "#d32f2f" }}>-{transaction.loyalty_points_redeemed.toLocaleString()}</span>
                </div>
              )}
              {transaction.loyalty_points_earned && transaction.loyalty_points_earned > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1mm" }}>
                  <span>Points Earned:</span>
                  <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                    +{transaction.loyalty_points_earned.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ borderTop: "1px dashed black", margin: "3mm 0" }} />

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: "10px", marginTop: "5mm" }}>
          <div style={{ marginBottom: "2mm" }}>Thank you for your purchase!</div>
          <div style={{ marginBottom: "2mm" }}>Terima kasih atas kunjungan Anda</div>
          <div style={{ marginTop: "3mm", fontSize: "9px" }}>
            Goods sold are not refundable
            <br />
            Exchange within 7 days with receipt
          </div>
          <div style={{ marginTop: "5mm", fontSize: "9px" }}>
            www.beautystore.co.id
            <br />
            Instagram: @beautystorejkt
          </div>
        </div>

        {/* Barcode placeholder */}
        <div style={{ textAlign: "center", marginTop: "5mm" }}>
          <div style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace" }}>
            *{transaction.invoice_number}*
          </div>
        </div>
      </div>
    );
  }
);

ThermalReceipt.displayName = "ThermalReceipt";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ReceiptProps["transaction"];
  onPrint?: () => void;
  onEmail?: () => void;
  onSMS?: () => void;
}

export function ReceiptDialog({
  open,
  onOpenChange,
  transaction,
  onPrint,
  onEmail,
  onSMS,
}: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print behavior
      const printWindow = window.open("", "_blank");
      if (printWindow && receiptRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${transaction.invoice_number}</title>
              <style>
                @media print {
                  @page { 
                    size: 80mm auto; 
                    margin: 0; 
                  }
                  body { 
                    margin: 0; 
                    padding: 0;
                  }
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleCopy = () => {
    if (receiptRef.current) {
      const text = receiptRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert("Receipt copied to clipboard!");
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>

        {/* Receipt Preview with scroll */}
        <div className="max-h-[60vh] overflow-auto border rounded-lg bg-gray-50 p-4">
          <ThermalReceipt ref={receiptRef} transaction={transaction} />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="flex gap-2 flex-1">
            {onEmail && (
              <Button variant="outline" size="sm" onClick={onEmail} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            )}
            {onSMS && (
              <Button variant="outline" size="sm" onClick={onSMS} className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            New Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
