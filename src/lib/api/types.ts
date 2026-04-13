export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiErrorShape;
  meta?: Meta;
}

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Meta<P = Pagination | undefined> {
  timestamp?: string;
  requestId?: string;
  pagination?: P;
}

export type Options = {
  label: string;
  value: string;
};

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: {
    code: string;
    message: string;
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  meta?: any;
}
