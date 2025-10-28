import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { use, useState } from 'react';

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

    const loadUserVotes = async () => {
        try {
            const votes = 
        } catch (error) {
            console.error('Error loading user votes: ', error);
        }
    }
}

export default Discover;