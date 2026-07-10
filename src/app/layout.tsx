import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velari | Travel That Understands You",
  description: "Personalized luxury journeys designed around how you feel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
