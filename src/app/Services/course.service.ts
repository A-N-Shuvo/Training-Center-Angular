import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Course } from '../Models/course';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = environment.apiBaseUrl;

  constructor() { }

  http = inject(HttpClient);

  getAllCourses() {
    return this.http.get<Course[]>(this.apiUrl + "/Course/GetCourses");
  }

  //getActiveCourses() {
  //  return this.http.get<Course[]>(this.apiUrl + "/Course/GetActiveCourses");
  //}
  getActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("http://localhost:5281/api/Course/active");
  }

  getCourseById(id: number) {
    return this.http.get<Course>(this.apiUrl + "/Course/GetCourse/" + id);
  }

  addCourse(course: Course) {
    return this.http.post(this.apiUrl + "/Course/InsertCourse", course);
  }

  updateCourse(course: Course) {
    return this.http.put(this.apiUrl + "/Course/UpdateCourse/" + course.courseId, course);
  }

  deleteCourse(id: number) {
    return this.http.delete(this.apiUrl + "/Course/DeleteCourse/" + id);
  }

  toggleCourseStatus(id: number, isActive: boolean) {
    return this.http.patch(this.apiUrl + "/Course/ToggleCourseStatus/" + id, { isActive });
  }


}
