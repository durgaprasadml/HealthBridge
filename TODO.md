# HealthBridge - Full Implementation Plan

## Phase 1: Database Schema Updates
- [ ] 1.1 Add patient profile fields (bloodGroup, allergies, emergencyContact, emergencyPhone) to User model
- [ ] 1.2 Create MedicalRecord model (diagnosis, medications, notes, doctorId, patientId)
- [ ] 1.3 Create Reminder model (checkupDate, message, patientId, doctorId, status)

## Phase 2: Backend Routes
- [ ] 2.1 Patient profile update endpoint (PUT /profile)
- [ ] 2.2 Public emergency access by phone (GET /emergency/:phone)
- [ ] 2.3 Doctor: Add medical record (POST /medical-records)
- [ ] 2.4 Doctor: Get patient's medical history (GET /medical-records/:patientId)
- [ ] 2.5 Patient: Get own medical records (GET /my-records)
- [ ] 2.6 Reminders: Create, list, complete

## Phase 3: Frontend Pages
- [ ] 3.1 Patient Signup with all fields
- [ ] 3.2 Patient Profile page (view/edit)
- [ ] 3.3 Emergency Access public page (no login needed)
- [ ] 3.4 Doctor: Patient medical records page
- [ ] 3.5 Doctor: Add medical record form
- [ ] 3.6 Patient: View medical history
- [ ] 3.7 Reminders UI

## Phase 4: UI Polish
- [ ] 4.1 Consistent styling across all pages
- [ ] 4.2 Loading states
- [ ] 4.3 Error handling

