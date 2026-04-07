import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turing Test Game",
  description: "A multiplayer social deduction game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <head>
        {/* Required for correct mobile scaling and safe area support */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          margin: 0,
          background: "#000",
        }}
      >
        {children}
      </body>
    </html>
  );
}
