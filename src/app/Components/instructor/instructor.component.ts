//import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Instructor } from '../../Models/instructor';
//import { InstructorService } from '../../Services/instructor.service';
//import { Course } from '../../Models/course';
//import { CourseService } from '../../Services/course.service';
//import { CommonModule } from '@angular/common';
//import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { Employee } from '../../Models/employee';
//import { EmployeeService } from '../../Services/employee.service';
//import { Observable, catchError, of, tap } from 'rxjs';
//import { ChangeDetectorRef } from '@angular/core';
//import { NgxPaginationModule } from 'ngx-pagination';

//@Component({
//  selector: 'app-instructor',
//  standalone: true,
//  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
//  templateUrl: './instructor.component.html',
//  styleUrls: ['./instructor.component.css']
//})
//export class InstructorComponent implements OnInit {
//  @ViewChild('instructorModal') instructorModal!: ElementRef;
//  @ViewChild('detailsModal') detailsModal!: ElementRef;

//  employeeList: Employee[] = [];
//  instructorList: Instructor[] = [];
//  filteredList: Instructor[] = [];
//  courseList: Course[] = [];
//  selectedInstructor: Instructor | null = null;

//  instructorForm: FormGroup;
//  isLoading = true;
//  isSubmitting = false;

//  // Pagination properties
//  p: number = 1;
//  itemsPerPage: number = 5;
//  searchText: string = '';

//  constructor(
//    private instructorService: InstructorService,
//    private courseService: CourseService,
//    private employeeService: EmployeeService,
//    private fb: FormBuilder,
//    private cdRef: ChangeDetectorRef
//  ) {
//    this.instructorForm = this.fb.group({
//      instructorId: [0],
//      employeeId: ['', Validators.required],
//      specialization: [''],
//      selectedCourseIds: [[]],
//      isActive: [true],
//      remarks: [null]
//    });
//  }

//  ngOnInit(): void {
//    this.isLoading = true;
//    this.loadEmployees();
//    this.loadCourses().subscribe({
//      complete: () => {
//        this.loadInstructors().subscribe({
//          complete: () => {
//            this.isLoading = false;
//            this.filteredList = [...this.instructorList];
//          },
//          error: () => {
//            this.isLoading = false;
//          }
//        });
//      },
//      error: () => {
//        this.isLoading = false;
//      }
//    });
//  }

//  applyFilter() {
//    if (!this.searchText) {
//      this.filteredList = [...this.instructorList];
//      return;
//    }
//    this.filteredList = this.instructorList.filter(instructor =>
//      (instructor.employeeName && instructor.employeeName.toLowerCase().includes(this.searchText.toLowerCase())) ||
//      (instructor.specialization && instructor.specialization.toLowerCase().includes(this.searchText.toLowerCase())) ||
//      this.getEmployeeName(instructor.employeeId).toLowerCase().includes(this.searchText.toLowerCase())
//    );
//  }

//  loadEmployees(): void {
//    this.employeeService.getAllEmployees().subscribe({
//      next: (employees) => {
//        this.employeeList = employees;
//      },
//      error: (err) => {
//        console.error('Error loading employees:', err);
//      }
//    });
//  }

//  loadInstructors(): Observable<Instructor[]> {
//    return this.instructorService.getAllInstructors().pipe(
//      tap(instructors => {
//        this.instructorList = instructors;
//        this.filteredList = [...instructors];
//      }),
//      catchError(error => {
//        console.error('Error loading instructors:', error);
//        return of([]);
//      })
//    );
//  }

//  refreshInstructorList(): void {
//    this.isLoading = true;
//    this.loadInstructors().subscribe({
//      complete: () => {
//        this.isLoading = false;
//      },
//      error: () => {
//        this.isLoading = false;
//      }
//    });
//  }

//  loadCourses(): Observable<Course[]> {
//    return this.courseService.getAllCourses().pipe(
//      tap(courses => {
//        this.courseList = courses;
//      }),
//      catchError(error => {
//        console.error('Error loading courses:', error);
//        return of([]);
//      })
//    );
//  }

//  openModal(): void {
//    this.instructorModal.nativeElement.style.display = 'block';
//  }

//  closeModal(): void {
//    this.instructorModal.nativeElement.style.display = 'none';
//    this.instructorForm.reset({
//      instructorId: 0,
//      employeeId: '',
//      specialization: '',
//      selectedCourseIds: [],
//      isActive: true,
//      remarks: ''
//    });
//  }

//  onEdit(instructor: Instructor) {
//    const specializationCourses = instructor.specialization
//      ? instructor.specialization.split(', ').map(name => name.trim())
//      : [];

//    const selectedIds = this.courseList
//      .filter(course => specializationCourses.includes(course.courseName))
//      .map(course => course.courseId);

