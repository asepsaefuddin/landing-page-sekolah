// PPDBFormPage
"use client";

import { useState } from "react";

export default function PPDBFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const res = await fetch("/api/ppdb", {
      method: "POST",
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (res.ok && data.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      setErr(data.error || "Gagal mengirim formulir");
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-emerald-50 p-6 text-center shadow">
        <h2 className="text-2xl font-bold text-emerald-700">Terima Kasih!</h2>
        <p className="mt-2 text-slate-700">
          Formulir berhasil dikirim. Panitia akan menghubungi Anda melalui email/WA.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {err && <p className="rounded-xl bg-red-50 p-3 text-red-700">{err}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
          <input name="nama_siswa" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">NISN</label>
          <input name="nisn" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tanggal Lahir</label>
          <input type="date" name="tgl_lahir" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Asal Sekolah</label>
          <input name="asal_sekolah" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nama Orang Tua/Wali</label>
          <input name="nama_ortu" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">No. HP/WA</label>
          <input name="no_hp" type="tel" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Alamat</label>
          <textarea name="alamat" rows={3} required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Jalur Pendaftaran</label>
        <select name="jalur" required className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
          <option value="">-- Pilih Jalur --</option>
          <option value="reguler">Reguler</option>
          <option value="prestasi">Prestasi</option>
          <option value="tahfizh">Tahfizh</option>
          <option value="afirmasi">Afirmasi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Upload Berkas (PDF/JPG/PNG, max 2MB)</label>
        <input name="berkas" type="file" accept=".pdf,.jpg,.jpeg,.png" className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim Formulir"}
      </button>
    </form>
  );
}
