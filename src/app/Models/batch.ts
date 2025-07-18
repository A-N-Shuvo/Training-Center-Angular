export interface Batch {
  batchId: number;
  batchName: string;
  courseId: number;
  course?: Course; // Make optional to match C# nullable
  startDate: Date | string; // Can handle both Date object and ISO string
  endDate?: Date | string; // Optional to match nullable
  batchType: string; // 'Regular' | 'Weekend' | 'Online' - you could use enum later
  classDays?: string; // "Saturday,Monday,Wednesday"
  selectedDayIds: number[]; // [1, 2, 3] for day IDs
  timeSlot?: string; // "9:00 AM - 01:00 PM" or Slot ID before transformation
  instructorId: number;
  instructor?: Instructor; // Optional
  isActive: boolean;
  classRoomId: number;
  classRoom?: ClassRoom; // Optional
  remarks?: string;
}

// Supporting interfaces (you'll need to define these based on your other models)
export interface Course {
  courseId: number;
  courseName: string; // Add this
  // ... other course properties
}

//export interface Instructor {
//  instructorId: number;
//  // ... other instructor properties
//}

export interface Instructor {
  instructorId: number;
  employeeId: number;
  employee?: Employee; // Add this relation
  // ... other instructor properties
}

export interface Employee {
  employeeId: number;
  employeeName: string;
  // ... other employee properties
}

export interface ClassRoom {
  classRoomId: number;
  roomName: string; // Add this or use correct property name
  // ... other classroom properties
}

export interface Slot {
  slotID: number; // or slotID if that's the correct name
  timeSlotType: string;
  startTime: string;
  endTime: string;
  // ... other slot properties
}
