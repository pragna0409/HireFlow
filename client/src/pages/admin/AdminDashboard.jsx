import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { adminApi } from '../../api/admin.api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .analytics()
      .then((res) => setData(res?.data || res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-slate-500">
        Failed to load analytics.
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: data.totalUsers || 0, icon: Users, color: 'from-indigo-500 to-violet-500' },
    { label: 'Total Jobs', value: data.totalJobs || 0, icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
    { label: 'Applications', value: data.totalApplications || 0, icon: FileText, color: 'from-amber-500 to-orange-500' },
    { label: 'Hire Rate', value: data.applicationsByStatus?.hired ? `${Math.round((data.applicationsByStatus.hired / Math.max(data.totalApplications, 1)) * 100)}%` : '0%', icon: TrendingUp, color: 'from-sky-500 to-blue-500' },
  ];

  const monthData = (data.jobsPerMonth || []).map((m) => ({
    name: MONTH_NAMES[(m.month || 1) - 1] + ' ' + (m.year || ''),
    jobs: m.count,
  }));

  const statusData = Object.entries(data.applicationsByStatus || {}).map(([k, v]) => ({
    name: k.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value: v,
  }));

  const roleData = Object.entries(data.usersByRole || {}).map(([k, v]) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    value: v,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Platform overview and analytics
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}
                >
                  <s.icon size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Jobs per month */}
        {monthData.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-indigo-600" />
              Jobs Posted Per Month
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 12,
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="jobs" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Application status pie */}
        {statusData.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <FileText size={16} className="text-amber-600" />
              Applications by Status
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Users by role */}
        {roleData.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Users size={16} className="text-emerald-600" />
              Users by Role
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}
