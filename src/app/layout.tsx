import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reel Flux — 3D WebGPU Photo Reel",
  description:
    "An interactive, responsive 3D WebGPU photo reel slider with dynamic wave deformation and smooth inertia scrolling by Saurow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
