import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from '../utils/constants.js';
import {
    getFirestore, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, getDocs, getDoc,
    query, where, orderBy, limit, increment, serverTimestamp, arrayUnion
} from "firebase/firestore";

//Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Firebase service class for handling all database operations
 */
class FirebaseService {
    constructor() {
        this.db = db;
        this.collections = {
            videos: 'videos',
            ratings: 'ratings',
            moods: 'moods',
            analytics: 'analytics'
        };
    }

    /**
     * 
     * @param {string} videoId - Youtube video id
     * @param {string} moodId - Mood category ID
     * @param {number} rating - Rating value (-1,0,1)
     * @param {string} userId - user identifier
     * @returns {boolean} success status
     */
    async saveVideoRating(videoId, moodId, rating, userId) {
        try {
            const ratingData = {
                videoId,
                moodId,
                rating,
                userId,
                timestamp: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            //check if rating already exists
            const ratingRef = collection(this.db, this.collections.ratings);
            const q = query(ratingRef,
                where('videoId', '==', videoId),
                where('moodId', '==', moodId),
                where('userId', '==', userId)
            );

            const existingRating = await getDoc(q);

            if (!existingRating.empty) {
                //update existing rating
                const ratingDoc = existingRating.docs[0];
                await updateDoc(ratingDoc.ref, {
                    rating,
                    updatedAt: serverTimestamp()
                });

                //update video mood score
                await this.updateVideoMoodScore(videoId, moodId);

            } else {
                // create new rating
                await addDoc(ratingRef, ratingData);
            }

            return true;

        } catch (error) {
            console.error('Error saving video rating: ', error);
            return false;
        }
    }

    /**
     * 
     * @param {string} videoId - Youtube video id
     * @param {string} moodId - mood category id
     * @returns {Object} Rating statistics
     */
    async getVideoRatings(videoId, moodId) {
        try {
            const ratingRef = collection(this.db, this.collections.ratings);
            const q = query(
                ratingRef,
                where('videoId', '==', videoId),
                where('moodId', '==', moodId)
            );

            const snapshot = await getDocs(q);
            const rating = snapshot.docs.map(doc => doc.data());

            const upvotes = rating.filter(r => r.rating === 1).length;
            const downvotes = rating.filter(r => r.rating === -1).length;
            const total = rating.length;
            const score = total > 0 ? (upvotes - downvotes) / total : 0;

            return { upvotes, downvotes, total, score };

        } catch (error) {
            console.error('Error in getting video ratings:', error);
            return { upvotes: 0, downvotes: 0, total: 0, score: 0 };
        }
    }

    /**
     * 
     * @param {string} videoId - Youtube video id
     * @param {string} moodId - mood category id
     * @returns {Promise<void>}
     */
    async updateVideoMoodScore(videoId, moodId) {
        try {
            const ratings = await this.getVideoRatings(videoId, moodId);

            const videoRef = doc(this.db, this.collections.videos, `${videoId}_${moodId}`);
            await updateDoc(videoRef, {
                [`moodScores.${moodId}`]: ratings.score,
                [`ratingCounts,${moodId}`]: ratings.total,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error in updating video mood score:', error);
        }
    }

    /**
     *  
     * @param {Object} videoData - video information from Youtube API
     * @param {string} moodId mood category
     * @returns {boolean} success status
     */
    async saveVideoMetadata(videoData, moodId) {
        try {
            const videoRef = doc(this.db, this.collections.videos, `${videoData.id}_${moodId}`)

            const metadata = {
                id: videoData.id,
                title: videoData.title,
                description: videoData.description,
                channelTitle: videoData.channelTitle,
                publishedAt: videoData.publishedAt,
                thumbnail: videoData.thumbnail,
                duration: videoData.contentDetails?.duration,
                viewCount: videoData.statistics?.viewCount,
                likeCount: videoData.statistics.likeCount,
                moodId,
                moodScore: { [moodId]: 0 },
                ratingCounts: { [moodId]: 0 },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await updateDoc(videoRef, metadata, { merge: true });

            return true;

        } catch (error) {
            console.error('Error saving video metadata:', error);
            return false;
        }
    }

    /**
     * Get top-rated videos for a mood           
     * @param {string} moodId - mood category id
     * @param {number} limitCount - number of videos to return
     * @returns {Array} Array of video data
     */
    async getTopVideosForMood(moodId, limitCount = 20) {
        try {
            const videoRef = collection(this.db, this.collections, videos);
            const q = query(videoRef,
                where('moodId', '==', moodId),
                orderBy(`moodScores.${moodId}`, desc),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        } catch (error) {
            console.error('Error getting top videos for mood:', error);
            return [];
        }
    }

    /**
     * Save user analytics data
     * @param {string} userId - user identifier
     * @param {Object} analyticsData - analytics information
     * @returns {boolean} - success status
     */
    async saveAnalytics(userId, analyticsData) {
        try {
            const analyticsRef = collection(this.db, this.collections.analytics);
            await addDoc(analyticsRef, {
                userId,
                ...analyticsData,
                timestamp: serverTimestamp()
            });
            return true;

        } catch (error) {
            console.error('Error saving analytics:', error);
            return false
        }
    }

    /**
     * Get user's mood preferences
     * @param {string} userId - user identification
     * @returns {Object} user preferences
     */
    async getUserPreferences(userId) {
        try {
            const ratingRef = collection(this.db, this.collections.ratings);
            const q = query(ratingRef, where('userId', '==', userId));
            const snapshot = await getDocs(q);
            const ratings = snapshot.docs.map(doc => doc.data());

            //calculate mood preferences based on user rating
            const moodPreferences = {};
            ratings.forEach(rating => {
                if (!moodPreferences[rating.moodId]) {
                    moodPreferences[rating.moodId] = { total: 0, active: 0 };
                }

                moodPreferences[rating.moodId].total++
                if (rating.rating > 0) {
                    moodPreferences[rating.moodId].positive++
                }
            });

            Object.keys(moodPreferences).forEach(moodId => {
                const pref = moodPreferences[moodId];
                pref.score = pref.total > 0 ? pref.positive / pref.total : 0;
            });

            return moodPreferences;

        } catch (error) {
            console.error('Error getting user preferences:', error);
            return {};
        }
    }

}

//save user vote for a video
export const saveUserVote = async (userId, videoId, mood, voteType) => {
    try {
        const voteId = `${userId}_${videoId}_${mood}`;
        const voteRef = doc(db, 'votes', voteId);

        await setDoc(voteRef, {
            userId,
            videoId,
            mood,
            voteType,
            timestamp: serverTimestamp()
        }, { merge: true });

        //update video statistics
        const videoStatsRef = doc(db, 'videoStats', `${videoId}_${mood}`);
        const videoStatsDoc = await getDoc(videoStatsRef);

        if (videoStatsDoc.exists()) {

        }
    } catch (error) {

    }
}

export const getUserVotes = async (userId) => {

}

//Export singleton instance
export default new FirebaseService();