import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import supabase from '../../supabaseClient';

interface RequestBody {
  requestType: 'login' | 'register';
  jwt: string;
}

interface UserData {
  id: string;
  email?: string;
}

export async function POST(req: Request) {
  try {
    const { requestType, jwt }: RequestBody = await req.json();
    
    // Validate input
    if (!requestType || !jwt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle requests
    switch (requestType) {
      case 'login':
        return handleLogin({ id: user.id });
      case 'register':
        return handleRegister({ id: user.id, email: user.email });
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleRegister({ id, email }: UserData) {
  const { error } = await supabase
    .from('users')
    .insert([{ name: id, email }]);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: 'User registered successfully' },
    { status: 200 }
  );
}

async function handleLogin({ id }: UserData) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { user: data },
    { status: 200 }
  );
}