import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load user from local storage on mount and validate token
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('profile');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Validate token by trying to fetch profile
            if (parsedUser.access_token) {
                validateToken(parsedUser.access_token);
            }
        }
        if (storedProfile) setProfile(JSON.parse(storedProfile));
    }, []);

    const validateToken = async (accessToken) => {
        try {
            await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            });
        } catch (err) {
            // Token is invalid/expired, logout user
            console.log("Stored token is invalid/expired, logging out...");
            logout();
        }
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            localStorage.setItem('user', JSON.stringify(codeResponse));
            fetchProfile(codeResponse.access_token);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const fetchProfile = async (accessToken) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            });
            setProfile(res.data);
            localStorage.setItem('profile', JSON.stringify(res.data));
        } catch (err) {
            console.error("Error fetching profile:", err);
            // If token is invalid/expired, logout user
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                console.log("Token expired or invalid, logging out...");
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        googleLogout();
        setUser(null);
        setProfile(null);
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
    };

    return (
        <AuthContext.Provider value={{ user, profile, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
