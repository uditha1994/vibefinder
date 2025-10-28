import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOODS } from "../../utils/constants";
import '../../styles/MoodSelector.css'

const MoodSelector = () => {

    const [hoverMood, setHoverMoode] = useState(null);
    // const navigate = useNavigate();

    return (
        <div className="mood-selector">
            <div className="mood-grid">
                {MOODS.map((mood) => (
                    <div
                        key={mood.id}
                        className={`mood-card`}
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