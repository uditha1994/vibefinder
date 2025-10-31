import { useState } from 'react';
import {
    signInWithEmailAndPassword, signInWithPopup,
    GoogleAuthProvider, createUserWithEmailAndPassword
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { createUserProfile } from '../services/firebaseService';
import '../styles/Login.css';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');

            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            //create use profile in firebase
            await createUserProfile(result.user.uid, {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                provider: 'google'
            });
            navigate('/discover');

        } catch (error) {
            setError('Failed to sign in with google, please try again');
            console.error('Google sign in error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();

        if (isSignUp && password !== confirmPassword) {
            setError('Password do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            setError('');

            let result;
            if (isSignUp) {
                result = await createUserWithEmailAndPassword(auth, email, password);
                await createUserProfile(result.user.uid, {
                    email: result.user.email,
                    displayName: email.split('@')[0],
                    provider: 'email'
                });
            } else {
                result = await signInWithEmailAndPassword(auth, email, password);
            }

            navigate('/discover');
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('Email is already registered, Try signin');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak, choose strong password');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email, Try signup');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                default:
                    setError('Authentication failed, Please try again');
            }
            console.error('Email auth error: ', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome to Vibefinder</h1>
                    <p>Discover videos that match your vibe</p>
                </div>
                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${!isSignUp ? 'active' : ''}`}
                        onClick={() => setIsSignUp(false)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab-btn ${isSignUp ? 'active' : ''}`}
                        onClick={() => setIsSignUp(true)}
                    >Sign Up</button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='Enter your Email'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='Enter your Password'
                            minLength='6'
                        />
                    </div>
                    {isSignUp && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password"
                                id='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder='Confirm your Password'
                                minLength='6'
                            />
                        </div>
                    )}

                    <button className="auth-btn primary"
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' :
                            (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <button
                    className='auth-btn google'
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    Continue with Google
                </button>

                <div className="auth-footer">
                    <p>
                        {isSignUp ? 'Already have an account?'
                            : 'Dont have an accont'}{' '}
                        <button
                            className="link-btn"
                            type='button'
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Login;