//    this.instructorForm.patchValue({
//      ...instructor,
//      selectedCourseIds: selectedIds
//    });
//    this.openModal();
//  }

//  onDelete(instructor: Instructor) {
//    const isConfirm = confirm("Are you sure you want to delete this Instructor?");
//    if (isConfirm) {
//      this.instructorService.deleteInstructor(instructor.instructorId).subscribe({
//        next: () => {
//          alert('Instructor deleted successfully');
//          this.refreshInstructorList();
//        },
//        error: (err) => {
//          console.error('Error deleting instructor:', err);
//          alert('Error deleting instructor');
//        }
//      });
//    }
//  }

//  onSubmit(): void {
//    if (this.instructorForm.invalid || this.isSubmitting) return;

//    this.isSubmitting = true;
//    const formValue = this.instructorForm.value;
//    const selectedEmployee = this.employeeList.find(e => e.employeeId === formValue.employeeId);

//    const instructor: Instructor = {
//      ...formValue,
//      employeeName: selectedEmployee?.employeeName
//    };

//    const operation = instructor.instructorId === 0
//      ? this.instructorService.addInstructor(instructor)
//      : this.instructorService.updateInstructor(instructor);

//    operation.subscribe({
//      next: () => {
//        this.isSubmitting = false;
//        this.loadInstructors().subscribe(() => {
//          this.closeModal();
//        });
//      },
//      error: (err) => {
//        this.isSubmitting = false;
//        console.error('Error saving instructor:', err);
//      }
//    });
//  }

//  onDetails(instructor: Instructor): void {
//    this.selectedInstructor = instructor;
//    this.detailsModal.nativeElement.style.display = 'block';
//  }

//  closeDetailsModal(): void {
//    this.detailsModal.nativeElement.style.display = 'none';
//    this.selectedInstructor = null;
//  }

//  getCourseNames(instructor: Instructor): string {
//    if (!instructor?.courses) return '';
//    return instructor.courses.map(c => c.courseName).filter(name => name).join(', ');
//  }

//  getEmployeeName(employeeId: number): string {
//    if (!this.employeeList || this.employeeList.length === 0) return '';
//    const employee = this.employeeList.find(e => e.employeeId === employeeId);
//    return employee ? employee.employeeName : '';
//  }

//  isCourseSelected(courseId: number): boolean {
//    return this.instructorForm.get('selectedCourseIds')?.value.includes(courseId);
//  }

//  onCourseCheckboxChange(event: any, courseId: number) {
//    const checked = event.target.checked;
//    const current = this.instructorForm.value.selectedCourseIds || [];

//    const updated = checked
//      ? [...current, courseId]
//      : current.filter((id: number) => id !== courseId);

//    this.instructorForm.patchValue({
//      selectedCourseIds: updated,
//      specialization: this.getSpecializationText(updated)
//    });
//  }

//  getSpecializationText(courseIds: number[]): string {
//    return this.courseList
//      .filter(c => courseIds.includes(c.courseId))
//      .map(c => c.courseName)
//      .join(', ');
//  }

//  getUniqueCourses(): Course[] {
//    return this.courseList.filter((course, index, self) =>
//      index === self.findIndex(c => c.courseId === course.courseId)
//    );
//  }
//}





