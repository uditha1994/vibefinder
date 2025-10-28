import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOODS } from "../../utils/constants";
import '../../styles/MoodSelector.css'

const MoodSelector = ({ onModeSelect, selectedMood = null }) => {

    const [hoverMood, setHoverMoode] = useState(null);
    // const navigate = useNavigate();

    const handleMoodClick = (mood) => {
        if (onModeSelect) {
            onModeSelect(mood);
        } else {
            // navigate(`/discover?mood=${mood.id}`);
        }
    };

    return (
        <div className="mood-selector">
            <div className="mood-grid">
                {MOODS.map((mood) => (
                    <div
                        key={mood.id}
                        className={`mood-card ${selectedMood === mood.id ? 'selected' : ''}`}
                        onClick={() => handleMoodClick(mood)}
                    >
                        <div className="mood-emoji">{mood.icon}</div>
                        <div className="mood-name">{mood.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default MoodSelector;