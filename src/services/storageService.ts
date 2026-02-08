import { supabaseServiceRole } from "./supabaseServer";

export const uploadRender = async (path: string, data: ArrayBuffer, contentType: string) => {
  const supabase = supabaseServiceRole();
  const { error } = await supabase.storage.from("renders").upload(path, data, {
    contentType,
    upsert: true
  });
  if (error) {
    throw new Error(error.message);
  }

  const { data: publicData } = supabase.storage.from("renders").getPublicUrl(path);
  return { storagePath: path, publicUrl: publicData.publicUrl };
};

export const getAssetPublicUrls = async (paths: string[]) => {
  const supabase = supabaseServiceRole();
  return paths.map((path) => ({ path, url: supabase.storage.from("assets").getPublicUrl(path).data.publicUrl }));
};
