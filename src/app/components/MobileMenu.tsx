import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { School, Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileMenu({
  navItems,
  cta,
}: {
  navItems: { label: string; href: string; onClick?: () => void }[];
  cta: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // lock scroll saat menu terbuka + tutup dengan ESC
  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // klik di luar panel untuk menutup
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleItemClick = (item: { label: string; href: string; onClick?: () => void }) => {
    if (item.onClick) {
      item.onClick();
    }
    setOpen(false);
  };

  return (
    <>
      {/* Toggle visible only on mobile */}
      <button
        type="button"
        className="inline-flex items-center rounded-xl p-2 text-slate-700 hover:bg-emerald-50 md:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((s) => !s)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm md:hidden" />
      )}

      {/* Panel */}
      <motion.div
        id="mobile-menu-panel"
        ref={panelRef}
        initial={{ y: -16, opacity: 0 }}
        animate={open ? { y: 0, opacity: 1 } : { y: -16, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed left-0 right-0 top-0 z-[70] origin-top rounded-b-2xl border-b border-emerald-100 bg-white/95 p-4 shadow-lg md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header kecil di panel (brand + close) */}
        <div className="mb-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <School className="h-6 w-6 text-emerald-600" />
            <span>MTS Al-Falah</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center rounded-xl p-2 hover:bg-emerald-50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="grid gap-2" aria-label="Mobile">
          {navItems.map((item) => (
            item.onClick ? (
              <button
                key={item.href}
                onClick={() => handleItemClick(item)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 text-left"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* CTA */}
        <div className="mt-4">{cta}</div>
      </motion.div>
    </>
  );
}
