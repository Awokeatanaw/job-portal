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
    } catch (err) {
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error } = await supabase.storage
        .from('avatars') // ⚠️ FIX: should be 'avatars', not 'company-logos'
        .upload(filePath, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Avatar updated!', { id: toastId });
    } catch (err) {
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const toastId = toast.loading('Uploading resume...');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error } = await supabase.storage
        .from('resumes') // ⚠️ FIX: should be 'resumes', not 'company-logos'
        .upload(filePath, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setProfile({ ...profile, resume_url: publicUrl });
      toast.success('Resume uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving profile...');
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profile, updated_at: new Date() });
      if (error) throw error;

      toast.success('Profile saved successfully!', { id: toastId });
      setIsEditing(false);
    } catch (err) {
      toast.error('Save failed: ' + err.message, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-2xl sm:text-4xl font-bold text-indigo-600">Loading your profile...</div>
      </div>
    );
  }

  const isComplete = profile.first_name && profile.phone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 sm:py-16">
      {/* Fluid container: scales to huge screens */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
        {/* Welcome Banner */}
        {!isComplete && !isEditing && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 sm:p-6 mb-6 sm:mb-8 rounded-r-xl">
            <p className="text-lg sm:text-2xl font-bold text-yellow-800">
              Complete your profile to start applying!
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 h-32 sm:h-48 md:h-56 relative">
            <div className="text-white text-lg sm:text-xl md:text-2xl pt-6 sm:pt-8 pl-4 sm:pl-8 md:pl-12 max-w-3xl">
              Click Edit to complete and edit your profile
            </div>
            <hr className="w-full sm:w-[564px] ml-4 sm:ml-12 border-white/30" />

            {/* Avatar */}
            <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 sm:border-8 border-white overflow-hidden bg-gray-200 shadow-2xl">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      size={48}
                      className="text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white p-2.5 sm:p-4 rounded-full shadow-xl cursor-pointer hover:bg-gray-100">
                    <Camera size={20} className="text-indigo-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatar}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 sm:pt-24 px-4 sm:px-8 md:px-10 pb-8 sm:pb-12">
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 sm:gap-4 mb-6 sm:mb-8">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 sm:px-8 sm:py-4 bg-gray-500 text-white rounded-full flex items-center gap-2 sm:gap-3 text-sm sm:text-base hover:bg-gray-600"
                  >
                    <X size={20} className="sm:size-24" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-full flex items-center gap-2 sm:gap-3 text-sm sm:text-base hover:shadow-xl"
                  >
                    <Check size={20} className="sm:size-24" /> Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 sm:px-10 sm:py-4 bg-indigo-600 text-white rounded-full flex items-center gap-2 sm:gap-3 text-sm sm:text-base hover:bg-indigo-700"
                >
                  <Edit3 size={20} className="sm:size-24" />{' '}
                  {isComplete ? 'Edit Profile' : 'Complete Profile'}
                </button>
              )}
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {/* Full Name */}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2">Full Name</h2>
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleChange}
                      placeholder="First name"
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl text-base"
                      required
                    />
                    <input
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl text-base"
                    />
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold">
                    {profile.first_name} {profile.last_name || ''}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2">Email</h2>
                <p className="text-base sm:text-lg flex items-center gap-2">
                  <Mail className="text-indigo-600 flex-shrink-0" /> {user?.email}
                </p>
              </div>

              {/* Phone */}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2">Phone</h2>
                {isEditing ? (
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="+251 9xx xxx xxx"
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl text-base"
                    required
                  />
                ) : (
                  <p className="text-base sm:text-lg flex items-center gap-2">
                    <Phone className="text-indigo-600 flex-shrink-0" />{' '}
                    {profile.phone || 'Not added'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2">Location</h2>
                {isEditing ? (
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Addis Ababa, Ethiopia"
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl text-base"
                  />
                ) : (
                  <p className="text-base sm:text-lg flex items-center gap-2">
                    <MapPin className="text-indigo-600 flex-shrink-0" />{' '}
                    {profile.location || 'Not added'}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">
                  Bio
                </h2>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl resize-none text-base"
                    placeholder="Tell employers about your experience..."
                  />
                ) : (
                  <p className="text-base sm:text-lg whitespace-pre-wrap">
                    {profile.bio || 'No bio added yet'}
                  </p>
                )}
              </div>

              {/* Resume */}
              <div className="md:col-span-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">
                  Resume
                </h2>
                {profile.resume_url ? (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline text-base sm:text-lg"
                  >
                    View Current Resume
                  </a>
                ) : (
                  <p className="text-gray-500 text-base">No resume uploaded</p>
                )}
                {isEditing && (
                  <label className="block mt-4 sm:mt-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3.5 sm:px-10 sm:py-5 rounded-full inline-flex items-center gap-3 cursor-pointer hover:shadow-lg text-base sm:text-lg">
                      <Upload size={24} className="sm:size-32" /> Upload New Resume
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResume}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}