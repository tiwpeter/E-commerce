// src/features/category/components/Breadcrumb.tsx
// Server Component — no "use client" needed

interface Props {
  slug: string;
  categoryName: string;
  selectedSubName?: string;
}

export function Breadcrumb({ slug, categoryName, selectedSubName }: Props) {
  return (
    <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <li>
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
        </li>
        <li aria-hidden="true">&gt;</li>
        <li>
          <a
            href={`/category/${slug}`}
            className="hover:text-orange-500 transition-colors"
          >
            {categoryName}
          </a>
        </li>
        {selectedSubName && (
          <>
            <li aria-hidden="true">&gt;</li>
            <li className="text-gray-800 font-medium">{selectedSubName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
