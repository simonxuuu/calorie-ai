import { PrismaClient } from '@prisma/client';
import supabase from '../../supabaseClient'

export async function POST(req) {
  //const { typeReq, data }: { typeReq: string, data: any } = await req.json();
  /*
  switch (typeReq){
    case "login" :
        return handleLogin(data);
    case "register":
        return handleRegister(data);
    default:
        return new Response(null, {
            status: 200,
        });
  }
    */
 

  const prisma = new PrismaClient();
  
  async function main() {
    //change to reference a table in your schema
    const val = await prisma.prismatest.findMany({
      take: 10,
    });
    console.log(val);
  }
  
  main()
    
}
async function handleRegister({name,email} : {name:string,email:string}){
    const {error} = await supabase
    .from('users')
    .insert([
      {
        name: name,
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
async function handleLogin({uid} : {uid:string}) {
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