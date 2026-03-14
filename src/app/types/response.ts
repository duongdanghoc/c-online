import { BaseError } from "./base-error";

export interface Resp<T> {
  data?: T;
  error?: BaseError;
}
