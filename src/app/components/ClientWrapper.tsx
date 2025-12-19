"use client";
import { usePathname } from "next/navigation";
import MTSSchoolLanding from "../pages/MTSSchoolLanding";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Jika di halaman utama, tampilkan landing page
  if (pathname === "/") {
    return <MTSSchoolLanding />;
  }
  
  // Selain itu, tampilkan children (halaman lain)
  return <>{children}</>;
}