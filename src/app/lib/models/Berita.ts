import mongoose from "mongoose";

const BeritaSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  konten: { type: String, required: true },
  kategori: { type: String, default: "umum" },
  gambar: { type: String, default: "" },
  penulis: { type: String, required: true },
  tanggalPublikasi: { type: Date, default: Date.now },
  tags: [{ type: String }],
  status: { type: String, enum: ["draft", "published"], default: "published" },
  tanggal: { type: String, required: false, default: "" },
}, { timestamps: true });

// Clear existing model to avoid cache issues
if (mongoose.models.Berita) {
  delete mongoose.models.Berita;
}

export default mongoose.model("Berita", BeritaSchema);