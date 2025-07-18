import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Batch } from '../Models/batch';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiUrl = environment.apiBaseUrl;

  constructor() { }

  http = inject(HttpClient);

  // Get all batches
  getAllBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.apiUrl}/Batch/GetBatches`);
  }

  // Get active batches only
  getActiveBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.apiUrl}/Batch/GetActiveBatches`);
  }

  // Get single batch by ID
  getBatchById(id: number): Observable<Batch> {
    return this.http.get<Batch>(`${this.apiUrl}/Batch/GetBatch/${id}`);
  }

  // Create new batch
  addBatch(batch: Batch): Observable<any> {
    return this.http.post(`${this.apiUrl}/Batch/InsertBatch`, batch);
  }

  // Update existing batch
  updateBatch(batch: Batch): Observable<any> {
    return this.http.put(`${this.apiUrl}/Batch/UpdateBatch/${batch.batchId}`, batch);
  }

  // Delete batch
  deleteBatch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Batch/DeleteBatch/${id}`);
  }

  // Toggle batch active status
  toggleBatchStatus(id: number, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Batch/ToggleBatchStatus/${id}`, { isActive });
  }

  // Get batches by course ID
  getBatchesByCourseId(courseId: number): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.apiUrl}/Batch/GetBatchesByCourse/${courseId}`);
  }

  // Get upcoming batches (optional)
  getUpcomingBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.apiUrl}/Batch/GetUpcomingBatches`);
  }


}
