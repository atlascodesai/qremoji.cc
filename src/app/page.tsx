'use client';

import { useState, useRef, useEffect } from 'react';

const EMOJI_CATEGORIES = {
  'Popular': ['🐍', '❤️', '⭐', '🔥', '✨', '🎉', '🚀', '💎', '🌟', '💯'],
  'Faces': ['😀', '😍', '🥳', '😎', '🤩', '😊', '🥰', '😇', '🤗', '😏'],
  'Animals': ['🦁', '🐶', '🐱', '🦊', '🐼', '🐨', '🦄', '🐸', '🦋', '🐝'],
  'Food': ['🍕', '🍔', '🍟', '🌮', '🍣', '🍩', '🍪', '☕', '🍺', '🍷'],
  'Activities': ['⚽', '🏀', '🎮', '🎯', '🎸', '🎨', '📸', '🎬', '🎤', '🎧'],
  'Symbols': ['💪', '👑', '🏆', '✅', '💰', '🔑', '💡', '⚡', '🌈', '☀️'],
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [emoji, setEmoji] = useState('🐍');
  const [customEmoji, setCustomEmoji] = useState('');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, emoji: customEmoji || emoji }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code');
      }

      setQrDataUrl(data.qrDataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!qrDataUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrImage = new Image();
    qrImage.onload = () => {
      const size = 400;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(qrImage, 0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const emojiSize = size / 4;

      ctx.beginPath();
      ctx.arc(centerX, centerY, emojiSize / 2 + 10, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      const currentEmoji = customEmoji || emoji;
      ctx.font = `${emojiSize * 0.8}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentEmoji, centerX, centerY);

      setFinalImageUrl(canvas.toDataURL('image/png'));
    };
    qrImage.src = qrDataUrl;
  }, [qrDataUrl, emoji, customEmoji]);

  const downloadQR = () => {
    if (!finalImageUrl) return;
    const link = document.createElement('a');
    link.download = `qr-${selectedEmoji}-${Date.now()}.png`;
    link.href = finalImageUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!finalImageUrl) return;
    try {
      const response = await fetch(finalImageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback - copy data URL
      await navigator.clipboard.writeText(finalImageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectedEmoji = customEmoji || emoji;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <a
            href="https://github.com/atlascodesai/qremoji.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 hover:bg-white/10 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-400">Free & Open Source</span>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
            QR + Emoji
          </h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Beautiful QR codes with your favorite emoji. Scannable, shareable, memorable.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* URL Input Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8">
              <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                Destination URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateQR()}
                  placeholder="https://your-awesome-link.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all text-lg"
                />
              </div>
            </div>

            {/* Emoji Picker Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Choose Emoji
                </label>
                <span className="text-4xl">{selectedEmoji}</span>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Emoji grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
                {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setEmoji(e);
                      setCustomEmoji('');
                    }}
                    className={`aspect-square text-2xl sm:text-3xl rounded-xl transition-all duration-200 hover:scale-110 hover:bg-white/10 ${
                      selectedEmoji === e && !customEmoji
                        ? 'bg-violet-600/30 ring-2 ring-violet-500 scale-110'
                        : 'bg-white/5'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Custom emoji input */}
              <div className="relative">
                <input
                  type="text"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  placeholder="Or paste any emoji..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all text-center text-xl"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              disabled={loading || !url}
              className="w-full group relative overflow-hidden rounded-2xl p-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 animate-gradient-x" />
              <div className="relative flex items-center justify-center gap-3 bg-[#0a0a0f] rounded-2xl px-8 py-5 transition-all group-hover:bg-transparent">
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg font-semibold">Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span className="text-lg font-semibold">Generate QR Code</span>
                  </>
                )}
              </div>
            </button>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Right Column - QR Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8">
              {finalImageUrl ? (
                <div className="space-y-6">
                  {/* QR Code Display */}
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl p-6 mx-auto w-fit">
                      <img
                        src={finalImageUrl}
                        alt="Generated QR Code"
                        className="w-64 h-64 sm:w-72 sm:h-72"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={downloadQR}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      {copied ? (
                        <>
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Info */}
                  <p className="text-center text-sm text-gray-500">
                    High error correction ensures scannability
                  </p>
                </div>
              ) : (
                /* Empty State */
                <div className="py-16 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Your QR code will appear here</h3>
                  <p className="text-gray-600">Enter a URL and click generate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-600">
          <p>Built with Next.js. QR codes use H-level error correction.</p>
        </footer>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
