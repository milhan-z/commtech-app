import { ExternalLink, MapPin, MessageCircle, PhoneCall, Shirt, Siren } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OrganicCard } from "@/components/OrganicCard";

const guideItems = [
  {
    title: "Kontak Darurat",
    icon: Siren,
    items: ["Koordinator: Noel / Shafa", "Medis kampus: hubungi pos keamanan ITS", "Transport darurat: Daniel"]
  },
  {
    title: "Lokasi Penting",
    icon: MapPin,
    items: ["Rektorat ITS", "DTSI / IE-601 TO", "Wisma Bougenville", "88 Embong Malang"]
  },
  {
    title: "Dress Code",
    icon: Shirt,
    items: ["Panitia: rapi, nyaman, dan mudah dikenali", "Opening: formal / batik", "Field visit: sepatu nyaman"]
  },
  {
    title: "Aturan Cepat",
    icon: PhoneCall,
    items: ["Standby 15 menit sebelum agenda", "Update PIC jika ada perubahan lokasi", "Jangan bagikan data peserta di luar panitia"]
  }
];

export default function GuidePage() {
  return (
    <AppShell title="Guide">
      <div className="space-y-5">
        {guideItems.map((section) => {
          const Icon = section.icon;
          return (
            <OrganicCard key={section.title} className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-ink text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black">{section.title}</h2>
              </div>
              <ul className="space-y-2 text-muted">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </OrganicCard>
          );
        })}

        <OrganicCard className="bg-ink p-5 text-white">
          <h2 className="text-xl font-black">Quick Links</h2>
          <div className="mt-4 grid gap-3">
            <a className="flex items-center justify-between rounded-full bg-white/10 px-4 py-3 font-bold" href={process.env.NEXT_PUBLIC_SHEET_URL || "#"}>
              Google Sheet
              <ExternalLink className="h-4 w-4" />
            </a>
            <a className="flex items-center justify-between rounded-full bg-white/10 px-4 py-3 font-bold" href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "#"}>
              Grup WhatsApp
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </OrganicCard>
      </div>
    </AppShell>
  );
}
