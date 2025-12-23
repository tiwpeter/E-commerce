"use client";
import { usePathname } from "next/navigation";

export default function Navpage() {
  const pathname = usePathname();

  if (!pathname) return null; // Or show a loader

  const formattedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  const formattedMain =
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || "";

  return (
    <div>
      <span>{formattedPath}</span>
      <div className="text-3xl">{formattedMain}</div>
    </div>
  );
}
