"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, Tag, ArrowLeft, Share2, Eye } from "lucide-react";
import { Button } from "../../components/Button";
import Navbar from "../../components/Navbar";
import RichTextContent from "../../components/RichTextContent";

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

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedNews, setRelatedNews] = useState<Berita[]>([]);
  const [latestNews, setLatestNews] = useState<Berita[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchBeritaDetail(params.id as string);
      fetchLatestNews();
    }
  }, [params.id]);

  const fetchBeritaDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/berita/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBerita(data);
        // Fetch related news
        fetchRelatedNews(data.kategori, id);
      } else {
        setError("Berita tidak ditemukan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat berita");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async (kategori: string, excludeId: string) => {
    try {
      const response = await fetch("/api/berita");
      if (response.ok) {
        const allBerita = await response.json();
        const related = allBerita
          .filter((b: Berita) => 
            b.kategori === kategori && 
            b._id !== excludeId && 
            b.status === "published"
          )
          .slice(0, 3);
        setRelatedNews(related);
      }
    } catch (err) {
      console.error("Error fetching related news:", err);
    }
  };

  const fetchLatestNews = async () => {
    try {
      const response = await fetch("/api/berita");
      if (response.ok) {
        const allBerita = await response.json();
        // Sort by creation date, newest first and get latest 3
        const latest = allBerita
          .filter((b: Berita) => b.status === "published" || !b.status)
          .sort((a: Berita, b: Berita) => {
            const dateA = new Date(a.tanggalPublikasi || a.tanggal || a.createdAt).getTime();
            const dateB = new Date(b.tanggalPublikasi || b.tanggal || b.createdAt).getTime();
            return dateB - dateA;
          })
          .slice(0, 3);
        setLatestNews(latest);
      }
    } catch (err) {
      console.error("Error fetching latest news:", err);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: berita?.judul,
        text: `Baca berita: ${berita?.judul}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berita berhasil disalin!");
    }
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

  if (error || !berita) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || "Berita tidak ditemukan"}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Buttons */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Berita
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => router.push('/news')}
            className="mb-4 bg-emerald-600 hover:bg-emerald-700"
          >
            Lihat Semua Berita
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Featured Image */}
            {berita.gambar && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={berita.gambar}
                  alt={berita.judul}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Article Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              {/* Category Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  (berita.kategori || 'umum') === 'akademik' ? 'bg-blue-100 text-blue-800' :
                  (berita.kategori || 'umum') === 'prestasi' ? 'bg-green-100 text-green-800' :
                  (berita.kategori || 'umum') === 'kegiatan' ? 'bg-purple-100 text-purple-800' :
                  (berita.kategori || 'umum') === 'pengumuman' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {(berita.kategori || 'UMUM').toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {berita.judul}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(berita.tanggalPublikasi || berita.tanggal || berita.createdAt)}
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {berita.penulis}
                </div>
                {berita.tags && berita.tags.length > 0 && (
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    {berita.tags.join(", ")}
                  </div>
                )}
              </div>

              {/* Share Button */}
              <div className="flex justify-end mb-6">
                <Button variant="outline" onClick={handleShare} size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Bagikan
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <RichTextContent 
                content={berita.konten}
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 prose-strong:text-gray-900"
              />
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Latest News */}
            {latestNews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-emerald-600 rounded mr-3"></div>
                  Berita Terbaru
                </h3>
                <div className="space-y-4">
                  {latestNews.map((news, index) => (
                    <motion.div
                      key={news._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => router.push(`/news/${news._id}`)}
                    >
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {news.gambar ? (
                            <img
                              src={news.gambar}
                              alt={news.judul}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <Tag className="text-white h-6 w-6" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Category Badge */}
                          <div className="mb-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              (news.kategori || 'umum') === 'akademik' ? 'bg-blue-100 text-blue-800' :
                              (news.kategori || 'umum') === 'prestasi' ? 'bg-green-100 text-green-800' :
                              (news.kategori || 'umum') === 'kegiatan' ? 'bg-purple-100 text-purple-800' :
                              (news.kategori || 'umum') === 'pengumuman' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {(news.kategori || 'UMUM').toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 line-clamp-2 text-sm mb-2 transition-colors">
                            {news.judul}
                          </h4>
                          
                          {/* Excerpt */}
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {truncateText(news.konten, 80)}
                          </p>
                          
                          {/* Meta */}
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(news.tanggalPublikasi || news.tanggal || news.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* View All Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/news')}
                    className="w-full text-sm"
                  >
                    Lihat Semua Berita
                  </Button>
                </div>
              </div>
            )}

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 rounded mr-3"></div>
                  Berita Terkait
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <a
                      key={news._id}
                      href={`/news/${news._id}`}
                      className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2 text-sm">
                        {news.judul}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(news.tanggalPublikasi || news.tanggal || news.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short"
                        })}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </main>
    </div>
  );
}