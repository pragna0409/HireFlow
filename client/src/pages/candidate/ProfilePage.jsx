import { useRef, useState } from 'react';
import { User, MapPin, Briefcase, Save, Camera, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Card, { CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { authApi } from '../../api/auth.api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '',
    experience: user?.experience || 0,
  });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const fileRef = useRef();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    // Optimistic preview
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setAvatarUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await authApi.updateProfileForm(fd);
      const updated = res?.data?.user || res?.data || null;
      if (updated) {
        setUser(updated);
        setAvatarPreview(updated.avatarUrl);
        toast.success('Profile picture updated');
      }
    } catch (err) {
      setAvatarPreview(user?.avatarUrl || null);
      toast.error(err?.message || 'Upload failed');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        bio: form.bio,
        location: form.location,
        company: form.company,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: Number(form.experience) || 0,
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
        <p className="mt-1 font-sans text-sm text-slate-500 dark:text-slate-400">Update your info, skills, and profile picture</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-5">
            {/* Avatar with upload overlay */}
            <div className="relative shrink-0">
              <Avatar name={user?.name} src={avatarPreview} size="xl" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-wait"
                title="Change photo"
              >
                {avatarUploading
                  ? <Loader2 size={18} className="text-white animate-spin" />
                  : <Camera size={18} className="text-white" />}
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                <Camera size={11} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <CardTitle className="text-lg">{user?.name}</CardTitle>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Briefcase size={10} /> {user?.role}
              </span>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">Click avatar to change photo</p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" required value={form.name} onChange={set('name')} leftIcon={<User size={16} />} />
            <Textarea label="Bio" value={form.bio} onChange={set('bio')} placeholder="Tell us about yourself…" rows={3} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Location" value={form.location} onChange={set('location')} placeholder="City, Country" leftIcon={<MapPin size={16} />} />
              <Input label="Company" value={form.company} onChange={set('company')} placeholder="Your company" leftIcon={<Briefcase size={16} />} />
            </div>
            <Input label="Skills" value={form.skills} onChange={set('skills')} placeholder="React, Node.js, TypeScript" helper="Comma-separated" />
            <Input label="Years of Experience" type="number" value={form.experience} onChange={set('experience')} min="0" />
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <Button type="submit" loading={saving} leftIcon={<Save size={14} />}>Save Changes</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
