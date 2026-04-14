export const config = { runtime: 'edge' };

export default function handler(req: Request) {
  return new Response(JSON.stringify({ 
    message: 'Welcome to SIMU API', 
    version: '1.0.0',
    docs: 'https://docs.simu.network/api'
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
