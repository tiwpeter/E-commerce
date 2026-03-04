import { Navbar } from "@/components/Navbar";
import { OrderList } from "@/components/OrderList";

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <OrderList />
      </main>
    </>
  );
}
