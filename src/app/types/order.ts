export enum PaymentMethod {
  COD = "COD",
  VNPAY = "VNPAY",
}

export enum OrderStatus {
  PROCESSING = 1, // Chờ xử lý
  ACCEPTED = 2, // Đã xác nhận
  ACCEPTED_ALT = 3, // Đã xác nhận
  PREPARING = 4, // Đang chuẩn bị hàng
  PREPARING_ALT = 5, // Đang chuẩn bị hàng
  SHIPPING = 7, // Đang giao
  DELIVERED = 8, // Đã giao hàng
  CANCELLED = 9, // Đơn hủy
  RETURNED = 10, // Trả hàng
  CANCEL_REQUESTED = 11, // Yêu cầu hủy
}

export interface ProductInfo {
  productId: number;
  displayName: string;
  slug: string;
  image?: string;
}

export interface OrderItem {
  orderItemId: number;
  orderId: string;
  productName: string;
  productId: number;
  unitId: number;
  originalPrice: number;
  orderPrice: number;
  quantity: number;
  unitName: string;
  productInfo: ProductInfo;
  type?: string;
  flashSaleId?: string;
}

export interface OrderProcessingHistory {
  id: number;
  orderId: string;
  time: string;
  title: string;
  content?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhoneNumber: string;
  recipientName: string;
  recipientPhoneNumber: string;
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  note?: string;
  eInvoiceRequested: boolean;
  paymentMethod: PaymentMethod;
  totalProductAmount: number;
  directDiscount: number;
  voucherDiscount: number;
  orderDiscount: number;
  shippingDiscount: number;
  itemDiscount: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  status: OrderStatus;
  items?: OrderItem[];
  processingHistory?: OrderProcessingHistory[];
  redemptions: Redemption[];
  paymentInfo?: OrderPaymentWithVnpay;
  hash: string;
}

export interface Redemption {
  scope: string;
  amountDiscount: number;
  promoName: string;
}

export interface OrderPaymentWithVnpay {
  expireDate: string;
  amount: number;
  url: string;
  status: VnpayPaymentStatus;
}

export enum VnpayPaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
