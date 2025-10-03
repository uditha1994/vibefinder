//YouTube API Configurations
export const YOUTUBE_CONFIG = {
    API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
    MAX_RESULTS: 20,
    REGION_CODE: 'LK',
    SAFE_SEARCH: 'moderator'
}

//Firebase Configurations
const FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

//Mood categories and metadata
export const MOODS = {
    chill: {
        id: 'chill',
        name: 'Chill',
        icon: '🌙',
        description: 'Relaxing and peaceful vibes',
        gradient: 'var(--mood-chill)',
        keywords: ['chill', 'relax', 'calm', 'peaceful', 'ambient', 'lofi', 'meditation'],
        categories: ['Music', 'Nature', 'ASMR']
    },
    pump: {
        id: 'pump',
        name: 'Pump Up',
        icon: '🔥',
        description: 'High energy and motivational',
        gradient: 'var(--mood-pump)',
        keywords: ['workout', 'motivation', 'energy', 'pump', 'intense', 'fitness', 'hype'],
        categories: ['Music', 'Sports', 'Fitness']
    },
    focus: {
        id: 'focus',
        name: 'Focus',
        icon: '🎯',
        description: 'Concentration and productivity',
        gradient: 'var(--mood-focus)',
        keywords: ['focus', 'study', 'concentration', 'productivity', 'work', 'instrumental'],
        categories: ['Music', 'Education', 'Productivity']
    },
    nostalgic: {
        id: 'nostalgic',
        name: 'Nostalgic',
        icon: '✨',
        description: 'Memories and throwback feels',
        gradient: 'var(--mood-nostalgic)',
        keywords: ['nostalgic', 'throwback', 'memories', 'vintage', 'classic', 'retro'],
        categories: ['Music', 'Entertainment', 'Gaming']
    },
    creative: {
        id: 'creative',
        name: 'Creative',
        icon: '🎨',
        description: 'Inspiration and artistic flow',
        gradient: 'var(--mood-creative)',
        keywords: ['creative', 'inspiration', 'art', 'design', 'innovative', 'artistic'],
        categories: ['Music', 'Art', 'Design', 'DIY']
    },
    energetic: {
        id: 'energetic',
        name: 'Energetic',
        icon: '⚡',
        description: 'Upbeat and lively content',
        gradient: 'var(--mood-energetic)',
        keywords: ['energetic', 'upbeat', 'lively', 'dance', 'party', 'fun', 'exciting'],
        categories: ['Music', 'Dance', 'Entertainment']
    }
};

//Error messages
export const ERROR_MESSAGES = {
    NETWORK: 'Network error, Please check your connection',
    API_LIMIT: 'API limit reached. please try again later',
    VIDEO_NOT_FOUND: 'Video not found or unavailable',
    GENERIC: 'Something went wrong, please try again'
};

//Success Messages
export const SUCCESS_MESSAGES = {
    ADDED_TO_FAVORITES: 'Added to favorites!!',
    RATING_SAVED: 'Your rating has been saved!',
    REMOVED_FROM_FAVORITES: 'Removed from favorites!'
};

export const ROUTES = {
    HOME: '/',
    MOOD: '/mood/:moodId',
    VIDEO: '/video/:videoId',
    FAVORITES: '/favorites',
    HISTORY: '/history'
};

//Local storage keys
export const STORAGE_KEYS = {
    THEME: 'vibefinder_theme',
    FAVORITES: 'vibefinder_favorites',
    HISTORY: 'vibefinder_history',
    USER_PREFERENCES: 'vibefinder_preferences'
};

//API end point
export const API_ENDPOINTS = {
    SEARCH: '/search',
    VIDEO: '/video',
    CHANNELS: '/channels'
};

//Animation Duration in milliseconds
export const ANIMATION_DURATION = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
}