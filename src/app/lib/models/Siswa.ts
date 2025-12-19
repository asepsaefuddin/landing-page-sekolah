import mongoose from "mongoose";

const SiswaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nisn: { type: String, required: true },
  kelas: { type: String, required: true },
  jalur: { type: String, required: true },
  asal_sekolah: { type: String, required: true },
  no_hp: { type: String, required: true },
  berkas_url: { type: String }, // path/URL file PDF
}, { timestamps: true });

export default mongoose.models.Siswa || mongoose.model("Siswa", SiswaSchema);