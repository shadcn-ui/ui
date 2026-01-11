"use client";

import React, { forwardRef, useRef } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/registry/new-york-v4/ui/dialog";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { toast } from "sonner";
import { 
  Printer, 
  Mail, 
  MessageSquare, 
  Copy,
  Receipt,
  Store,
  User,
  CreditCard,
  Gift
} from "lucide-react";

interface TransactionItem {
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
  tax_amount?: number;
  batch_number?: string;
}

interface PaymentMethod {
  method: string;
  amount: number;
  reference?: string;
  tender_amount?: number;
  change_amount?: number;
}

interface ReceiptData {
  transaction_number: string;
  invoice_number?: string;
  transaction_date: string;
  cashier_name: string;
  terminal_name: string;
  warehouse_name: string;
  
  // Customer information
  customer_name?: string;
  customer_phone?: string;
  customer_tier?: string;
  
  // Items
  items: TransactionItem[];
  
  // Amounts
  subtotal: number;
  tax_amount: number;
  customer_discount: number;
  loyalty_discount: number;
  total_amount: number;
  
  // Payments
  payments: PaymentMethod[];
  
  // Loyalty
  loyalty_points_earned?: number;
  loyalty_points_redeemed?: number;
  loyalty_points_balance?: number;
  
  // Notes
  notes?: string;
}

interface StoreInfo {
  name: string;
  address: string[];
  phone: string;
  email?: string;
  website?: string;
  tax_id?: string;
  business_license?: string;
  footer_message?: string;
}

interface ThermalReceiptProps {
  receiptData: ReceiptData;
  storeInfo?: StoreInfo;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPrint?: () => void;
  onEmail?: () => void;
  onSMS?: () => void;
}

const DEFAULT_STORE_INFO: StoreInfo = {
  name: "Ocean Beauty Store",
  address: [
    "Jl. Sudirman No. 123",
    "Jakarta Pusat 10220",
    "Indonesia"
  ],
  phone: "+62-21-1234-5678",
  email: "info@oceanbeauty.co.id",
  website: "www.oceanbeauty.co.id",
  tax_id: "01.234.567.8-901.000",
  business_license: "NIB: 1234567890123",
  footer_message: "Terima kasih atas kunjungan Anda!"
};

