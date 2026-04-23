import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROLES } from './utils/constants';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailPage from './pages/jobs/JobDetailPage';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import SavedJobs from './pages/candidate/SavedJobs';
import ProfilePage from './pages/candidate/ProfilePage';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import PostJob from './pages/recruiter/PostJob';
import EditJob from './pages/recruiter/EditJob';
import JobApplicants from './pages/recruiter/JobApplicants';
import ATSChecker from './pages/recruiter/ATSChecker';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';

// Messages
import MessagesPage from './pages/messages/MessagesPage';

// Other
import NotFoundPage from './pages/NotFoundPage';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public layout routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Candidate dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/applications" element={<MyApplications />} />
        <Route path="/candidate/saved" element={<SavedJobs />} />
        <Route path="/candidate/profile" element={<ProfilePage />} />
      </Route>

      {/* Recruiter dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/new" element={<PostJob />} />
        <Route path="/recruiter/jobs/:id/edit" element={<EditJob />} />
        <Route path="/recruiter/jobs/:id/applicants" element={<JobApplicants />} />
        <Route path="/recruiter/jobs/:id/ats" element={<ATSChecker />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
      </Route>

      {/* Messages — all authenticated roles */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE, ROLES.RECRUITER, ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:userId" element={<MessagesPage />} />
      </Route>
    </Routes>
  );
}
