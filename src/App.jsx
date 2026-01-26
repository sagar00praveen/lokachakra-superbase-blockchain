import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import Layout from './components/layout/Layout';
import PortalSelection from './pages/PortalSelection';
import RoleGuard from './components/auth/RoleGuard';

// Dashboards
import HRDashboard from './pages/dashboards/HRDashboard';
import ITDashboard from './pages/dashboards/ITDashboard';
import CandidateDashboard from './pages/dashboards/CandidateDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Pages
import TeamsOverview from './pages/TeamsOverview';
import TeamDetail from './pages/TeamDetail';
import AddCandidate from './pages/AddCandidate';
import SendOfferLetter from './pages/hr/SendOfferLetter';
import PayrollManagement from './pages/admin/PayrollManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import UserManagement from './pages/admin/UserManagement';
import Settings from './pages/admin/Settings';
import CandidateProfile from './pages/CandidateProfile';
import Employees from './pages/Employees';

import MyOrientations from './pages/candidate/MyOrientations';
import Notifications from './pages/candidate/Notifications';
import AcceptOffer from './pages/candidate/AcceptOffer';
import PolicyAcceptance from './pages/candidate/PolicyAcceptance';
import DeviceReceipt from './pages/candidate/DeviceReceipt';
import PersonalInformation from './pages/candidate/PersonalInformation';
import UploadDocuments from './pages/candidate/UploadDocuments';

import OrientationManagement from './pages/hr/OrientationManagement';
import DocumentManagement from './pages/hr/DocumentManagement';

import ITRequest from './pages/it/ITRequest';
import AssetManagement from './pages/it/AssetManagement';
import AssetAllocation from './pages/it/AssetAllocation';
import ITOrientation from './pages/it/ITOrientation';
import ITSettings from './pages/it/ITSettings';

import Login from './pages/Login';

function App() {
  return (
    <DashboardProvider>
      <Router>
        <Routes>
          {/* Public Route: Portal Selection */}
          <Route path="/" element={<PortalSelection />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (wrapped in Layout) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                {/* HR Routes */}
                <Route path="hr/*" element={
                  <RoleGuard requiredRole="hr">
                    <Routes>
                      <Route path="dashboard" element={<HRDashboard />} />
                      <Route path="orientations" element={<OrientationManagement />} />
                      <Route path="documents" element={<DocumentManagement />} />
                      {/* Shared pages allowed for HR */}
                      <Route path="add-candidate" element={<AddCandidate />} />
                      <Route path="send-offer-letter" element={<SendOfferLetter />} />
                      <Route path="candidate-profile/:id" element={<CandidateProfile />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleGuard>
                } />

                {/* IT Routes */}
                <Route path="it/*" element={
                  <RoleGuard requiredRole="it">
                    <Routes>
                      <Route path="dashboard" element={<ITDashboard />} />
                      <Route path="requests" element={<ITRequest />} />
                      <Route path="assets" element={<AssetManagement />} />
                      <Route path="assets/allocate" element={<AssetAllocation />} />
                      <Route path="orientations" element={<ITOrientation />} />
                      <Route path="settings" element={<ITSettings />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleGuard>
                } />

                {/* Candidate Routes */}
                <Route path="candidate/*" element={
                  <RoleGuard requiredRole="candidate">
                    <Routes>
                      <Route path="dashboard" element={<CandidateDashboard />} />
                      <Route path="orientations" element={<MyOrientations />} />
                      <Route path="accept-offer" element={<AcceptOffer />} />
                      <Route path="policies" element={<PolicyAcceptance />} />
                      <Route path="device" element={<DeviceReceipt />} />
                      <Route path="profile" element={<PersonalInformation />} />
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="documents" element={<UploadDocuments />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleGuard>
                } />

                {/* Admin Routes */}
                <Route path="admin/*" element={
                  <RoleGuard requiredRole="admin">
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="teams" element={<TeamsOverview />} />
                      <Route path="teams/:id" element={<TeamDetail />} />
                      <Route path="employees" element={<Employees />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="payroll" element={<PayrollManagement />} />
                      <Route path="analytics" element={<AnalyticsDashboard />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleGuard>
                } />

                {/* Shared/Top Level Redirections */}
                {/* These routes (add-candidate, etc) if they were previously top-level,
                     I've moved them under strict namespaces above or need to decide where they live.
                     
                     For backward compatibility or shared links, we can redirect legacy paths. */}
                <Route path="add-candidate" element={<Navigate to="/hr/add-candidate" replace />} />
                <Route path="send-offer-letter" element={<Navigate to="/hr/send-offer-letter" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </DashboardProvider>
  );
}

export default App;
