import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import Layout from './components/layout/Layout';
import PortalSelection from './pages/PortalSelection';
import DashboardRouter from './pages/DashboardRouter';
import TeamsOverview from './pages/TeamsOverview';
import TeamDetail from './pages/TeamDetail';
import AddCandidate from './pages/AddCandidate';
import SendOfferLetter from './pages/SendOfferLetter';
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
                <Route path="dashboard" element={<DashboardRouter />} />
                <Route path="teams-overview" element={<TeamsOverview />} />
                <Route path="add-candidate" element={<AddCandidate />} />
                <Route path="send-offer-letter" element={<SendOfferLetter />} />
                <Route path="hr/orientations" element={<OrientationManagement />} />
                <Route path="hr/documents" element={<DocumentManagement />} />
                <Route path="it/requests" element={<ITRequest />} />
                <Route path="it/assets" element={<AssetManagement />} />
                <Route path="it/assets/allocate" element={<AssetAllocation />} />
                <Route path="it/orientations" element={<ITOrientation />} />
                <Route path="it/settings" element={<ITSettings />} />
                <Route path="candidate-profile/:id" element={<CandidateProfile />} />
                <Route path="candidate/orientations" element={<MyOrientations />} />
                <Route path="candidate/accept-offer" element={<AcceptOffer />} />
                <Route path="candidate/policies" element={<PolicyAcceptance />} />
                <Route path="candidate/device" element={<DeviceReceipt />} />
                <Route path="candidate/profile" element={<PersonalInformation />} />
                <Route path="candidate/notifications" element={<Notifications />} />
                <Route path="candidate/documents" element={<UploadDocuments />} />
                <Route path="admin/teams" element={<TeamsOverview />} />
                <Route path="admin/teams/:id" element={<TeamDetail />} />
                <Route path="admin/employees" element={<Employees />} />
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="admin/settings" element={<Settings />} />
                <Route path="admin/payroll" element={<PayrollManagement />} />
                <Route path="admin/analytics" element={<AnalyticsDashboard />} />
                {/* Fallback to dashboard if path matches nothing else under /* */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </DashboardProvider>
  );
}

export default App;
