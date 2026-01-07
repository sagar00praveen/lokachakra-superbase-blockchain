# Multi-Portal HR System - Navigation Guide

## Overview
The application has been restructured into a comprehensive Multi-Portal System. users now enter through a central portal selection screen and are routed to role-specific dashboards.

## 🚀 How to Access

**URL**: http://localhost:5175

### 1. Portal Selection (Landing Page)
When you open the app, you will see the **Portal Selection** screen.
Choose a role to enter. You will be redirected to a secure **Login Page** tailored to that role.

- **HR Portal**: Manage candidates, sending offers, onboarding.
- **IT Portal**: Manage system access, account creation requests.
- **Candidate Portal**: Track application status, upload documents.
- **Admin Portal**: System settings, user management, analytics.

### 2. Role-Specific Feature
Each portal has a unique dashboard and menu:

#### 👩‍💼 HR Portal
- **Dashboard**: Overview of candidates and tasks.
- **Orientation Management**: Schedule and manage onboarding sessions.
- **Document Management**: Review uploaded documents and approve/reject.
- **Teams Overview**: View team structures.
- **Add Candidate**: Create new candidate profiles.
- **Send Offer Letter**: Upload and send offer letters.

#### 💻 IT Portal
- **Dashboard**: Pending IT requests (email creation, system setup).
- **IT Request**: Manage IT support requests and ticket queue.
- **Asset Management**: Track and manage IT assets and equipment.
- **Orientation**: IT onboarding and training sessions.
- **Settings**: Configure IT system preferences and access.

#### 🎓 Candidate Portal
- **Dashboard**: Track your onboarding progress (100% complete example).
- **My Documents**: Upload and manage onboarding documents.
- **My Orientations**: View and join upcoming orientation sessions.
- **Policy Acceptance**: Review and digitally sign mandatory policies.
- **Device Receipt**: Confirm receipt of allocated assets and view credentials.
- **Personal Information**: View and edit personal details, addresses, and emergency contacts.
- **Upload Documents**: Submit required documents (e.g., Aadhaar, PAN).

#### 🛡️ Admin Portal
- **System Stats**: real-time system health and usage.
- **Activity Log**: Audit trail of all system actions.
- **Teams Overview**: View team structures.
- **Employees**: Complete employee directory with search and filters.
- **User Management**: Manage system users.
- **Analytics**: Key performance metrics and onboarding trends.
- **Payroll**: Run payroll, view reports, and manage disbursement.

## 🔄 User Flow Examples

### HR Flow: Sending an Offer
1. Select **HR Portal**.
2. Go to **Dashboard**.
3. Hover over a candidate in the "Active Candidates" list.
4. Click **"Send Offer"**.
5. Upload PDF and complete the workflow.

### IT Flow: Processing a Request
1. Select **IT Portal**.
2. Go to **Dashboard**.
3. View "Pending Requests".
4. Click "Process" on a waiting IT request.

### Navigation Tips
- Click the **"LokaChakra"** logo in the sidebar to return to the active dashboard.
- Click the **Logout** icon (next to user profile) to return to the Portal Selection screen.
- The **Header** title changes automatically based on your current page.

---

**Status**: ✅ Multi-Portal Architecture Fully Implemented
**App Running**: http://localhost:5175
