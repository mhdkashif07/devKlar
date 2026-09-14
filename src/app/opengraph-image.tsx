import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0a0b0e",
          backgroundImage:
            "radial-gradient(900px 500px at 20% 0%, rgba(109,92,255,0.35), transparent 60%)",
          color: "#eef0f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundImage: "linear-gradient(135deg,#8b7bff,#5b47f5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: "white",
            }}
          >
            D
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 700 }}>{SITE.name}</span>
            <span style={{ fontSize: 18, color: "#b9bfce" }}>
              a {SITE.parent} project
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 960,
            }}
          >
            Describe your app. Get the right stack.
          </span>
          <span style={{ marginTop: 24, fontSize: 28, color: "#b9bfce", maxWidth: 900 }}>
            Verified · region-aware · free-first
          </span>
        </div>
      </div>
    ),
    size,
  );
}
