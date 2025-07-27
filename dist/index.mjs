// src/client.ts
import axios from "axios";

// src/errors.ts
var SDKError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ReceecoSDKError";
  }
};

// src/utils.ts
function generateReceiptToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
function generateShortCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// src/client.ts
var ReceecoClient = class {
  constructor(options) {
    if (!(options == null ? void 0 : options.apiKey)) {
      throw new SDKError("API_KEY_REQUIRED", "apiKey is required");
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://receeco.com/api/trpc";
    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      }
    });
    this.http.interceptors.response.use(
      (res) => {
        var _a;
        const data = res.data;
        if ((_a = data == null ? void 0 : data.result) == null ? void 0 : _a.data)
          return data.result.data;
        if (data == null ? void 0 : data.result)
          return data.result;
        return data;
      },
      (err) => {
        var _a, _b, _c, _d, _e;
        const data = (_a = err.response) == null ? void 0 : _a.data;
        const code = ((_c = (_b = data == null ? void 0 : data.error) == null ? void 0 : _b.data) == null ? void 0 : _c.code) || ((_d = data == null ? void 0 : data.error) == null ? void 0 : _d.code) || "UNKNOWN";
        const message = ((_e = data == null ? void 0 : data.error) == null ? void 0 : _e.message) || err.message;
        return Promise.reject(new SDKError(code, message));
      }
    );
  }
  /**
   * Create a digital receipt from transaction data.
   */
  async createReceipt(input) {
    const token = generateReceiptToken();
    const shortCode = generateShortCode();
    const transactionDate = input.transaction_date || (/* @__PURE__ */ new Date()).toISOString();
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
      status: "completed"
    };
    return await this.post("createReceiptFromPOS", payload);
  }
  /**
   * Get a receipt by its token or short code.
   */
  async getReceipt(tokenOrCode) {
    return await this.get("getReceipt", { token: tokenOrCode });
  }
  /**
   * Update contact details (email / phone) attached to a receipt.
   */
  async updateReceiptContact(input) {
    return await this.post("updateReceiptContact", input);
  }
  /* ---------------------- internal helpers ---------------------- */
  async get(endpoint, params) {
    const config = {
      params: { input: JSON.stringify(params) }
    };
    const res = await this.http.get(`/${endpoint}`, config);
    return res.data;
  }
  async post(endpoint, body) {
    const res = await this.http.post(`/${endpoint}`, body);
    return res.data;
  }
};
export {
  ReceecoClient,
  SDKError,
  generateReceiptToken,
  generateShortCode
};
