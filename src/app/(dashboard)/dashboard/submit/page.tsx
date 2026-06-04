'use client';

import { useState, useTransition, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { upsertSubmission, getMySubmission, lockSubmission } from '@/app/actions/submission';
import { getMyTeam } from '@/app/actions/team';
import { getPaymentStatus } from '@/app/actions/payment';
import { Track, Submission } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRef } from 'react';
import {
  sanitizeTitleInput,
  sanitizeDescriptionInput,
  validateTitle,
  validateDescription,
} from '@/lib/validation/submission-text';
import { Cloud, Clapperboard, BookOpen, Gamepad2, Bot, AlertTriangle, Lock, Check, FileText, FolderOpen, CreditCard, Trash2, Plus } from 'lucide-react';
import PayButton from '@/components/dashboard/pay-button';

const TRACKS: { value: Track; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'SaaS',         label: 'SaaS',         icon: <Cloud size={16} />,         desc: 'Software as a Service, productivity tools, enterprise solutions' },
  { value: 'Animation',    label: 'Animation',    icon: <Clapperboard size={16} />,  desc: '2D/3D animation, motion graphics, interactive web animations' },
  { value: 'Storytelling', label: 'Storytelling', icon: <BookOpen size={16} />,       desc: 'Interactive narratives, digital storytelling, immersive experiences' },
  { value: 'Gaming',       label: 'Gaming',       icon: <Gamepad2 size={16} />,      desc: 'Browser games, indie titles, gamified applications' },
  { value: 'AI',           label: 'AI',           icon: <Bot size={16} />,           desc: 'Machine learning, LLMs, computer vision, AI agents' },
];

