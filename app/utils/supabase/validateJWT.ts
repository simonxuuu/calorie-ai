import { User } from "@supabase/supabase-js";
import supabase from "@/app/supabaseClient";

interface validatedJWT {
    user : User | null,
    response : string,
    status : number
}

export default async function validateJWT(jwt: string): Promise<validatedJWT> {
  
  // Validate JWT w/ supabase
  const { data: { user }, error: authError} = await supabase.auth.getUser(jwt);
  if (authError || !user) {
    return {
        user : null,
        response : "Auth Error",
        status : 401
    };
  }

  return {
    user,
    response : "Success",
    status: 200
  };
};