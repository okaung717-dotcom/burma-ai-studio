import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fffdf8",
          borderRadius: "40px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 25% 18%, rgba(190,149,55,0.28), transparent 45%), radial-gradient(circle at 82% 86%, rgba(145,25,35,0.18), transparent 46%)",
          }}
        />
        <div
          style={{
            width: "132px",
            height: "132px",
            borderRadius: "32px",
            border: "3px solid rgba(190,149,55,0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            background: "linear-gradient(145deg, #ffffff 0%, #fff5e2 100%)",
            boxShadow: "0 22px 45px rgba(145,25,35,0.20)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "88px",
              height: "18px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #be9537 0%, #f1d180 100%)",
              transform: "translate(18px, 44px) rotate(-18deg)",
            }}
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
            <span style={{ color: "#911923", fontSize: "62px", fontWeight: 900, letterSpacing: "-5px" }}>B</span>
            <span style={{ color: "#911923", fontSize: "62px", fontWeight: 900, letterSpacing: "-5px" }}>A</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 180,
      height: 180,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
