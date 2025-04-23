
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface DronShot {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  storage_path: string;
  created_at: string;
}

export const useDronShots = () => {
  return useQuery({
    queryKey: ['dron-shots'],
    queryFn: async (): Promise<DronShot[]> => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching dron shots:", error);
          throw error;
        }

        return data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          file_path: item.file_path,
          storage_path: item.storage_path,
          created_at: item.created_at
        }));
      } catch (err) {
        console.error("Error in dron shots query:", err);
        return [];
      }
    }
  });
};
