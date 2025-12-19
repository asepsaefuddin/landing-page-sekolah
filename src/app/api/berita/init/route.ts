import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Berita from "@/app/lib/models/Berita";

export async function GET() {
  try {
    await connectDB();
    
    // Check if there are already news articles
    const existingCount = await Berita.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({ message: "Berita sudah ada", count: existingCount });
    }

    // Simple news data
    const sampleBerita = [
      {
        judul: "Penerimaan Siswa Baru 2025 Dibuka",
        konten: "<p>MTS Al-Falah dengan bangga mengumumkan bahwa <strong>Penerimaan Siswa Baru (PSB) untuk tahun ajaran 2025/2026</strong> telah resmi dibuka!</p><p>Daftarkan putra-putri Anda sekarang juga dan dapatkan pendidikan berkualitas dengan nuansa islami.</p>",
        kategori: "pengumuman",
        gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
        penulis: "Tim Humas",
        tanggalPublikasi: new Date(),
        tags: ["PPDB", "Pendaftaran"],
        status: "published"
      },
      {
        judul: "Juara 1 Olimpiade Matematika",
        konten: "<p>Alhamdulillah, siswa MTS Al-Falah berhasil meraih <strong>juara 1 Olimpiade Matematika Tingkat Provinsi</strong>.</p><p>Prestasi membanggakan ini diraih oleh Ahmad Fadhil Ramadhan, siswa kelas IX.</p>",
        kategori: "prestasi",
        gambar: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&h=400&fit=crop",
        penulis: "Ustadzah Siti",
        tanggalPublikasi: new Date(Date.now() - 86400000), // 1 day ago
        tags: ["Olimpiade", "Matematika"],
        status: "published"
      },
      {
        judul: "Festival Seni dan Budaya Islam",
        konten: "<p>MTS Al-Falah sukses menyelenggarakan <strong>Festival Seni dan Budaya Islam 2024</strong> yang berlangsung meriah selama 3 hari.</p><p>Acara menampilkan berbagai pertunjukan seni dari siswa-siswi yang memadukan kreativitas dengan nilai-nilai islami.</p>",
        kategori: "kegiatan",
        gambar: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
        penulis: "Tim Dokumentasi",
        tanggalPublikasi: new Date(Date.now() - 172800000), // 2 days ago
        tags: ["Festival", "Seni"],
        status: "published"
      }
    ];

    // Insert sample data
    const result = await Berita.insertMany(sampleBerita);
    
    return NextResponse.json({ 
      success: true,
      message: "Sample berita berhasil ditambahkan", 
      count: result.length 
    });
  } catch (error) {
    console.error("Error creating sample berita:", error);
    return NextResponse.json({ error: "Failed to create sample berita" }, { status: 500 });
  }
}