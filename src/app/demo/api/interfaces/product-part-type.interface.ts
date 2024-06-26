export interface IProductPartType {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  prefix: string | null;
  name: string;
  description?: string | null;
}
