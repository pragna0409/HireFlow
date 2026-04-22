import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div className="relative mb-6 inline-block">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-pink-200 blur-2xl opacity-50" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow mx-auto">
            <ShieldX size={36} />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Access Denied</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          You don't have permission to view this page. If you think this is an error,
          please contact support.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button
            as={Link}
            to="/"
            leftIcon={<Home size={16} />}
          >
            Go Home
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
