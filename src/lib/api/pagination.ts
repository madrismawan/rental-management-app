export interface NormalizedPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export function normalizePaginationMeta(
  meta: PaginationMeta,
): NormalizedPaginationMeta {
  const page = Math.max(meta.page, 1);
  const limit = Math.max(meta.limit, 1);
  const total = Math.max(meta.total, 0);
  const totalPages = Math.max(meta.totalPages || Math.ceil(total / limit), 1);

  return {
    page,
    limit,
    total,
    totalPages,
  };
}
