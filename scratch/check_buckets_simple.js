const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://riulkmskbnslkptrgxuw.supabase.co'
const supabaseKey = 'sb_publishable__kEcy1Lme2SJluJ9H9C5PA_GrFFRkd8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
  } else {
    console.log('Buckets:', data.map(b => b.name))
  }
}

checkBuckets()
