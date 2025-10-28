import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MoodSelector from "../mood/MoodSelector";
import '../../styles/Home.css';

const Home = () => {
    // const {user} = useAuth();

    return (
        <div className="home">
            {/* Hero section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover Videos by
                        <span className="gradient-text">Your Vibe !!!</span>
                    </h1>
                    <p className="hero-description">
                        Skip the traditional search. find videos that match Your
                        current mood and vibe. From chill vibes to pump-up sessions,
                        descover content with how you feel...
                    </p>

                    {/* {user ? (
                        <Link to="/discover" className="cta-button">
                            Start Discovering
                        </Link>
                    ) : (
                        <div className="cta-buttons">
                            <Link to="/discover" className="cta-button primary">
                                Try It Now</Link>
                            <Link to="/login" className="cta-button secondary">
                                Sign Up Free</Link>
                        </div>
                    )} */}
                </div>

                <div className="hero-visual">
                    <div className="floating-moods">
                        <div className="mood-bubble">😎 Chill</div>
                        <div className="mood-bubble">🧘 Focus</div>
                        <div className="mood-bubble">🔥 Pump Up</div>
                        <div className="mood-bubble">😀 Happy</div>
                        <div className="mood-bubble">🥱 Sleepy</div>
                        <div className="mood-bubble">👨‍🦰 Nostalgic</div>
                    </div>
                </div>
            </section>

            {/* Quick Mood Selection section */}
            <section className="quick-moods">
                <h2>How about your feeling today?</h2>
                <MoodSelector />
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Vibe Finder</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔭</div>
                        <h3>Mood Based Discovery</h3>
                        <p>Find videos that match your current energy and emotional
                            state, not just keyword
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Community Driven</h3>
                        <p>Videos are tagged and rated by real users who understand
                            the vibe you're looking for.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Smart Recommendations</h3>
                        <p>Our algorithm learns from community votes to suggest better
                            matches over time.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Vibes</h3>
                        <p>No more endless scrolling. Get the perfect video for your
                            mood in seconds.</p>
                    </div>
                </div>
            </section>

            {/* stats section */}
            <section className="stats">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Curated Videos</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">10+</div>
                        <div className="stat-label">Mood Categories</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">2M+</div>
                        <div className="stat-label">Vibe Matches</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;