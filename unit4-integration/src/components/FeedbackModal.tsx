import { useState, useRef } from 'react';
import { MessageSquare, X, Check, Plus } from 'lucide-react';

interface FeedbackModalProps {
  siteName: string;
}

export default function FeedbackModal({ siteName }: FeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const WEBHOOK_URL =
    import.meta.env.VITE_DISCORD_WEBHOOK_URL ||
    'https://discord.com/api/webhooks/1528287780504080435/HcCBYWI_gdigLfhUxpIPbp83CVcXvU6vh4BG-lQ9V1OIRBZqVNNqJ8APsf8PztMEkb1w';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 4)); // max 4 images
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      setImages((prev) => [...prev, ...pastedFiles].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && images.length === 0) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append(
        'payload_json',
        JSON.stringify({
          embeds: [
            {
              title: `Feedback / Bug Report: ${siteName}`,
              description: message || '*No text provided.*',
              color: 0xf59e0b, // amber
              fields: [
                {
                  name: 'URL',
                  value: window.location.href,
                  inline: true,
                },
                {
                  name: 'Time',
                  value: new Date().toISOString(),
                  inline: true,
                },
              ],
            },
          ],
        })
      );

      images.forEach((file, idx) => {
        formData.append(`file${idx}`, file);
      });

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      setStatus('success');
      setMessage('');
      setImages([]);
      setTimeout(() => {
        setIsOpen(false);
        setImages([]);
        setStatus('idle');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to send webhook:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send feedback. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
        style={{
          backgroundColor: 'var(--panel-2)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Feedback & Bugs</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative space-y-5"
            style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)' }}
            onPaste={handlePaste}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--line)' }}>
              <div>
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--ink)' }}>
                  Send Feedback or Report Bug
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                  Reporting from: <strong className="text-amber-400">{siteName}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors hover:bg-gray-500/20"
                style={{ color: 'var(--ink-soft)' }}
              >
                ×
              </button>
            </div>

            {/* Status success view */}
            {status === 'success' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto border border-amber-500/30">
                  ✓
                </div>
                <h4 className="font-bold text-base" style={{ color: 'var(--ink)' }}>
                  Feedback Sent Successfully!
                </h4>
                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                  Thank you for helping us improve our simulation website.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ink)' }}>
                    Your Message / Bug Description
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe what happened, what could be improved, or paste a screenshot (Ctrl+V)..."
                    className="w-full rounded-xl p-3.5 text-xs font-medium border outline-none focus:border-amber-500 transition-colors resize-none"
                    style={{
                      backgroundColor: 'var(--panel-2)',
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                    }}
                    required={images.length === 0}
                  />
                </div>

                {/* Attachments & Paste Tip */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                      Attached Screenshots ({images.length}/4)
                    </label>
                    <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                      Tip: You can paste images (Ctrl+V) directly
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 items-center">
                    {images.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-lg border overflow-hidden group bg-black/40"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="upload preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-base font-bold transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {images.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-lg border border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:border-amber-400 cursor-pointer text-xs"
                        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                      >
                        <span className="text-lg leading-none">+</span>
                        <span className="text-[10px] font-medium">Add</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--ink)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'submitting' || (!message.trim() && images.length === 0)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-gray-950 hover:bg-amber-400 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Feedback'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
