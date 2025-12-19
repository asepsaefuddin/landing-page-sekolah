"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  IdCard,
  Image as ImageIcon,
  Wallet,
  ChevronRight,
} from "lucide-react";

import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/Badge";

export default function PPDBSection() {
  return (
    <section id="ppdb" className="relative overflow-hidden">
      {/* dekorasi lembut */}
      <div className="pointer-events-none absolute -inset-x-10 -bottom-24 h-48 rotate-2 bg-emerald-200/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <CalendarDays className="h-3.5 w-3.5" />
            PPDB Tahun Ajaran 2025/2026
          </span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Penerimaan Peserta Didik Baru
          </h2>
          <p className="mt-2 text-slate-600">
            Gelombang 1 dibuka. Kuota terbatas, tersedia jalur prestasi & tahfizh.
          </p>
        </div>

        {/* Ringkasan cepat */}
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
          <Card className="border-emerald-100 bg-white/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Periode Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700">
              <p className="font-semibold">Gel. 1: 10 Okt – 30 Nov 2025</p>
              <p className="text-sm text-slate-600">Gel. 2 menyusul*</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Metode Seleksi</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700">
              <p className="font-semibold">Tes Akademik & Wawancara</p>
              <p className="text-sm text-slate-600">Khusus Tahfizh: tes tahsin</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Kontak Panitia</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700">
              <p className="font-semibold">0821-xxx-xxxx</p>
              <p className="text-sm text-slate-600">ppdb@mts-alfalah.sch.id</p>
            </CardContent>
          </Card>
        </div>

        {/* Jalur pendaftaran */}
        <div className="mx-auto mt-10 max-w-6xl">
          <h3 className="mb-4 text-xl font-semibold">Pilih Jalur Pendaftaran</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { title: "Reguler", text: "Tes akademik & wawancara." },
              { title: "Prestasi", text: "Bebas tes akademik (syarat nilai/piagam)." },
              { title: "Tahfizh", text: "Seleksi tahsin & setoran hafalan." },
              { title: "Afirmasi", text: "KIP/PIP sesuai ketentuan." },
            ].map((j) => (
              <motion.div
                key={j.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-emerald-100 bg-white/70 transition hover:-translate-y-1 hover:shadow-md">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base">{j.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">{j.text}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alur pendaftaran */}
        <div className="mx-auto mt-12 max-w-6xl">
          <h3 className="mb-4 text-xl font-semibold">Alur Pendaftaran</h3>
          <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", title: "Daftar Online", text: "Isi formulir & unggah berkas." },
              { step: "2", title: "Verifikasi", text: "Panitia memeriksa kelengkapan." },
              { step: "3", title: "Seleksi", text: "Tes/ wawancara sesuai jalur." },
              { step: "4", title: "Pengumuman", text: "Lolos? Lanjut daftar ulang." },
            ].map((s) => (
              <li key={s.step} className="group">
                <Card className="h-full border-emerald-100 bg-white/70 transition group-hover:-translate-y-1 group-hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {s.step}
                    </div>
                    <CardTitle className="mt-2 text-base">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">{s.text}</CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>

        {/* Syarat dokumen & biaya ringkas */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* Syarat Dokumen */}
          <Card className="border-emerald-100 bg-white/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" /> Syarat Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { icon: <IdCard className="h-4 w-4 text-emerald-600" />, text: "Fotokopi KK & Akta Kelahiran" },
                { icon: <ImageIcon className="h-4 w-4 text-emerald-600" />, text: "Pas foto 3x4 (2 lembar)" },
                { icon: <FileText className="h-4 w-4 text-emerald-600" />, text: "Rapor/Kartu Nilai (kelas 4–6)" },
                { icon: <Wallet className="h-4 w-4 text-emerald-600" />, text: "Bukti pembayaran formulir" },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <p className="text-slate-700">{r.text}</p>
                </div>
              ))}
              <p className="mt-3 text-xs text-slate-500">
                *Dokumen tambahan dapat diminta sesuai jalur pendaftaran.
              </p>
            </CardContent>
          </Card>

          {/* Jadwal Penting */}
          <Card className="border-emerald-100 bg-white/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" /> Jadwal Penting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p>Pendaftaran Gel. 1</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  10 Okt – 30 Nov 2025
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>Ujian/ Wawancara</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  Setiap Sabtu (periode)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>Pengumuman</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  05 Des 2025
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>Daftar Ulang</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  06–12 Des 2025
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Biaya Ringkas + CTA */}
          <Card className="border-emerald-100 bg-white/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Biaya Ringkas</span>
                <Badge className="bg-emerald-100 text-emerald-700">Transparan</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p>Formulir Pendaftaran</p>
                <p className="font-semibold text-slate-800">Rp 100.000</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Biaya Daftar Ulang*</p>
                <p className="font-semibold text-slate-800">Rp 1.500.000</p>
              </div>
              <p className="text-xs text-slate-500">
                *Rincian lengkap (seragam, buku, kegiatan) diberikan saat diterima.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <a href="/ppdb/form" className="flex items-center w-full h-full">
                    Daftar PPDB
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  Unduh Panduan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-12 max-w-5xl">
          <h3 className="mb-4 text-xl font-semibold">FAQ</h3>
          <div className="divide-y divide-emerald-100 rounded-2xl border border-emerald-100 bg-white/70">
            {[
              {
                q: "Apakah bisa mendaftar tanpa datang ke sekolah?",
                a: "Bisa. Seluruh proses pendaftaran (unggah berkas, jadwal seleksi) dapat dilakukan online. Wawancara dapat dilakukan daring sesuai jadwal.",
              },
              {
                q: "Adakah beasiswa atau keringanan biaya?",
                a: "Ada. Jalur prestasi dan afirmasi menyediakan keringanan sesuai ketentuan. Hubungi panitia untuk detail.",
              },
              {
                q: "Bagaimana jika berkas belum lengkap?",
                a: "Bisa mendaftar terlebih dahulu, kemudian melengkapi berkas sebelum batas yang ditentukan.",
              },
            ].map((item, i) => (
              <details key={i} className="group p-4 open:bg-emerald-50/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-slate-800">
                  {item.q}
                  <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
