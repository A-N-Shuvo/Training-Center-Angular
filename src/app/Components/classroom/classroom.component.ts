//import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//import { Classroom } from '../../Models/classroom';
//import { ClassroomService } from '../../Services/classroom.service';
//import { CommonModule } from '@angular/common';

//@Component({
//  selector: 'app-classroom',
//  standalone: true,
//  imports: [ReactiveFormsModule, CommonModule],
//  templateUrl: './classroom.component.html',
//  styleUrl: './classroom.component.css'
//})
//export class ClassroomComponent implements OnInit {
//  @ViewChild('classroomModal') model: ElementRef | undefined;
//  @ViewChild('detailsModal') detailsModal: ElementRef | undefined;

//  classroomList: Classroom[] = [];
//  paginatedClassrooms: Classroom[] = [];
//  classroomForm: FormGroup = new FormGroup({});
//  selectedClassroom: Classroom | null = null;
//  classroomService = inject(ClassroomService);

//  // Pagination variables
//  currentPage: number = 1;
//  itemsPerPage: number = 5;
//  totalItems: number = 0;
//  totalPages: number = 0;
//  pageNumbers: number[] = [];

//  constructor(private fb: FormBuilder) { }

//  ngOnInit(): void {
//    this.setFormState();
//    this.getClassrooms();
//  }

//  openModal() {
//    const modal = document.getElementById('classroomModal');
//    if (modal != null) {
//      modal.style.display = 'block';
//    }
//  }

//  closeModal() {
//    this.setFormState();
//    if (this.model != null) {
//      this.model.nativeElement.style.display = 'none';
//    }
//  }

//  getClassrooms() {
//    this.classroomService.getAllClassrooms().subscribe((res) => {
//      this.classroomList = res;
//      this.totalItems = res.length;
//      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//      this.generatePageNumbers();
//      this.paginateClassrooms();
//    });
//  }

//  setFormState() {
//    this.classroomForm = this.fb.group({
//      classRoomId: [0],
//      roomName: ['', [Validators.required, Validators.maxLength(100)]],
//      seatCapacity: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
//      location: ['', [Validators.required, Validators.maxLength(200)]],
//      hasProjector: [false],
//      hasAirConditioning: [false],
//      hasWhiteboard: [false],
//      hasSoundSystem: [false],
//      hasInternetAccess: [false],
//      isActive: [true],
//      additionalFacilities: [''],
//      remarks: ['']
//    });
//  }

//  onSubmit() {
//    if (this.classroomForm.invalid) {
//      alert('Please fill all required fields correctly');
//      return;
//    }

//    const formData = this.classroomForm.value;

//    if (formData.classRoomId === 0) {
//      this.classroomService.addClassroom(formData).subscribe({
//        next: () => {
//          alert('Classroom added successfully');
//          this.getClassrooms();
//          this.closeModal();
//        },
//        error: (err) => {
//          console.error('Error adding classroom:', err);
//          alert('Error adding classroom');
//        }
//      });
//    } else {
//      this.classroomService.updateClassroom(formData).subscribe({
//        next: () => {
//          alert('Classroom updated successfully');
//          this.getClassrooms();
//          this.closeModal();
//        },
//        error: (err) => {
//          console.error('Error updating classroom:', err);
//          alert('Error updating classroom');
//        }
//      });
//    }
//  }

//  onEdit(classroom: Classroom) {
//    this.openModal();
//    this.classroomForm.patchValue(classroom);
//  }

//  onDelete(classroom: Classroom) {
//    const isConfirm = confirm(`Are you sure you want to delete classroom: ${classroom.roomName}?`);
//    if (isConfirm) {
//      this.classroomService.deleteClassroom(classroom.classRoomId).subscribe({
//        next: () => {
//          alert('Classroom deleted successfully');
//          this.getClassrooms();
//        },
//        error: (err) => {
//          console.error('Error deleting classroom:', err);
//          alert('Error deleting classroom');
//        }
//      });
//    }
//  }

//  onDetails(classroom: Classroom) {
//    this.selectedClassroom = classroom;
//    this.openDetailsModal();
//  }

//  openDetailsModal() {
//    const modal = document.getElementById('detailsModal');
//    if (modal) {
//      modal.style.display = 'block';
//    }
//  }

//  closeDetailsModal() {
//    this.selectedClassroom = null;
//    const modal = document.getElementById('detailsModal');
//    if (modal) {
//      modal.style.display = 'none';
//    }
//  }

//  // Pagination methods
//  paginateClassrooms() {
//    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//    const endIndex = startIndex + this.itemsPerPage;
//    this.paginatedClassrooms = this.classroomList.slice(startIndex, endIndex);
//  }

//  changePage(page: number) {
//    if (page < 1 || page > this.totalPages) return;
//    this.currentPage = page;
//    this.paginateClassrooms();
//  }

