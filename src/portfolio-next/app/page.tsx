import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
    </main>
  );
}
