import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  Sparkles,
  Building2,
  MapPin,
  Zap,
} from 'lucide-react';
import Button from '../components/ui/Button';

const stats = [
  { label: 'Active Jobs', value: '2,500+', icon: Briefcase },
  { label: 'Companies', value: '500+', icon: Building2 },
  { label: 'Candidates', value: '10K+', icon: Users },
  { label: 'Hired', value: '1,200+', icon: TrendingUp },
];

const features = [
  {
    icon: Search,
    title: 'Smart Job Matching',
    desc: 'Our intelligent search filters help you find the perfect role — by skills, location, salary, and experience level.',
  },
  {
    icon: Shield,
    title: 'Verified Recruiters',
    desc: 'Every recruiter is reviewed and approved, so you can apply with confidence knowing every listing is legitimate.',
  },
  {
    icon: Zap,
    title: 'Real-time Tracking',
    desc: 'Track every application from submission to offer. Get instant notifications at every stage of the process.',
  },
];

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up in seconds and build your professional profile.' },
  { num: '02', title: 'Browse & Apply', desc: 'Explore thousands of jobs and apply with a single click.' },
  { num: '03', title: 'Track & Succeed', desc: 'Follow your applications in real time and land your dream job.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 section-pad">
        <div className="absolute inset-0 bg-grid-slate bg-[length:32px_32px] dark:opacity-5" />
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-indigo-200/40 dark:bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-violet-200/40 dark:bg-violet-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 mb-6">
              <Sparkles size={13} /> The future of hiring is here
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Find Your Next{' '}
              <span className="text-gradient">Dream Job</span>
              <br />
              or Perfect Hire
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              HireFlow connects talented professionals with top companies. Whether you're looking for
              your next career move or searching for the perfect candidate, we've got you covered.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" onClick={() => navigate('/jobs')} rightIcon={<ArrowRight size={16} />}>
              Browse Jobs
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Create Account
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="group rounded-xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-sm p-5 text-center shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                  <s.icon size={20} />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-5xl text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why Choose <span className="text-gradient">HireFlow?</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Built with modern technology to make hiring and job seeking seamless, secure, and fast.
          </p>
        </div>
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-7 shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-glow group-hover:scale-105 transition-transform">
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="section-pad bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Three simple steps to your next career milestone.</p>
        </div>
        <div className="mx-auto max-w-3xl grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white text-lg font-bold shadow-glow">
                {s.num}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-10 sm:p-14 text-center shadow-glow">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to take the next step?
          </h2>
          <p className="mt-3 text-indigo-100 max-w-lg mx-auto">
            Join thousands of professionals and companies already using HireFlow.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight size={16} />}
            >
              Get Started — It's Free
            </Button>
            <Button
              size="lg"
              className="bg-white/15 text-white border-white/25 hover:bg-white/25"
              variant="secondary"
              onClick={() => navigate('/jobs')}
            >
              Explore Jobs
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
