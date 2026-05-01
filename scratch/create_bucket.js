const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://riulkmskbnslkptrgxuw.supabase.co'
const supabaseKey = 'sb_publishable__kEcy1Lme2SJluJ9H9C5PA_GrFFRkd8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('fish-images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 5242880 // 5MB
  })
  if (error) {
    console.error('Error creating bucket:', error)
  } else {
    console.log('Bucket created:', data)
  }
}

createBucket()
