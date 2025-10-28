import { useEffect, useState } from "react"
import Header from "./components/common/Header"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Router, Routes } from "react-router-dom";
import Home from "./components/common/Home";

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
    // <ThemeProvider>
    //   <AuthProvider>
    //     <BrowserRouter>
    //       <div className="app">
    //         <Header />
    //         <main className="main-content">
    //           <Routes>

    //           </Routes>
    //         </main>
    //       </div>
    //     </BrowserRouter>
    //   </AuthProvider>
    // </ThemeProvider>
    <Home />
  )
}

export default App
