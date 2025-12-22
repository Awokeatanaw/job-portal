// src/pages/Notifications.jsx ← FINAL CANDIDATE NOTIFICATIONS (PERFECT)
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Briefcase, Heart, AlertCircle, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    // REAL-TIME: Listen for new notifications
    const channel = supabase
      .channel('candidate-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${(async () => (await supabase.auth.getUser()).data.user?.id)()}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        toast.success(payload.new.title);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const getIconAndColor = (type) => {
    switch (type) {
      case 'application_update': return { icon: <Briefcase />, color: 'emerald' };
      case 'job_alert': return { icon: <Bell />, color: 'indigo' };
      case 'saved_job': return { icon: <Heart />, color: 'pink' };
      case 'profile_update': return { icon: <CheckCircle />, color: 'green' };
      default: return { icon: <MessageCircle />, color: 'blue' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-8 border-indigo-200"></div>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-transparent border-t-indigo-600 border-r-pink-600 animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full blur-xl opacity-70"></div>
          </div>
          <p className="mt-10 text-2xl font-bold text-gray-700">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Bell size={64} className="text-indigo-600" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              Notifications
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {unreadCount > 0 ? (
              <span className="font-bold text-indigo-600">{unreadCount} unread</span>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={markAllAsRead}
              className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-6">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-20 text-center">
              <Bell size={80} className="text-gray-300 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-600 mb-4">No notifications yet</h2>
              <p className="text-xl text-gray-500">We'll notify you when something important happens!</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const { icon, color } = getIconAndColor(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-8 cursor-pointer ${
                    notif.read 
                      ? 'border-gray-200 opacity-90' 
                      : `border-${color}-500 ring-2 ring-indigo-100`
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`p-4 rounded-full bg-gradient-to-br from-${color}-500 to-${color}-600 text-white shadow-lg`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-xl font-bold ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notif.title}
                        </h3>
                        {!notif.read && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
                      </div>
                      <p className="text-gray-600 text-lg mb-3">{notif.message}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Clock size={18} />
                        <span>{new Date(notif.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}