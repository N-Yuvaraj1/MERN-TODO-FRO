import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedTheme = localStorage.getItem("darkMode");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedTheme) {
            setDarkMode(JSON.parse(storedTheme));
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchTasks(user.email);
        }
    }, [user]);

    const fetchTasks = async (email) => {
        try {
            const response = await axios.get(`https://mern-todo-back-wdqp.onrender.com`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = { name: decoded.name, email: decoded.email };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        fetchTasks(userData.email);
    };

    const handleLogout = () => {
        setUser(null);
        setTasks([]);
        localStorage.removeItem("user");
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            localStorage.setItem("darkMode", JSON.stringify(!prevMode));
            return !prevMode;
        });
    };

    return (
        <div className={`app-container ${darkMode ? "dark-theme" : "light-theme"}`}>
            <div className="theme-toggle">
                <button onClick={toggleDarkMode}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            {!user ? (
                <div className="login-container">
                    <h2>Welcome to Task Manager</h2>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.log('Login Failed')}
                    />
                </div>
            ) : (
                <div className="task-container">
                    <div className="header">
                        <h2>Welcome, {user.name}!</h2>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                    <TaskList userEmail={user.email} tasks={tasks} setTasks={setTasks} />
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default App;
