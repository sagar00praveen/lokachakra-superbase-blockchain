# Send Offer Letter Feature - Test Guide

## Overview
The "Send Offer Letter" feature is now complete! This is a multi-step wizard that allows HR to upload and send offer letters to candidates.

## Accessing the Feature

### Option 1: From the Dashboard
1. Navigate to http://localhost:5175
2. Find a candidate in the "Active Candidates" table
3. Hover over any candidate row
4. Click the "Send Offer" button that appears

### Option 2: Direct URL
- Navigate directly to: http://localhost:5175/send-offer-letter

## Features Implemented

### ✅ Step 1: Upload Offer Letter
- **Drag & Drop**: Drag a PDF file into the upload area
- **Click to Upload**: Click anywhere in the upload area to browse files
- **File Validation**:
  - Only PDF files accepted
  - Maximum file size: 10MB
  - Real-time error messages for invalid files
- **Visual Feedback**:
  - Hover effects on upload area
  - Drag-over animation
  - Upload success indicator
- **File Preview**: Shows uploaded file name and size
- **Remove File**: Option to remove and re-upload

### ✅ Step Progress Indicator
- **3-Step Workflow**:
  1. Upload Offer (Active)
  2. Review & Send (Locked until file uploaded)
  3. Confirmation (Final step)
- **Visual Progress**:
  - Active step highlighted in indigo
  - Completed steps show checkmark in emerald
  - Progress bar fills as you advance
  - Smooth transitions between steps

### ✅ UI/UX Features
- **Candidate Information Card**: Shows who will receive the offer
- **Breadcrumb Navigation**: Back button to return to candidates
- **Disabled State**: "Continue" button is disabled until file is uploaded
- **Smooth Transitions**: Step changes with animations
- **Error Handling**: Clear validation messages
- **Modern Design**: Matches the existing HR portal aesthetic

## User Flow

1. **Start**: Click "Send Offer" on any candidate
2. **Upload**: Drag/drop or click to upload PDF (max 10MB)
3. **Validation**: System validates file type and size
4. **Preview**: See uploaded file details
5. **Continue**: Button enables after successful upload
6. **Review** (Step 2): Review details before sending
7. **Send** (Step 3): Confirmation of sent offer letter

## Testing Checklist

- [ ] Upload a valid PDF file (< 10MB)
- [ ] Try uploading a non-PDF file (should show error)
- [ ] Try uploading a file > 10MB (should show error)
- [ ] Drag and drop a PDF file
- [ ] Click to browse and select a file
- [ ] Remove an uploaded file and re-upload
- [ ] Verify "Continue" button is disabled without file
- [ ] Navigate through all 3 steps
- [ ] Use back button to return to previous step
- [ ] Cancel and return to dashboard

## Technical Details

### New Files Created
- `src/pages/SendOfferLetter.jsx` - Main component

### Modified Files
- `src/App.jsx` - Added route
- `src/components/dashboard/ActiveCandidates.jsx` - Added "Send Offer" button

### Route
- Path: `/send-offer-letter`
- Navigation: From Dashboard → Click "Send Offer" on any candidate

## Next Steps (Future Enhancements)

1. **Step 2 Implementation**: Review & Send
   - Display PDF preview
   - Edit email message
   - Select recipients
   
2. **Step 3 Implementation**: Confirmation
   - Success message
   - Tracking information
   - View sent offers history

3. **Backend Integration**:
   - Upload file to server/cloud storage
   - Send email via API
   - Track delivery status
   - Store offer letter metadata

4. **Additional Features**:
   - Email template customization
   - Bulk send to multiple candidates
   - Offer letter status tracking
   - Resend functionality

## Screenshots Preview

The page includes:
- Clean header with title and subtitle
- Candidate info card with gradient background
- Step progress indicator with 3 steps
- Large drag-and-drop upload area
- File preview card after upload
- Action buttons (Cancel/Continue)
- Smooth animations and transitions

---

**Status**: ✅ Step 1 Complete and Ready for Testing
**App Running**: http://localhost:5175
