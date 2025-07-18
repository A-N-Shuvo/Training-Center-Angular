import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MoneyReceipt } from '../../Models/moneyreceipt';
import { MoneyReceiptService } from '../../Services/money-receipt.service';
import { AdmissionService } from '../../Services/admission.service';
import { VisitorService } from '../../Services/visitor.service';
import { RegistrationService } from '../../Services/registration.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-money-receipt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './money-receipt.component.html',
  styleUrls: ['./money-receipt.component.css']
})
export class MoneyReceiptComponent implements OnInit {
  @ViewChild('receiptModal') receiptModal!: ElementRef;
  @ViewChild('detailsModal') detailsModal!: ElementRef;

  receiptForm!: FormGroup;
  receipts: MoneyReceipt[] = [];
  paginatedReceipts: MoneyReceipt[] = [];
  selectedReceipt: MoneyReceipt | null = null;
  admissionNumbers: string[] = [];
  visitors: any[] = [];
  showChequeFields = false;
  showMfsFields = false;
  showCardFields = false;
  invoiceNumbersDisplay = '';
  registrationNumbersDisplay = '';
  totalCourseFee = 0;
  existingInvoices: string[] = [];

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;
  pageNumbers: number[] = [];

  constructor(
    private fb: FormBuilder,
    private receiptService: MoneyReceiptService,
    private admissionService: AdmissionService,
    private visitorService: VisitorService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadReceipts();
    this.loadVisitors();
  }

  initializeForm(): void {
    this.receiptForm = this.fb.group({
      moneyReceiptId: [0],
      receiptDate: [new Date().toISOString().substring(0, 10), Validators.required],
      category: ['', Validators.required],
      admissionNo: [''],
      admissionId: [null],
      visitorId: [null],
      paymentMode: ['', Validators.required],
      chequeNo: [''],
      bankName: [''],
      mfsName: [''],
      transactionNo: [''],
      debitOrCreditCardNo: [''],
      isFullPayment: [false],
      isInvoiceCreated: [false],
      payableAmount: [0, [Validators.required, Validators.min(0)]],
      paidAmount: [0, [Validators.required, Validators.min(0)]],
      dueAmount: [0, [Validators.min(0)]],
      remarks: ['']
    });
  }

  loadReceipts(): void {
    this.receiptService.getMoneyReceipts().subscribe({
      next: (res) => {
        this.receipts = res;
        this.totalItems = res.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.generatePageNumbers();
        this.paginateReceipts();
      },
      error: (err) => {
        console.error('Error loading receipts:', err);
      }
    });
  }

  loadAdmissionNumbers(): void {
    this.admissionService.getAllAdmissions().subscribe({
      next: (admissions) => {
        this.admissionNumbers = admissions
          .filter(adm => adm.admissionNo)
          .map(adm => adm.admissionNo as string);
      },
      error: (err) => {
        console.error('Error loading admission numbers:', err);
      }
    });
  }

  loadVisitors(): void {
    this.visitorService.getAllVisitors().subscribe({
      next: (visitors) => {
        this.visitors = visitors;
      },
      error: (err) => {
        console.error('Error loading visitors:', err);
      }
    });
  }

  //onCategoryChange(): void {
  //  const category = this.receiptForm.get('category')?.value;

  //  if (category === 'Course') {
  //    this.loadAdmissionNumbers();
  //    this.receiptForm.get('visitorId')?.reset();
  //  } else if (category === 'Registration Fee') {
  //    this.receiptForm.get('admissionNo')?.reset();
  //  }
  //}
  onCategoryChange(): void {
    const category = this.receiptForm.get('category')?.value;

    if (category === 'Course') {
      this.loadAdmissionNumbers();
      this.receiptForm.get('visitorId')?.reset();
      // Reset amount fields for Course
      this.receiptForm.patchValue({
        payableAmount: 0,
        paidAmount: 0,
        dueAmount: 0
      });
    } else if (category === 'Registration Fee') {
      this.receiptForm.get('admissionNo')?.reset();
      // For Registration Fee, set payable = paid and due = 0
      const paidAmount = this.receiptForm.get('paidAmount')?.value || 0;
      this.receiptForm.patchValue({
        payableAmount: paidAmount,
        dueAmount: 0
      });
    }
  }

  onAdmissionChange(): void {
    const admissionNo = this.receiptForm.get('admissionNo')?.value;
    if (admissionNo) {
      this.fetchInvoiceNosFromMoneyReceipts(admissionNo);

      this.receiptService.getAdmissionPaymentInfo(admissionNo).subscribe({
        next: (res) => {
          this.totalCourseFee = res.totalAmount;
          const regFee = res.registrationFeePaid || 0;
          const previous = res.coursePaid || 0;
          const payable = this.totalCourseFee - regFee - previous;

          this.receiptForm.patchValue({
            payableAmount: payable > 0 ? payable : 0
          });
          this.calculateDueAmount();
        },
        error: (err) => {
          console.error('Error loading admission payment info:', err);
        }
      });
    } else {
      this.invoiceNumbersDisplay = '';
      this.existingInvoices = [];
    }
  }

  onPaymentModeChange(): void {
    const mode = this.receiptForm.get('paymentMode')?.value;
    this.showChequeFields = mode === 'Cheque';
    this.showMfsFields = mode === 'MFS';
    this.showCardFields = mode === 'Card';
  }

  //calculateDueAmount(): void {
  //  const payable = this.receiptForm.get('payableAmount')?.value || 0;
  //  const paid = this.receiptForm.get('paidAmount')?.value || 0;
  //  const due = payable - paid;

