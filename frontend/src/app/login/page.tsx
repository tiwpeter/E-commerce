import { Navbar } from "@/components/Navbar";
import { AuthForms } from "@/components/AuthForms";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-8">
        <AuthForms />
      </main>
    </>
  );
}
