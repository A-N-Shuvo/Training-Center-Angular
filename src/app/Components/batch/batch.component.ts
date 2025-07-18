//import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
//import { CommonModule, DatePipe } from '@angular/common';
//import { Batch } from '../../Models/batch';
//import { Course } from '../../Models/course';
//import { Instructor } from '../../Models/instructor';
//import { Classroom } from '../../Models/classroom';
//import { Day } from '../../Models/day';
//import { Slot } from '../../Models/slot';
//import { BatchService } from '../../Services/batch.service';
//import { CourseService } from '../../Services/course.service';
//import { InstructorService } from '../../Services/instructor.service';
//import { ClassroomService } from '../../Services/classroom.service';
//import { DayService } from '../../Services/day.service';
//import { SlotService } from '../../Services/slot.service';
//import * as bootstrap from 'bootstrap';

//@Component({
//  selector: 'app-batch',
//  templateUrl: './batch.component.html',
//  styleUrls: ['./batch.component.css'],
//  standalone: true,
//  imports: [CommonModule, ReactiveFormsModule, DatePipe]
//})
//export class BatchComponent implements OnInit {
//  @ViewChild('batchModal') batchModal!: ElementRef;
//  @ViewChild('detailsModal') detailsModal!: ElementRef;

//  batchList: Batch[] = [];
//  paginatedBatches: Batch[] = [];
//  selectedBatch: Batch | null = null;
//  courses: Course[] = [];
//  instructors: Instructor[] = [];
//  classRooms: Classroom[] = [];
//  days: Day[] = [];
//  slots: Slot[] = [];

//  batchForm: FormGroup;
//  checkedDays: { [key: number]: boolean } = {};

//  // Pagination variables
//  currentPage: number = 1;
//  itemsPerPage: number = 5;
//  totalItems: number = 0;
//  totalPages: number = 0;
//  pageNumbers: number[] = [];

//  constructor(
//    private fb: FormBuilder,
//    private batchService: BatchService,
//    private courseService: CourseService,
//    private instructorService: InstructorService,
//    private classRoomService: ClassroomService,
//    private dayService: DayService,
//    private slotService: SlotService
//  ) {
//    this.batchForm = this.fb.group({
//      batchId: [0],
//      batchName: ['', Validators.required],
//      courseId: [null, Validators.required],
//      startDate: ['', Validators.required],
//      endDate: [''],
//      remarks:[''],
//      batchType: ['Regular', Validators.required],
//      selectedDayIds: [[], [Validators.required, Validators.minLength(1)]],
//      timeSlot: ['', Validators.required],
//      instructorId: [null, Validators.required],
//      classRoomId: [null, Validators.required],
//      isActive: [true]
//    });
//  }

//  ngOnInit(): void {
//    this.loadBatches();
//    this.loadDropdownData();
//  }

//  loadBatches(): void {
//    this.batchService.getAllBatches().subscribe({
//      next: (batches) => {
//        this.batchList = batches;
//        this.totalItems = batches.length;
//        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//        this.generatePageNumbers();
//        this.paginateBatches();
//      },
//      error: (error) => console.error('Error loading batches:', error)
//    });
//  }

//  loadDropdownData(): void {
//    this.courseService.getActiveCourses().subscribe(data => this.courses = data);
//    this.instructorService.getAllInstructorsWithEmployees().subscribe(data => {
//      this.instructors = data;
//    });
//    this.classRoomService.getAllClassrooms().subscribe(data => this.classRooms = data);
//    this.dayService.getAllDays().subscribe(data => this.days = data);
//    this.slotService.getAllSlots().subscribe(data => this.slots = data);
//  }

//  // Pagination methods
//  paginateBatches() {
//    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//    const endIndex = startIndex + this.itemsPerPage;
//    this.paginatedBatches = this.batchList.slice(startIndex, endIndex);
//  }

//  changePage(page: number) {
//    if (page < 1 || page > this.totalPages) return;
//    this.currentPage = page;
//    this.paginateBatches();
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
//    this.paginateBatches();
//  }

