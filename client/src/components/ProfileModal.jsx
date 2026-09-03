import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../utils/api';
import Button from './Button';

export default function ProfileModal({ isOpen, onClose }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    city: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      setMessage('');
      setError('');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setIsDarkMode(document.documentElement.classList.contains('dark-theme'));
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setProfileData({
        name: res.data.name || '',
        email: res.data.email || '',
        mobileNumber: res.data.mobileNumber || '',
        city: res.data.location?.city || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.put('/auth/profile', {
        name: profileData.name,
        mobileNumber: profileData.mobileNumber,
        city: profileData.city
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.put('/auth/password', passwordData);
      setMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '32px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: 'white',
            fontSize: '1.5rem', cursor: 'pointer', zIndex: 10
          }}
        >
          &times;
        </button>

        <h2 style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginTop: 0 }}>Your Profile</h2>

        {message && <div style={{ background: 'var(--color-success)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{message}</div>}
        {error && <div style={{ background: 'var(--color-danger)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={saveProfile} style={{ marginBottom: '32px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ color: 'white', marginBottom: '4px' }}>Email (Read Only)</label>
            <input className="form-control" type="text" value={profileData.email} disabled style={{ opacity: 0.7 }} />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ color: 'white', marginBottom: '4px' }}>Full Name</label>
            <input className="form-control" type="text" name="name" value={profileData.name} onChange={handleProfileChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ color: 'white', marginBottom: '4px' }}>Mobile Number</label>
            <input className="form-control" type="text" name="mobileNumber" value={profileData.mobileNumber} onChange={handleProfileChange} placeholder="+1234567890" />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ color: 'white', marginBottom: '4px' }}>City</label>
            <input className="form-control" type="text" name="city" value={profileData.city} onChange={handleProfileChange} placeholder="e.g. San Francisco" />
          </div>
          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', background: 'var(--color-secondary)', border: 'none' }}>Update Profile</Button>
        </form>

        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', color: 'white' }}>Security</h3>
        <form onSubmit={savePassword} style={{ marginBottom: '32px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ color: 'white', marginBottom: '4px' }}>Current Password</label>
            <input className="form-control" type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ color: 'white', marginBottom: '4px' }}>New Password</label>
            <input className="form-control" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
          </div>
          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', background: 'var(--color-primary)', border: 'none' }}>Change Password</Button>
        </form>

        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', color: 'white' }}>Preferences</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white' }}>Dark Mode Theme</span>
          <button 
            onClick={toggleDarkMode}
            style={{
              background: isDarkMode ? 'var(--color-secondary)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '20px',
              width: '50px',
              height: '26px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '3px',
              left: isDarkMode ? '27px' : '3px',
              width: '20px',
              height: '20px',
              background: 'white',
              borderRadius: '50%',
              transition: 'left 0.3s'
            }} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
