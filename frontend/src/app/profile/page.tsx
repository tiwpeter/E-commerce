import { Navbar } from "@/components/Navbar";
import { AddressManager } from "@/components/AddressManager";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <AddressManager />
      </main>
    </>
  );
}