//  openModal(): void {
//    this.batchForm.reset({
//      batchId: 0,
//      isActive: true,
//      batchType: 'Regular'
//    });
//    this.checkedDays = {};
//    const modal = new bootstrap.Modal(this.batchModal.nativeElement);
//    modal.show();
//  }

//  closeModal(): void {
//    const modal = bootstrap.Modal.getInstance(this.batchModal.nativeElement);
//    modal?.hide();
//  }

//  onEdit(batch: Batch): void {
//    const formattedStartDate = batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '';
//    const formattedEndDate = batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '';

//    this.checkedDays = {};
//    const dayIds = batch.classDays?.split(',').map(day => {
//      const foundDay = this.days.find(d => d.dayName === day.trim());
//      if (foundDay) {
//        this.checkedDays[foundDay.dayId] = true;
//        return foundDay.dayId;
//      }
//      return undefined;
//    }).filter(id => id !== undefined) as number[];

//    const matchingSlot = this.slots.find(slot =>
//      slot.timeSlotType === batch.timeSlot ||
//      `${slot.timeSlotType} (${slot.startTime} - ${slot.endTime})` === batch.timeSlot
//    );

//    this.batchForm.patchValue({
//      ...batch,
//      startDate: formattedStartDate,
//      endDate: formattedEndDate,
//      selectedDayIds: dayIds,
//      timeSlot: matchingSlot ? matchingSlot.slotID : null
//    });

//    const modal = new bootstrap.Modal(this.batchModal.nativeElement);
//    modal.show();
//  }

//  onSubmit(): void {
//    if (this.batchForm.invalid) return;

//    const formValue = this.batchForm.value;
//    const selectedDays = this.days.filter(day =>
//      formValue.selectedDayIds.includes(day.dayId)
//    ).map(day => day.dayName);

//    const batchData: Batch = {
//      ...formValue,
//      classDays: selectedDays.join(',')
//    };

//    if (batchData.batchId === 0) {
//      this.batchService.addBatch(batchData).subscribe({
//        next: () => {
//          this.loadBatches();
//          this.closeModal();
//        },
//        error: (error) => console.error('Error adding batch:', error)
//      });
//    } else {
//      this.batchService.updateBatch(batchData).subscribe({
//        next: () => {
//          this.loadBatches();
//          this.closeModal();
//        },
//        error: (error) => console.error('Error updating batch:', error)
//      });
//    }
//  }

//  onDetails(batch: Batch): void {
//    this.selectedBatch = batch;
//    const modal = new bootstrap.Modal(this.detailsModal.nativeElement);
//    modal.show();
//  }

//  closeDetailsModal(): void {
//    const modal = bootstrap.Modal.getInstance(this.detailsModal.nativeElement);
//    modal?.hide();
//  }

//  onDelete(batch: Batch): void {
//    if (confirm('Are you sure you want to delete this batch?')) {
//      this.batchService.deleteBatch(batch.batchId).subscribe({
//        next: () => {
//          this.batchList = this.batchList.filter(b => b.batchId !== batch.batchId);
//          this.totalItems = this.batchList.length;
//          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//          this.generatePageNumbers();
//          this.paginateBatches();
//        },
//        error: (error) => console.error('Error deleting batch:', error)
//      });
//    }
//  }

//  onDayCheckboxChange(dayId: number): void {
//    this.checkedDays[dayId] = !this.checkedDays[dayId];
//    const selectedDays = Object.keys(this.checkedDays)
//      .filter(id => this.checkedDays[+id])
//      .map(id => +id);
//    this.batchForm.get('selectedDayIds')?.setValue(selectedDays);
//  }
//}



