import { supabase } from '../lib/supabase';

export interface Game {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Retry failed');
}

export async function getGames(): Promise<Game[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch games: ${error.message}`);
    return data as Game[];
  });
}

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(`Failed to fetch posts: ${error.message}`);
    return data as CommunityPost[];
  });
}
