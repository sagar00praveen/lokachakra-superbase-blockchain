import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProfiles, fetchUserProfile } from '../services/api';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id).then(profile => {
          if (profile) setUser(profile);
        });
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (role, userData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });

      if (error) {
        alert("Login Failed: " + error.message);
        console.error("Login failed", error);
        return;
      }

      // onAuthStateChange will handle setting the user
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('hr_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
