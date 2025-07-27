const { ReceecoClient } = require("../dist/index.js");

async function main() {
  // Initialize the client
  const client = new ReceecoClient({
    apiKey: "test-key", // Use test key for demo
    baseUrl: "https://receeco.com/api/trpc" // Optional - this is the default
  });

  try {
    console.log("🧾 Creating a test receipt...");
    
    // Create a receipt
    const receipt = await client.createReceipt({
      merchant_string_id: "test-coffee-shop-demo",
      merchant_name: "Demo Coffee Shop",
      merchant_logo: "https://example.com/logo.png",
      accent_color: "#8B4513",
      customer_email: "customer@example.com",
      items: [
        {
          name: "Cappuccino",
          quantity: 2,
          unit_price: 500,
          total_price: 1000,
        },
        {
          name: "Croissant",
          quantity: 1,
          unit_price: 300,
          total_price: 300,
        }
      ],
      total_amount: 1300,
      currency: "NGN",
      payment_method: "card",
      category: "Restaurant",
      location: "Lagos, Nigeria"
    });

    console.log("✅ Receipt created successfully!");
    console.log(`📄 Receipt ID: ${receipt.id}`);
    console.log(`🔗 Receipt Token: ${receipt.token}`);
    console.log(`🌐 Receipt URL: https://receeco.com/receipt/${receipt.token}`);

    // Fetch the receipt back
    console.log("\n📥 Fetching receipt...");
    const fetchedReceipt = await client.getReceipt(receipt.token);
    console.log(`✅ Fetched receipt for: ${fetchedReceipt.merchant_name}`);
    console.log(`💰 Total Amount: ₦${fetchedReceipt.total_amount}`);
    console.log(`📧 Customer Email: ${fetchedReceipt.customer_email || 'Not provided'}`);

    // Update contact info
    console.log("\n📞 Updating customer contact...");
    const updateResult = await client.updateReceiptContact({
      token: receipt.token,
      phone: "+2348123456789"
    });
    console.log(`✅ Contact updated: ${updateResult.success}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code) {
      console.error("🔍 Error Code:", error.code);
    }
  }
}

main(); 