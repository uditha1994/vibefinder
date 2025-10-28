const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const MOOD_SEARCH_TERM = {
    'chill': ['chill music', 'relaxing', 'lofi', 'ambient', 'calm', 'peaceful'],
    'pump-up': ['workout music', 'energetic', 'motivational', 'pump up', 'high energy', 'intense'],
    'focus': ['study music', 'concentration', 'focus', 'productivity', 'work music', 'deep work'],
    'nostalgic': ['throwback', 'retro', 'vintage', 'classic', 'nostalgia', 'old school'],
    'happy': ['upbeat', 'happy music', 'feel good', 'positive', 'cheerful', 'joyful'],
    'sleepy': ['sleep music', 'bedtime', 'lullaby', 'night time', 'relaxing sleep', 'calm sleep'],
    'creative': ['creative music', 'artistic', 'inspiration', 'creative process', 'art music'],
    'adventurous': ['adventure', 'travel music', 'exploration', 'journey', 'epic music'],
    'romantic': ['romantic music', 'love songs', 'romantic', 'date night', 'love'],
    'mysterious': ['mysterious music', 'dark ambient', 'mystery', 'suspense', 'enigmatic'],
    'energetic': ['dance music', 'electronic', 'upbeat', 'party', 'high tempo'],
    'peaceful': ['meditation music', 'zen', 'tranquil', 'serene', 'mindfulness']
}

const parseDuration = (duration) => {
    // convert duration ISO to seconds
    if (!duration) return 0;

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 60 * 60 + minutes * 60 + seconds;
};

const getDurationFilter = (duration) => {
    switch (duration) {
        case 'short': return 'short'
        case 'medium': return 'medium'
        case 'long': return 'long'
        default: return 'any';
    }
};

const getPulblishedAfter = (updaloadDate) => {
    //get published after date for API
    const now = new Date();
    switch (updaloadDate) {
        case 'hour':
            return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        case 'today':
            return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        case 'week':
            return new Date(now.getTime() - 7 * 24 * 60 * 1000).toISOString();
        case 'month':
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        case 'year':
            return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
        default:
            return null;
    }
}

export const searchVideosByMood = async (mood, filters = {}) => {
    try {
        const searchTerm = MOOD_SEARCH_TERM[mood] || [mood];
        const randomTerm = searchTerm[Math.floor(Math.random() * searchTerm.length)];

        //add duration filter
        if (filters.duration && filters.duration !== 'any') {
            params.append('videoDuration', getDurationFilter(filters.duration));
        }

        //add published after filter
        const publishedAfter = getPulblishedAfter(filters.updaloadDate);
        if (publishedAfter) {
            params.append('publishedAfter', publishedAfter);
        }

        //build search parameters
        const params = new URLSearchParams({
            part: 'snippet',
            q: randomTerm,
            type: 'video',
            maxResults: 24,
            order: filters.sortBy || 'relavance',
            key: YOUTUBE_API_KEY,
            safeSearch: 'moderate',
            videoEmbeddable: true
        });

        const searchResponse = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`);

        if (!searchResponse.ok) {
            throw new Error(`Youtube API Error: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
            return [];
        }

        //get video ids for detailed info
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        //get detaild video information
        const detailsResponse = await fetch(`${YOUTUBE_API_BASE_URL}/videos?
            part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);

        if (!detailsResponse.ok) {
            throw new Error(`Youtube API Error: ${detailsResponse.status}`);
        }

        const detailsData = await detailsResponse.json();

        //get channel information
        const channelIds = [...new Set(detailsData.items.map
            (item => item.snippet.channelId))].join(',');
        const channelResponse = await fetch(`${YOUTUBE_API_BASE_URL}/channels?
                part=snippet&id=${channelIds}&key=${YOUTUBE_API_KEY}`);

        const channelData = channelResponse.ok ?
            await channelResponse.json() : { items: [] };

        const channelMap = {};
        channelData.items?.forEach(channel => {
            channelMap[channel.id] = channel.snippet.thumbnails.default?.url;
        });

        //format video data
        const videos = detailsData.items.map(video => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high?.url
                || video.snippet.thumbnails.medium?.url,
            channelTitle: video.snippet.channelTitle,
            channelId: video.snippet.channelId,
            channelThumbnail: channelMap[video.snippet.channelId],
            publishedAt: video.snippet.publishedAt,
            duration: parseDuration(video.contentDetails.duration),
            viewCount: parseInt(video.statistics.viewCount) || 0,
            likeCount: parseInt(video.statistics.likeCount) || 0,
            commentCount: parseInt(video.statistics.commentCount) || 0,
            mood: mood,
            vibeScore: Math.floor(Math.random() * 30) + 70
        }));
        return videos;

    } catch (error) {
        console.error('error fetching videos:', error);
        throw error;
    }
}

export const getTrendingVideosByMood = async (mood) => {
    try {
        const searchTerms = MOOD_SEARCH_TERM[mood] || [mood];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        const params = new URLSearchParams({
            part: 'snippt',
            chart: 'mostPopular',
            maxResults: 20,
            regionCode: 'LK',
            videoCategoryId: '10',
            key: YOUTUBE_API_KEY
        });

        const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);

        if (!response.ok) {
            throw new Error(`Youtube API Error: ${response.status}`);
        }

        const data = await response.json();

        const filteredVideos = data.items.filter(video => {
            const text = `${video.snippet.title} ${video.snippet.description}`
                .toLowerCase();
            return searchTerms.some(term => text.includes(term.toLowerCase()));
        });

        return filteredVideos;
    } catch (error) {
        console.error('Error fetching trending videos:', error);
        throw error;
    }
}