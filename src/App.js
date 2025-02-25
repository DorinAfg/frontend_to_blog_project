import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import Navigation from "./components/Navigation"; 
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from './AuthContext'; // הוספת ייבוא של AuthProvider
import './index.css';

function App() {
    return (
        <AuthProvider> {/* עטיפת האפליקציה ב-AuthProvider */}
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
