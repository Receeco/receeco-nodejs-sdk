import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  CreateReceiptInput,
  Receipt,
  UpdateContactInput,
  ReceecoClientOptions,
  CreateReceiptResponse,
} from "./types";
import { SDKError } from "./errors";
import { generateReceiptToken, generateShortCode } from "./utils";

export class ReceecoClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly http: AxiosInstance;

  constructor(options: ReceecoClientOptions) {
    if (!options?.apiKey) {
      throw new SDKError("API_KEY_REQUIRED", "apiKey is required");
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://receeco.com/api/trpc";

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    // Response interceptor to handle tRPC responses and errors
    this.http.interceptors.response.use(
      (res) => {
        // Handle tRPC response format
        const data = res.data;
        if (data?.result?.data) return data.result.data;
        if (data?.result) return data.result;
        return data;
      },
      (err) => {
        const data = err.response?.data;
        const code = data?.error?.data?.code || data?.error?.code || "UNKNOWN";
        const message = data?.error?.message || err.message;
        return Promise.reject(new SDKError(code, message));
      }
    );
  }

  /**
   * Create a digital receipt from transaction data.
   */
  async createReceipt(input: CreateReceiptInput): Promise<CreateReceiptResponse> {
    // Generate required fields if not provided
    const token = generateReceiptToken();
    const shortCode = generateShortCode();
    const transactionDate = input.transaction_date || new Date().toISOString();
    
    // Prepare the payload matching the API schema
    const payload = {
      token,
      short_code: shortCode,
      merchant_string_id: input.merchant_string_id,
      merchant_name: input.merchant_name,
      merchant_logo: input.merchant_logo,
      accent_color: input.accent_color,
      customer_email: input.customer_email || null,
      customer_phone: input.customer_phone || null,
      total_amount: input.total_amount,
      currency: input.currency || "NGN",
      transaction_date: transactionDate,
      items: input.items,
      category: input.category,
      payment_method: input.payment_method,
      location: input.location,
      status: "completed",
    };

    return await this.post<CreateReceiptResponse>("createReceiptFromPOS", payload);
  }

  /**
   * Get a receipt by its token or short code.
   */
  async getReceipt(tokenOrCode: string): Promise<Receipt> {
    return await this.get<Receipt>("getReceipt", { token: tokenOrCode });
  }

  /**
   * Update contact details (email / phone) attached to a receipt.
   */
  async updateReceiptContact(input: UpdateContactInput): Promise<{ success: boolean }> {
    return await this.post<{ success: boolean }>("updateReceiptContact", input);
  }

  /* ---------------------- internal helpers ---------------------- */
  private async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = { 
      params: { input: JSON.stringify(params) } 
    };
    const res = await this.http.get<T>(`/${endpoint}`, config);
    return res.data as T;
  }

  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await this.http.post<T>(`/${endpoint}`, body);
    return res.data as T;
  }
}
