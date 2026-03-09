export const mockOrders = [
  {
    order_id: 1,
    user_email: "john.doe@example.com",
    total_price: 120.0,
    shipping_address: "123 Main St, Bangkok, Thailand, 10110",
    phone: "0812345678",
    payment_method: "4111111111111111",
    created_at: "2025-11-24T07:00:00Z",
    items: [
      {
        order_item_id: 101,
        product_id: 1,
        product_name: "Product A",
        product_price: 50,
        product_quantity: 1,
      },
      {
        order_item_id: 102,
        product_id: 2,
        product_name: "Product B",
        product_price: 70,
        product_quantity: 1,
      },
    ],
  },
  {
    order_id: 2,
    user_email: "jane.smith@example.com",
    total_price: 200.0,
    shipping_address: "456 Sukhumvit Rd, Bangkok, Thailand, 10220",
    phone: "0898765432",
    payment_method: "5500000000000004",
    created_at: "2025-11-23T15:30:00Z",
    items: [
      {
        order_item_id: 103,
        product_id: 3,
        product_name: "Product C",
        product_price: 200,
        product_quantity: 1,
      },
    ],
  },
];
