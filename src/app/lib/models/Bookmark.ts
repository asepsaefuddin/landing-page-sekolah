import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  link: { type: String, required: true },
  deskripsi: { type: String },
}, { timestamps: true });

export default mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);