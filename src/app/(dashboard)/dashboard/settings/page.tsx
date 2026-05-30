'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { getProfile, updateProfile, changeEmail, deleteAccount } from '@/app/actions/profile';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Check, 
  X, 
  Loader2, 
  Lock,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface UserProfile {
  full_name: string | null;
  phone: string | null;
  college_company: string | null;
  email: string | null;
  role: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailChanging, setEmailChanging] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeCompany, setCollegeCompany] = useState('');

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeCompany: '',
  });

  const [toast, setToast] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);

  // Load profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const data = await getProfile();
        setProfile(data as UserProfile);
        setFullName(data.full_name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setCollegeCompany(data.college_company || '');
      } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load profile details.', false);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  // Real-time validations
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
    
    if (!val.trim()) {
      setErrors(prev => ({ ...prev, fullName: 'Full name is required' }));
    } else if (val.trim().length < 3) {
      setErrors(prev => ({ ...prev, fullName: 'Name must be at least 3 characters' }));
    } else if (!/^[a-zA-Z\s]+$/.test(val)) {
      setErrors(prev => ({ ...prev, fullName: 'Only letters and spaces allowed' }));
    } else {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (!val) setErrors(prev => ({ ...prev, email: 'Email is required' }));
    else if (!val.includes('@')) setErrors(prev => ({ ...prev, email: 'Valid email is required' }));
    else setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    
    if (!val) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
    } else if (val.length !== 10) {
      setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleCollegeCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCollegeCompany(val);
    
    if (!val.trim()) {
      setErrors(prev => ({ ...prev, collegeCompany: 'College / Company is required' }));
    } else if (val.trim().length < 2) {
      setErrors(prev => ({ ...prev, collegeCompany: 'Must be at least 2 characters' }));
    } else if (!/^[a-zA-Z\s.,'\/&()-]+$/.test(val.trim())) {
      setErrors(prev => ({ ...prev, collegeCompany: 'Only letters and standard punctuation allowed (no numbers)' }));
    } else {
      setErrors(prev => ({ ...prev, collegeCompany: '' }));
    }
  };

  const startEditing = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCollegeCompany(profile.college_company || '');
      setErrors({ fullName: '', email: '', phone: '', collegeCompany: '' });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    // Reset values to original profile data
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCollegeCompany(profile.college_company || '');
    }
    setErrors({ fullName: '', email: '', phone: '', collegeCompany: '' });
  };

  // Check if form is valid to submit
  const isFormInvalid = 
    !!(errors.fullName || errors.email || errors.phone || errors.collegeCompany) ||
    !fullName.trim() || fullName.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(fullName) ||
    !email.trim() || !email.includes('@') ||
    !phone || phone.length !== 10 ||
    !collegeCompany.trim() || collegeCompany.trim().length < 2 ||
    !/^[a-zA-Z\s.,'\/&()-]+$/.test(collegeCompany.trim());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isFormInvalid) return;

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('phone', phone);
      formData.append('collegeCompany', collegeCompany.trim());

      await updateProfile(formData);

      let msg = 'Profile updated successfully!';
      if (email.trim() !== profile?.email) {
        const emailRes = await changeEmail(email.trim());
        if (emailRes.success) {
          msg = 'Profile updated! Check your email to verify the new address.';
        } else {
          msg = `Profile updated, but email change failed: ${emailRes.error}`;
        }
      }

      setProfile(prev => prev ? {
        ...prev,
        full_name: fullName.trim(),
        phone,
        college_company: collegeCompany.trim()
      } : null);

      showToast(msg, true);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      showToast('Something went wrong while updating profile.', false);
    } finally {
      setIsSaving(false);
    }
  }

  // Loading view
  if (isLoading) {
    return (
      <div className="p-8 text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="text-sm text-white/40 tracking-wider">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <section className="flex-1 overflow-y-auto min-w-0 p-8">
        <div className="max-w-xl mx-auto">
          <h1
          className="text-3xl font-bold mb-6 tracking-wide"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Settings
        </h1>

        {/* TOAST */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 px-5 py-4 rounded-xl text-sm font-medium border transition-all duration-300 ${
                toast.ok
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-cyber p-6 md:p-8 relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] pointer-events-none rounded-full blur-xl" />

          {/* CARD HEADER */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white/90">
                {isEditing ? 'Edit Profile Details' : 'Account Profile'}
              </h2>
              <p className="text-xs text-white/40 mt-1">Manage your credentials</p>
            </div>
            
            {!isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold tracking-wide uppercase transition-all duration-200 text-white/80 hover:text-white"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              /* DISPLAY MODE */
              <motion.div
                key="display"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Profile Grid */}
                <div className="grid gap-6">
                  {/* Full Name */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Full Name</p>
                      <p className="text-base font-semibold text-white/90 mt-0.5">
                        {profile?.full_name || <span className="text-white/20 italic">Not set</span>}
                      </p>
                    </div>
                  </div>

                  {/* Email (Read only) */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Email Address</p>
                        <span className="flex items-center gap-0.5 text-[10px] text-white/20 uppercase tracking-wider bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.04]">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      </div>
                      <p className="text-base font-semibold text-white/90 mt-0.5">
                        {profile?.email || <span className="text-white/20 italic">No email linked</span>}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Phone Number</p>
                      <p className="text-base font-semibold text-white/90 mt-0.5">
                        {profile?.phone || <span className="text-white/20 italic">Not set</span>}
                      </p>
                    </div>
                  </div>

                  {/* College Company */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">College / Company</p>
                      <p className="text-base font-semibold text-white/90 mt-0.5">
                        {profile?.college_company || <span className="text-white/20 italic">Not set</span>}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Platform Role</p>
                      <div className="mt-1">
                        <span className="tag-label border-white/20 text-white bg-white/[0.04]">
                          {profile?.role || 'USER'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* EDIT MODE */
              <motion.form
                key="edit"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* FULL NAME */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 font-semibold mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={handleNameChange}
                    className={`input-nn w-full ${
                      errors.fullName ? 'border-red-500/70 focus:border-red-500' : 'focus:border-white/50'
                    }`}
                    required
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                      {errors.fullName}
                    </motion.p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 font-semibold mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`input-nn w-full ${
                      errors.email ? 'border-red-500/70 focus:border-red-500' : 'focus:border-white/50'
                    }`}
                    required
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                      {errors.email}
                    </motion.p>
                  )}
                  {email !== profile?.email && !errors.email && (
                    <p className="text-[11px] text-amber-400/80 mt-1.5">
                      Changing email requires verification of both old and new addresses.
                    </p>
                  )}
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 font-semibold mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`input-nn w-full ${
                      errors.phone ? 'border-red-500/70 focus:border-red-500' : 'focus:border-white/50'
                    }`}
                    required
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* COLLEGE / COMPANY */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 font-semibold mb-1.5">
                    College / Company
                  </label>
                  <input
                    type="text"
                    value={collegeCompany}
                    onChange={handleCollegeCompanyChange}
                    className={`input-nn w-full ${
                      errors.collegeCompany ? 'border-red-500/70 focus:border-red-500' : 'focus:border-white/50'
                    }`}
                    required
                    placeholder="Your college or company name"
                  />
                  {errors.collegeCompany && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                      {errors.collegeCompany}
                    </motion.p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isFormInvalid || isSaving}
                    className={`btn-pill btn-primary flex-1 justify-center ${
                      isFormInvalid || isSaving ? 'opacity-40 cursor-not-allowed hover:shadow-none' : ''
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="btn-pill btn-outline flex-1 justify-center"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ── Danger Zone ─────────────────────────────── */}
        <div className="card-cyber p-6 md:p-8 mt-6 border-red-500/20">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-red-500/10">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
              <p className="text-xs text-white/40 mt-0.5">Irreversible actions</p>
            </div>
          </div>

          <p className="text-sm text-white/50 mb-4">
            Deleting your account will permanently remove your profile, team memberships, and submissions. 
            This action cannot be undone. <span className="font-semibold text-white/80 block mt-2">Note: If you have already paid the registration fee, there is no refund available upon account deletion.</span>
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn-pill text-sm py-2 px-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-cyber p-6 md:p-8 max-w-md w-full border-red-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    Delete Account?
                  </p>
                  <p className="text-white/50 text-sm mt-1">
                    This will permanently delete your account, profile, team, and all submissions. This cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">
                  Type <span className="text-red-400 font-mono">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="input-nn w-full border-red-500/30 focus:border-red-500/50"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  className="btn-pill btn-outline text-sm py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    const res = await deleteAccount();
                    if (res.success) {
                      window.location.href = '/login';
                    } else {
                      showToast(res.error || 'Failed to delete account', false);
                      setIsDeleting(false);
                    }
                  }}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className={`btn-pill text-sm py-2 px-4 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors ${
                    deleteConfirmText !== 'DELETE' || isDeleting ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  {isDeleting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                  ) : (
                    'Permanently Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      </section>
    </main>
  );
}