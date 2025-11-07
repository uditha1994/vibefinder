import { useEffect, useState } from "react"
import Header from "./components/common/Header"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Routes, Router, Route } from "react-router-dom";
import Home from "./components/common/Home";
import Discover from './pages/Discover';
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubsribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
