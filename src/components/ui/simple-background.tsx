export function SimpleBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      {/* Slowly drifting radial orbs — pure CSS, no JS */}
      <div className="simple-orb simple-orb-a" />
      <div className="simple-orb simple-orb-b" />
      <div className="simple-orb simple-orb-c" />
    </div>
  );
}