import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Batch } from '../../Models/batch';
import { Course } from '../../Models/course';
import { Instructor } from '../../Models/instructor';
import { Classroom } from '../../Models/classroom';
import { Day } from '../../Models/day';
import { Slot } from '../../Models/slot';
import { BatchService } from '../../Services/batch.service';
import { CourseService } from '../../Services/course.service';
import { InstructorService } from '../../Services/instructor.service';
import { ClassroomService } from '../../Services/classroom.service';
import { DayService } from '../../Services/day.service';
import { SlotService } from '../../Services/slot.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, FormsModule, NgxPaginationModule]
})
export class BatchComponent implements OnInit {
  @ViewChild('batchModal') batchModal!: ElementRef;
  @ViewChild('detailsModal') detailsModal!: ElementRef;

  batchList: Batch[] = [];
  filteredList: Batch[] = [];
  selectedBatch: Batch | null = null;
  courses: Course[] = [];
  instructors: Instructor[] = [];
  classRooms: Classroom[] = [];
  days: Day[] = [];
  slots: Slot[] = [];

  batchForm: FormGroup;
  checkedDays: { [key: number]: boolean } = {};
  isSubmitting = false;

  // Pagination properties
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  searchBy: string = 'batchName'; // Default search field

  // Sorting properties
  sortColumn: string = 'batchName';
  sortDirection: 'asc' | 'desc' = 'asc';

  batchService = inject(BatchService);
  courseService = inject(CourseService);
  instructorService = inject(InstructorService);
  classRoomService = inject(ClassroomService);
  dayService = inject(DayService);
  slotService = inject(SlotService);

