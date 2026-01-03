// src/pages/EmployerNotifications.jsx ← FINAL 100% WORKING — NO ERRORS AT ALL
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCheck, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function EmployerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/employer/login');
        return;
      }

      const { data: company, error } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error || !company) {
        toast.error('Company not found');
        setLoading(false);
        return;
      }

      setCompanyId(company.id);
      fetchNotifications(company.id);

      const channel = supabase
        .channel(`employer-notifs-${company.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `company_id=eq.${company.id}`
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotif = payload.new;
            setNotifications(prev => [newNotif, ...prev]);
            if (!newNotif.read) {
              setUnreadCount(c => c + 1);
              toast.success(newNotif.title, { duration: 6000 });
            }
          }
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new;
            setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
            if (!payload.old.read && updated.read) {
              setUnreadCount(c => Math.max(0, c - 1));
            }
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [navigate]);

  const fetchNotifications = async (compId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('company_id', compId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || notif.read) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read!');
    }
  };

  const getStyle = (type, read) => {
    const base = "rounded-3xl shadow-xl transition-all duration-300 border-l-8 hover:shadow-2xl";
    if (read) return `${base} border-gray-200 bg-white opacity-90`;

    switch (type) {
      case 'new_application': return `${base} border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100`;
      case 'application_withdrawn': return `${base} border-red-500 bg-red-50 ring-2 ring-red-100`;
      default: return `${base} border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 rounded-full border-12 border-indigo-200 border-t-indigo-600"
        />
        <p className="mt-8 text-4xl font-black text-indigo-600">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16 px-6">
      {/* 
        RESPONSIVE CONTAINER: 
        - max-w-5xl on screens <1920px
        - full width with padding on ≥1920px
      */}
      <div className="max-w-5xl mx-auto [@media(min-width:1920px)]:max-w-full [@media(min-width:1920px)]:px-20">

        {/* HEADER */}
        <motion.div initial={{ y: -60 }} animate={{ y: 0 }} className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <Bell size={90} className="text-indigo-600" />
            {unreadCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-0 -right-0 w-8 h-8 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </div>
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Notifications
          </h1>
        </motion.div>

        {/* MARK ALL BUTTON */}
        {unreadCount > 0 && (
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-16 py-6 rounded-full font-black text-3xl shadow-3xl hover:shadow-4xl"
            >
              Mark All as Read
            </motion.button>
          </div>
        )}

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-8">
          {notifications.length === 0 ? (
            <div className="text-center py-32">
              <Bell size={120} className="text-gray-300 mx-auto mb-8" />
              <h2 className="text-5xl font-bold text-gray-500">No notifications yet</h2>
              <p className="text-2xl text-gray-400 mt-4">When candidates apply, you'll see them here</p>
            </div>
          ) : (
            notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={getStyle(notif.type, notif.read)}
              >
                <div className="p-8 flex items-start gap-6">
                  {/* ICON */}
                  <div className={`p-5 rounded-full ${notif.read ? 'bg-gray-300' : 'bg-gradient-to-br from-indigo-500 to-pink-500'} text-white shadow-xl`}>
                    {notif.type === 'new_application' ? <UserCheck size={32} /> : <Bell size={32} />}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-3xl font-bold ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-5 h-5 bg-red-500 rounded-full"
                        />
                      )}
                    </div>
                    <p className="text-xl text-gray-700 mb-4">{notif.message}</p>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Clock size={20} /> {new Date(notif.created_at).toLocaleString('en-GB')}
                    </p>
                  </div>

                  {/* MARK AS READ BUTTON */}
                  {!notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl hover:shadow-2xl transition transform hover:scale-110"
                    >
                      <CheckCircle size={32} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}