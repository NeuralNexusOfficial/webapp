import { updateProfile } from "@/app/actions/profile";

export default function SettingsPage() {
  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
      <div className="card-cyber p-6 md:p-8 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <form action={updateProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Full Name</label>
            <input type="text" name="fullName" className="input-nn w-full" required />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Phone Number</label>
            <input type="tel" name="phone" className="input-nn w-full" required />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">College / Company</label>
            <input type="text" name="collegeCompany" className="input-nn w-full" required />
          </div>
          <button type="submit" className="btn-pill btn-primary w-full justify-center mt-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
