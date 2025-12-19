"use client";
// ...existing code...
import PPDBSection from "../pages/PPDBSection";

export default function PPDBPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-3xl font-bold text-emerald-700">Pendaftaran PPDB</h1>
        <p className="mt-2 text-slate-600">
          Silakan isi formulir PPDB sesuai data asli. Pastikan semua dokumen lengkap.
        </p>
        {/* Tempatkan komponen PPDB Section yang sudah kubuat */}
        <PPDBSection />
      </div>
    </main>
  );
}
