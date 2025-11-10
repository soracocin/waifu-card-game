import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import GachaPage from './pages/GachaPage';
import BattlePage from './pages/BattlePage';
import AdminPage from './pages/AdminPage';
import AdminGalleriesPage from './pages/AdminGalleriesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/dashboard"
                        element={(
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/collection"
                        element={(
                            <ProtectedRoute>
                                <CollectionPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/gacha"
                        element={(
                            <ProtectedRoute>
                                <GachaPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/battle"
                        element={(
                            <ProtectedRoute>
                                <BattlePage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/admin/cards"
                        element={(
                            <ProtectedRoute>
                                <AdminPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/admin/galleries"
                        element={(
                            <ProtectedRoute>
                                <AdminGalleriesPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
