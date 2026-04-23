import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Briefcase, ArrowRight, ArrowUpRight, Users, TrendingUp,
  CheckCircle2, Sparkles, Building2, Bell, Bookmark,
  LineChart, FileCheck, UserCog, ShieldCheck, Star,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart as RLineChart, Line } from 'recharts';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import GooeyNav from '../components/ui/GooeyNav';
import { IMG } from '../utils/images';

const steps = [
  { num: '01', title: 'Create your profile', desc: 'Sign up in under a minute. Add your skills, experience, and what you are looking for.', align: 'left' },
  { num: '02', title: 'Browse and apply', desc: 'Search jobs by role, stack, salary, or location. Apply in a single click with your saved resume.', align: 'right' },
  { num: '03', title: 'Track in real time', desc: 'Every status change — shortlisted, interview, offer — lands in your inbox and dashboard.', align: 'left' },
];

const sparkData = [{ v: 3 }, { v: 5 }, { v: 4 }, { v: 7 }, { v: 6 }, { v: 9 }, { v: 8 }, { v: 12 }];

const gooeyNavItems = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className={`relative overflow-hidden pt-20 pb-0 sm:pt-28 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          {theme === 'dark' && (
            <img src={IMG.hero} alt="" className="h-full w-full object-cover object-center opacity-40" />
          )}
          <div
            className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-slate-950/50 via-slate-950/60 to-slate-950/90'
                : 'bg-gradient-to-b from-white/90 via-white/95 to-white'
            }`}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center pb-16 sm:pb-20">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className={`inline-flex items-center gap-2 rounded-full backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-white/10 border border-white/20 text-white/80'
                  : 'bg-slate-100 border border-slate-200 text-slate-600'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              247 hires this week · 12 live now
            </motion.span>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className={`mt-6 text-4xl sm:text-5xl lg:text-[4.25rem] font-extrabold tracking-tighter leading-[1.02] ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Hire <span className="italic font-bold text-violet-300">smarter</span>.<br />
              Apply <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">faster</span>.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className={`mt-6 max-w-xl text-lg leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              HireFlow is the role-based hiring platform built for humans. Candidates apply in one click, recruiters move pipelines in real time.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight size={16} />} className="group">
                Get started — it's free
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/jobs')} rightIcon={<ArrowUpRight size={16} />}
                className={`${theme === 'dark' ? 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30' : 'bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200 hover:border-slate-300'} shadow-none`}
              >
                Browse jobs
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[
                  { bg: '#818cf8', l: 'A' },
                  { bg: '#a78bfa', l: 'M' },
                  { bg: '#34d399', l: 'J' },
                  { bg: '#fbbf24', l: 'K' },
                  { bg: '#fb7185', l: 'S' },
                ].map(({ bg, l }, i) => (
                  <div key={i}
                    style={{ background: bg }}
                    className="h-8 w-8 rounded-full ring-2 ring-slate-900 flex items-center justify-center text-white text-[11px] font-bold"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Trusted by <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>10,000+</span> companies hiring
              </p>
            </motion.div>
          </div>

          {theme === 'dark' && (
            <div className="lg:col-span-5 relative h-[420px] hidden lg:flex items-center justify-center">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="relative w-[340px] h-[400px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              >
                <img src={IMG.heroPerson} alt="Professional" className="h-full w-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-4 right-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={13} /> Shortlisted for Product Designer
                  </div>
                  <p className="mt-1 text-xs text-white/70 font-mono">Linear · 2 min ago</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -right-4 top-16 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xl"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">This week</p>
                <p className="font-serif text-3xl font-bold text-slate-900 dark:text-white mt-0.5">143</p>
                <p className="font-sans text-xs text-slate-500 mt-0.5">applications</p>
                <div className="mt-2 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                      <defs>
                        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2} fill="url(#sg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </div>

      </section>

      {/* ── BENTO FEATURES ───────────────────────────────────────────────── */}
      <section className="section-pad bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">What's in the box</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Everything you need — <span className="italic text-indigo-600 dark:text-indigo-400">nothing</span> you don't.
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">Purpose-built for the three roles that matter in a hiring pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[auto_auto] gap-4 lg:gap-5 auto-rows-fr">
            {/* BIG card — photo bg */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl shadow-lg group hover:-translate-y-1 transition-transform duration-300 min-h-[320px]"
            >
              <img src={IMG.team} alt="Team" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-tight">Smart matching</h3>
                <p className="mt-2 text-white/80 leading-relaxed max-w-sm text-sm">
                  Role-aware ranking pairs candidates with roles by skills, seniority, and stack — not keywords.
                </p>
                <div className="mt-6 space-y-2.5">
                  {[{ skill: 'React', match: 98 }, { skill: 'TypeScript', match: 94 }, { skill: 'Node.js', match: 87 }].map((s) => (
                    <div key={s.skill} className="flex items-center gap-3">
                      <span className="font-mono text-xs font-medium w-24 text-white/90">{s.skill}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.match}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                          className="h-full bg-white rounded-full" />
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums text-white/80">{s.match}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <BentoCard icon={<ShieldCheck size={20} />} title="Role-based access" desc="Candidate, recruiter, admin — every route guarded." accent="emerald" />
            <BentoCard icon={<Bell size={20} />} title="Real-time notifications" desc="Status changes hit your inbox the moment they happen." accent="amber" />

            {/* Wide card — office photo */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 relative overflow-hidden rounded-2xl group hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
            >
              <img src={IMG.office} alt="Office" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
              <div className="relative p-6 flex items-start justify-between gap-4 h-full">
                <div className="max-w-[60%]">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white">
                    <LineChart size={20} />
                  </div>
                  <h3 className="mt-4 font-serif font-semibold text-white">Analytics that matter</h3>
                  <p className="mt-1.5 text-sm text-white/70 leading-relaxed">Time-to-hire, funnel conversion, pipeline health — at a glance.</p>
                </div>
                <div className="w-32 h-16 flex-shrink-0 self-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={sparkData}>
                      <Line type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <BentoCard icon={<FileCheck size={20} />} title="Resume, one click" desc="Upload once, apply everywhere." accent="indigo" />
            <BentoCard icon={<Bookmark size={20} />} title="Save for later" desc="Bookmark jobs, get notified when status changes." accent="violet" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="section-pad bg-slate-50 dark:bg-slate-900/40 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">How it works</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">From sign-up to offer, three steps.</h2>
          </div>
          <div className="space-y-16 sm:space-y-20">
            {steps.map((s) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className={`relative grid sm:grid-cols-12 gap-6 items-center ${s.align === 'right' ? 'sm:text-right' : ''}`}
              >
                <div className={`sm:col-span-4 ${s.align === 'right' ? 'sm:order-2 sm:text-left' : ''} relative`}>
                  <span className="pointer-events-none select-none text-[9rem] sm:text-[11rem] leading-none font-black tracking-tighter bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-400/15 dark:to-violet-400/15 bg-clip-text text-transparent">
                    {s.num}
                  </span>
                </div>
                <div className={`sm:col-span-8 ${s.align === 'right' ? 'sm:order-1' : ''}`}>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed max-w-md sm:inline-block">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ────────────────────────────────────────────────────────── */}
      <section className="section-pad bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">Built for three roles</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Pick your side of the table.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <RoleCard tone="photo" img={IMG.office} icon={<Users size={20} />} title="Candidates" desc="Find roles that actually match. Apply once, track everything."
              bullets={['One-click apply with saved resume', 'Real-time status updates', 'Save jobs for later']} cta="Sign up free" onClick={() => navigate('/register')} />
            <RoleCard tone="photo" img={IMG.heroPerson} icon={<Briefcase size={20} />} title="Recruiters" desc="Post jobs, review applicants, move pipelines — in one view."
              bullets={['Create and manage job posts', 'Shortlist with one click', 'Filter by skills and experience']} cta="Post a job" onClick={() => navigate('/register')} />
            <RoleCard tone="photo" img={IMG.abstract} icon={<UserCog size={20} />} title="Admins" desc="Approve recruiters, audit activity, and watch the pulse of every hire."
              bullets={['Approve or ban users', 'Platform-wide analytics', 'Moderate job postings']} cta="Sign up" onClick={() => setAdminModalOpen(true)} />
          </div>
        </div>
      </section>

      {/* ── GOOEY NAV DEMO ───────────────────────────────────────────────── */}
      <section className="section-pad bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-8">
            Interactive Navigation Demo
          </h2>
          <div style={{ height: '200px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GooeyNav
              items={gooeyNavItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-pad bg-slate-50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Background image */}
            <img src={IMG.abstract} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-violet-900/85 to-indigo-900/90" />
            <div className="relative px-8 py-14 sm:px-14 sm:py-20 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white mb-5">
                <Star size={12} className="fill-white" /> Free forever for candidates
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to take the next step?
              </h2>
              <p className="mt-4 text-indigo-100 max-w-lg mx-auto leading-relaxed">
                Join thousands of professionals and companies already using HireFlow.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" onClick={() => navigate('/register')} rightIcon={<ArrowRight size={16} />}
                  className="bg-white text-slate-900 border-0 hover:bg-slate-100"
                >Get started</Button>
                <Button size="lg" onClick={() => navigate('/jobs')}
                  className="bg-white/10 text-white border border-white/25 hover:bg-white/20 hover:border-white/40 shadow-none"
                >Browse jobs</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        title="NOTE ONLY FOR Elipsonic Testers"
        size="md"
        footer={
          <Button onClick={() => { setAdminModalOpen(false); navigate('/register'); }}>
            OK
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Admin access is restricted to authorized Elipsonic testers only.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-slate-900 dark:text-white">Email:</span>
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">admin@hireflow.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-900 dark:text-white">Password:</span>
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Admin@123</span>
            </div>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Do not misuse this account. It is for testing purposes only.
          </p>
        </div>
      </Modal>
    </>
  );
}

function BentoCard({ icon, title, desc, accent = 'indigo' }) {
  const accentMap = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md transition-all duration-300"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accentMap[accent]}`}>{icon}</div>
      <h3 className="mt-4 font-serif font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function RoleCard({ tone, img, icon, title, desc, bullets, cta, onClick }) {
  const isPhoto = tone === 'photo';
  const isDark = tone === 'dark';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="group relative rounded-2xl border-0 overflow-hidden p-7 hover:-translate-y-1 transition-all duration-300 text-white min-h-[320px]"
    >
      {/* Photo bg — always */}
      <img
        src={img || IMG.heroPerson}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/25" />

      <div className="relative">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white border border-white/20">
          {icon}
        </div>
        <h3 className="mt-5 font-serif text-xl font-bold tracking-tight text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
        <ul className="mt-5 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-white/80">
              <CheckCircle2 size={16} className="text-indigo-300 shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onClick}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
        >
          {cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