//  generatePageNumbers() {
//    this.pageNumbers = [];
//    for (let i = 1; i <= this.totalPages; i++) {
//      this.pageNumbers.push(i);
//    }
//  }

//  onItemsPerPageChange(event: Event) {
//    const selectElement = event.target as HTMLSelectElement;
//    this.itemsPerPage = Number(selectElement.value);
//    this.currentPage = 1;
//    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//    this.generatePageNumbers();
//    this.paginateClassrooms();
//  }
//}




import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Classroom } from '../../Models/classroom';
import { ClassroomService } from '../../Services/classroom.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent implements OnInit {
  @ViewChild('classroomModal') model: ElementRef | undefined;
  @ViewChild('detailsModal') detailsModal: ElementRef | undefined;

  classroomList: Classroom[] = [];
  filteredList: Classroom[] = [];
  classroomForm: FormGroup = new FormGroup({});
  selectedClassroom: Classroom | null = null;
  classroomService = inject(ClassroomService);

  // Pagination properties
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  searchBy: string = 'roomName'; // Default search field

  // Sorting properties
  sortColumn: string = 'roomName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setFormState();
    this.getClassrooms();
  }

  applyFilter() {
    if (!this.searchText) {
      this.filteredList = [...this.classroomList];
      this.applySorting();
      return;
    }

    this.filteredList = this.classroomList.filter(classroom => {
      const searchField = classroom[this.searchBy as keyof Classroom];

      if (typeof searchField === 'string') {
        return searchField.toLowerCase().includes(this.searchText.toLowerCase());
      } else if (typeof searchField === 'number') {
        return searchField.toString().includes(this.searchText);
      } else if (typeof searchField === 'boolean') {
        return searchField.toString().toLowerCase().includes(this.searchText.toLowerCase());
      }
      return false;
    });

    this.applySorting();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  applySorting() {
    this.filteredList.sort((a, b) => {
      let valA = a[this.sortColumn as keyof Classroom];
      let valB = b[this.sortColumn as keyof Classroom];

      // Handle null/undefined values
      if (valA == null) return this.sortDirection === 'asc' ? 1 : -1;
      if (valB == null) return this.sortDirection === 'asc' ? -1 : 1;

      // Handle string comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Handle number comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc'
          ? (valA - valB)
          : (valB - valA);
      }

      // Handle boolean comparison
      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return this.sortDirection === 'asc'
          ? (valA === valB ? 0 : valA ? -1 : 1)
          : (valA === valB ? 0 : valA ? 1 : -1);
      }

      return 0;
    });
  }

  openModal() {
    const modal = document.getElementById('classroomModal');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.setFormState();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }

  getClassrooms() {
    this.classroomService.getAllClassrooms().subscribe((res) => {
      this.classroomList = res;
      this.filteredList = [...res];
      this.applySorting();
    });
  }

  setFormState() {
    this.classroomForm = this.fb.group({
      classRoomId: [0],
      roomName: ['', [Validators.required, Validators.maxLength(100)]],
      seatCapacity: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      hasProjector: [false],
      hasAirConditioning: [false],
      hasWhiteboard: [false],
      hasSoundSystem: [false],
      hasInternetAccess: [false],
      isActive: [true],
      additionalFacilities: [''],
      remarks: ['']
    });
  }

  onSubmit() {
    if (this.classroomForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    const formData = this.classroomForm.value;

    if (formData.classRoomId === 0) {
      this.classroomService.addClassroom(formData).subscribe({
        next: () => {
          alert('Classroom added successfully');
          this.getClassrooms();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error adding classroom:', err);
          alert('Error adding classroom');
        }
      });
    } else {
      this.classroomService.updateClassroom(formData).subscribe({
        next: () => {
          alert('Classroom updated successfully');
          this.getClassrooms();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating classroom:', err);
          alert('Error updating classroom');
        }
      });
    }
  }

  onEdit(classroom: Classroom) {
    this.openModal();
    this.classroomForm.patchValue(classroom);
  }

  onDelete(classroom: Classroom) {
    const isConfirm = confirm(`Are you sure you want to delete classroom: ${classroom.roomName}?`);
    if (isConfirm) {
      this.classroomService.deleteClassroom(classroom.classRoomId).subscribe({
        next: () => {
          alert('Classroom deleted successfully');
          this.getClassrooms();
        },
        error: (err) => {
          console.error('Error deleting classroom:', err);
          alert('Error deleting classroom');
        }
      });
    }
  }

  onDetails(classroom: Classroom) {
    this.selectedClassroom = classroom;
    this.openDetailsModal();
  }

  openDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeDetailsModal() {
    this.selectedClassroom = null;
    const modal = document.getElementById('detailsModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
