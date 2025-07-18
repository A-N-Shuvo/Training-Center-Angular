export interface BatchTransfer {
  traineeId: number;
  batchId: number;
  createdDate?: Date;
  transferDate?: Date | null;
  trainee?: any;
  batch?: any;
}

export interface TraineeDisplay {
  traineeId: number;
  displayText: string;
}
