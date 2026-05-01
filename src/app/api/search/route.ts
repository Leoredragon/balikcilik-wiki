import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) return NextResponse.json([]);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Balıklarda Ara
  const { data: fishes } = await supabase
    .from('fish')
    .select('id, name_tr, slug, cover_image_url')
    .ilike('name_tr', `%${query}%`)
    .eq('is_published', true)
    .limit(5);

  // Yöntemlerde Ara
  const { data: methods } = await supabase
    .from('fishing_methods')
    .select('id, title, slug')
    .ilike('title', `%${query}%`)
    .eq('is_published', true)
    .limit(5);

  return NextResponse.json({
    fishes: fishes || [],
    methods: methods || []
  });
}