export const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(
  ({ receiptData, storeInfo = DEFAULT_STORE_INFO, open, onOpenChange, onPrint, onEmail, onSMS }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const receiptRef = ref || internalRef;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    const handlePrint = async () => {
      try {
        if (receiptRef && 'current' in receiptRef && receiptRef.current) {
          const printContent = receiptRef.current.innerHTML;
          const printWindow = window.open('', '_blank');
          
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Receipt - ${receiptData.transaction_number}</title>
                  <style>
                    body { font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
                    .receipt { width: 80mm; margin: 0 auto; }
                    .text-center { text-align: center; }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .font-bold { font-weight: bold; }
                    .text-sm { font-size: 12px; }
                    .text-xs { font-size: 10px; }
                    .mb-2 { margin-bottom: 8px; }
                    .mb-4 { margin-bottom: 16px; }
                    .border-t { border-top: 1px dashed #000; padding-top: 4px; }
                    .border-b { border-bottom: 1px dashed #000; padding-bottom: 4px; }
                    .flex { display: flex; }
                    .justify-between { justify-content: space-between; }
                    .space-y-1 > * + * { margin-top: 4px; }
                    @media print {
                      body { -webkit-print-color-adjust: exact; }
                      .no-print { display: none; }
                    }
                  </style>
                </head>
                <body>
                  <div class="receipt">${printContent}</div>
                </body>
              </html>
            `);
            
            printWindow.document.close();
            printWindow.focus();
            
            // Wait a bit for content to load then print
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 250);
            
            toast.success("Receipt sent to printer");
            onPrint?.();
          }
        }
      } catch (error) {
        console.error("Print error:", error);
        toast.error("Failed to print receipt");
      }
    };

    const handleCopy = async () => {
      try {
        if (receiptRef && 'current' in receiptRef && receiptRef.current) {
          const textContent = receiptRef.current.innerText;
          await navigator.clipboard.writeText(textContent);
          toast.success("Receipt copied to clipboard");
        }
      } catch (error) {
        console.error("Copy error:", error);
        toast.error("Failed to copy receipt");
      }
    };

    const handleEmail = () => {
      if (receiptData.customer_name && receiptData.customer_phone) {
        toast.success("Receipt will be sent via email");
        onEmail?.();
      } else {
        toast.error("Customer email required");
      }
    };

    const handleSMS = () => {
      if (receiptData.customer_phone) {
        toast.success("Receipt summary sent via SMS");
        onSMS?.();
      } else {
        toast.error("Customer phone number required");
      }
    };

    const ReceiptContent = () => (
      <div className="receipt w-80 mx-auto bg-white text-black font-mono text-sm leading-relaxed">
        {/* Store Header */}
        <div className="text-center mb-4 pb-2 border-b-2 border-dashed border-gray-300">
          <h1 className="font-bold text-lg uppercase tracking-wide">{storeInfo.name}</h1>
          {storeInfo.address.map((line, index) => (
            <div key={index} className="text-xs">{line}</div>
          ))}
          <div className="text-xs">Tel: {storeInfo.phone}</div>
          {storeInfo.email && <div className="text-xs">{storeInfo.email}</div>}
          {storeInfo.website && <div className="text-xs">{storeInfo.website}</div>}
          {storeInfo.tax_id && (
            <div className="text-xs mt-1">
              NPWP: {storeInfo.tax_id}
            </div>
          )}
          {storeInfo.business_license && (
            <div className="text-xs">{storeInfo.business_license}</div>
          )}
        </div>

        {/* Transaction Info */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-xs">No. Transaksi:</span>
            <span className="text-xs font-bold">{receiptData.transaction_number}</span>
          </div>
          {receiptData.invoice_number && (
            <div className="flex justify-between">
              <span className="text-xs">No. Invoice:</span>
              <span className="text-xs">{receiptData.invoice_number}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-xs">Tanggal:</span>
            <span className="text-xs">{formatDate(receiptData.transaction_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Kasir:</span>
            <span className="text-xs">{receiptData.cashier_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Terminal:</span>
            <span className="text-xs">{receiptData.terminal_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Outlet:</span>
            <span className="text-xs">{receiptData.warehouse_name}</span>
          </div>
        </div>

        {/* Customer Info */}
        {(receiptData.customer_name || receiptData.customer_phone) && (
          <div className="mb-4 pb-2 border-b border-dashed border-gray-300">
            <div className="text-xs font-bold mb-1">PELANGGAN:</div>
            {receiptData.customer_name && (
              <div className="flex justify-between">
                <span className="text-xs">Nama:</span>
                <span className="text-xs">{receiptData.customer_name}</span>
              </div>
            )}
            {receiptData.customer_phone && (
              <div className="flex justify-between">
                <span className="text-xs">Telepon:</span>
                <span className="text-xs">{receiptData.customer_phone}</span>
              </div>
            )}
            {receiptData.customer_tier && (
              <div className="flex justify-between">
                <span className="text-xs">Member:</span>
                <span className="text-xs font-bold">{receiptData.customer_tier}</span>
              </div>
            )}
            {receiptData.loyalty_points_balance && (
              <div className="flex justify-between">
                <span className="text-xs">Poin Saldo:</span>
                <span className="text-xs">{receiptData.loyalty_points_balance.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="mb-4 pb-2 border-b-2 border-dashed border-gray-300">
          <div className="text-xs font-bold mb-2">ITEM PEMBELIAN:</div>
          
          {receiptData.items.map((item, index) => (
            <div key={index} className="mb-3">
              {/* Product name and SKU */}
              <div className="text-xs font-medium">{item.name}</div>
              <div className="text-xs text-gray-600 mb-1">SKU: {item.sku}</div>
              
              {/* Quantity, Price, Total */}
              <div className="flex justify-between text-xs">
                <span>{item.quantity} x {formatCurrency(item.unit_price)}</span>
                <span className="font-medium">{formatCurrency(item.total)}</span>
              </div>
              
              {/* Discount if any */}
              {item.discount > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>  Diskon:</span>
                  <span>-{formatCurrency(item.discount)}</span>
                </div>
              )}
              
              {/* Batch number if any */}
              {item.batch_number && (
                <div className="text-xs text-gray-500">  Batch: {item.batch_number}</div>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Subtotal:</span>
            <span>{formatCurrency(receiptData.subtotal)}</span>
          </div>

          {receiptData.customer_discount > 0 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Diskon Member:</span>
              <span>-{formatCurrency(receiptData.customer_discount)}</span>
            </div>
          )}

          {receiptData.loyalty_points_redeemed && receiptData.loyalty_points_redeemed > 0 && (
            <div className="flex justify-between text-xs text-blue-600">
              <span>Poin Terpakai ({receiptData.loyalty_points_redeemed}):</span>
              <span>-{formatCurrency(receiptData.loyalty_discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs">
            <span>PPN (11%):</span>
            <span>{formatCurrency(receiptData.tax_amount)}</span>
          </div>

          <div className="border-t border-dashed border-gray-400 pt-1 mt-1">
            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL:</span>
              <span>{formatCurrency(receiptData.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="mb-4 pb-2 border-b border-dashed border-gray-300">
          <div className="text-xs font-bold mb-1">PEMBAYARAN:</div>
          {receiptData.payments.map((payment, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between text-xs">
                <span>{payment.method}:</span>
                <span>{formatCurrency(payment.amount)}</span>
              </div>
              {payment.reference && (
                <div className="text-xs text-gray-600">  Ref: {payment.reference}</div>
              )}
              {payment.tender_amount && payment.change_amount !== undefined && (
                <div className="text-xs space-y-0">
                  <div className="flex justify-between">
                    <span>  Diterima:</span>
                    <span>{formatCurrency(payment.tender_amount)}</span>
                  </div>
                  {payment.change_amount > 0 && (
                    <div className="flex justify-between font-medium">
                      <span>  Kembalian:</span>
                      <span>{formatCurrency(payment.change_amount)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loyalty Points */}
        {(receiptData.loyalty_points_earned || receiptData.loyalty_points_redeemed) && (
          <div className="mb-4 pb-2 border-b border-dashed border-gray-300">
            <div className="text-xs font-bold mb-1">LOYALTY POINTS:</div>
            {receiptData.loyalty_points_redeemed && receiptData.loyalty_points_redeemed > 0 && (
              <div className="flex justify-between text-xs text-blue-600">
                <span>Poin Terpakai:</span>
                <span>-{receiptData.loyalty_points_redeemed}</span>
              </div>
            )}
            {receiptData.loyalty_points_earned && receiptData.loyalty_points_earned > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Poin Diperoleh:</span>
                <span>+{receiptData.loyalty_points_earned}</span>
              </div>
            )}
            {receiptData.loyalty_points_balance && (
              <div className="flex justify-between text-xs font-medium">
                <span>Total Poin:</span>
                <span>{receiptData.loyalty_points_balance.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Transaction Notes */}
        {receiptData.notes && (
          <div className="mb-4 pb-2 border-b border-dashed border-gray-300">
            <div className="text-xs font-bold mb-1">CATATAN:</div>
            <div className="text-xs">{receiptData.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs space-y-2">
          {storeInfo.footer_message && (
            <div className="font-medium">{storeInfo.footer_message}</div>
          )}
          
          <div className="border-t border-dashed border-gray-400 pt-2">
            <div>Barang yang sudah dibeli</div>
            <div>tidak dapat dikembalikan</div>
            <div>kecuali ada kesepakatan</div>
          </div>

          <div className="border-t border-dashed border-gray-400 pt-2">
            <div>Ikuti kami:</div>
            <div>@oceanbeautystore</div>
            <div>Instagram | Facebook | TikTok</div>
          </div>

          <div className="font-mono text-xs mt-4 pt-2 border-t border-dashed border-gray-400">
            Ocean ERP v4.0 - POS System
          </div>
        </div>
      </div>
    );

    // If used as standalone component
    if (!open && !onOpenChange) {
      return (
        <div ref={receiptRef}>
          <ReceiptContent />
        </div>
      );
    }

    // If used in dialog
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Receipt Preview
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div ref={receiptRef}>
              <ReceiptContent />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            
            {receiptData.customer_phone && (
              <Button variant="outline" onClick={handleSMS}>
                <MessageSquare className="w-4 h-4 mr-1" />
                SMS
              </Button>
            )}
            
            {receiptData.customer_name && (
              <Button variant="outline" onClick={handleEmail}>
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            )}
            
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

ThermalReceipt.displayName = "ThermalReceipt";

export default ThermalReceipt;