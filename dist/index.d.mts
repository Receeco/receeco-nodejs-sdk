interface Item {
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}
interface CreateReceiptInput {
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
    transaction_date?: string;
}
interface UpdateContactInput {
    token: string;
    email?: string;
    phone?: string;
}
interface Receipt {
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
    merchant_name?: string;
    merchant_logo?: string;
    accent_color?: string;
}
interface CreateReceiptResponse {
    id: number;
    token: string;
}
interface ReceecoClientOptions {
    apiKey: string;
    baseUrl?: string;
}

declare class ReceecoClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly http;
    constructor(options: ReceecoClientOptions);
    /**
     * Create a digital receipt from transaction data.
     */
    createReceipt(input: CreateReceiptInput): Promise<CreateReceiptResponse>;
    /**
     * Get a receipt by its token or short code.
     */
    getReceipt(tokenOrCode: string): Promise<Receipt>;
    /**
     * Update contact details (email / phone) attached to a receipt.
     */
    updateReceiptContact(input: UpdateContactInput): Promise<{
        success: boolean;
    }>;
    private get;
    private post;
}

declare class SDKError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}

declare function generateReceiptToken(): string;
declare function generateShortCode(): string;

export { CreateReceiptInput, CreateReceiptResponse, Item, ReceecoClient, ReceecoClientOptions, Receipt, SDKError, UpdateContactInput, generateReceiptToken, generateShortCode };
