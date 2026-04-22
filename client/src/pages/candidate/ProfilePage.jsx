import { useState } from 'react';
import { User, Mail, MapPin, Briefcase, Save, FileText } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Card, { CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '',
    experience: user?.experience || 0,
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        bio: form.bio,
        location: form.location,
        company: form.company,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update your personal information and skills
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} size="xl" />
            <div>
              <CardTitle className="text-lg">{user?.name}</CardTitle>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                <Briefcase size={10} /> {user?.role}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={set('name')}
              leftIcon={<User size={16} />}
            />
            <Textarea
              label="Bio"
              value={form.bio}
              onChange={set('bio')}
              placeholder="Tell us about yourself…"
              rows={3}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                value={form.location}
                onChange={set('location')}
                placeholder="City, Country"
                leftIcon={<MapPin size={16} />}
              />
              <Input
                label="Company"
                value={form.company}
                onChange={set('company')}
                placeholder="Your company"
                leftIcon={<Briefcase size={16} />}
              />
            </div>
            <Input
              label="Skills"
              value={form.skills}
              onChange={set('skills')}
              placeholder="React, Node.js, TypeScript"
              helper="Comma-separated"
            />
            <Input
              label="Years of Experience"
              type="number"
              value={form.experience}
              onChange={set('experience')}
              min="0"
            />
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button type="submit" loading={saving} leftIcon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
