import Image from "next/image";
import OwnerFlow from "@/components/user-flow/owner-flow";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <OwnerFlow />
    </main>
  );
}
