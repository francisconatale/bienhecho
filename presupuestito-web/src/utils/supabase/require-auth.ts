import { User } from "@supabase/supabase-js";
import { createClient } from "./server";
import { redirect } from "next/navigation";

export async function requireAuth(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; user: User }> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) {
    redirect("/login");
  }
  
  return { supabase, user };
}
