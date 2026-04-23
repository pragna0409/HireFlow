import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Ban,
  CheckCircle2,
  Search,
  ChevronDown,
} from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { timeAgo } from '../../utils/formatters';
import useDebounce from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  admin: 'indigo',
  recruiter: 'violet',
  candidate: 'emerald',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const debouncedSearch = useDebounce(search);

  const fetchUsers = (page = 1) => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (roleFilter) params.role = roleFilter;

    adminApi
      .users(params)
      .then((res) => {
        const data = res?.data || res;
        setUsers(data?.users || []);
        setPagination(data?.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(1);
  }, [debouncedSearch, roleFilter]);

  const handleApprove = async (id) => {
    try {
      await adminApi.approveRecruiter(id);
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, isApproved: true } : u)),
      );
      toast.success('Recruiter approved');
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  const handleBan = async (id) => {
    try {
      const res = await adminApi.banUser(id);
      const updated = res?.data || res;
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === id ? { ...u, isBanned: updated.isBanned ?? !u.isBanned } : u,
        ),
      );
      toast.success(updated.isBanned ? 'User banned' : 'User unbanned');
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {pagination.total} total users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {['', 'candidate', 'recruiter', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              {r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <>
          <div className="space-y-3">
            {users.map((u, i) => (
              <motion.div
                key={u._id || u.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card hoverable className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Avatar name={u.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{u.name}</span>
                      <Badge variant={ROLE_BADGE[u.role] || 'slate'}>
                        {u.role}
                      </Badge>
                      {u.isBanned && <Badge variant="rose">Banned</Badge>}
                      {u.role === 'recruiter' && !u.isApproved && (
                        <Badge variant="amber">Pending</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{u.email}</span>
                      <span>Joined {timeAgo(u.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {u.role === 'recruiter' && !u.isApproved && (
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => handleApprove(u._id || u.id)}
                        leftIcon={<CheckCircle2 size={13} />}
                      >
                        Approve
                      </Button>
                    )}
                    {u.role !== 'admin' && (
                      <Button
                        variant={u.isBanned ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => handleBan(u._id || u.id)}
                        leftIcon={u.isBanned ? <Shield size={13} /> : <Ban size={13} />}
                        className={u.isBanned ? '' : 'text-rose-600 hover:bg-rose-50'}
                      >
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchUsers(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchUsers(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
