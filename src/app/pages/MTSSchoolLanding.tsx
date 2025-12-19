"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Trophy, PhoneCall, MapPin, Mail, ChevronRight, Sparkles, School, Star } from "lucide-react";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/Badge";
import { Menu, X } from "lucide-react";
import Navbar from "../components/Navbar";
// Tip: Ganti semua teks "MTS Al-Falah" dan konten placeholder lain dengan data sekolah Anda.
// TailwindCSS diharapkan sudah aktif pada proyek Anda.

export default function MTSSchoolLanding() {
  // Efek header blur saat scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = [
    { label: "Siswa Aktif", value: "850+" },
    { label: "Guru & Staff", value: "65" },
    { label: "Ekstrakurikuler", value: "20+" },
    { label: "Tahun Pengabdian", value: "30+" },
  ];

  const programs = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Kurikulum Terpadu",
      desc: "Sinkronisasi Kurikulum Nasional dengan penguatan Pendidikan Agama Islam.",
      tags: ["Project-based", "Character building"],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Bimbingan Tahfizh",
      desc: "Program tahfizh bertahap dengan target hafalan realistis per semester.",
      tags: ["Tahsin", "Setoran rutin"],
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Persiapan Lanjutan",
      desc: "Pendampingan tryout dan portofolio untuk melanjutkan ke MA/SMA unggulan.",
      tags: ["Tryout CBT", "Coaching"],
    },
  ];

  const facilities = [
    { title: "Laboratorium Komputer", desc: "Perangkat modern untuk coding, desain, dan asesmen berbasis CBT." },
    { title: "Perpustakaan Digital", desc: "Akses ratusan e-book & jurnal; terintegrasi kartu pelajar." },
    { title: "Masjid & Ruang Tahfizh", desc: "Kegiatan ibadah & halaqah tahfizh yang kondusif." },
    { title: "Lapangan Serbaguna", desc: "Futsal, basket, panahan, dan kegiatan upacara." },
  ];

  const achievements = [
    { year: "2025", text: "Juara 1 Olimpiade Sains MTs Tingkat Kota" },
    { year: "2024", text: "Akreditasi A (Unggul) – BAN S/M" },
    { year: "2023", text: "Juara Umum Porseni MTs se-Kabupaten" },
  ];

  const testimonials = [
    {
      name: "Orang Tua Siswa",
      role: "Wali Kelas 8",
      quote:
        "Anak saya jadi lebih percaya diri, pembelajaran menyenangkan dan penguatan akhlak terasa nyata.",
    },
    {
      name: "Alumni 2022",
      role: "Siswa MA Favorit",
      quote:
        "Berkat pembinaan guru, saya diterima di MA favorit dan aktif di klub sains.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
      {/* Background pattern islami */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="#10b98122" />
              <circle cx="20" cy="20" r="3" fill="#10b98122" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute -top-28 right-0 -z-10 h-80 w-80 rounded-full bg-emerald-200 blur-3xl" />
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 md:flex-row md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full md:w-1/2"
          >
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">
  <Sparkles className="mr-1 h-3.5 w-3.5" /> Madrasah Unggul, Berkarakter
</Badge>

            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Membangun Ilmu & Akhlak
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Generasi Cerdas Beradab
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Lingkungan belajar modern dengan sentuhan islami: kurikulum terpadu, tahfizh, dan literasi digital.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700"><a href="/ppdb" className="flex items-center w-full h-full">
            Daftar Sekarang
            <ChevronRight className="ml-1 h-4 w-4" />
          </a></Button>
              <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                Jelajahi Sekolah
              </Button>
            </div>
            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <Card key={s.label} className="border-emerald-100 bg-white/70">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{s.value}</p>
                    <p className="text-xs text-slate-600">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mt-10 w-full md:mt-0 md:w-1/2"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-emerald-100">
              {/* Ganti URL gambar berikut dengan foto sekolah */}
              <img
                src="https://image.pollinations.ai/prompt/graduation%20school%20madrasah%20aliyah?width=1920&height=1080&seed=3532&nologo=true&model=flux-pro"
                alt="Gedung sekolah"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-xl bg-white/80 px-4 py-2 text-sm text-slate-700 backdrop-blur">
                <Star className="mr-2 inline h-4 w-4 text-amber-500" /> Akreditasi A (Unggul)
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section id="program" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Program Unggulan</h2>
          <p className="mt-2 text-slate-600">Pembelajaran bermakna yang menyiapkan siswa untuk masa depan.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card className="group border-emerald-100 bg-white/70 transition hover:-translate-y-1 hover:shadow-xl">
                <CardHeader>
                  <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    {p.icon}
                  </div>
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-slate-600">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="outline" className="border-emerald-200 text-emerald-700">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fasilitas */}
      <section id="fasilitas" className="bg-gradient-to-b from-white to-emerald-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Fasilitas</h2>
            <p className="mt-2 text-slate-600">Ruang belajar nyaman, aman, dan penuh inspirasi.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="h-full border-emerald-100 bg-white/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prestasi */}
      <section id="prestasi" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Prestasi</h2>
          <p className="mt-2 text-slate-600">Capaian membanggakan hasil kolaborasi guru, siswa, dan orang tua.</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <ol className="relative border-s-2 border-emerald-200">
            {achievements.map((a, i) => (
              <li key={a.year} className="ms-6 py-4">
                <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white ring-4 ring-emerald-100">
                  <Trophy className="h-3.5 w-3.5" />
                </span>
                <h3 className="font-semibold text-emerald-700">{a.year}</h3>
                <p className="text-slate-600">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimoni */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Apa Kata Mereka</h2>
            <p className="mt-2 text-slate-600">Suara orang tua dan alumni tentang MTS Al‑Falah.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <Card className="h-full border-emerald-100 bg-emerald-50/40">
                  <CardContent className="p-6">
                    <p className="text-lg italic text-slate-700">“{t.quote}”</p>
                    <p className="mt-4 text-sm font-medium text-emerald-800">{t.name}</p>
                    <p className="text-xs text-emerald-700/80">{t.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PPDB CTA */}
      <section id="ppdb" className="relative overflow-hidden">
        <div className="absolute -inset-x-10 -bottom-24 h-48 rotate-2 bg-emerald-200/50 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Penerimaan Peserta Didik Baru</h2>
              <p className="mt-2 text-slate-600">
                Pendaftaran gelombang 1 telah dibuka. Kuota terbatas. Dapatkan jalur prestasi dan keringanan biaya.
              </p>
              <ul className="mt-4 list-inside list-disc text-slate-700">
                <li>Daftar online & verifikasi berkas</li>
                <li>Asesmen potensi & wawancara</li>
                <li>Pengumuman & daftar ulang</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700"><a href="/ppdb" className="flex items-center w-full h-full">
            Daftar PPDB
          </a></Button>
                <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  Unduh Brosur
                </Button>
              </div>
            </div>
            <Card className="border-emerald-100 bg-white/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-emerald-600"/> Jalur Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="font-medium">Reguler</p>
                  <p className="text-sm text-slate-600">Tes akademik & wawancara.</p>
                </div>
                <div>
                  <p className="font-medium">Prestasi</p>
                  <p className="text-sm text-slate-600">Bebas tes akademik (syarat berlaku).</p>
                </div>
                <div>
                  <p className="font-medium">Tahfizh</p>
                  <p className="text-sm text-slate-600">Seleksi tahsin & setoran hafalan.</p>
                </div>
                <div>
                  <p className="font-medium">Afirmasi</p>
                  <p className="text-sm text-slate-600">KIP/PIP sesuai ketentuan.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Hubungi Kami</h2>
              <p className="mt-2 text-slate-600">Tanya seputar pendaftaran, kunjungan, atau kolaborasi.</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <PhoneCall className="mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">(0274) 123456</p>
                    <p className="text-sm text-slate-600">Senin–Jumat, 08.00–15.00 WIB</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">info@mts-alfalah.sch.id</p>
                    <p className="text-sm text-slate-600">Respon maksimal 1x24 jam</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Jl. Merpati No. 123, Kota Cirebon</p>
                    <p className="text-sm text-slate-600">POS 55281</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white/60 shadow">
                {/* Ganti dengan embed peta Google Maps */}
                {/* <div className="flex h-full items-center justify-center text-slate-500">
                  <MapPin className="mr-2 h-5 w-5" /> Peta Sekolah (Embed Google Maps)
                </div> */}
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white/60 shadow">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63331.95190901917!2d108.51717375991965!3d-6.737246237212496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ee25f00000001%3A0x401576d14fed5e0!2sCirebon%2C%20Cirebon%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1736416010000!5m2!1sen!2sid"
    width="600"
    height="450"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="h-full w-full"
  />
</div>

              </div>
              {/* <p className="mt-3 text-xs text-slate-500">*Silakan ganti nomor, email, alamat, dan peta sesuai data resmi sekolah.</p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>
              © {new Date().getFullYear()} MTS Al‑Falah. Seluruh hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-emerald-700">Kebijakan Privasi</a>
              <a href="#" className="hover:text-emerald-700">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
