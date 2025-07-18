import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BatchTransfer, TraineeDisplay } from '../Models/batchtransfer';

@Injectable({
  providedIn: 'root'
})
export class BatchTransferService {
  private apiUrl = `${environment.apiBaseUrl}/BatchTransfer`;

  constructor(private http: HttpClient) { }

  getAllBatchTransfers(): Observable<BatchTransfer[]> {
    return this.http.get<BatchTransfer[]>(this.apiUrl);
  }

  getBatchTransferByTrainee(traineeId: number): Observable<BatchTransfer> {
    return this.http.get<BatchTransfer>(`${this.apiUrl}/${traineeId}`);
  }

  createBatchTransfer(batchTransfer: BatchTransfer): Observable<BatchTransfer> {
    return this.http.post<BatchTransfer>(this.apiUrl, batchTransfer);
  }

  updateBatchTransfer(traineeId: number, batchTransfer: BatchTransfer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${traineeId}`, batchTransfer);
  }

  deleteBatchTransfer(traineeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${traineeId}`);
  }
  getTraineeDisplayList(): Observable<TraineeDisplay[]> {
    return this.http.get<TraineeDisplay[]>('http://localhost:5281/api/Admission/trainee-display-list');
  }

}
