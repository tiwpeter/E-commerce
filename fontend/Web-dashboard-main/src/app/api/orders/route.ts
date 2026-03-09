import { NextResponse } from "next/server";
import { mockOrders } from "./mockOrders";

// ใช้ mock data แทนการเชื่อม DB จริง
let orders = [...mockOrders]; // สร้าง copy เพื่อให้สามารถเพิ่มคำสั่งซื้อใหม่ได้

export async function GET(request: Request) {
  return NextResponse.json(orders, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { cardInfo, shippingInfo, cart, totalPrice } = requestBody;

    const fullAddress = `${shippingInfo.address}, ${shippingInfo.district}, ${shippingInfo.province}, ${shippingInfo.postalCode}`;

    // สร้าง order ใหม่
    const newOrderId = orders.length ? orders[orders.length - 1].order_id + 1 : 1;
    const newOrder = {
      order_id: newOrderId,
      user_email: shippingInfo.name,
      total_price: totalPrice,
      shipping_address: fullAddress,
      phone: shippingInfo.phone,
      payment_method: cardInfo.payment_method,
      created_at: new Date().toISOString(),
      items: cart.map((item: any, idx: number) => ({
        order_item_id: newOrderId * 100 + idx,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_quantity: item.quantity,
      })),
    };

    orders.push(newOrder);

    return NextResponse.json({ message: "Order placed successfully", order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
