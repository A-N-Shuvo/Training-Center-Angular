import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Classroom } from '../Models/classroom';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  private apiUrl = environment.apiBaseUrl;

  constructor() { }

  http = inject(HttpClient);

  // Get all classrooms
  getAllClassrooms() {
    return this.http.get<Classroom[]>(this.apiUrl + "/ClassRoom/GetClassRooms");
  }

  // Get single classroom by ID
  getClassroomById(id: number) {
    return this.http.get<Classroom>(this.apiUrl + "/ClassRoom/GetClassRoom/" + id);
  }

  // Add new classroom
  addClassroom(data: Classroom) {
    return this.http.post(this.apiUrl + "/ClassRoom/InsertClassRoom", data);
  }

  // Update existing classroom
  updateClassroom(classroom: Classroom) {
    return this.http.put(this.apiUrl + "/ClassRoom/UpdateClassRoom/" + classroom.classRoomId, classroom);
  }

  // Delete classroom
  deleteClassroom(id: number) {
    return this.http.delete(this.apiUrl + "/ClassRoom/DeleteClassRoom/" + id);
  }

  // Get active classrooms only
  getActiveClassrooms() {
    return this.http.get<Classroom[]>(this.apiUrl + "/ClassRoom/GetActiveClassRooms");
  }

  // Search classrooms by criteria (optional)
  searchClassrooms(criteria: any) {
    return this.http.post<Classroom[]>(this.apiUrl + "/ClassRoom/SearchClassRooms", criteria);
  }
}



