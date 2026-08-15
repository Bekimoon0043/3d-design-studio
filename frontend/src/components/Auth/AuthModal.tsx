/** Auth modal disabled in local-cache testing mode. */
export default function AuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-panel border border-border rounded-lg p-5 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-white mb-2">Local testing mode</h2>
        <p className="text-sm text-gray-400 mb-4">
          Projects are saved to your browser&apos;s localStorage. No account required.
        </p>
        <button onClick={onClose} className="btn-primary w-full">
          OK
        </button>
      </div>
    </div>
  );
}
