export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_email: string;
  items: CartItem[];
  total: number;
}

export interface OrderResponse {
  ok: boolean;
  error?: string;
}
