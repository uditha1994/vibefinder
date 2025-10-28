import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { use, useEffect, useState } from 'react';
import { getUserVotes, saveUserVote } from '../services/firebaseService';
import { searchVideosByMood } from '../services/youtubeService'

const Discover = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    //state management
    const [selectedMood, setSelectedMood] = useState(searchParams.get('mood') || null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        duration: 'any', //sort, medium, long, any
        uploadDate: 'any', //hour, today, week, month, year, any
        sortBy: 'relacance' //relavance, date, rating, viewCount
    });
    const [userVotes, setUserVotes] = useState({});

    useEffect(() => {
        if (user) {
            loadUserVotes();
        }
    }, [user]);

    const loadUserVotes = async () => {
        try {
            const votes = await getUserVotes(user.uid);
            setUserVotes(votes);
        } catch (error) {
            console.error('Error loading user votes: ', error);
        }
    }

    const handleMoodSelect = async (mood) => {
        setSelectedMood(mood.id);
        setSearchParams({ mood: mood.id });
        setLoading(true);
        setError(null);

        try {
            const fetchedVideos = await searchVideosByMood(mood.id, filters);
            setVideos(fetchedVideos);
        } catch (error) {
            setError('failed to fetch videos. try again');
            console.error('Error fetching videos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = async (newFilters) => {
        setFilters(newFilters);

        if (selectedMood) {
            setLoading(true);
            try {
                const fetchedVideos = await searchVideosByMood(selectedMood, newFilters);
                setVideos(fetchedVideos);
            } catch (error) {
                setError('failed to apply filters');
                console.error('Error applying filters:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleVote = async (videoId, voteType) => {
        if (!user) {
            alert('please log in to vote on videos');
            return;
        }

        try {
            await saveUserVote(user.uid, videoId, selectedMood, voteType);
            setUserVotes(prev => ({
                ...prev,
                [`${videoId}_${selectedMood}`]: voteType
            }));
        } catch (error) {
            console.error('error saving vote:', error);
            alert('Failed to save vote')
        }
    }

    const clearSection = () => {
        setSelectedMood(null);
        setVideos([]);
        setSearchParams({});
    }

    return (
        <div className="discover">

        </div>
    )
}

export default Discover;