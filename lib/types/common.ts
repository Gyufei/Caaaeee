export interface ApiResponse<T = unknown> {
  code: number;
  msg: {
    en: string;
    zh: string;
  };
  data: T;
}
