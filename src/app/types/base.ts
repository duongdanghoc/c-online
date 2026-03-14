export interface PaginationQueryDto {
  page?: number;
  limit?: number;
}

export interface PaginationResponseDto {
  total: number;
  page: number;
  limit: number;
}
