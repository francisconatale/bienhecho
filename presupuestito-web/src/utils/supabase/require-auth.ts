import { User } from "@supabase/supabase-js";
import { createClient } from "./client";

export async function requireAuth(): Promise<{ supabase: ReturnType<typeof createClient>; user: User }> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error("No authenticated user");
  return { supabase, user };
}
