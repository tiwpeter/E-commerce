import { subcategories, categories } from "@/app/data/mockData";
import Link from "next/link";
import { useCategoryViewModel } from "../viewmodels/categoryViewModel";
import "./cate.css";

interface Props {
  slug: string;
}

export default function CategoryPageClient({ slug }: Props) {
  const {
    selectedSub,
    setSelectedSub,
    selectedBrand,
    setSelectedBrand,
    products,
    loading,
  } = useCategoryViewModel();

  const filteredSubs = subcategories.filter((s) => s.parentSlug === slug);

  return (
    <div className="bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="text-sm text-gray-600">
          Home &gt; {slug} &gt; {selectedSub || "All Products"}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex px-4">
        {/* Sidebar */}
        <aside className="w-56 pr-6 border-r">
          <h3 className="font-semibold text-lg mb-2">Subcategories</h3>
          <ul className="text-sm mb-6 space-y-2">
            {filteredSubs.map((sub) => (
              <li
                key={sub.id}
                className={`cursor-pointer px-2 py-1 rounded ${
                  selectedSub === sub.slug ? "bg-orange-100 font-medium" : ""
                }`}
                onClick={() => setSelectedSub(sub.slug)}
              >
                {sub.name}
              </li>
            ))}
          </ul>

          {/*** mark */}
          {/* Brand filters */}
          <h3 className="font-semibold text-lg mb-2">Brand</h3>
          <ul className="text-sm space-y-2 mb-6">
            <li>
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedBrand === "xiaomi"}
                onChange={() =>
                  setSelectedBrand(selectedBrand === "xiaomi" ? "" : "xiaomi")
                }
              />
              Xiaomi
            </li>
            <li>
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedBrand === "samsung"}
                onChange={() =>
                  setSelectedBrand(selectedBrand === "samsung" ? "" : "samsung")
                }
              />
              Samsung
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 pl-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {categories.find((c) => c.slug === slug)?.name}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {loading && <div>Loading...</div>}
            {!loading && products.length === 0 && (
              <div className="col-span-4 text-gray-500">
                กรุณาเลือกหมวดหมู่ย่อยเพื่อดูสินค้า
              </div>
            )}

            {products.map((product) => (
              <Link
                key={product.id}
                href={`/features/products/${product.id}`}
                className="border p-3 rounded-lg hover:shadow flex flex-col cursor-pointer"
              >
                <div className="jBwCF picture-wrapper">
                  <img
                    src={product.galleryImages}
                    alt={product.title}
                    width="200"
                    height="200"
                    loading="lazy"
                  />
                </div>
                <div className="catetitle">{product.title}</div>
                <div className="text-red-600 font-bold mt-1">
                  ฿{product.salePrice}
                </div>
                <div className="text-sm text-gray-500">{product.brand}</div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
