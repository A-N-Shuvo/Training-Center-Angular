export interface Instructor {
  instructorId: number;
  employeeId: number;
  employeeName?: string;  
  employee?: Employee;  // Assuming you have an Employee interface
  specialization: string;
  selectedCourseIds: number[];
  isActive: boolean;
  courses?: Course[];   // Assuming you have a Course interface
  remarks?: string;
}

// If you don't have these interfaces, here are basic versions:
export interface Employee {
  employeeId: number;
  employeeName: string; 
  // other employee properties...
}

export interface Course {
  courseId: number;
  courseName: string;
  // other course properties...
}
