import { ImageResponse } from "next/og";
import { person } from "@/data/profile";

export const alt = `${person.name}, SAP HANA and BI/BW developer, M.Sc. Web Engineering student`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          background: "#ffffff", padding: 80, borderLeft: "20px solid #c2185b", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#6b6072" }}>Portfolio</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 600, color: "#241a2b", letterSpacing: -2, lineHeight: 1.05 }}>
            {person.name}
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#c2185b", marginTop: 28 }}>
            SAP HANA and BI/BW developer, now in Web Engineering
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6b6072" }}>
          Deloitte, Accenture, TU Chemnitz
        </div>
      </div>
    ),
    size,
  );
}
