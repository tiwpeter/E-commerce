export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface CategoryQuery extends PaginationQuery {
  search?: string;
}