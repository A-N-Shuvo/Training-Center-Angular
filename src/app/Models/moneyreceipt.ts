export interface MoneyReceipt {
  moneyReceiptId: number;
  moneyReceiptNo: string;
  receiptDate: Date;
  category: 'Course' /*| 'NonCourse'*/ | 'Registration Fee';
  //admissionId?: number;
  admissionNo: string;
  invoiceId?: number;
  visitorId?: number;
  paymentMode: 'Cash' | 'Cheque' | 'MFS' | 'Card';

  // Cheque details
  chequeNo?: string;
  bankName?: string;

  // MFS details
  mfsName?: 'Bkash' | 'Rocket' | 'Nagad';
  transactionNo?: string;

  // Card details
  debitOrCreditCardNo?: string;

  isFullPayment: boolean;
  isInvoiceCreated: boolean;

  payableAmount: number;
  paidAmount: number;
  dueAmount: number;

  createdBy?: string;
  remarks?: string;
}
export interface Visitor {
  visitorId: number;
  visitorName: string;
  // other visitor properties
}
