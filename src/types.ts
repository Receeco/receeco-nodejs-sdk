export interface Item {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateReceiptInput {
  merchant_string_id: string;
  merchant_name?: string;
  merchant_logo?: string;
  accent_color?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  items: Item[];
  total_amount: number;
  currency?: string;
  payment_method?: string;
  category: string;
  location?: string;
  transaction_date?: string; // ISO8601 - will be generated if not provided
}

export interface UpdateContactInput {
  token: string; // token or short code
  email?: string;
  phone?: string;
}

export interface Receipt {
  id: number;
  token: string;
  short_code: string;
  merchant_id: number;
  customer_email?: string | null;
  customer_phone?: string | null;
  total_amount: number;
  currency: string;
  transaction_date: string;
  items: Item[];
  category: string;
  payment_method?: string;
  location?: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Merchant info (when fetched)
  merchant_name?: string;
  merchant_logo?: string;
  accent_color?: string;
}

export interface CreateReceiptResponse {
  id: number;
  token: string;
}

export interface ReceecoClientOptions {
  apiKey: string;
  baseUrl?: string;
}
