import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const supabaseServer = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        }
      }
    }
  );
};

export const supabaseServiceRole = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {
          return undefined;
        },
        remove() {
          return undefined;
        }
      }
    }
  );
};
