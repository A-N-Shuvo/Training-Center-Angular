export interface Classroom {
  classRoomId: number;
  roomName: string;
  seatCapacity: number;
  location: string;
  hasProjector: boolean;
  hasAirConditioning: boolean;
  hasWhiteboard: boolean;
  hasSoundSystem: boolean;
  hasInternetAccess: boolean;
  isActive: boolean;
  additionalFacilities?: string;
  remarks: string;
}
