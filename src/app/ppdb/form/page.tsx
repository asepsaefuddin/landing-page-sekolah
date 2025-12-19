import PPDBForm from "../../pages/PPDBForm";

export const metadata = {
  title: "Formulir PPDB | MTS Al-Falah",
};

export default function PPDBPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Formulir Pendaftaran PPDB
        </h1>
        <PPDBForm />
      </div>
    </main>
  );
}
