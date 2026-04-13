export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });

  // Return the authoritative server time in milliseconds
  // This is used by the client to calculate clock drift offset
  return new Response(JSON.stringify({ 
    serverTime: Date.now() 
  }), {
    headers: { 
      'Content-Type': 'application/json',
      // Prevent caching so we always get the live time
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
