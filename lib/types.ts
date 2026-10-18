export type Boutique = {
  slug: string;
  name: string;
  area: string;
  tagline: string;
  story: string;
  commissionPct: number;
  palette: [string, string];
};

export type Collection = {
  slug: string;
  name: string;
  description: string;
  palette: [string, string];
};

export type Product = {
  id: string;
  name: string;
  boutique: string; // Boutique slug
  collections: string[]; // Collection slugs
  category: "women" | "men" | "kids";
  price: number; // INR
  mrp: number; // INR
  sizes: string[];
  description: string;
  fabric: string;
  customisable: boolean;
  returnable: boolean;
  palette: [string, string];
};

export type CartItem = {
  productId: string;
  size: string;
  qty: number;
};

export type PaymentMethod = "cod" | "online";

export type OrderStatus = "placed" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled" | "return_requested" | "returned";

export type OrderLine = {
  productId: string;
  name: string;
  boutique: string;
  size: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; pincode: string };
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: PaymentMethod;
  paymentStatus: "cod_pending" | "awaiting_payment" | "paid";
  status: OrderStatus;
  deliveryPromise: string;
};

export type CustomRequest = {
  id: string;
  createdAt: string;
  productId: string;
  productName: string;
  boutique: string;
  name: string;
  phone: string;
  measurements: string;
  notes: string;
  status: "new" | "quoted" | "paid" | "in_progress" | "delivered" | "declined";
};
