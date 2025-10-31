import VideoCard from './VideoCard';
import '../../styles/VideoGrid.css';

const VideoGrid = ({ videos, onVote, userVote, selectMood }) => {
    if (!videos || videos.length === 0) {
        return (
            <div className="no-videos">
                <p>No videos found for this mood</p>
            </div>
        );
    }

    return (
        <div className="video-grid">
            <div className="grid-header">
                <h2>Videos matching your vibe</h2>
                <span className='video-count'>{videos.length} videos found</span>
            </div>
            <div className="videos-container">
                {videos.map((video) => {
                    <VideoCard
                        key={video.id}
                        video={video}
                        onVote={onVote}
                        userVote={userVote[`${video.id}_${selectMood}`]}
                        selectMood={selectMood}
                    />
                })}
            </div>
        </div>
    )
}

export default VideoGrid;