export class BaseError {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.message = message;
    this.code = code;
  }

  get isUnauthorized() {
    return this.code == -1 || this.code == 401;
  }

  get isNotFound() {
    return this.code == 404;
  }
}

export const notFoundError = new BaseError(404, "Không tìm thấy trang");
export const unauthorizedError = new BaseError(401, "Hết hạn phiên đăng nhập");

export const getErrorFromException = (e: any): BaseError => {
  if (e instanceof BaseError) {
    return e;
  }

  return new BaseError(99, "Có lỗi xảy ra");
};
