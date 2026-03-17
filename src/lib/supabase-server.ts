import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Create a Supabase client for use in Server Components, API Routes, and Server Actions.
 * Reads/writes auth tokens from Next.js cookies.
 * Returns null if Supabase is not configured.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll can fail in Server Components (read-only context).
          // This is expected — auth refresh will retry on next request.
        }
      },
    },
  });
}

/**
 * Create a Supabase client for use in middleware.
 * Accepts the request and a response setter for cookie management.
 */
export function createSupabaseMiddlewareClient(
  request: Request,
  response: Response
) {
  if (!isSupabaseConfigured) return null;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookies(request.headers.get('cookie') || '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookie = serializeCookie(name, value, options);
          response.headers.append('set-cookie', cookie);
        });
      },
    },
  });
}

function parseCookies(cookieHeader: string): Array<{ name: string; value: string }> {
  if (!cookieHeader) return [];
  return cookieHeader.split(';').map(pair => {
    const [name, ...rest] = pair.trim().split('=');
    return { name, value: rest.join('=') };
  });
}

function serializeCookie(
  name: string,
  value: string,
  options?: Record<string, unknown>
): string {
  let cookie = `${name}=${value}`;
  if (options?.path) cookie += `; Path=${options.path}`;
  if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options?.domain) cookie += `; Domain=${options.domain}`;
  if (options?.httpOnly) cookie += '; HttpOnly';
  if (options?.secure) cookie += '; Secure';
  if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;
  return cookie;
}
