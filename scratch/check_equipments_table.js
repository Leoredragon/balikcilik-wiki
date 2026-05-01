const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://riulkmskbnslkptrgxuw.supabase.co'
const supabaseKey = 'sb_publishable__kEcy1Lme2SJluJ9H9C5PA_GrFFRkd8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
  const { error } = await supabase.from('equipments').select('*').limit(1)
  if (error) {
    console.log('Table "equipments" does not exist or error:', error.message)
  } else {
    console.log('Table "equipments" exists.')
  }
}

checkTable()
