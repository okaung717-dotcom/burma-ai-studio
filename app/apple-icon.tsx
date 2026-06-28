import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "42px",
          background: "#fffdf8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(145deg, rgba(145,25,35,0.10), rgba(190,149,55,0.22))",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "132px",
            height: "132px",
            borderRadius: "34px",
            border: "3px solid rgba(190,149,55,0.55)",
            background: "rgba(255,255,255,0.72)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: 900,
            letterSpacing: "-10px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#911923", fontSize: "96px" }}>B</span>
          <span style={{ color: "#911923", fontSize: "96px" }}>A</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: "42px",
            right: "33px",
            bottom: "43px",
            height: "14px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #be9537, #f1d180)",
            transform: "rotate(-9deg)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
