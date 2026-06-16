export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
