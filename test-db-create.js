import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwyfkneccltlpbicnwct.supabase.co'
const supabaseKey = 'sb_publishable_bhGj14ez_dXD1fA18FyqHw_HP7YbbRN'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: room, error: err1 } = await supabase.rpc('create_room', { p_name: 'test', p_rounds: 1, p_secret: '11111111-1111-1111-1111-111111111111' })
  console.log('Room:', room, err1)
  
  await supabase.rpc('join_room', { p_code: room.room_code, p_name: 'p2', p_secret: '22222222-2222-2222-2222-222222222222' })
  await supabase.rpc('join_room', { p_code: room.room_code, p_name: 'p3', p_secret: '33333333-3333-3333-3333-333333333333' })
  await supabase.rpc('join_room', { p_code: room.room_code, p_name: 'p4', p_secret: '44444444-4444-4444-4444-444444444444' })
  
  const { error: err2 } = await supabase.rpc('start_round', { p_room_id: room.room_id, p_secret: '11111111-1111-1111-1111-111111111111' })
  console.log('Start round err:', err2)
  
  const { data: role, error: err3 } = await supabase.rpc('get_my_role', { p_room_id: room.room_id, p_secret: '11111111-1111-1111-1111-111111111111' })
  console.log('Role:', role, err3)
}
test()
