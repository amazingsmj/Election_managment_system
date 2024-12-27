// import './App.css';
// import CameroonMap from './components/CameroonMap';

// function App() {
//   return (
//     <div className="App">
//       <div className="App">
//         <CameroonMap />
//       </div>
//     </div>
//   );
// }

// export default App;
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

import Bureaux from './pages/Bureaux';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

    const handleLogin = () => {
        setIsAuthenticated(true); // Set authentication state to true
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // Reset authentication state
    };

    return (
        <Router>
            <div style={{ display: 'flex' }}>
                {isAuthenticated && <SideMenu />} {/* Render SideMenu only if authenticated */}
                <div style={{ padding: '20px', flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/landing" />} />
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Pass handleLogin to Login */}
                        <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                        <Route path="/bureaux" element={isAuthenticated ? <Bureaux /> : <Navigate to="/login" />} />
                        <Route path="/map" element={isAuthenticated ? <CameroonMap /> : <Navigate to="/login" />} />
                        <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />
                        <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
                        <Route path="/logout" element={isAuthenticated ? <Logout onLogout={handleLogout} /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;