import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY is not set');
    }

    const { query, subject, maxResults = 10 } = await req.json();

    // Build search query - add educational context
    let searchQuery = query || '';
    if (subject) {
      searchQuery = `${subject} ${searchQuery} class 11 12 education tutorial`.trim();
    }

    if (!searchQuery) {
      searchQuery = 'physics chemistry mathematics class 11 12 education';
    }

    console.log('Searching YouTube for:', searchQuery);

    // Search for videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', searchQuery);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', String(maxResults));
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('safeSearch', 'strict');

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (searchData.error) {
      console.error('YouTube API Error:', searchData.error);
      throw new Error(searchData.error.message || 'YouTube API error');
    }

    if (!searchData.items || searchData.items.length === 0) {
      return new Response(JSON.stringify({ videos: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get video IDs for statistics
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // Fetch video statistics
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    statsUrl.searchParams.set('part', 'statistics,contentDetails');
    statsUrl.searchParams.set('id', videoIds);
    statsUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const statsResponse = await fetch(statsUrl.toString());
    const statsData = await statsResponse.json();

    // Create a map of video stats
    const statsMap = new Map();
    if (statsData.items) {
      statsData.items.forEach((item: any) => {
        statsMap.set(item.id, {
          viewCount: parseInt(item.statistics?.viewCount || '0'),
          likeCount: parseInt(item.statistics?.likeCount || '0'),
          duration: item.contentDetails?.duration || 'PT0M0S',
        });
      });
    }

    // Format duration from ISO 8601 to readable format
    const formatDuration = (isoDuration: string): string => {
      const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return '0:00';
      
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Combine search results with statistics
    const videos = searchData.items.map((item: any) => {
      const stats = statsMap.get(item.id.videoId) || { viewCount: 0, likeCount: 0, duration: 'PT0M0S' };
      
      return {
        id: item.id.videoId,
        video_id: item.id.videoId,
        title: item.snippet.title,
        channel_title: item.snippet.channelTitle,
        channel_id: item.snippet.channelId,
        thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        description: item.snippet.description,
        published_at: item.snippet.publishedAt,
        view_count: stats.viewCount,
        like_count: stats.likeCount,
        duration: formatDuration(stats.duration),
        subject: subject || 'General',
      };
    });

    console.log(`Found ${videos.length} videos`);

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in youtube-search function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
