import { Navbar } from "@/components/Navbar";
import { CartList } from "@/components/CartList";

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <CartList />
      </main>
    </>
  );
}
