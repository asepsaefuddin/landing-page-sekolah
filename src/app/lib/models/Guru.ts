import mongoose from "mongoose";

const GuruSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nip: { type: String, required: true },
  mata_pelajaran: { type: String, required: true },
  no_hp: { type: String, required: true },
  berkas_url: { type: String }, // path/URL file PDF
}, { timestamps: true });

export default mongoose.models.Guru || mongoose.model("Guru", GuruSchema);