type FormState = {
  title: string;
  description: string;
  track: Track | '';
  repo_url: string;
  demo_url: string;
  file_url: string;
};

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    track: '',
    repo_url: '',
    demo_url: '',
    file_url: '',
  });
  const [existing, setExisting] = useState<Submission | null>(null);
  const [extraLinks, setExtraLinks] = useState<string[]>(['']);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; description?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean }>({});
  const [role, setRole] = useState<string>('loading');
  const [isTeam, setIsTeam] = useState<boolean | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'NONE' | 'INITIATED' | 'SUCCESS' | 'FAILED' | null>(null);
  const [paidTrack, setPaidTrack] = useState<Track | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    id?: string;
    amount?: number;
    currency?: string;
    razorpay_payment_id?: string | null;
    created_at?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing submission on mount
  useEffect(() => {
    async function loadData() {
      // 1. Fetch user role
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
        if (profile) setRole(profile.role);
      }

      // 2. Fetch team status
      const teamRes = await getMyTeam();
      const hasTeam = teamRes.success && !!teamRes.data;
      setIsTeam(hasTeam);

      // 3. Fetch payment status
      const paymentRes = await getPaymentStatus();
      setPaymentStatus(paymentRes.status);
      const pTrack = paymentRes.track ?? null;
      setPaidTrack(pTrack);
      if (paymentRes.status === 'SUCCESS') {
        setPaymentDetails({
          id: paymentRes.id,
          amount: paymentRes.amount,
          currency: paymentRes.currency,
          razorpay_payment_id: paymentRes.razorpay_payment_id,
          created_at: paymentRes.created_at,
        });
      }

      // 4. Fetch submission
      const res = await getMySubmission();
      if (res.success && res.data) {
        const s = res.data;
        setExisting(s);
        const title = sanitizeTitleInput(s.title ?? '');
        const description = sanitizeDescriptionInput(s.description ?? '');
        setForm({
          title,
          description,
          track: pTrack ?? s.track ?? '',
          repo_url: s.repo_url ?? '',
          demo_url: s.demo_url ?? '',
          file_url: s.file_url ?? '',
        });
        const loadedDemoUrls = (s.demo_url ?? '').split('|||').filter(Boolean);
        setExtraLinks(loadedDemoUrls.length > 0 ? loadedDemoUrls : ['']);
        setCharCount(description.length);
      } else if (pTrack) {
        // Pre-fill paid track even if no submission exists yet
        setForm((f) => ({ ...f, track: pTrack }));
      }
      setLoadingExisting(false);
    }
    loadData();
  }, []);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  }

  function handleTitleChange(raw: string) {
    const value = sanitizeTitleInput(raw);
    setForm((f) => ({ ...f, title: value }));
    if (touched.title) {
      setFieldErrors((e) => ({ ...e, title: validateTitle(value) ?? undefined }));
    }
  }

  function handleDescriptionChange(raw: string) {
    const value = sanitizeDescriptionInput(raw);
    setForm((f) => ({ ...f, description: value }));
    setCharCount(value.length);
    if (touched.description) {
      setFieldErrors((e) => ({
        ...e,
        description: validateDescription(value) ?? undefined,
      }));
    }
  }

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (key === 'title') {
      handleTitleChange(value as string);
      return;
    }
    if (key === 'description') {
      handleDescriptionChange(value as string);
      return;
    }
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateForm(): boolean {
    const titleError = validateTitle(form.title);
    const descriptionError = validateDescription(form.description);
    const errors: { title?: string; description?: string } = {};
    if (titleError) errors.title = titleError;
    if (descriptionError) errors.description = descriptionError;
    setFieldErrors(errors);
    setTouched({ title: true, description: true });
    return !titleError && !descriptionError;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;
    if (!validateForm()) {
      showToast('Please fix the errors in Project Title and Description.', false);
      return;
    }
    if (!form.track) {
      showToast('Please select a track before saving.', false);
      return;
    }
    startTransition(async () => {
      const res = await upsertSubmission({
        title: form.title,
        description: form.description,
        track: form.track as Track,
        repo_url: form.repo_url,
        demo_url: form.demo_url,
        file_url: form.file_url,
      });
      if (res.success) {
        setExisting(res.data);
        showToast('Submission saved successfully!', true);
      } else {
        showToast(res.error, false);
      }
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check deadline before upload
    const deadline = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE ? new Date(process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE) : null;
    if (deadline && new Date() > deadline) {
      showToast('Submission deadline has passed. Uploads are no longer allowed.', false);
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('submission-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('submission-files')
        .getPublicUrl(filePath);

      setForm(f => ({ ...f, file_url: publicUrl }));
      showToast('File uploaded successfully!', true);
    } catch (error: any) {
      showToast(error.message || 'Error uploading file', false);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFinalize() {
    if (!existing) return;
    if (!validateForm()) {
      showToast('Please fix the errors in Project Title and Description before finalizing.', false);
      return;
    }
    if (!window.confirm('Are you sure? Once finalized, you cannot edit your submission again.')) return;

    startTransition(async () => {
      const res = await lockSubmission();
      if (res.success) {
        setExisting(res.data);
        showToast('Submission finalized and locked!', true);
      } else {
        showToast(res.error, false);
      }
    });
  }

  const isLocked = existing?.status === 'SUBMITTED' || existing?.status === 'JUDGED';
  const isPaid = paymentStatus === 'SUCCESS';

  // Compute USD price for Pay & Submit button
  const prices: Record<Track, { ind: number; team?: number }> = {
    'SaaS': { ind: 15, team: 25 }, 'Animation': { ind: 12, team: 18 },
    'Storytelling': { ind: 8, team: 12 }, 'Gaming': { ind: 18, team: 30 }, 'AI': { ind: 25, team: 35 },
  };
  const selectedTrack = ((isPaid && paidTrack) ? paidTrack : form.track) as Track | '';
  const priceUSD = selectedTrack ? (isTeam && prices[selectedTrack]?.team ? prices[selectedTrack].team : prices[selectedTrack]?.ind) ?? 0 : 0;

  // Handle Pay & Submit: save draft first, then on payment success lock it
  async function handlePayAndSubmitSuccess() {
    // Save the submission first
    const res = await upsertSubmission({
      title: form.title,
      description: form.description,
      track: (paidTrack ?? form.track) as Track,
      repo_url: form.repo_url,
      demo_url: form.demo_url,
      file_url: form.file_url,
    });
    if (res.success) {
      setExisting(res.data);
      // Now lock it
      const lockRes = await lockSubmission();
      if (lockRes.success) {
        setExisting(lockRes.data);
        setPaymentStatus('SUCCESS');
        const paymentRes = await getPaymentStatus();
        if (paymentRes.status === 'SUCCESS') {
          setPaymentDetails({
            id: paymentRes.id,
            amount: paymentRes.amount,
            currency: paymentRes.currency,
            razorpay_payment_id: paymentRes.razorpay_payment_id,
            created_at: paymentRes.created_at,
          });
        }
        showToast('Payment confirmed & submission finalized!', true);
      }
    }
  }

  function printReceipt() {
    if (!paymentDetails) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const receiptHtml = `
      <html>
        <head>
          <title>Payment Receipt - NeuralNexus Hackathon</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; padding: 40px; line-height: 1.6; }
            .receipt-box { max-width: 600px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); padding: 30px; border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #10b981; }
            .title { text-align: right; }
            .title h2 { margin: 0; color: #10b981; }
            .title p { margin: 5px 0 0 0; font-size: 12px; color: #666; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .col h4 { margin: 0 0 8px 0; color: #4b5563; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
            .col p { margin: 0; font-size: 14px; font-weight: 600; color: #1f2937; }
            .col p.mono { font-family: monospace; font-size: 13px; color: #374151; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .details-table th { background: #f3f4f6; color: #4b5563; font-size: 12px; text-transform: uppercase; text-align: left; padding: 12px; }
            .details-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            .total-section { display: flex; justify-content: flex-end; font-size: 18px; font-weight: bold; padding-top: 10px; }
            .total-label { margin-right: 20px; color: #4b5563; }
            .total-val { color: #10b981; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 12px; color: #9ca3af; margin-top: 50px; }
            @media print {
              body { padding: 0; }
              .receipt-box { border: none; box-shadow: none; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <div class="logo">NeuralNexus</div>
              <div class="title">
                <h2>RECEIPT</h2>
                <p>Reference: ${paymentDetails.id || 'N/A'}</p>
              </div>
            </div>
            
            <div class="grid">
              <div class="col">
                <h4>Transaction Date</h4>
                <p>${paymentDetails.created_at ? new Date(paymentDetails.created_at).toLocaleString() : new Date().toLocaleString()}</p>
              </div>
              <div class="col">
                <h4>Payment Status</h4>
                <p style="color: #10b981;">SUCCESSFULLY CAPTURED</p>
              </div>
              <div class="col">
                <h4>Registered Track</h4>
                <p>${existing?.track || paidTrack || 'N/A'}</p>
              </div>
              <div class="col">
                <h4>Payment Method</h4>
                <p>${paymentDetails.razorpay_payment_id ? 'Razorpay (' + paymentDetails.razorpay_payment_id + ')' : 'Manual Payment'}</p>
              </div>
            </div>
            
            <table class="details-table">
               <thead>
                 <tr>
                   <th>Description</th>
                   <th style="text-align: right;">Amount</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>NeuralNexus Hackathon Registration Fee</td>
                   <td style="text-align: right;">${paymentDetails.currency === 'USD' ? '$' : '₹'}${paymentDetails.amount ? paymentDetails.amount.toFixed(2) : '0.00'} ${paymentDetails.currency || 'USD'}</td>
                 </tr>
               </tbody>
            </table>
            
            <div class="total-section">
              <span class="total-label">Total Paid:</span>
              <span class="total-val">${paymentDetails.currency === 'USD' ? '$' : '₹'}${paymentDetails.amount ? paymentDetails.amount.toFixed(2) : '0.00'} ${paymentDetails.currency || 'USD'}</span>
            </div>
            
            <div class="footer">
              Thank you for registering for AOT Hackathon 2026. See you at the event!<br>
              This is a computer-generated receipt and requires no signature.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  }

  const deadlineStr = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE
    ? new Date(process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE).toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : 'TBD';

  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 sm:px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Submit Project
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">AOT Hackathon 2026</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 pl-10 sm:pl-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
            Deadline: {deadlineStr}
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-10 space-y-8 max-w-3xl mx-auto w-full">

          {role === 'ADMIN' || role === 'JUDGE' ? (
            <div className="card-cyber p-5 sm:p-8 text-center border-red-500/30">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Access Restricted
              </h2>
              <p className="text-white/60">
                You are currently logged in as an <span className="font-bold text-white">{role}</span>.
                Admins and Judges cannot participate in the hackathon or submit projects.
              </p>
            </div>
          ) : isTeam === false ? (
            <div className="card-cyber p-5 sm:p-8 text-center border-red-500/30">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Access Restricted
              </h2>
              <p className="text-white/60">
                You need to be part of a team to submit a project. Head to <a href="/dashboard/team" className="text-emerald-400 underline">Team Setup</a> to create or join one.
              </p>
            </div>
          ) : (
            <>
              {/* Status banner */}
              {existing && (
                <div className={`card-cyber p-4 sm:p-5 flex items-start gap-3 sm:gap-4 ${isLocked ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                    isLocked ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isLocked ? <Lock className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-emerald-400 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                      {isLocked ? 'Submission Finalized' : 'Draft Saved'}
                    </p>
                    <p className="text-white/40 text-sm mt-0.5">
                      {isLocked ? 'Finalized on' : 'Last saved'}:{' '}
                      {existing.submitted_at
                        ? new Date(existing.submitted_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                        : '—'}
                      {' '}· Status: <span className="text-white/60 font-mono tracking-tight">{existing.status}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Receipt */}
              {isPaid && paymentDetails && (
                <div className="card-cyber p-6 border-emerald-500/30 bg-emerald-500/5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.06] pb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                        Registration Receipt
                      </h3>
                      <p className="text-xs text-white/40 mt-0.5">Payment Captured Successfully</p>
                    </div>
                    <button
                      type="button"
                      onClick={printReceipt}
                      className="btn-pill btn-primary text-xs flex items-center gap-2 py-2 px-4"
                    >
                      <FileText size={14} /> Download Receipt (PDF)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/40 uppercase tracking-wider block mb-0.5">Receipt Reference</span>
                      <span className="text-white font-mono break-all">{paymentDetails.id}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase tracking-wider block mb-0.5">Transaction ID</span>
                      <span className="text-white font-mono break-all">{paymentDetails.razorpay_payment_id || 'Manual Payment'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase tracking-wider block mb-0.5">Registration Track</span>
                      <span className="text-white">{existing?.track || paidTrack || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase tracking-wider block mb-0.5">Amount Paid</span>
                      <span className="text-emerald-400 font-bold">
                        {paymentDetails.currency === 'USD' ? '$' : '₹'}{paymentDetails.amount?.toFixed(2)} {paymentDetails.currency || 'USD'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Toast */}
              {toast && (
                <div
                  className={`px-5 py-4 rounded-xl text-sm font-medium border ${
                    toast.ok
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {toast.msg}
                </div>
              )}

              {/* Submission form */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="tag-label">Project Details</div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Your Submission
                  </h2>
                </div>

                {loadingExisting ? (
                  <div className="card-cyber p-5 sm:p-10 flex items-center justify-center text-white/30 text-sm">
                    Loading…
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="card-cyber p-4 sm:p-6 space-y-4">
                      <label className="block">
                        <span className="text-xs text-white/40 uppercase tracking-widest mb-2 block">
                          Project Title <span className="text-red-400">*</span>
                        </span>
                        <input
                          id="submit-title"
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          spellCheck
                          className={`input-nn ${fieldErrors.title ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                          placeholder="e.g. MediScan — AI-powered drug interaction checker"
                          value={form.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          onBlur={() => {
                            setTouched((t) => ({ ...t, title: true }));
                            setFieldErrors((err) => ({
                              ...err,
                              title: validateTitle(form.title) ?? undefined,
                            }));
                          }}
                          disabled={isLocked}
                          required
                          minLength={3}
                          maxLength={120}
                          aria-invalid={!!fieldErrors.title}
                          aria-describedby={fieldErrors.title ? 'submit-title-error' : 'submit-title-hint'}
                        />
                        <p id="submit-title-hint" className="text-[11px] text-white/25 mt-1.5">
                          Letters, numbers, spaces, and . , &apos; - ( ) &amp; only
                        </p>
                        {fieldErrors.title && (
                          <p id="submit-title-error" role="alert" className="text-xs text-red-400 mt-1.5">
                            {fieldErrors.title}
                          </p>
                        )}
                      </label>

                      {/* Description */}
                      <label className="block">
                        <span className="text-xs text-white/40 uppercase tracking-widest mb-2 flex justify-between">
                          <span>
                            Description <span className="text-red-400">*</span>
                          </span>
                          <span className={charCount > 900 ? 'text-amber-400' : ''}>{charCount}/1000</span>
                        </span>
                        <textarea
                          id="submit-description"
                          inputMode="text"
                          autoComplete="off"
                          spellCheck
                          className={`input-nn min-h-[140px] resize-none overflow-hidden ${fieldErrors.description ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                          placeholder="Describe what your project does, the problem it solves, and the tech stack you used…"
                          value={form.description}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = '140px';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                          onChange={(e) => handleDescriptionChange(e.target.value)}
                          onBlur={() => {
                            setTouched((t) => ({ ...t, description: true }));
                            setFieldErrors((err) => ({
                              ...err,
                              description: validateDescription(form.description) ?? undefined,
                            }));
                          }}
                          disabled={isLocked}
                          required
                          minLength={10}
                          maxLength={1000}
                          aria-invalid={!!fieldErrors.description}
                          aria-describedby={fieldErrors.description ? 'submit-description-error' : 'submit-description-hint'}
                        />
                        <p id="submit-description-hint" className="text-[11px] text-white/25 mt-1.5">
                          Plain text only — no URLs, emails, or special symbols like @ # $ %
                        </p>
                        {fieldErrors.description && (
                          <p id="submit-description-error" role="alert" className="text-xs text-red-400 mt-1.5">
                            {fieldErrors.description}
                          </p>
                        )}
                      </label>
                    </div>

                    {/* Track selector */}
                    <div className="card-cyber p-4 sm:p-6">
                      <span className="text-xs text-white/40 uppercase tracking-widest mb-4 block">
                        Track <span className="text-red-400">*</span>
                      </span>
                      <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Select hackathon track">
                        {TRACKS.map((t) => {
                          const selected = form.track === t.value;
                          const isTrackLocked = !!paidTrack && isPaid && paidTrack !== t.value;
                          const isDisabled = isLocked || isTrackLocked;
                          return (
                            <button
                              key={t.value}
                              type="button"
                              id={`track-${t.value.toLowerCase().replace('/', '-')}`}
                              role="radio"
                              aria-checked={selected}
                              onClick={() => !isDisabled && handleChange('track', t.value)}
                              disabled={isDisabled}
                              className={`text-left p-4 rounded-xl border transition-all ${
                                selected
                                  ? 'bg-white/10 border-white/40 text-white'
                                  : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'
                              } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                              <p className="font-semibold text-sm mb-0.5 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                                {t.icon} {t.label}
                                {isTrackLocked && <Lock size={12} className="text-amber-400" />}
                              </p>
                              <p className="text-xs opacity-70 leading-relaxed">{t.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="card-cyber p-4 sm:p-6 space-y-4">
                      <span className="text-xs text-white/40 uppercase tracking-widest block">Links</span>
                      <label className="block">
                        <span className="text-xs text-white/30 mb-2 flex items-center justify-between">
                          <span>GitHub / GitLab Repo</span>
                          <span className="text-white/20 italic lowercase">Optional</span>
                        </span>
                        <input
                          id="submit-repo"
                          type="url"
                          className="input-nn"
                          placeholder="https://github.com/your-team/project"
                          value={form.repo_url}
                          onChange={(e) => handleChange('repo_url', e.target.value)}
                          disabled={isLocked}
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs text-white/30 mb-2 flex items-center justify-between">
                          <span>Demo URL / Additional Links</span>
                          <span className="text-white/20 italic lowercase">Optional</span>
                        </span>
                        {extraLinks.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                              type="url"
                              className="input-nn flex-1"
                              placeholder="https://..."
                              value={link}
                              onChange={(e) => {
                                const newLinks = [...extraLinks];
                                newLinks[idx] = e.target.value;
                                setExtraLinks(newLinks);
                                handleChange('demo_url', newLinks.join('|||'));
                              }}
                              disabled={isLocked}
                            />
                            {!isLocked && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = extraLinks.filter((_, i) => i !== idx);
                                  if (newLinks.length === 0) newLinks.push('');
                                  setExtraLinks(newLinks);
                                  handleChange('demo_url', newLinks.join('|||'));
                                }}
                                className="p-3 text-white/30 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => setExtraLinks([...extraLinks, ''])}
                            className="flex items-center gap-2 text-xs text-emerald-400/80 hover:text-emerald-400 transition-colors mt-2"
                          >
                            <Plus size={14} /> Add another link
                          </button>
                        )}
                      </label>
                    </div>

                    {/* File upload */}
                    <div className="card-cyber p-4 sm:p-6">
                      <span className="text-xs text-white/40 uppercase tracking-widest mb-4 block">File Upload (optional)</span>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.zip,.rar,.7z,.jpg,.png,.ppt,.pptx,.doc,.docx"
                      />

                      {form.file_url ? (
                        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><FileText className="w-6 h-6 text-emerald-400" /></div>
                            <div>
                              <p className="text-emerald-400 font-semibold text-sm">File Uploaded</p>
                              <a 
                                href={form.file_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-white/40 text-xs hover:text-white transition-colors"
                              >
                                View uploaded file →
                              </a>
                            </div>
                          </div>
                          {!isLocked && (
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, file_url: '' }))}
                              className="w-full sm:w-auto text-center justify-center text-xs text-red-400/60 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ) : (
                        <div
                          onClick={() => !isLocked && !isUploading && fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center gap-3 text-center transition-all ${
                            isLocked || isUploading
                              ? 'border-white/[0.06] opacity-30 cursor-not-allowed'
                              : 'border-white/[0.12] hover:border-white/30 cursor-pointer hover:bg-white/[0.02]'
                          }`}
                        >
                          {isUploading ? (
                            <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full mb-2" />
                          ) : (
                            <FolderOpen className="w-8 h-8 text-white/40" />
                          )}
                          <p className="text-white/50 text-sm font-medium">
                            {isUploading ? 'Uploading file...' : 'Drag & drop or click to upload'}
                          </p>
                          <p className="text-white/30 text-xs">PDF, ZIP, PPT, DOC, or any file ≤ 50 MB</p>
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 border-t border-white/10 pt-8 mt-8 w-full">
                      {!isLocked && (
                        <button
                          id="save-submission-btn"
                          type="submit"
                          disabled={isPending}
                          className={`btn-pill w-full sm:w-auto justify-center ${isPending ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                        >
                          {isPending ? 'Saving…' : `${existing ? 'Update' : 'Save'} Draft →`}
                        </button>
                      )}

                      {/* Pay & Submit (when unpaid) */}
                      {existing && !isLocked && !isPaid && selectedTrack && (
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <p className="text-xs text-amber-400/70 flex items-center gap-1.5 justify-center sm:justify-start">
                            <CreditCard size={12} /> Payment required to finalize submission
                          </p>
                          <PayButton
                            amount={priceUSD}
                            currency="USD"
                            label={`Pay $${priceUSD} & Submit`}
                            track={selectedTrack}
                            onPaymentVerified={handlePayAndSubmitSuccess}
                            className="w-full sm:w-auto justify-center"
                          />
                        </div>
                      )}

                      {/* Finalize (when already paid) */}
                      {existing && !isLocked && isPaid && (
                        <button
                          id="finalize-submission-btn"
                          type="button"
                          onClick={handleFinalize}
                          disabled={isPending}
                          className={`btn-pill w-full sm:w-auto justify-center ${isPending ? 'btn-outline opacity-60 cursor-not-allowed' : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'}`}
                        >
                          Finalize & Lock →
                        </button>
                      )}

                      {isLocked && (
                        <div className="text-emerald-400 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-full sm:w-auto justify-center">
                          <span className="flex items-center gap-1.5"><Lock size={14} /> Submission Locked</span>
                        </div>
                      )}

                      <p className="text-xs text-white/30 text-center sm:text-left w-full sm:w-auto flex-1">
                        {isLocked 
                          ? "This project has been submitted and can no longer be edited."
                          : isPaid
                            ? "You can update anytime before the deadline."
                            : "Save your draft, then pay to finalize your submission."}
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
