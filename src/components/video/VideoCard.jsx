import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/VideoCard.css';

const VideoCard = ({ video, onVote, userVote, selectMood }) => {
    const { user } = useAuth();
    const [isPlaying, setIsPlaying] = useState(false);

    const formatDuration = (duration) => {
        if (!duration) return;

        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatViewCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M views`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K views`;
        }
        return `${count} views`;
    }

    const formatPublishDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    }

    const handleVote = (voteType) => {
        if (!user) {
            alert('please log in to vote on videos');
            return;
        }
        onVote(video.id, voteType);
    }

    const handleThumbnailClick = () => {
        //open video in new tab
        window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
    }

    return (
        <div className="video-card">
            {/* thumbnail */}
            <div className="video-thumbnail" onClick={handleThumbnailClick}>
                <img src={video.thumbnail} alt={video.title} loading='lazy' />
                <div className="play-overlay">
                    <div className="play-button">▶</div>
                </div>
                {video.duration && (
                    <div className="duration-badge">
                        {formatDuration(video.duration)}
                    </div>
                )}
            </div>

            {/* video information */}
            <div className="video-info">
                <h3 className='video-title' title={video.title}>{video.title}</h3>
                <div className="video-channel">
                    {video.channelThumbnail && (
                        <img src={video.channelThumbnail}
                            alt={video.channelTitle}
                            className='channel-avatar' />
                    )}
                    <span className='channel-name'>{video.channelTitle}</span>
                </div>
                <div className="video-stats">
                    <span className="view-count">
                        {formatViewCount(video.viewCount)}
                    </span>
                    <span className='publish-date'>
                        {formatPublishDate(video.publishedAt)}
                    </span>
                </div>
                {video.description && (
                    <p className="video-description">
                        {video.description.length > 100
                            ? `${video.description.substring(0, 100)}...`
                            : video.description
                        }
                    </p>
                )}
            </div>

            {/* voting section */}
            <div className="video-actions">
                <div className="vote-buttons">
                    <button
                        className={`vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
                        onClick={() => handleVote('up')}
                        title='This matches the vibe!!'
                    >
                        👍 <span>Good Vibe</span>
                    </button>
                    <button
                        className={`vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
                        onClick={() => handleVote('down')}
                        title="This doesn't match the vibe"
                    >
                        👎 <span>Wrong Vibe</span>
                    </button>
                </div>
                {video.vibeScore && (
                    <div className="vibe-score">
                        <span>Vibe Score: {video.vibeScore}%</span>
                    </div>
                )}
            </div>

        </div>
    );
};

export default VideoCard;