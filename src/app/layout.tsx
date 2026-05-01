import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Avlak — Türkiye Balıkçılık Ansiklopedisi",
  description: "Türkiye'nin kapsamlı tatlı su ve tuzlu su balıkçılık rehberi. Balık türleri, avlanma teknikleri, yasal limitler ve mevsimsel takvim.",
  keywords: "balıkçılık, balık türleri, avlanma, Türkiye, tatlı su, tuzlu su",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: fishes } = await supabase
    .from("fish")
    .select("id, slug, name_tr, water_type")
    .eq("is_published", true)
    .order("name_tr", { ascending: true });

  const { data: methods } = await supabase
    .from("fishing_methods")
    .select("id, slug, title")
    .eq("is_published", true)
    .order("title", { ascending: true });

  const { data: equipments } = await supabase
    .from("equipments")
    .select("id, slug, title, category_name")
    .eq("is_published", true)
    .order("title", { ascending: true });

  return (
    <html lang="tr" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-inter bg-gray-50 text-gray-900 flex min-h-screen antialiased">
        <Sidebar
          fishes={fishes || []}
          methods={methods || []}
          equipments={equipments || []}
        />
        <div className="flex-1 w-full pt-14 md:pt-0 md:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
