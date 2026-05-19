'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/actions/profile';

export default function SettingsPage() {
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    collegeCompany: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);

  function validateForm(formData: FormData) {
    const newErrors = {
      fullName: '',
      phone: '',
      collegeCompany: '',
    };

    const fullName = String(
      formData.get('fullName') || ''
    ).trim();

    const phone = String(
      formData.get('phone') || ''
    ).trim();

    const collegeCompany = String(
      formData.get('collegeCompany') || ''
    ).trim();

    // FULL NAME VALIDATION

    if (!fullName) {
      newErrors.fullName =
        'Full name is required';
    } else if (fullName.length < 3) {
      newErrors.fullName =
        'Name must be at least 3 characters';
    } else if (
      !/^[a-zA-Z\s]+$/.test(fullName)
    ) {
      newErrors.fullName =
        'Only letters and spaces allowed';
    }

    // PHONE VALIDATION

    if (!phone) {
      newErrors.phone =
        'Phone number is required';
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone =
        'Phone number must contain only numbers';
    } else if (phone.length !== 10) {
      newErrors.phone =
        'Phone number must be exactly 10 digits';
    }

    // COLLEGE / COMPANY VALIDATION

    if (!collegeCompany) {
      newErrors.collegeCompany =
        'College / Company is required';
    } else if (
      collegeCompany.length < 2
    ) {
      newErrors.collegeCompany =
        'Must be at least 2 characters';
    }

    setErrors(newErrors);

    return (
      !newErrors.fullName &&
      !newErrors.phone &&
      !newErrors.collegeCompany
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);

    const isValid =
      validateForm(formData);

    if (!isValid) return;

    try {
      setIsSaving(true);

      await updateProfile(formData);

      setToast({
        msg: 'Profile updated successfully!',
        ok: true,
      });

      setTimeout(() => {
        setToast(null);
      }, 4000);

    } catch (error) {
      console.error(error);

      setToast({
        msg:
          'Something went wrong while updating profile.',
        ok: false,
      });

      setTimeout(() => {
        setToast(null);
      }, 4000);

    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-8 text-white min-h-screen">
      <h1
        className="text-3xl font-bold mb-6"
        style={{
          fontFamily:
            'var(--font-display)',
        }}
      >
        Settings
      </h1>

      {/* TOAST */}

      {toast && (
        <div
          className={`mb-6 px-5 py-4 rounded-xl text-sm font-medium border transition-all duration-300 ${
            toast.ok
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="card-cyber p-6 md:p-8 max-w-xl">
        <h2 className="text-xl font-bold mb-4">
          Update Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* FULL NAME */}

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              className={`input-nn w-full ${
                errors.fullName
                  ? 'border border-red-500'
                  : ''
              }`}
              required
              minLength={3}
              placeholder="Enter your full name"
            />

            {errors.fullName && (
              <p className="text-red-400 text-xs mt-2">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* PHONE NUMBER */}

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              className={`input-nn w-full ${
                errors.phone
                  ? 'border border-red-500'
                  : ''
              }`}
              required
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="9876543210"
              onInput={(e) => {
                e.currentTarget.value =
                  e.currentTarget.value.replace(
                    /\D/g,
                    ''
                  );
              }}
            />

            {errors.phone && (
              <p className="text-red-400 text-xs mt-2">
                {errors.phone}
              </p>
            )}
          </div>

          {/* COLLEGE / COMPANY */}

          <div>
            <label className="block text-sm text-white/70 mb-1">
              College / Company
            </label>

            <input
              type="text"
              name="collegeCompany"
              className={`input-nn w-full ${
                errors.collegeCompany
                  ? 'border border-red-500'
                  : ''
              }`}
              required
              minLength={2}
              placeholder="Your college or company"
            />

            {errors.collegeCompany && (
              <p className="text-red-400 text-xs mt-2">
                {errors.collegeCompany}
              </p>
            )}
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={isSaving}
            className={`btn-pill btn-primary w-full justify-center mt-4 ${
              isSaving
                ? 'opacity-60 cursor-not-allowed'
                : ''
            }`}
          >
            {isSaving
              ? 'Saving...'
              : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}