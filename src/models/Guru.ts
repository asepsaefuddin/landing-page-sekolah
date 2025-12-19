import mongoose from "mongoose";

const GuruSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    nip: { type: String, required: true },
    mata_pelajaran: { type: String, required: true },
    no_hp: { type: String, required: true },
    berkas_url: { type: String },
    berkas_name: { type: String }, // Original filename
    berkas_type: { type: String }, // MIME type
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Guru || mongoose.model("Guru", GuruSchema);
