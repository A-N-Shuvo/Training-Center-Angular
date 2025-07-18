import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Instructor } from '../Models/instructor';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = environment.apiBaseUrl;

  constructor() { }

  http = inject(HttpClient);

  getAllInstructors() {
    return this.http.get<Instructor[]>(this.apiUrl + "/Instructor/GetInstructors");
  }

  getInstructorById(id: number) {
    return this.http.get<Instructor>(this.apiUrl + "/Instructor/GetInstructor/" + id);
  }

  addInstructor(data: Instructor) {
    return this.http.post(this.apiUrl + "/Instructor/InsertInstructor", data);
  }

  updateInstructor(instructor: Instructor) {
    return this.http.put(this.apiUrl + "/Instructor/UpdateInstructor/" + instructor.instructorId, instructor);
  }

  deleteInstructor(id: number) {
    return this.http.delete(this.apiUrl + "/Instructor/DeleteInstructor/" + id);
  }

  // Additional method to get courses for dropdown
  getCourses() {
    return this.http.get<any[]>(this.apiUrl + "/Course/GetCourses");
  }


  // In your InstructorService
  getAllInstructorsWithEmployees(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.apiUrl}/Instructor/GetInstructorsWithEmployees`);
  }
}