  //  this.receiptForm.patchValue({
  //    dueAmount: due >= 0 ? due : 0,
  //    isFullPayment: due <= 0 && this.receiptForm.get('category')?.value === 'Course'
  //  });
  //}

  calculateDueAmount(): void {
    const category = this.receiptForm.get('category')?.value;

    if (category === 'Registration Fee') {
      const paid = this.receiptForm.get('paidAmount')?.value || 0;
      this.receiptForm.patchValue({
        payableAmount: paid,
        dueAmount: 0
      });
    } else {
      const payable = this.receiptForm.get('payableAmount')?.value || 0;
      const paid = this.receiptForm.get('paidAmount')?.value || 0;
      const due = payable - paid;

      this.receiptForm.patchValue({
        dueAmount: due >= 0 ? due : 0,
        isFullPayment: due <= 0
      });
    }
  }

  get showInvoiceCheckbox(): boolean {
    const category = this.receiptForm.get('category')?.value;
    const isFullPayment = this.receiptForm.get('isFullPayment')?.value;
    return category === 'Registration Fee' || (category === 'Course' && !isFullPayment);
  }

  fetchInvoiceNosFromMoneyReceipts(admissionNo: string): void {
    this.receiptService.getInvoiceNosByAdmission(admissionNo).subscribe({
      next: (invoiceNos) => {
        this.existingInvoices = invoiceNos || [];
        this.invoiceNumbersDisplay = this.existingInvoices.join(', ');
      },
      error: (err) => {
        console.error('Error fetching invoice numbers:', err);
        this.existingInvoices = [];
        this.invoiceNumbersDisplay = '';
      }
    });
  }

  onVisitorSelected(): void {
    const visitorId = this.receiptForm.get('visitorId')?.value;
    if (visitorId) {
      this.fetchRegistrationNumbers(visitorId);
    } else {
      this.registrationNumbersDisplay = '';
    }
  }

  fetchRegistrationNumbers(visitorId: number): void {
    this.registrationService.getRegistrationsByVisitor(visitorId).subscribe({
      next: (registrations) => {
        const numbers = registrations.map(reg => reg.registraionNo).filter(n => n);
        this.registrationNumbersDisplay = numbers.join(', ');
      },
      error: (err) => {
        console.error('Error fetching registration numbers:', err);
        this.registrationNumbersDisplay = '';
      }
    });
  }

  // Modal Operations
  openModal(): void {
    this.initializeForm();
    this.receiptModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.receiptModal.nativeElement.style.display = 'none';
  }

  onEdit(receipt: MoneyReceipt): void {
    this.receiptForm.patchValue({
      ...receipt,
      receiptDate: new Date(receipt.receiptDate).toISOString().substring(0, 10)
    });
    this.onPaymentModeChange();
    this.receiptModal.nativeElement.style.display = 'block';
  }

  onDelete(receipt: MoneyReceipt): void {
    if (confirm(`Are you sure you want to delete receipt ${receipt.moneyReceiptNo}?`)) {
      this.receiptService.deleteMoneyReceipt(receipt.moneyReceiptId).subscribe({
        next: () => {
          this.loadReceipts();
        },
        error: (err) => {
          console.error('Error deleting receipt:', err);
        }
      });
    }
  }

  onDetails(receipt: MoneyReceipt): void {
    this.receiptService.getMoneyReceipt(receipt.moneyReceiptId).subscribe({
      next: (res) => {
        this.selectedReceipt = res;
        this.detailsModal.nativeElement.style.display = 'block';
      },
      error: (err) => {
        console.error('Error loading receipt details:', err);
      }
    });
  }

  closeDetailsModal(): void {
    this.detailsModal.nativeElement.style.display = 'none';
  }

  onSubmit(): void {
    if (this.receiptForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = this.receiptForm.value;
    formData.receiptDate = new Date(formData.receiptDate);

    // Handle visitorId conversion
    if (formData.visitorId === null || formData.visitorId === undefined || formData.visitorId === '') {
      formData.visitorId = null;
    } else {
      formData.visitorId = +formData.visitorId;
    }

    // Handle admissionId conversion
    if (formData.admissionId === '' || formData.admissionId === null || formData.admissionId === undefined) {
      formData.admissionId = null;
    } else {
      formData.admissionId = +formData.admissionId;
    }

    // Registration Fee logic
    if (formData.category === 'Registration Fee') {
      formData.payableAmount = formData.paidAmount;
      formData.dueAmount = 0;
      formData.isFullPayment = false;
    } else {
      // Normal calculation
      formData.dueAmount = (formData.payableAmount || 0) - (formData.paidAmount || 0);
      formData.isFullPayment = formData.dueAmount === 0;
    }

    if (formData.moneyReceiptId === 0) {
      this.receiptService.createMoneyReceipt(formData).subscribe({
        next: () => {
          alert('Money receipt created successfully');
          this.loadReceipts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating receipt:', err);
          alert('Error creating money receipt');
        }
      });
    } else {
      this.receiptService.updateMoneyReceipt(formData.moneyReceiptId, formData).subscribe({
        next: () => {
          alert('Money receipt updated successfully');
          this.loadReceipts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating receipt:', err);
          alert('Error updating money receipt');
        }
      });
    }
  }

  // Pagination methods
  paginateReceipts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReceipts = this.receipts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateReceipts();
  }

  generatePageNumbers(): void {
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(selectElement.value);
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.generatePageNumbers();
    this.paginateReceipts();
  }
}
