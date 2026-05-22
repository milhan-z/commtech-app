import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CommTECH Insight 2026 Staff",
    short_name: "CommTECH",
    description: "Rundown, checklist, dan data peserta untuk panitia CommTECH Insight 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#F7F4EE",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
