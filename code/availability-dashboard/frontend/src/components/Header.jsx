import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.PNG';
import '../styles/header.css';

const DEFAULT_PROFILE_IMAGE = 'https://ui-avatars.com/api/?name=User&background=0D8A4E&color=fff';

const Header = () => {
  const [userProfile, setUserProfile] = useState({});
  const navigate = useNavigate();

  const loadUserProfile = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setUserProfile({});
      return;
    }

    try {
      setUserProfile(JSON.parse(storedUser));
    } catch (error) {
      setUserProfile({});
    }
  }, []);

  useEffect(() => {
    loadUserProfile();

    const handleAuthStateChange = () => {
      loadUserProfile();
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, [loadUserProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/login');
  };

  const profileImage = userProfile?.profilePicture || DEFAULT_PROFILE_IMAGE;

  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="GymPappa Spooty logo" className="header-logo" />
          <div>
            <h1>GymPappa Spooty</h1>
            <p className="tagline">Your Sports Equipment Management System</p>
          </div>
        </div>
        <div className="header-right">
          <div className="user-section">
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
            <img
              src={profileImage}
              alt="Profile"
              className="profile-pic"
              onError={handleImgError}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;