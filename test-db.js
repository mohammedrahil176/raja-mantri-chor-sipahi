import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwyfkneccltlpbicnwct.supabase.co'
const supabaseKey = 'sb_publishable_bhGj14ez_dXD1fA18FyqHw_HP7YbbRN'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.rpc('get_my_role', {
      p_room_id: '807f0562-59f8-4459-b7f3-212127cec02d',
      p_secret: '7c75bf03-5537-478c-b6be-5ab06f3f690a'
  });
  console.log('Role:', data, error)
}
test()
