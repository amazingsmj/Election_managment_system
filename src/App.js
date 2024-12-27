import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import SideMenu from './SideMenu';
import Dashboard from './pages/Dashboard';
import CameroonMap from './components/CameroonMap';
import Help from './pages/Help';
import About from './pages/About';
import Logout from './pages/Logout';
import LandingPage from './pages/Landing';
import Login from './pages/Login';
import LoginS from './pages/LoginS';
import RegistrationLogin from './pages/RegistrationLogin';
import Profile from './pages/Profile';
import Bureaux from './pages/Bureaux';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // État d'authentification

    // Fonction pour gérer la connexion
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div style={{ display: 'flex' }}>
                {/* Afficher SideMenu uniquement si l'utilisateur est authentifié */}
                {isAuthenticated && <SideMenu />}

                <div style={{ padding: '20px', flex: 1 }}>
                    <Routes>
                        {/* Route pour rediriger vers la page d'accueil */}
                        <Route path="/" element={<Navigate to="/landing" />} />

                        {/* Routes publiques */}
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/loginS" element={<LoginS />} />
                        <Route path="/registrationLogin" element={<RegistrationLogin />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* Routes privées accessibles uniquement si authentifié */}
                        <Route
                            path="/dashboard"
                            element={
                                isAuthenticated ? (
                                    <Dashboard onLogout={handleLogout} />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/bureaux"
                            element={
                                isAuthenticated ? (
                                    <Bureaux />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/map"
                            element={
                                isAuthenticated ? (
                                    <CameroonMap />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/help"
                            element={
                                isAuthenticated ? (
                                    <Help />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                isAuthenticated ? (
                                    <About />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/logout"
                            element={
                                isAuthenticated ? (
                                    <Logout onLogout={handleLogout} />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
