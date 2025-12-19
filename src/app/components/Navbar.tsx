"use client";
import { useEffect, useState } from "react";
import { School, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Program", href: "/#program" },
    { label: "Fasilitas", href: "/#fasilitas" },
    { label: "Prestasi", href: "/#prestasi" },
    { label: "Berita", href: "/news" },
    { label: "PPDB", href: "/ppdb" },
    { label: "Kontak", href: "/#kontak" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      // Handle anchor links
      if (pathname !== "/") {
        // If not on home page, navigate to home first
        window.location.href = href;
      } else {
        // If on home page, scroll to section
        const targetId = href.substring(2);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition backdrop-blur ${
        scrolled ? "bg-white/90 shadow-sm" : "bg-white/70"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
          <School className="h-6 w-6 text-emerald-600" />
          <span className="text-gray-800">MTS Al-Falah</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden gap-6 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            item.href.startsWith("/#") ? (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                  isActive(item.href) ? "text-emerald-700" : "text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                  isActive(item.href) ? "text-emerald-700" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button className="group bg-emerald-600 hover:bg-emerald-700">
            <Link href="/ppdb" className="flex items-center">
              PPDB 2025
              <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <MobileMenu
          navItems={navItems.map(item => ({
            ...item,
            onClick: item.href.startsWith("/#") ? () => handleNavClick(item.href) : undefined
          }))}
          cta={
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/ppdb" className="flex items-center w-full h-full justify-center">
                PPDB 2025
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      </div>
    </header>
  );
}