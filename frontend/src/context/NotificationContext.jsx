
// src/context/NotificationContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [companyId, setCompanyId] = useState(null);

    // --- EFFECT TO GET COMPANY ID AND SUBSCRIBE ---
    useEffect(() => {
        let channel;

        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // User not logged in

            // 1. Fetch Company ID
            const { data: company, error } = await supabase
                .from('companies')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (error || !company) return;

            const compId = company.id;
            setCompanyId(compId);
            
            // 2. Fetch Initial Unread Count
            const { count: initialCount, error: countError } = await supabase
                .from('notifications')
                .select('id', { count: 'exact' })
                .eq('company_id', compId)
                .eq('read', false);

            if (countError) {
                toast.error("Failed to load initial notification count.");
            } else {
                setUnreadCount(initialCount || 0);
            }

            // 3. Subscribe to Realtime Changes
            channel = supabase
                .channel(`employer-notifs-count-${compId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `company_id=eq.${compId}`
                }, (payload) => {
                    if (!payload.new.read) {
                        setUnreadCount(c => c + 1); // Increment for new unread notif
                        // (Optional: You can add the toast here if you want a global notification)
                    }
                })
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `company_id=eq.${compId}`
                }, (payload) => {
                    // Decrement if the notification was marked read
                    if (!payload.old.read && payload.new.read) {
                        setUnreadCount(c => Math.max(0, c - 1)); 
                    }
                })
                .subscribe();
        };

        init();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    // Function to manually update count (used when "Mark All as Read" is clicked)
    const updateCount = (newCount) => {
        setUnreadCount(newCount);
    };

    const value = { unreadCount, companyId, updateCount };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}