  constructor(private fb: FormBuilder) {
    this.batchForm = this.fb.group({
      batchId: [0],
      batchName: ['', Validators.required],
      courseId: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      remarks: [''],
      batchType: ['Regular', Validators.required],
      selectedDayIds: [[], [Validators.required, Validators.minLength(1)]],
      timeSlot: ['', Validators.required],
      instructorId: [null, Validators.required],
      classRoomId: [null, Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadBatches();
    this.loadDropdownData();
  }

  applyFilter() {
    if (!this.searchText) {
      this.filteredList = [...this.batchList];
      this.applySorting();
      return;
    }

    this.filteredList = this.batchList.filter(batch => {
      const searchField = batch[this.searchBy as keyof Batch];

      // Special handling for course name
      if (this.searchBy === 'courseId') {
        const courseName = this.getCourseName(batch.courseId).toLowerCase();
        return courseName.includes(this.searchText.toLowerCase());
      }

      // Special handling for instructor name
      if (this.searchBy === 'instructorId') {
        const instructorName = this.getInstructorName(batch.instructorId).toLowerCase();
        return instructorName.includes(this.searchText.toLowerCase());
      }

      // Special handling for classroom name
      if (this.searchBy === 'classRoomId') {
        const roomName = this.getClassRoomName(batch.classRoomId).toLowerCase();
        return roomName.includes(this.searchText.toLowerCase());
      }

      if (typeof searchField === 'string') {
        return searchField.toLowerCase().includes(this.searchText.toLowerCase());
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
      let valA = a[this.sortColumn as keyof Batch];
      let valB = b[this.sortColumn as keyof Batch];

      // Special handling for course name sorting
      if (this.sortColumn === 'courseId') {
        valA = this.getCourseName(a.courseId);
        valB = this.getCourseName(b.courseId);
      }

      // Special handling for instructor name sorting
      if (this.sortColumn === 'instructorId') {
        valA = this.getInstructorName(a.instructorId);
        valB = this.getInstructorName(b.instructorId);
      }

      // Special handling for classroom name sorting
      if (this.sortColumn === 'classRoomId') {
        valA = this.getClassRoomName(a.classRoomId);
        valB = this.getClassRoomName(b.classRoomId);
      }

      // Handle null/undefined values
      if (valA == null) return this.sortDirection === 'asc' ? 1 : -1;
      if (valB == null) return this.sortDirection === 'asc' ? -1 : 1;

      // Handle string comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Handle number/date comparison
      return this.sortDirection === 'asc'
        ? (valA > valB ? 1 : -1)
        : (valB > valA ? 1 : -1);
    });
  }

  loadBatches(): void {
    this.batchService.getAllBatches().subscribe({
      next: (batches) => {
        this.batchList = batches;
        this.filteredList = [...batches];
        this.applySorting();
      },
      error: (error) => console.error('Error loading batches:', error)
    });
  }

  loadDropdownData(): void {
    this.courseService.getActiveCourses().subscribe(data => this.courses = data);
    this.instructorService.getAllInstructorsWithEmployees().subscribe(data => {
      this.instructors = data;
    });
    this.classRoomService.getAllClassrooms().subscribe(data => this.classRooms = data);
    this.dayService.getAllDays().subscribe(data => this.days = data);
    this.slotService.getAllSlots().subscribe(data => this.slots = data);
  }

  getCourseName(id: number): string {
    const course = this.courses.find(c => c.courseId === id);
    return course ? course.courseName : 'Unknown';
  }

  getInstructorName(id: number): string {
    const instructor = this.instructors.find(i => i.instructorId === id);
    return instructor ? instructor.employee?.employeeName || 'Unknown' : 'Unknown';
  }

  getClassRoomName(id: number): string {
    const room = this.classRooms.find(r => r.classRoomId === id);
    return room ? room.roomName : 'Unknown';
  }

  openModal(): void {
    this.batchForm.reset({
      batchId: 0,
      isActive: true,
      batchType: 'Regular'
    });
    this.checkedDays = {};
    this.batchModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.batchModal.nativeElement.style.display = 'none';
  }

  onEdit(batch: Batch): void {
    const formattedStartDate = batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '';
    const formattedEndDate = batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '';

    this.checkedDays = {};
    const dayIds = batch.classDays?.split(',').map(day => {
      const foundDay = this.days.find(d => d.dayName === day.trim());
      if (foundDay) {
        this.checkedDays[foundDay.dayId] = true;
        return foundDay.dayId;
      }
      return undefined;
    }).filter(id => id !== undefined) as number[];

    const matchingSlot = this.slots.find(slot =>
      slot.timeSlotType === batch.timeSlot ||
      `${slot.timeSlotType} (${slot.startTime} - ${slot.endTime})` === batch.timeSlot
    );

    this.batchForm.patchValue({
      ...batch,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      selectedDayIds: dayIds,
      timeSlot: matchingSlot ? matchingSlot.slotID : null
    });

    this.batchModal.nativeElement.style.display = 'block';
  }

  onSubmit(): void {
    if (this.batchForm.invalid || this.isSubmitting) {
      alert('Please fill all required fields.');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.batchForm.value;
    const selectedDays = this.days.filter(day =>
      formValue.selectedDayIds.includes(day.dayId)
    ).map(day => day.dayName);

    const batchData: Batch = {
      ...formValue,
      classDays: selectedDays.join(',')
    };

    if (batchData.batchId === 0) {
      this.batchService.addBatch(batchData).subscribe({
        next: () => {
          alert('Batch added successfully.');
          this.loadBatches();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.batchService.updateBatch(batchData).subscribe({
        next: () => {
          alert('Batch updated successfully.');
          this.loadBatches();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onDetails(batch: Batch): void {
    this.selectedBatch = batch;
    this.detailsModal.nativeElement.style.display = 'block';
  }

  closeDetailsModal(): void {
    this.detailsModal.nativeElement.style.display = 'none';
  }

  onDelete(batch: Batch): void {
    if (confirm(`Are you sure to delete batch: ${batch.batchName}?`)) {
      this.batchService.deleteBatch(batch.batchId).subscribe(() => {
        alert('Batch deleted successfully.');
        this.loadBatches();
      });
    }
  }

  onDayCheckboxChange(dayId: number): void {
    this.checkedDays[dayId] = !this.checkedDays[dayId];
    const selectedDays = Object.keys(this.checkedDays)
      .filter(id => this.checkedDays[+id])
      .map(id => +id);
    this.batchForm.get('selectedDayIds')?.setValue(selectedDays);
  }
}
