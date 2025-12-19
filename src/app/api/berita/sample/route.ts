import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Berita from "@/app/lib/models/Berita";

export async function POST() {
  try {
    await connectDB();
    
    // Check if there are already news articles
    const existingCount = await Berita.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({ message: "Berita sudah ada", count: existingCount });
    }

    // Sample news data
    const sampleBerita = [
      {
        judul: "Penerimaan Siswa Baru 2025 MTS Al-Falah Dibuka",
        konten: `<p>MTS Al-Falah dengan bangga mengumumkan bahwa <strong>Penerimaan Siswa Baru (PSB) untuk tahun ajaran 2025/2026</strong> telah resmi dibuka!</p>
        
        <p>Kami mengundang putra-putri terbaik bangsa untuk bergabung dengan keluarga besar MTS Al-Falah dan meraih pendidikan berkualitas dengan nuansa islami yang kental.</p>
        
        <h3>Jalur Pendaftaran:</h3>
        <ul>
          <li><strong>Jalur Reguler:</strong> Test tertulis dan wawancara</li>
          <li><strong>Jalur Prestasi:</strong> Berdasarkan prestasi akademik/non-akademik</li>
          <li><strong>Jalur Tahfizh:</strong> Khusus calon siswa yang telah menghafal Al-Quran</li>
        </ul>
        
        <h3>Fasilitas Unggulan:</h3>
        <ul>
          <li>Laboratorium komputer modern</li>
          <li>Perpustakaan digital</li>
          <li>Masjid untuk kegiatan keagamaan</li>
          <li>Lapangan olahraga</li>
        </ul>
        
        <p><em>Jangan lewatkan kesempatan emas ini! Daftarkan putra-putri Anda sekarang juga.</em></p>`,
        kategori: "pengumuman",
        gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
        penulis: "Tim Humas MTS Al-Falah",
        tanggalPublikasi: new Date("2024-12-15"),
        tags: ["PPDB", "Pendaftaran", "Siswa Baru"],
        status: "published"
      },
      {
        judul: "Prestasi Gemilang: Juara 1 Olimpiade Matematika Tingkat Provinsi",
        konten: `<p>Alhamdulillah, siswa MTS Al-Falah kembali mengukir prestasi membanggakan di ajang <strong>Olimpiade Matematika Tingkat Provinsi 2024</strong>.</p>
        
        <p><strong>Ahmad Fadhil Ramadhan</strong>, siswa kelas IX, berhasil meraih juara 1 setelah melalui kompetisi ketat dengan peserta dari seluruh provinsi.</p>
        
        <h3>Perjalanan Menuju Juara:</h3>
        <p>Ahmad telah mempersiapkan diri selama 6 bulan dengan bimbingan intensif dari guru matematika sekolah. Ia rutin mengikuti latihan soal olimpiade setiap hari dan mengikuti try out berkala.</p>
        
        <blockquote>
          <p>"Saya sangat bangga bisa mewakili sekolah dan meraih prestasi ini. Terima kasih kepada guru-guru yang telah membimbing saya dengan sabar," ujar Ahmad saat diwawancarai.</p>
        </blockquote>
        
        <p>Prestasi ini semakin menegaskan komitmen MTS Al-Falah dalam mengembangkan potensi akademik siswa-siswanya.</p>`,
        kategori: "prestasi",
        gambar: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&h=400&fit=crop",
        penulis: "Ustadzah Siti Aminah",
        tanggalPublikasi: new Date("2024-12-10"),
        tags: ["Olimpiade", "Matematika", "Prestasi"],
        status: "published"
      },
      {
        judul: "Festival Seni dan Budaya Islam 2024: Memadukan Kreativitas dengan Nilai-nilai Islami",
        konten: `<p>MTS Al-Falah sukses menyelenggarakan <strong>Festival Seni dan Budaya Islam 2024</strong> yang berlangsung meriah selama 3 hari di aula sekolah.</p>
        
        <p>Acara ini menampilkan berbagai pertunjukan seni dari siswa-siswi yang memadukan kreativitas dengan nilai-nilai islami yang luhur.</p>
        
        <h3>Rangkaian Acara:</h3>
        <ul>
          <li><strong>Hari Pertama:</strong> Lomba kaligrafi dan lukis islami</li>
          <li><strong>Hari Kedua:</strong> Pentas seni musik islami dan qasidah</li>
          <li><strong>Hari Ketiga:</strong> Drama sejarah islam dan fashion show busana muslim</li>
        </ul>
        
        <h3>Antusiasme Tinggi:</h3>
        <p>Festival ini dihadiri oleh lebih dari 500 peserta dari siswa-siswi MTS Al-Falah dan sekolah-sekolah sekitar. Para orang tua dan masyarakat juga turut memeriahkan acara ini.</p>
        
        <p>Kepala Sekolah, <strong>Ustadz H. Muhammad Yusuf, S.Pd.I., M.Pd</strong>, menyampaikan apresiasi tinggi atas kreativitas dan dedikasi siswa-siswi.</p>
        
        <p><em>"Festival ini membuktikan bahwa seni dan budaya dapat menjadi media dakwah yang efektif untuk menyebarkan nilai-nilai islam,"</em> tutupnya.</p>`,
        kategori: "kegiatan",
        gambar: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
        penulis: "Tim Dokumentasi Sekolah",
        tanggalPublikasi: new Date("2024-12-05"),
        tags: ["Festival", "Seni", "Budaya Islam"],
        status: "published"
      },
      {
        judul: "Program Tahfizh Al-Quran: Mencetak Generasi Penghafal Al-Quran",
        konten: `<p>MTS Al-Falah terus berkomitmen mencetak generasi yang cinta Al-Quran melalui <strong>Program Tahfizh Al-Quran</strong> yang telah berjalan selama 5 tahun.</p>
        
        <p>Program ini telah berhasil mencetak puluhan siswa yang menghafal Al-Quran dengan target minimal 5 juz selama masa studi di MTS.</p>
        
        <h3>Metode Pembelajaran:</h3>
        <ul>
          <li><strong>Talaqqi:</strong> Setoran hafalan langsung kepada ustadz</li>
          <li><strong>Muraja'ah:</strong> Pengulangan hafalan secara berkelompok</li>
          <li><strong>Tahsin:</strong> Perbaikan bacaan dan tajwid</li>
          <li><strong>Tadarus:</strong> Membaca Al-Quran bersama-sama</li>
        </ul>
        
        <h3>Prestasi Program Tahfizh:</h3>
        <p>Hingga saat ini, program tahfizh MTS Al-Falah telah menghasilkan:</p>
        <ul>
          <li>45 siswa hafizh 5-10 juz</li>
          <li>12 siswa hafizh 15-20 juz</li>
          <li>3 siswa hafizh 30 juz (hafizh penuh)</li>
        </ul>
        
        <p>Para hafizh ini tidak hanya unggul dalam menghafal, tetapi juga berprestasi dalam bidang akademik lainnya.</p>`,
        kategori: "akademik",
        gambar: "https://images.unsplash.com/photo-1609890748408-2c5d0f8e79b4?w=800&h=400&fit=crop",
        penulis: "Ustadz Ahmad Maulana",
        tanggalPublikasi: new Date("2024-12-01"),
        tags: ["Tahfizh", "Al-Quran", "Program Unggulan"],
        status: "published"
      },
      {
        judul: "Kunjungan Edukasi ke Museum Sejarah Islam: Mengenal Warisan Peradaban",
        konten: `<p>Dalam rangka memperkaya wawasan sejarah islam, siswa-siswi kelas VIII MTS Al-Falah melakukan <strong>kunjungan edukasi ke Museum Sejarah Islam</strong> Jakarta.</p>
        
        <p>Kunjungan ini bertujuan untuk memberikan pengalaman langsung kepada siswa tentang perkembangan peradaban islam di Indonesia dan dunia.</p>
        
        <h3>Agenda Kunjungan:</h3>
        <ul>
          <li>Tur koleksi artefak sejarah islam</li>
          <li>Workshop kaligrafi arab</li>
          <li>Presentasi sejarah masuknya islam ke Indonesia</li>
          <li>Diskusi interaktif dengan pemandu museum</li>
        </ul>
        
        <p><strong>Siti Nurhaliza</strong>, siswi kelas VIII A, mengungkapkan kekagumannya:</p>
        <blockquote>
          <p>"Saya baru tahu kalau peradaban islam dahulu sangat maju dalam bidang sains dan teknologi. Ini membuat saya semakin bangga menjadi muslim."</p>
        </blockquote>
        
        <p>Guru pendamping, <strong>Ustadzah Fatimah</strong>, berharap kunjungan ini dapat menumbuhkan rasa cinta siswa terhadap sejarah dan peradaban islam.</p>`,
        kategori: "kegiatan", 
        gambar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
        penulis: "Ustadzah Fatimah Azzahra",
        tanggalPublikasi: new Date("2024-11-28"),
        tags: ["Kunjungan Edukasi", "Museum", "Sejarah Islam"],
        status: "published"
      }
    ];

    // Insert sample data
    const result = await Berita.insertMany(sampleBerita);
    
    return NextResponse.json({ 
      message: "Sample berita berhasil ditambahkan", 
      count: result.length 
    });
  } catch (error) {
    console.error("Error creating sample berita:", error);
    return NextResponse.json({ error: "Failed to create sample berita" }, { status: 500 });
  }
}