import mongoose from "mongoose";

const PpdbSchema = new mongoose.Schema({
  nama_siswa: { type: String, required: true },
  nisn: { type: String, required: true },
  tgl_lahir: { type: String, required: true },
  asal_sekolah: { type: String, required: true },
  nama_ortu: { type: String, required: true },
  no_hp: { type: String, required: true },
  alamat: { type: String, required: true },
  jalur: { type: String, required: true },
  berkas: { type: String }, // path/URL file jika upload
}, { timestamps: true });

export default mongoose.models.Ppdb || mongoose.model("Ppdb", PpdbSchema);
