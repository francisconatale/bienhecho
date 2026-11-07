import { User } from "@supabase/supabase-js";
import { createClient } from "./server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
});

export async function requireAuth(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; user: User }> {
  const { supabase, user } = await getAuthUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return { supabase, user };
}
