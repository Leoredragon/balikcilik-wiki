import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Balıkçılık Wiki",
  description: "Türkiye'nin kapsamlı balıkçılık rehberi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Balıkları Çekiyoruz
  const { data: fishes } = await supabase
    .from("fish")
    .select("id, slug, name_tr, water_type")
    .eq("is_published", true)
    .order("name_tr", { ascending: true });

  // 2. Balıkçılık Çeşitlerini (Yöntemleri) Çekiyoruz
  const { data: methods } = await supabase
    .from("fishing_methods")
    .select("id, slug, title")
    .eq("is_published", true)
    .order("title", { ascending: true });

  // 3. Ekipmanları Çekiyoruz
  const { data: equipments } = await supabase
    .from("equipments")
    .select("id, slug, title, category_name")
    .eq("is_published", true)
    .order("title", { ascending: true });

  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex min-h-screen antialiased`}>
        {/* Tüm verileri Sidebar'a gönderiyoruz */}
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