import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../Services/instructor.service';
import { Course } from '../../Models/course';
import { CourseService } from '../../Services/course.service';
import { Employee } from '../../Models/employee';
import { EmployeeService } from '../../Services/employee.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Instructor } from '../../Models/instructor';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  @ViewChild('instructorModal') instructorModal!: ElementRef;
  @ViewChild('detailsModal') detailsModal!: ElementRef;

  employeeList: Employee[] = [];
  instructorList: Instructor[] = [];
  filteredList: Instructor[] = [];
  courseList: Course[] = [];
  selectedInstructor: Instructor | null = null;

  instructorForm: FormGroup;
  isLoading = true;
  isSubmitting = false;

  // Pagination properties
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  searchBy: string = 'employeeName'; // Default search field

  // Sorting properties
  sortColumn: string = 'employeeName';
  sortDirection: 'asc' | 'desc' = 'asc';

  instructorService = inject(InstructorService);
  courseService = inject(CourseService);
  employeeService = inject(EmployeeService);

  constructor(private fb: FormBuilder) {
    this.instructorForm = this.fb.group({
      instructorId: [0],
      employeeId: ['', Validators.required],
      specialization: [''],
      selectedCourseIds: [[]],
      isActive: [true],
      remarks: [null]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadEmployees();
    this.loadCourses().subscribe({
      complete: () => {
        this.loadInstructors().subscribe({
          complete: () => {
            this.isLoading = false;
            this.filteredList = [...this.instructorList];
            this.applySorting();
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    if (!this.searchText) {
      this.filteredList = [...this.instructorList];
      this.applySorting();
      return;
    }

    this.filteredList = this.instructorList.filter(instructor => {
      const searchField = instructor[this.searchBy as keyof Instructor];

      // Special handling for employee name
      if (this.searchBy === 'employeeId') {
        const empName = this.getEmployeeName(instructor.employeeId).toLowerCase();
        return empName.includes(this.searchText.toLowerCase());
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
      let valA = a[this.sortColumn as keyof Instructor];
      let valB = b[this.sortColumn as keyof Instructor];

      // Special handling for employee name sorting
      if (this.sortColumn === 'employeeId') {
        valA = this.getEmployeeName(a.employeeId);
        valB = this.getEmployeeName(b.employeeId);
      }

      // Handle boolean values for isActive
      if (this.sortColumn === 'isActive') {
        valA = a.isActive ? 'true' : 'false';
        valB = b.isActive ? 'true' : 'false';
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

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employeeList = employees;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  loadInstructors(): Observable<Instructor[]> {
    return this.instructorService.getAllInstructors().pipe(
      tap(instructors => {
        this.instructorList = instructors;
        this.filteredList = [...instructors];
      }),
      catchError(error => {
        console.error('Error loading instructors:', error);
        return of([]);
      })
    );
  }

  refreshInstructorList(): void {
    this.isLoading = true;
    this.loadInstructors().subscribe({
      complete: () => {
        this.isLoading = false;
        this.applySorting();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadCourses(): Observable<Course[]> {
    return this.courseService.getAllCourses().pipe(
      tap(courses => {
        this.courseList = courses;
      }),
      catchError(error => {
        console.error('Error loading courses:', error);
        return of([]);
      })
    );
  }

  openModal(): void {
    this.instructorModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.instructorModal.nativeElement.style.display = 'none';
    this.instructorForm.reset({
      instructorId: 0,
      employeeId: '',
      specialization: '',
      selectedCourseIds: [],
      isActive: true,
      remarks: ''
    });
  }

  onEdit(instructor: Instructor) {
    const specializationCourses = instructor.specialization
      ? instructor.specialization.split(', ').map(name => name.trim())
      : [];

    const selectedIds = this.courseList
      .filter(course => specializationCourses.includes(course.courseName))
      .map(course => course.courseId);

    this.instructorForm.patchValue({
      ...instructor,
      selectedCourseIds: selectedIds
    });
    this.openModal();
  }

  onDelete(instructor: Instructor) {
    const isConfirm = confirm("Are you sure you want to delete this Instructor?");
    if (isConfirm) {
      this.instructorService.deleteInstructor(instructor.instructorId).subscribe({
        next: () => {
          alert('Instructor deleted successfully');
          this.refreshInstructorList();
        },
        error: (err) => {
          console.error('Error deleting instructor:', err);
          alert('Error deleting instructor');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.instructorForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = this.instructorForm.value;
    const selectedEmployee = this.employeeList.find(e => e.employeeId === formValue.employeeId);

    const instructor: Instructor = {
      ...formValue,
      employeeName: selectedEmployee?.employeeName
    };

    const operation = instructor.instructorId === 0
      ? this.instructorService.addInstructor(instructor)
      : this.instructorService.updateInstructor(instructor);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadInstructors().subscribe(() => {
          this.closeModal();
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error saving instructor:', err);
      }
    });
  }

  onDetails(instructor: Instructor): void {
    this.selectedInstructor = instructor;
    this.detailsModal.nativeElement.style.display = 'block';
  }

  closeDetailsModal(): void {
    this.detailsModal.nativeElement.style.display = 'none';
    this.selectedInstructor = null;
  }

  getCourseNames(instructor: Instructor): string {
    if (!instructor?.courses) return '';
    return instructor.courses.map(c => c.courseName).filter(name => name).join(', ');
  }

  getEmployeeName(employeeId: number): string {
    if (!this.employeeList || this.employeeList.length === 0) return '';
    const employee = this.employeeList.find(e => e.employeeId === employeeId);
    return employee ? employee.employeeName : '';
  }

  isCourseSelected(courseId: number): boolean {
    return this.instructorForm.get('selectedCourseIds')?.value.includes(courseId);
  }

  onCourseCheckboxChange(event: any, courseId: number) {
    const checked = event.target.checked;
    const current = this.instructorForm.value.selectedCourseIds || [];

    const updated = checked
      ? [...current, courseId]
      : current.filter((id: number) => id !== courseId);

    this.instructorForm.patchValue({
      selectedCourseIds: updated,
      specialization: this.getSpecializationText(updated)
    });
  }

  getSpecializationText(courseIds: number[]): string {
    return this.courseList
      .filter(c => courseIds.includes(c.courseId))
      .map(c => c.courseName)
      .join(', ');
  }

  getUniqueCourses(): Course[] {
    return this.courseList.filter((course, index, self) =>
      index === self.findIndex(c => c.courseId === course.courseId)
    );
  }
}

