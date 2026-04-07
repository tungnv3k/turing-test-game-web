import dynamic from "next/dynamic";

// Phaser is browser-only — must never run on the server
const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "18px",
        fontFamily: "monospace",
      }}
    >
      Loading...
    </div>
  ),
});

export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "fixed",
        inset: 0,
      }}
    >
      <GameCanvas />
    </main>
  );
}
