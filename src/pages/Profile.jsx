import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { getUserProfile, getUserVotes, getUserMoodPreferences, saveUserMoodPreferences } from '../services/firebaseService';
import '../styles/Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [userVotes, setUserVotes] = useState({});
    const [moodPreferences, setMoodPreferences] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const moodCategories = [
        { id: 'chill', name: 'Chill', emoji: '😌' },
        { id: 'pump-up', name: 'Pump Up', emoji: '🔥' },
        { id: 'focus', name: 'Focus', emoji: '🧘' },
        { id: 'nostalgic', name: 'Nostalgic', emoji: '💭' },
        { id: 'happy', name: 'Happy', emoji: '😂' },
        { id: 'sleepy', name: 'Sleepy', emoji: '🌙' },
        { id: 'creative', name: 'Creative', emoji: '🎨' },
        { id: 'adventurous', name: 'Adventure', emoji: '🌍' },
        { id: 'romantic', name: 'Romantic', emoji: '💕' },
        { id: 'mysterious', name: 'Mysterious', emoji: '🔮' },
        { id: 'energetic', name: 'Energetic', emoji: '⚡' },
        { id: 'peaceful', name: 'Peaceful', emoji: '🕊️' }
    ];

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const [profile, votes] = await Promise.all([
                getUserProfile(user.uid),
                getUserVotes(user.uid)
            ]);
            setUserProfile(profile);
            setUserVotes(votes);
            setMoodPreferences(profile?.moodPreferences || {});

        } catch (error) {
            console.error('Error loading profile data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handlePreferenceChange = (moodId, value) => {
        setMoodPreferences(prev => ({
            ...prev,
            [moodId]: value
        }));
    }

    const savePreferences = async () => {
        try {
            setSaving(true);
            await saveUserMoodPreferences(user.uid, moodPreferences);
            alert('Preferences saved');

        } catch (error) {
            console.error('Error saving preference: ', error);
            alert('Failed to save, try again');
        } finally {
            setSaving(false);
        }
    }

    const calculateStats = () => {
        const votes = Object.values(userVotes);
        const upvotes = votes.filter(vote => vote === 'up').length;
        const downvotes = votes.filter(vote => vote === 'down').length;
        const totalVotes = upvotes + downvotes;

        return {
            totalVotes,
            upvotes,
            downvotes,
            positivityRate: totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0
        };
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* profile header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <img src={user.photoURL || '/default-avatar.png'}
                            alt="Profile" />
                    </div>
                    <div className="profile-info">
                        <h1>{user.displayName || 'Guest User'}</h1>
                        <p>{user.email}</p>
                        <div className="member-since">
                            Member Since {userProfile?.createdAt?.toDate()?.toLocaleDateString()
                                || 'Recently'}
                        </div>
                    </div>
                </div>

                {/* statistics */}
                <div className="profile-stats">
                    <h2>Your Vibefinder stats</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalVotes}</div>
                            <div className="stat-label">Total Votes</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.upvotes}</div>
                            <div className="stat-label">Good Vibes</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.downvotes}</div>
                            <div className="stat-label">Wrong Vibes</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.positivityRate}%</div>
                            <div className="stat-label">Positivity Rate</div>
                        </div>
                    </div>
                </div>

                <div className="mood-preferences">
                    <h2>Mood Preferences</h2>
                    <p>Rate now, how much you enjoy each mood category (1-5 Statrs)</p>

                    <div className="preferences-grid">
                        {moodCategories.map((mood) => (
                            <div key={mood.id} className="preference-item">
                                <div className="mood-info">
                                    <span className="mood-emoji">{mood.emoji}</span>
                                    <span className='mood-name'>{mood.name}</span>
                                </div>
                                <div className="rating-starts">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`star ${(moodPreferences[mood.id] || 0) >=
                                                star ? 'active' : ''}`}
                                            onClick={() => handlePreferenceChange(mood.id, star)}
                                        >
                                            ⭐️
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className='save-preferences-btn'
                        onClick={savePreferences}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>

                {/* resent activity */}
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    {Object.keys(userVotes).length > 0 ? (
                        <div className="activity-list">
                            {Object.entries(userVotes).slice(-10).reverse()
                                .map(([key, vote]) => {
                                    const [videoId, mood] = key.split('_');
                                    return (
                                        <div className="activity-item">
                                            <div className="activity-icon">
                                                {vote === 'up' ? '👍' : '👎'}
                                            </div>
                                            <div className="activity-text">
                                                Toy voted <strong>{vote === 'up' ? 'Good Vibe' :
                                                    'Wrong Vibe'}</strong> for a <strong>{mood}</strong>
                                                video
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    ) : (
                        <div className="no-activity">
                            <p>No activity yet, Start discovering videos to see your activity here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;