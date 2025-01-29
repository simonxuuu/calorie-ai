import { PrismaClient } from '@prisma/client';
import supabase from '../../supabaseClient'

export async function POST(req) {
  const { requestType, jwt }: { requestType: string, jwt: any } = await req.json();

  // Validate JWT 
  const {data: { user }} = await supabase.auth.getUser(jwt);
  if (!user) return new Response(null, {status: 500});


  switch (requestType){
    case "login" :
        return handleLogin(user);
    case "register":
        return handleRegister(user);
    default:
        return new Response("Request Type not specified.", {
            status: 500,
        });
  }
    
  
  
  console.log("user:", user);

  const prisma = new PrismaClient();
  
  async function main() {
    //change to reference a table in your schema
    const val = await prisma.prismatest.findMany({
      take: 10,
    });
    console.log(val);
  }
  
  main()
  return new Response(null, {
    status: 200,
});  
}
async function handleRegister({id, email} : {id:string; email?:string}){
    const {error} = await supabase
    .from('users')
    .insert([
      {
        name: id,
        email: email,
      }
    ]);

    if (error) {
        console.error(error);
        return new Response(JSON.stringify({error}), {
            status: 500,
        });
    }
    
    console.log('Inserted user:', email);
    return new Response(null, {
    status: 200,
    });
}
async function handleLogin({id} : {id:string;}) {
    /*
    const {error} = await supabase
    .from('users')
    .select('*')  // Select all columns
    .eq('id', userId)  // Filter by 'id' column and specific userId
    .single();


    if (error) {
        console.error(error);
        return new Response(JSON.stringify({error}), {
            status: 500,
        });
    }
    
    console.log('Inserted user:', email);
    return new Response(null, {
    status: 200,
    });
    */
}