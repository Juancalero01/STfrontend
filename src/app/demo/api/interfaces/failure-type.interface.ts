export interface IFailureType {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description: string | null;
}
