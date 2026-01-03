// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Upload, Camera, Edit3, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    first_name: '', last_name: '', phone: '', location: '', bio: '', avatar_url: '', resume_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in');
        navigate('/login');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setProfile(data);
        if (!data.first_name || !data.phone) {
          setIsEditing(true);
          toast.info('Please complete your profile');
        }
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading avatar...');
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}_${Date.now()}.${ext}`;

      await supabase.storage.from('company-logos').upload(path, file, { upsert: true });
      const { data } = supabase.storage.from('company-logos').getPublicUrl(path);

      setProfile({ ...profile, avatar_url: data.publicUrl });
      toast.success('Avatar updated!', { id: toastId });
    } catch {
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading resume...');
    try {
      const ext = file.name.split('.').pop();
      const path = `resumes/${user.id}_${Date.now()}.${ext}`;

      await supabase.storage.from('company-logos').upload(path, file, { upsert: true });
      const { data } = supabase.storage.from('company-logos').getPublicUrl(path);

      setProfile({ ...profile, resume_url: data.publicUrl });
      toast.success('Resume uploaded!', { id: toastId });
    } catch {
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving profile...');
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        ...profile,
        updated_at: new Date(),
      });
      toast.success('Profile saved!', { id: toastId });
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-4xl font-bold text-indigo-600">Loading your profile...</div>
      </div>
    );
  }

  const isComplete = profile.first_name && profile.phone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16">
      
      {/* 🔥 RESPONSIVE WIDTH FIX HERE */}
      <div className="
        mx-auto px-6
        max-w-5xl
        2xl:max-w-6xl
        3xl:max-w-7xl
        4xl:max-w-[1600px]
      ">

        {!isComplete && !isEditing && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-8 rounded-r-xl">
            <p className="text-2xl font-bold text-yellow-800">
              Complete your profile to start applying!
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 h-56 relative">
            <div className="text-white text-3xl pt-8 pl-12">
              Click Edit to complete and edit your profile
            </div>
            <hr className="w-[564px] ml-12" />

            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-44 h-44 rounded-full border-10 border-white overflow-hidden bg-gray-200 shadow-2xl">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <User size={100} className="text-gray-400 absolute inset-0 m-auto" />
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-4 right-4 bg-white p-4 rounded-full shadow-2xl cursor-pointer">
                    <Camera size={28} className="text-indigo-600" />
                    <input type="file" hidden accept="image/*" onChange={handleAvatar} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-24 px-10 pb-12">
            {/* Buttons */}
            <div className="flex justify-end gap-4 mb-8">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-8 py-4 bg-gray-500 text-white rounded-full flex gap-3">
                    <X /> Cancel
                  </button>
                  <button onClick={handleSave} className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-full flex gap-3">
                    <Check /> Save Changes
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-indigo-600 text-white rounded-full flex gap-3">
                  <Edit3 /> {isComplete ? 'Edit Profile' : 'Complete Profile'}
                </button>
              )}
            </div>

            {/* Profile Grid */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* unchanged fields */}
              {/* your existing content stays exactly the same */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
