import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    increment,
    updateDoc,
    arrayUnion,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Save user vote for a video
export const saveUserVote = async (userId, videoId, mood, voteType) => {
    try {
        const voteId = `${userId}_${videoId}_${mood}`;
        const voteRef = doc(db, 'votes', voteId);

        await setDoc(voteRef, {
            userId,
            videoId,
            mood,
            voteType, // 'up' or 'down'
            timestamp: serverTimestamp()
        }, { merge: true });

        // Update video statistics
        const videoStatsRef = doc(db, 'videoStats', `${videoId}_${mood}`);
        const videoStatsDoc = await getDoc(videoStatsRef);

        if (videoStatsDoc.exists()) {
            const currentData = videoStatsDoc.data();
            const updates = {};

            // Remove previous vote if exists
            if (currentData.voters && currentData.voters[userId]) {
                const previousVote = currentData.voters[userId];
                if (previousVote === 'up') {
                    updates.upvotes = increment(-1);
                } else {
                    updates.downvotes = increment(-1);
                }
            }

            // Add new vote
            if (voteType === 'up') {
                updates.upvotes = increment(1);
            } else {
                updates.downvotes = increment(1);
            }

            updates[`voters.${userId}`] = voteType;
            updates.lastUpdated = serverTimestamp();

            await updateDoc(videoStatsRef, updates);
        } else {
            // Create new video stats document
            await setDoc(videoStatsRef, {
                videoId,
                mood,
                upvotes: voteType === 'up' ? 1 : 0,
                downvotes: voteType === 'down' ? 1 : 0,
                voters: {
                    [userId]: voteType
                },
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error saving vote:', error);
        throw error;
    }
};

// Get user's votes
export const getUserVotes = async (userId) => {
    try {
        const votesQuery = query(
            collection(db, 'votes'),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(votesQuery);
        const votes = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            votes[`${data.videoId}_${data.mood}`] = data.voteType;
        });

        return votes;
    } catch (error) {
        console.error('Error getting user votes:', error);
        return {};
    }
};

// Get video statistics for a specific mood
export const getVideoStats = async (videoId, mood) => {
    try {
        const statsRef = doc(db, 'videoStats', `${videoId}_${mood}`);
        const statsDoc = await getDoc(statsRef);

        if (statsDoc.exists()) {
            return statsDoc.data();
        }

        return {
            upvotes: 0,
            downvotes: 0,
            voters: {}
        };
    } catch (error) {
        console.error('Error getting video stats:', error);
        return {
            upvotes: 0,
            downvotes: 0,
            voters: {}
        };
    }
};

// Save user's mood preferences
export const saveUserMoodPreferences = async (userId, preferences) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            moodPreferences: preferences,
            lastUpdated: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving mood preferences:', error);
        throw error;
    }
};

// Get user's mood preferences
export const getUserMoodPreferences = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data().moodPreferences || {};
        }

        return {};
    } catch (error) {
        console.error('Error getting mood preferences:', error);
        return {};
    }
};

// Save user's viewing history
export const saveViewingHistory = async (userId, videoId, mood) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            viewingHistory: arrayUnion({
                videoId,
                mood,
                timestamp: serverTimestamp()
            }),
            lastActive: serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving viewing history:', error);
    }
};

// Get top-rated videos for a mood
export const getTopRatedVideos = async (mood, limitCount = 20) => {
    try {
        const statsQuery = query(
            collection(db, 'videoStats'),
            where('mood', '==', mood),
            orderBy('upvotes', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(statsQuery);
        const topVideos = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const vibeScore = data.upvotes + data.downvotes > 0
                ? Math.round((data.upvotes / (data.upvotes + data.downvotes)) * 100)
                : 0;

            topVideos.push({
                videoId: data.videoId,
                mood: data.mood,
                upvotes: data.upvotes,
                downvotes: data.downvotes,
                vibeScore
            });
        });

        return topVideos;
    } catch (error) {
        console.error('Error getting top rated videos:', error);
        return [];
    }
};

// Create or update user profile
export const createUserProfile = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data();
        }

        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};