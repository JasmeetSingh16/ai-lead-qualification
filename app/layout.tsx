import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/jaseir-kit.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { agentMetadata } from "../lib/agent-metadata";
import type { SiteZone } from "../lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = agentMetadata("lead-qualification");

const zone: SiteZone = { kind: "agent", slug: "lead-qualification" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader zone={zone} />
        {children}
        <SiteFooter
          zone={zone}
          cta={{
            title: "Want every new lead scored automatically?",
            text: "We connect this agent to your forms, inbox and CRM so each lead arrives scored, explained and with a reply drafted — using your own qualification rules.",
          }}
        />
      </body>
    </html>
  );
}
