"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ChevronLeft, ChevronRight, Tag, Search } from "lucide-react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
interface Berita {
  _id: string;
  judul: string;
  konten: string;
  kategori?: string;
  gambar?: string;
  penulis: string;
  tanggalPublikasi?: Date | string;
  tanggal?: string; // fallback for old format
  tags?: string[];
  status?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function NewsPage() {
  const router = useRouter();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ["semua", "akademik", "prestasi", "kegiatan", "pengumuman", "umum"];

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    try {
      console.log("Starting fetchBerita...");
      const response = await fetch("/api/berita");
      console.log("Response status:", response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Data received:", data);
        // Sort by creation date, newest first
        const sortedData = data.sort((a: Berita, b: Berita) => {
          const dateA = new Date(a.tanggalPublikasi || a.tanggal || a.createdAt).getTime();
          const dateB = new Date(b.tanggalPublikasi || b.tanggal || b.createdAt).getTime();
          return dateB - dateA;
        });
        console.log("Sorted data:", sortedData);
        setBeritaList(sortedData);
      } else {
        console.error("Response not ok:", response.status);
        setError("Gagal memuat berita");
      }
    } catch (err) {
      console.error("Error in fetchBerita:", err);
      setError("Terjadi kesalahan saat memuat berita");
    } finally {
      setLoading(false);
    }
  };

  // Filter berita berdasarkan pencarian dan kategori
  const filteredBerita = beritaList.filter((berita) => {
    const matchesSearch = berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         berita.konten.toLowerCase().includes(searchTerm.toLowerCase());
    const beritaKategori = berita.kategori || "umum";
    const matchesCategory = selectedCategory === "semua" || beritaKategori === selectedCategory;
    const beritaStatus = berita.status || "published";
    return matchesSearch && matchesCategory && beritaStatus === "published";
  });

  // Get featured news (top 3 latest)
  const featuredNews = filteredBerita.slice(0, 3);

  // Pagination logic
  const totalPages = Math.ceil(filteredBerita.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBerita = filteredBerita.slice(startIndex, startIndex + itemsPerPage);

  // Slider navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  // Auto slide
  useEffect(() => {
    if (featuredNews.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredNews.length]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const truncateText = (text: string, maxLength: number) => {
    const stripped = stripHtml(text);
    return stripped.length > maxLength ? stripped.substring(0, maxLength) + "..." : stripped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat berita...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchBerita} className="mt-4">
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Portal Berita MTS Al-Falah
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-200 text-lg"
            >
              Informasi Terkini Seputar Kegiatan dan Prestasi Sekolah
            </motion.p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured News Slider */}
        {featuredNews.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Berita Terbaru</h2>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-96 overflow-hidden">
                {featuredNews.map((berita, index) => (
                  <div
                    key={berita._id}
                    className={`absolute inset-0 transition-transform duration-500 ease-in-out cursor-pointer ${
                      index === currentSlide ? 'translate-x-0' : 
                      index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                    }`}
                    onClick={() => router.push(`/news/${berita._id}`)}
                  >
                    <div className="h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative overflow-hidden">
                      {berita.gambar ? (
                        <>
                          <img
                            src={berita.gambar}
                            alt={berita.judul}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                        </>
                      )}
                      <div className="relative z-10 text-center text-white p-8 max-w-4xl">
                        <Badge className="mb-4 bg-red-500 text-white">
                          {(berita.kategori || "UMUM").toUpperCase()}
                        </Badge>
                        <h3 className="text-4xl font-bold mb-4">{berita.judul}</h3>
                        <p className="text-xl mb-6 text-gray-200">
                          {truncateText(berita.konten, 150)}
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm">
                          <span><Calendar className="inline mr-2 h-4 w-4" />{formatDate(berita.tanggalPublikasi || berita.tanggal || berita.createdAt)}</span>
                          <span><User className="inline mr-2 h-4 w-4" />{berita.penulis}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {featuredNews.length > 1 && (
                <>
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    {/* Left Arrow */}
                    <button
                      onClick={prevSlide}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="flex space-x-2">
                      {featuredNews.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Right Arrow */}
                    <button
                      onClick={nextSlide}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.section>
        )}

        {/* News Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {selectedCategory === "semua" ? "Semua Berita" : `Berita ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
          </h2>
          
          {currentBerita.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Tidak ada berita yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBerita.map((berita, index) => (
                <motion.article
                  key={berita._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={() => router.push(`/news/${berita._id}`)}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden">
                    {berita.gambar ? (
                      <img
                        src={berita.gambar}
                        alt={berita.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600">
                        <Tag className="text-6xl text-white opacity-50" />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm ${
                        (berita.kategori || 'umum') === 'akademik' ? 'bg-blue-500/80' :
                        (berita.kategori || 'umum') === 'prestasi' ? 'bg-green-500/80' :
                        (berita.kategori || 'umum') === 'kegiatan' ? 'bg-purple-500/80' :
                        (berita.kategori || 'umum') === 'pengumuman' ? 'bg-red-500/80' :
                        'bg-gray-500/80'
                      }`}>
                        {(berita.kategori || 'UMUM').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {berita.judul}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {truncateText(berita.konten, 120)}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(berita.tanggalPublikasi || berita.tanggal || berita.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {berita.penulis}
                        </span>
                      </div>
                      <span className="text-emerald-600 font-semibold group-hover:text-emerald-700">
                        Baca →
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}