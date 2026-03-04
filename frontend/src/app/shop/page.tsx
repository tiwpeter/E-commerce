import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-black tracking-tight text-zinc-900">สินค้าทั้งหมด</h1>
        <ProductGrid />
      </main>
    </>
  );
}
