import { supabase } from '@/lib/supabase';

export const saveWhiteboard = async (
  userId: string,
  whiteboardId: string | null,
  name: string,
  data: any
) => {
  if (whiteboardId) {
    const { error } = await supabase
      .from('whiteboards')
      .update({ name, data, updated_at: new Date() })
      .eq('id', whiteboardId)
      .eq('user_id', userId);

    if (error) throw error;
    return whiteboardId;
  } else {
    const { data: newBoard, error } = await supabase
      .from('whiteboards')
      .insert([{ user_id: userId, name, data }])
      .select('id')
      .single();

    if (error) throw error;
    return newBoard.id;
  }
};

export const loadWhiteboard = async (userId: string, whiteboardId: string) => {
  const { data, error } = await supabase
    .from('whiteboards')
    .select('*')
    .eq('id', whiteboardId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};
