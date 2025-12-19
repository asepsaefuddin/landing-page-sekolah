// models/Application.ts
import { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    nama_siswa: String,
    nisn: String,
    tgl_lahir: String,
    asal_sekolah: String,
    nama_ortu: String,
    no_hp: String,
    alamat: String,
    jalur: String,

    // --- fields berkas ---
    file_kind: { type: String, enum: ["pdf", "image"], required: false },
    berkas_url: { type: String, required: false }, // "/pdf_uploads/xxx.pdf" atau "https://res.cloudinary.com/..."
    berkas_public_id: { type: String, required: false }, // hanya untuk image
    berkas_resource_type: { type: String, required: false },
    berkas_format: { type: String, required: false },

    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application = models.Application || model("Application", ApplicationSchema);
