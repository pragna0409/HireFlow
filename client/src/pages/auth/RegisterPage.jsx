import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Briefcase } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const target =
      user?.role === 'admin'
        ? '/admin/dashboard'
        : user?.role === 'recruiter'
          ? '/recruiter/dashboard'
          : '/candidate/dashboard';
    navigate(target, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const u = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      const target =
        u?.role === 'admin'
          ? '/admin/dashboard'
          : u?.role === 'recruiter'
            ? '/recruiter/dashboard'
            : '/candidate/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="absolute inset-0 bg-grid-slate bg-[length:32px_32px] pointer-events-none dark:opacity-5" />
      <div className="absolute top-40 left-1/3 h-48 w-48 rounded-full bg-indigo-200/30 blur-[80px] dark:bg-indigo-500/10" />
      <div className="absolute bottom-20 right-1/3 h-48 w-48 rounded-full bg-violet-200/30 blur-[80px] dark:bg-violet-500/10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card p-8 sm:p-10 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-glow">
                <Briefcase size={20} />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">HireFlow</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Join HireFlow and start your journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="John Doe"
              leftIcon={<User size={16} />}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
            />
            <Select
              label="I am a…"
              value={form.role}
              onChange={set('role')}
              options={[
                { value: 'candidate', label: 'Candidate — Looking for a job' },
                { value: 'recruiter', label: 'Recruiter — Hiring talent' },
              ]}
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              required
              value={form.password}
              onChange={set('password')}
              placeholder="At least 6 characters"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <Input
              label="Confirm Password"
              type={showPw ? 'text' : 'password'}
              required
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
            />
            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              leftIcon={<UserPlus size={16} />}
              className="mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
