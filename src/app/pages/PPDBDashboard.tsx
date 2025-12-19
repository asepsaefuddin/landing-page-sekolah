"use client";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { PpdbItem } from "../types/types";

export default function PPDBDashboard() {
  const [data, setData] = useState<PpdbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function fetchData() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/ppdb");
      const json = await res.json();
      if (json.ok) setData(json.data);
      else setErr(json.error || "Gagal load data");
    } catch {
      setErr("Gagal load data");
    }
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/ppdb/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (json.ok) {
      setData((d) => d.filter((item) => item._id !== id));
    } else {
      setErr(json.error || "Gagal hapus data");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Dashboard PPDB</h2>
      {err && <div className="mb-4 rounded bg-red-50 p-3 text-red-700">{err}</div>}
      {loading && <div className="mb-4">Loading...</div>}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-emerald-50">
            <th className="p-2">Nama</th>
            <th className="p-2">NISN</th>
            <th className="p-2">Jalur</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="p-2">{item.nama_siswa}</td>
              <td className="p-2">{item.nisn}</td>
              <td className="p-2">{item.jalur}</td>
              <td className="p-2">
                <Button className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs" onClick={() => handleDelete(item._id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
