# ReCeeco Node.js SDK

Official Node.js client for the [ReCeeco](https://receeco.com) digital-receipt API.

## Installation

```bash
npm install @receeco/node-sdk
# or
pnpm add @receeco/node-sdk
```

## Quick Start

```ts
import { ReceecoClient } from "@receeco/node-sdk";

const client = new ReceecoClient({
  apiKey: process.env.RECEECO_API_KEY!, // "pos_live_abc123…" or "test-key" for testing
});

const receipt = await client.createReceipt({
  merchant_string_id: "test-grocery-store-001",
  merchant_name: "Green Grocery Store",
  items: [
    {
      name: "Rice (5 kg)",
      quantity: 1,
      unit_price: 8500,
      total_price: 8500,
    },
  ],
  total_amount: 8500,
  currency: "NGN",
  payment_method: "card",
  category: "Grocery",
});

console.log(receipt.token); // → Generated receipt token
console.log(`Receipt URL: https://receeco.com/receipt/${receipt.token}`);
```

## API Reference

### `createReceipt(data: CreateReceiptInput)`

Creates a digital receipt from transaction data.

**Required fields:**
- `merchant_string_id` - Your merchant identifier
- `items` - Array of items with `name`, `quantity`, `unit_price`, `total_price`
- `total_amount` - Total transaction amount
- `category` - Receipt category (e.g., "Grocery", "Restaurant", "Retail")

**Optional fields:**
- `merchant_name` - Business name for display
- `merchant_logo` - URL to business logo
- `accent_color` - Brand color (hex format)
- `customer_email` - Customer email for notifications
- `customer_phone` - Customer phone for SMS notifications
- `currency` - Currency code (defaults to "NGN")
- `payment_method` - Payment method used
- `location` - Store location
- `transaction_date` - ISO date string (auto-generated if not provided)

**Returns:** `Promise<{ id: number, token: string }>`

### `getReceipt(tokenOrCode: string)`

Fetch an existing receipt using token or 6-digit short code.

**Returns:** `Promise<Receipt>` with full receipt data including merchant info.

### `updateReceiptContact(data: UpdateContactInput)`

Add or update customer contact information on a receipt.

**Required fields:**
- `token` - Receipt token or short code

**Optional fields:**
- `email` - Customer email
- `phone` - Customer phone

**Returns:** `Promise<{ success: boolean }>`

## Error Handling

```ts
import { SDKError } from "@receeco/node-sdk";

try {
  await client.getReceipt("INVALID");
} catch (err) {
  if (err instanceof SDKError) {
    console.error(`Error ${err.code}: ${err.message}`);
  }
}
```

## TypeScript

This package ships with full TypeScript definitions.

## Testing

For testing, use merchant IDs starting with "test-" (e.g., "test-my-store"). Test merchants are automatically created.

```ts
const client = new ReceecoClient({
  apiKey: "test-key", // Use any API key for testing
});

const receipt = await client.createReceipt({
  merchant_string_id: "test-coffee-shop",
  merchant_name: "Test Coffee Shop",
  // ... other fields
});
```

## License

MIT © ReCeeco
