"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import RichTextContent from "../components/RichTextContent";
import "./admin.css";

// Import TipTap Editor dynamically
const TipTapEditor = dynamic(
  () => import("../components/TipTapEditor"),
  { 
    ssr: false,
    loading: () => <div className="border rounded-lg p-4 bg-gray-50">Memuat editor...</div>
  }
);

type AppItem = {
  _id: string;
  nama_siswa: string;
  nisn: string;
  jalur: string;
  asal_sekolah: string;
  no_hp: string;
  berkas_url?: string;
  createdAt?: string;
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('ppdb');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    const res = await fetch("/api/ppdb/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (json.ok) {
      setItems((items) => items ? items.filter((item) => item._id !== id) : items);
    } else {
      alert(json.error || "Gagal hapus data");
    }
  }
  const [items, setItems] = useState<AppItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  
  // State untuk data siswa dan guru
  const [siswaData, setSiswaData] = useState<any[]>([]);
  const [guruData, setGuruData] = useState<any[]>([]);
  const [beritaData, setBeritaData] = useState<any[]>([]);
  const [bookmarkData, setBookmarkData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSiswaForm, setShowSiswaForm] = useState(false);
  const [showGuruForm, setShowGuruForm] = useState(false);
  const [showBeritaForm, setShowBeritaForm] = useState(false);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<any>(null);
  const [editingGuru, setEditingGuru] = useState<any>(null);
  const [editingBerita, setEditingBerita] = useState<any>(null);
  const [editingBookmark, setEditingBookmark] = useState<any>(null);
  const [beritaContent, setBeritaContent] = useState('');
  
  // Remove SimpleEditor toggle - we only use TipTap now
  // const [useSimpleEditor, setUseSimpleEditor] = useState(true);

  // Fetch data siswa
  const fetchSiswa = async () => {
    try {
      const res = await fetch("/api/siswa");
      const result = await res.json();
      if (result.ok) {
        setSiswaData(result.data);
      }
    } catch (error) {
      console.error("Error fetching siswa:", error);
    }
  };

  // Fetch data guru
  const fetchGuru = async () => {
    try {
      const res = await fetch("/api/guru");
      const result = await res.json();
      if (result.ok) {
        setGuruData(result.data);
      }
    } catch (error) {
      console.error("Error fetching guru:", error);
    }
  };

  // Fetch data berita
  const fetchBerita = async () => {
    try {
      const res = await fetch("/api/berita");
      if (res.ok) {
        const data = await res.json();
        setBeritaData(data);
      } else {
        console.error("Error fetching berita:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching berita:", error);
    }
  };

  // Fetch data bookmark
  const fetchBookmark = async () => {
    try {
      const res = await fetch("/api/bookmark");
      const result = await res.json();
      if (result.ok) {
        setBookmarkData(result.data);
      }
    } catch (error) {
      console.error("Error fetching bookmark:", error);
    }
  };

  // Fungsi delete siswa
  const deleteSiswa = async (id: string, siswa?: any) => {
    const hasFile = siswa?.berkas_url;
    const confirmMessage = hasFile 
      ? "Yakin ingin menghapus data siswa ini?\n\nFile berkas yang terkait juga akan ikut terhapus secara permanen."
      : "Yakin ingin menghapus data siswa ini?";
      
    if (!confirm(confirmMessage)) return;
    
    try {
      const res = await fetch("/api/siswa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.ok) {
        setSiswaData(prev => prev.filter(item => item._id !== id));
        if (hasFile) {
          alert("Data siswa dan file berkas berhasil dihapus");
        }
      } else {
        alert(json.error || "Gagal hapus data siswa");
      }
    } catch (error) {
      alert("Error menghapus data siswa");
    }
  };

  // Fungsi delete guru
  const deleteGuru = async (id: string, guru?: any) => {
    const hasFile = guru?.berkas_url;
    const confirmMessage = hasFile 
      ? "Yakin ingin menghapus data guru ini?\n\nFile berkas yang terkait juga akan ikut terhapus secara permanen."
      : "Yakin ingin menghapus data guru ini?";
      
    if (!confirm(confirmMessage)) return;
    
    try {
      const res = await fetch("/api/guru", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.ok) {
        setGuruData(prev => prev.filter(item => item._id !== id));
        if (hasFile) {
          alert("Data guru dan file berkas berhasil dihapus");
        }
      } else {
        alert(json.error || "Gagal hapus data guru");
      }
    } catch (error) {
      alert("Error menghapus data guru");
    }
  };

  // Fungsi delete berita
  const deleteBerita = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    try {
      const res = await fetch("/api/berita", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.ok) {
        setBeritaData(prev => prev.filter(item => item._id !== id));
      } else {
        alert(json.error || "Gagal hapus berita");
      }
    } catch (error) {
      alert("Error menghapus berita");
    }
  };

  // Fungsi delete bookmark
  const deleteBookmark = async (id: string) => {
    if (!confirm("Yakin ingin menghapus bookmark ini?")) return;
    try {
      const res = await fetch("/api/bookmark", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.ok) {
        setBookmarkData(prev => prev.filter(item => item._id !== id));
      } else {
        alert(json.error || "Gagal hapus bookmark");
      }
    } catch (error) {
      alert("Error menghapus bookmark");
    }
  };

  // Handle form submit siswa
  const handleSiswaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      if (editingSiswa) {
        // Mode edit
        formData.append("id", editingSiswa._id);
        const res = await fetch("/api/siswa", {
          method: "PUT",
          body: formData,
        });
        const json = await res.json();
        if (json.ok) {
          setShowSiswaForm(false);
          setEditingSiswa(null);
          fetchSiswa();
        } else {
          alert(json.error || "Gagal update data siswa");
        }
      } else {
        // Mode tambah
        const res = await fetch("/api/siswa", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.ok) {
          setShowSiswaForm(false);
          fetchSiswa();
          (e.target as HTMLFormElement).reset();
        } else {
          alert(json.error || "Gagal menyimpan data siswa");
        }
      }
    } catch (error) {
      alert("Error menyimpan data siswa");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit guru
  const handleGuruSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      if (editingGuru) {
        // Mode edit
        formData.append("id", editingGuru._id);
        const res = await fetch("/api/guru", {
          method: "PUT",
          body: formData,
        });
        const json = await res.json();
        if (json.ok) {
          setShowGuruForm(false);
          setEditingGuru(null);
          fetchGuru();
        } else {
          alert(json.error || "Gagal update data guru");
        }
      } else {
        // Mode tambah
        const res = await fetch("/api/guru", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.ok) {
          setShowGuruForm(false);
          fetchGuru();
          (e.target as HTMLFormElement).reset();
        } else {
          alert(json.error || "Gagal menyimpan data guru");
        }
      }
    } catch (error) {
      alert("Error menyimpan data guru");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit siswa
  const handleEditSiswa = (siswa: any) => {
    setEditingSiswa(siswa);
    setShowSiswaForm(true);
  };

  // Handle edit guru
  const handleEditGuru = (guru: any) => {
    setEditingGuru(guru);
    setShowGuruForm(true);
  };

  // Handle edit berita
  const handleEditBerita = (berita: any) => {
    setEditingBerita(berita);
    setBeritaContent(berita.konten || '');
    setShowBeritaForm(true);
  };

  // Handle edit bookmark
  const handleEditBookmark = (bookmark: any) => {
    setEditingBookmark(bookmark);
    setShowBookmarkForm(true);
  };

  // Handle cancel edit
  const handleCancelSiswa = () => {
    setShowSiswaForm(false);
    setEditingSiswa(null);
  };

  const handleCancelGuru = () => {
    setShowGuruForm(false);
    setEditingGuru(null);
  };

  const handleCancelBerita = () => {
    setShowBeritaForm(false);
    setEditingBerita(null);
    setBeritaContent('');
  };

  const handleCancelBookmark = () => {
    setShowBookmarkForm(false);
    setEditingBookmark(null);
  };

  // Handle form submit berita
  const handleBeritaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      // Debug: Log semua form data
      console.log("Form data entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const tanggalPublikasi = formData.get("tanggalPublikasi");
      console.log("Raw tanggalPublikasi:", tanggalPublikasi);
      
      // Pastikan tanggal valid
      let finalTanggal;
      if (tanggalPublikasi && tanggalPublikasi !== "") {
        try {
          finalTanggal = new Date(tanggalPublikasi as string).toISOString();
        } catch (e) {
          console.error("Error parsing tanggal:", e);
          finalTanggal = new Date().toISOString();
        }
      } else {
        finalTanggal = new Date().toISOString();
      }
      
      const data = {
        judul: formData.get("judul"),
        konten: beritaContent, // Gunakan state dari rich editor
        kategori: formData.get("kategori") || "umum",
        gambar: formData.get("gambar") || "",
        penulis: formData.get("penulis"),
        tanggalPublikasi: finalTanggal,
        tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map(tag => tag.trim()) : [],
        status: formData.get("status") || "published",
      };
      
      console.log("Final data to submit:", data);
      
      if (editingBerita) {
        // Mode edit
        const res = await fetch("/api/berita", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: editingBerita._id }),
        });
        const json = await res.json();
        if (json.ok) {
          setShowBeritaForm(false);
          setEditingBerita(null);
          setBeritaContent('');
          fetchBerita();
        } else {
          alert(json.error || "Gagal update berita");
        }
      } else {
        // Mode tambah
        console.log("Submitting berita data:", data);
        const res = await fetch("/api/berita", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log("Response status:", res.status);
        const json = await res.json();
        console.log("Response data:", json);
        if (json.ok) {
          setShowBeritaForm(false);
          setBeritaContent('');
          fetchBerita();
          (e.target as HTMLFormElement).reset();
          alert("Berita berhasil disimpan!");
        } else {
          console.error("Error saving berita:", json.error);
          alert(`Gagal menyimpan berita: ${json.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error in handleBeritaSubmit:", error);
      alert(`Error menyimpan berita: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit bookmark
  const handleBookmarkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        judul: formData.get("judul"),
        link: formData.get("link"),
        deskripsi: formData.get("deskripsi"),
      };
      
      if (editingBookmark) {
        // Mode edit
        const res = await fetch("/api/bookmark", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: editingBookmark._id }),
        });
        const json = await res.json();
        if (json.ok) {
          setShowBookmarkForm(false);
          setEditingBookmark(null);
          fetchBookmark();
        } else {
          alert(json.error || "Gagal update bookmark");
        }
      } else {
        // Mode tambah
        const res = await fetch("/api/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.ok) {
          setShowBookmarkForm(false);
          fetchBookmark();
          (e.target as HTMLFormElement).reset();
        } else {
          alert(json.error || "Gagal menyimpan bookmark");
        }
      }
    } catch (error) {
      alert("Error menyimpan bookmark");
    } finally {
      setLoading(false);
    }
  };

  async function load() {
    setErr(null);
    const res = await fetch("/api/ppdb", { cache: "no-store" });
    if (!res.ok) {
      setErr("Tidak memiliki akses. Silakan login ulang.");
      setItems([]);
      return;
    }
    const data = await res.json();
    setItems(data.data);
  }

  useEffect(() => {
    load();
  }, []);

  // Load data saat section berubah
  useEffect(() => {
    if (activeSection === "data-siswa") {
      fetchSiswa();
    } else if (activeSection === "data-guru") {
      fetchGuru();
    } else if (activeSection === "berita") {
      fetchBerita();
    } else if (activeSection === "bookmark") {
      fetchBookmark();
    }
  }, [activeSection]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-800 text-white p-2 rounded-lg"
      >
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Dashboard Sekolah</h1>
          <nav className="space-y-2">
            <button 
              onClick={() => {setActiveSection('ppdb'); setSidebarOpen(false);}} 
              className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                activeSection === 'ppdb' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <i className="fas fa-user-graduate mr-3"></i>
              PPDB
            </button>
            <button 
              onClick={() => {setActiveSection('data-siswa'); setSidebarOpen(false);}} 
              className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                activeSection === 'data-siswa' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <i className="fas fa-users mr-3"></i>
              Data Siswa
            </button>
            <button 
              onClick={() => {setActiveSection('data-guru'); setSidebarOpen(false);}} 
              className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                activeSection === 'data-guru' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <i className="fas fa-chalkboard-teacher mr-3"></i>
              Data Guru
            </button>
            <button 
              onClick={() => {setActiveSection('berita'); setSidebarOpen(false);}} 
              className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                activeSection === 'berita' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <i className="fas fa-newspaper mr-3"></i>
              Berita
            </button>
            <button 
              onClick={() => {setActiveSection('bookmark'); setSidebarOpen(false);}} 
              className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                activeSection === 'bookmark' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <i className="fas fa-bookmark mr-3"></i>
              Bookmark
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="flex items-center justify-between p-6 bg-white shadow sticky top-0 z-20">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeSection === 'ppdb' && 'Data PPDB'}
            {activeSection === 'data-siswa' && 'Data Siswa'}
            {activeSection === 'data-guru' && 'Data Guru'}
            {activeSection === 'berita' && 'Berita'}
            {activeSection === 'bookmark' && 'Bookmark'}
          </h2>
          <button
            onClick={logout}
            className="rounded-xl border border-blue-700 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
        
        {/* PPDB Section */}
        {activeSection === 'ppdb' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {err && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{err}</p>}
              {!items ? (
                <p className="text-slate-600">Memuat...</p>
              ) : items.length === 0 ? (
                <p className="text-slate-600">Belum ada pendaftar.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NISN</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Jalur</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Asal Sekolah</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kontak</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Berkas</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((it) => (
                        <tr key={it._id}>
                          <td className="px-4 py-3">{it.nama_siswa}</td>
                          <td className="px-4 py-3">{it.nisn}</td>
                          <td className="px-4 py-3">{it.jalur}</td>
                          <td className="px-4 py-3">{it.asal_sekolah}</td>
                          <td className="px-4 py-3">{it.no_hp}</td>
                          <td className="px-4 py-3">
                            {it.berkas_url ? (
                              <a
                                href={it.berkas_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline hover:text-blue-900"
                              >
                                {it.berkas_url.includes('.pdf') ? "📄 PDF" : 
                                 it.berkas_url.includes('.docx') || it.berkas_url.includes('.doc') ? "📝 Word" : 
                                 it.berkas_url.includes('.jpg') || it.berkas_url.includes('.jpeg') || it.berkas_url.includes('.png') || it.berkas_url.includes('.gif') ? "🖼️ Gambar" :
                                 "📁 File"}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                              onClick={() => handleDelete(it._id)}
                            >
                              <i className="fas fa-trash mr-1"></i>Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Data Siswa Section */}
        {activeSection === 'data-siswa' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Data Siswa</h3>
                <button 
                  onClick={() => setShowSiswaForm(!showSiswaForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <i className="fas fa-plus mr-2"></i>Tambah Siswa
                </button>
              </div>
              
              {/* Form Tambah/Edit Siswa */}
              {showSiswaForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">{editingSiswa ? 'Edit Data Siswa' : 'Tambah Data Siswa'}</h4>
                  <form onSubmit={handleSiswaSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="nama" 
                        defaultValue={editingSiswa?.nama || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NISN</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="nisn" 
                        defaultValue={editingSiswa?.nisn || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="kelas" 
                        defaultValue={editingSiswa?.kelas || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jalur</label>
                      <select 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="jalur"
                        defaultValue={editingSiswa?.jalur || ''}
                      >
                        <option value="">Pilih Jalur</option>
                        <option value="Reguler">Reguler</option>
                        <option value="Prestasi">Prestasi</option>
                        <option value="Zonasi">Zonasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Asal Sekolah</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="asal_sekolah" 
                        defaultValue={editingSiswa?.asal_sekolah || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="no_hp" 
                        defaultValue={editingSiswa?.no_hp || ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Berkas (PDF, Gambar, atau DOCX)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.docx,.doc" 
                        className="w-full p-2 border rounded-lg" 
                        name="berkas"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format yang didukung: PDF, JPG, PNG, GIF, DOCX. Maksimal 10MB</p>
                      {editingSiswa?.berkas_url && (
                        <p className="text-sm text-gray-600 mt-1">File saat ini: 
                          <a href={editingSiswa.berkas_url} target="_blank" className="text-blue-600 underline">
                            {editingSiswa.berkas_url.includes('.pdf') ? 'Lihat PDF' : 
                             editingSiswa.berkas_url.includes('.docx') || editingSiswa.berkas_url.includes('.doc') ? 'Lihat Dokumen' : 
                             'Lihat File'}
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        {loading ? 'Menyimpan...' : (editingSiswa ? 'Update' : 'Simpan')}
                      </button>
                      <button type="button" onClick={handleCancelSiswa} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NISN</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kelas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Jalur</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Asal Sekolah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kontak</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Berkas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {siswaData.map((siswa) => (
                      <tr key={siswa._id}>
                        <td className="px-4 py-3">{siswa.nama}</td>
                        <td className="px-4 py-3">{siswa.nisn}</td>
                        <td className="px-4 py-3">{siswa.kelas}</td>
                        <td className="px-4 py-3">{siswa.jalur}</td>
                        <td className="px-4 py-3">{siswa.asal_sekolah}</td>
                        <td className="px-4 py-3">{siswa.no_hp}</td>
                        <td className="px-4 py-3">
                          {siswa.berkas_url ? (
                            <a
                              href={siswa.berkas_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 underline hover:text-blue-900"
                            >
                              Lihat PDF
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleEditSiswa(siswa)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                          >
                            <i className="fas fa-edit mr-1"></i>Edit
                          </button>
                          <button 
                            onClick={() => deleteSiswa(siswa._id, siswa)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            <i className="fas fa-trash mr-1"></i>Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {siswaData.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Belum ada data siswa</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Data Guru Section */}
        {activeSection === 'data-guru' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Data Guru</h3>
                <button 
                  onClick={() => setShowGuruForm(!showGuruForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <i className="fas fa-plus mr-2"></i>Tambah Guru
                </button>
              </div>
              
              {/* Form Tambah/Edit Guru */}
              {showGuruForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">{editingGuru ? 'Edit Data Guru' : 'Tambah Data Guru'}</h4>
                  <form onSubmit={handleGuruSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="nama" 
                        defaultValue={editingGuru?.nama || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="nip" 
                        defaultValue={editingGuru?.nip || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="mata_pelajaran" 
                        defaultValue={editingGuru?.mata_pelajaran || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="no_hp" 
                        defaultValue={editingGuru?.no_hp || ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Berkas (PDF, Gambar, atau DOCX)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.docx,.doc" 
                        className="w-full p-2 border rounded-lg" 
                        name="berkas"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format yang didukung: PDF, JPG, PNG, GIF, DOCX. Maksimal 10MB</p>
                      {editingGuru?.berkas_url && (
                        <p className="text-sm text-gray-600 mt-1">File saat ini: 
                          <a href={editingGuru.berkas_url} target="_blank" className="text-blue-600 underline">
                            {editingGuru.berkas_url.includes('.pdf') ? 'Lihat PDF' : 
                             editingGuru.berkas_url.includes('.docx') || editingGuru.berkas_url.includes('.doc') ? 'Lihat Dokumen' : 
                             'Lihat File'}
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        {loading ? 'Menyimpan...' : (editingGuru ? 'Update' : 'Simpan')}
                      </button>
                      <button type="button" onClick={handleCancelGuru} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NIP</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mata Pelajaran</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kontak</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Berkas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {guruData.map((guru) => (
                      <tr key={guru._id}>
                        <td className="px-4 py-3">{guru.nama}</td>
                        <td className="px-4 py-3">{guru.nip}</td>
                        <td className="px-4 py-3">{guru.mata_pelajaran}</td>
                        <td className="px-4 py-3">{guru.no_hp}</td>
                        <td className="px-4 py-3">
                          {guru.berkas_url ? (
                            <a
                              href={guru.berkas_url}
                              download={guru.berkas_name || `guru_${guru.nip}_berkas`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 underline hover:text-blue-900"
                            >
                              {guru.berkas_name ? (
                                <>
                                  {guru.berkas_name.endsWith('.pdf') && '📄 '}
                                  {(guru.berkas_name.endsWith('.docx') || guru.berkas_name.endsWith('.doc')) && '📝 '}
                                  {(guru.berkas_name.endsWith('.jpg') || guru.berkas_name.endsWith('.jpeg') || 
                                    guru.berkas_name.endsWith('.png') || guru.berkas_name.endsWith('.gif')) && '🖼️ '}
                                  {guru.berkas_name}
                                </>
                              ) : (
                                'Lihat Berkas'
                              )}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleEditGuru(guru)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                          >
                            <i className="fas fa-edit mr-1"></i>Edit
                          </button>
                          <button 
                            onClick={() => deleteGuru(guru._id, guru)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            <i className="fas fa-trash mr-1"></i>Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {guruData.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Belum ada data guru</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Berita Section */}
        {activeSection === 'berita' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Berita</h3>
                <button 
                  onClick={() => {
                    if (!showBeritaForm) {
                      setEditingBerita(null);
                      setBeritaContent('');
                    }
                    setShowBeritaForm(!showBeritaForm);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <i className="fas fa-plus mr-2"></i>Tambah Berita
                </button>
              </div>
              
              {/* Form Tambah/Edit Berita */}
              {showBeritaForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">{editingBerita ? 'Edit Berita' : 'Tambah Berita'}</h4>
                  <form onSubmit={handleBeritaSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="judul" 
                        defaultValue={editingBerita?.judul || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konten Berita
                      </label>
                      <TipTapEditor
                        value={beritaContent}
                        onChange={setBeritaContent}
                        placeholder="Mulai menulis konten berita... Gunakan toolbar untuk format teks seperti di Microsoft Word."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select 
                          className="w-full p-2 border rounded-lg" 
                          name="kategori" 
                          defaultValue={editingBerita?.kategori || 'umum'}
                        >
                          <option value="umum">Umum</option>
                          <option value="akademik">Akademik</option>
                          <option value="prestasi">Prestasi</option>
                          <option value="kegiatan">Kegiatan</option>
                          <option value="pengumuman">Pengumuman</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                          className="w-full p-2 border rounded-lg" 
                          name="status" 
                          defaultValue={editingBerita?.status || 'published'}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publikasi</label>
                        <input 
                          type="datetime-local" 
                          className="w-full p-2 border rounded-lg" 
                          name="tanggalPublikasi"
                          required
                          defaultValue={editingBerita?.tanggalPublikasi ? 
                            new Date(editingBerita.tanggalPublikasi).toISOString().slice(0, 16) : 
                            new Date().toISOString().slice(0, 16)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full p-2 border rounded-lg" 
                          name="penulis" 
                          defaultValue={editingBerita?.penulis || ''}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (opsional)</label>
                        <input 
                          type="url" 
                          className="w-full p-2 border rounded-lg" 
                          name="gambar" 
                          placeholder="https://example.com/image.jpg"
                          defaultValue={editingBerita?.gambar || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-lg" 
                          name="tags" 
                          placeholder="tag1, tag2, tag3"
                          defaultValue={editingBerita?.tags?.join(', ') || ''}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        {loading ? 'Menyimpan...' : (editingBerita ? 'Update' : 'Simpan')}
                      </button>
                      <button type="button" onClick={handleCancelBerita} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="grid gap-4">
                {beritaData.map((berita) => (
                  <div key={berita._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{berita.judul}</h4>
                        <div className="text-gray-600 mb-2 prose prose-sm max-w-none">
                          <RichTextContent 
                            content={berita.konten}
                            className="rich-content"
                          />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span><i className="fas fa-calendar mr-1"></i>{berita.tanggalPublikasi ? new Date(berita.tanggalPublikasi).toLocaleDateString('id-ID') : new Date(berita.createdAt).toLocaleDateString('id-ID')}</span>
                          <span><i className="fas fa-user mr-1"></i>{berita.penulis}</span>
                          <span><i className="fas fa-tag mr-1"></i>{berita.kategori}</span>
                          <span className={`px-2 py-1 rounded text-xs ${berita.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {berita.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditBerita(berita)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button 
                          onClick={() => deleteBerita(berita._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          <i className="fas fa-trash mr-1"></i>Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {beritaData.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Belum ada berita</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Bookmark Section */}
        {activeSection === 'bookmark' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Bookmark</h3>
                <button 
                  onClick={() => setShowBookmarkForm(!showBookmarkForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <i className="fas fa-plus mr-2"></i>Tambah Bookmark
                </button>
              </div>
              
              {/* Form Tambah/Edit Bookmark */}
              {showBookmarkForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">{editingBookmark ? 'Edit Bookmark' : 'Tambah Bookmark'}</h4>
                  <form onSubmit={handleBookmarkSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="judul" 
                        defaultValue={editingBookmark?.judul || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input 
                        type="url" 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        name="link" 
                        placeholder="https://example.com"
                        defaultValue={editingBookmark?.link || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2 border rounded-lg" 
                        name="deskripsi" 
                        defaultValue={editingBookmark?.deskripsi || ''}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        {loading ? 'Menyimpan...' : (editingBookmark ? 'Update' : 'Simpan')}
                      </button>
                      <button type="button" onClick={handleCancelBookmark} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Judul</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Link</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Deskripsi</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookmarkData.map((bookmark, index) => (
                      <tr key={bookmark._id}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{bookmark.judul}</td>
                        <td className="px-4 py-3">
                          <a href={bookmark.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {bookmark.link}
                          </a>
                        </td>
                        <td className="px-4 py-3">{bookmark.deskripsi || '-'}</td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleEditBookmark(bookmark)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                          >
                            <i className="fas fa-edit mr-1"></i>Edit
                          </button>
                          <button 
                            onClick={() => deleteBookmark(bookmark._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            <i className="fas fa-trash mr-1"></i>Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookmarkData.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Belum ada bookmark</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
