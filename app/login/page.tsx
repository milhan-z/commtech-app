"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { OrganicCard } from "@/components/OrganicCard";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });
    const data = await response.json();
    if (data.ok) {
      router.replace(searchParams.get("next") || "/");
      router.refresh();
    } else {
      setError("PIN belum cocok. Coba cek lagi.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <OrganicCard className="rounded-blob p-8">
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-ink text-white">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <h1 className="font-serif text-5xl leading-none">Masuk panitia</h1>
        <p className="mt-4 text-muted">Masukkan STAFF PIN untuk membuka data internal CommTECH.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            type="password"
            inputMode="numeric"
            placeholder="PIN"
            className="w-full rounded-full border border-border bg-white px-5 py-4 text-center text-2xl font-black tracking-[0.35em] outline-none"
          />
          {error ? <p className="text-sm font-bold text-danger">{error}</p> : null}
          <button type="submit" className="w-full rounded-full bg-ink px-5 py-4 font-black text-white">
            Buka app
          </button>
        </form>
      </OrganicCard>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
