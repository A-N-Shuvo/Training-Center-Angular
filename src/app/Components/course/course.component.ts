import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../Models/course';
import { CourseService } from '../../Services/course.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @ViewChild('courseModal') courseModal!: ElementRef;
  @ViewChild('detailsModal') detailsModal!: ElementRef;

  courseList: Course[] = [];
  filteredList: Course[] = [];
  courseForm: FormGroup;

  // Pagination properties
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  searchBy: string = 'courseName';
  isSubmitting = false;
  selectedCourse: Course | null = null;

  // Sorting properties
  sortColumn: string = 'courseName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder
  ) {
    this.courseForm = this.fb.group({
      courseId: [0],
      courseName: ['', Validators.required],
      shortCode: ['', Validators.required],
      totalHours: ['', Validators.required],
      courseFee: [500, [
        Validators.required,
        Validators.min(500)
      ]],
      remarks: [''],
      isActive: [true],
      createdDate: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courseList = courses;
        this.filteredList = [...this.courseList];
        this.applySorting();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  applyFilter() {
    if (!this.searchText) {
      this.filteredList = [...this.courseList];
      this.applySorting();
      return;
    }

    this.filteredList = this.courseList.filter(course => {
      const searchField = course[this.searchBy as keyof Course];
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
      let valA = a[this.sortColumn as keyof Course];
      let valB = b[this.sortColumn as keyof Course];

      if (valA == null) return this.sortDirection === 'asc' ? 1 : -1;
      if (valB == null) return this.sortDirection === 'asc' ? -1 : 1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return this.sortDirection === 'asc'
        ? (valA > valB ? 1 : -1)
        : (valB > valA ? 1 : -1);
    });
  }

  openModal(): void {
    this.courseModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.courseModal.nativeElement.style.display = 'none';
    this.courseForm.reset({
      courseId: 0,
      isActive: true,
      createdDate: new Date().toISOString().substring(0, 10)
    });
  }

  onEdit(course: Course): void {
    const formattedDate = new Date(course.createdDate).toLocaleDateString('en-CA');
    this.courseForm.patchValue({
      ...course,
      createdDate: formattedDate
    });
    this.openModal();
  }

  onDelete(course: Course): void {
    if (confirm(`Delete ${course.courseName}?`)) {
      this.courseService.deleteCourse(course.courseId).subscribe({
        next: () => this.loadCourses(),
        error: (err) => console.error('Error deleting course:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid || this.isSubmitting) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const course = this.courseForm.value;
    const operation = course.courseId === 0
      ? this.courseService.addCourse(course)
      : this.courseService.updateCourse(course);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadCourses();
        this.closeModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error saving course:', err);
      }
    });
  }

  onDetails(course: Course): void {
    this.selectedCourse = course;
    this.detailsModal.nativeElement.style.display = 'block';
  }

  closeDetailsModal(): void {
    this.detailsModal.nativeElement.style.display = 'none';
    this.selectedCourse = null;
  }
}
