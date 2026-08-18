import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, Copy, Check, AlertTriangle, Wifi, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PhoneShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PhoneShareModal: React.FC<PhoneShareModalProps> = ({ open, onOpenChange }) => {
  const [copied, setCopied] = useState(false);
  const [customIp, setCustomIp] = useState('');
  const [port, setPort] = useState('8080');
  const [activeUrl, setActiveUrl] = useState('');

  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port || '8080';
      setPort(currentPort);

      // If already on a live domain or local IP, use that
      if (!isLocalhost && window.location.hostname) {
        setActiveUrl(window.location.origin);
      } else {
        // Default placeholder for local Wi-Fi IP
        const savedIp = localStorage.getItem('uc_dev_local_ip') || '';
        if (savedIp) {
          setCustomIp(savedIp);
          setActiveUrl(`http://${savedIp}:${currentPort}`);
        } else {
          setActiveUrl(`http://192.168.1.X:${currentPort}`);
        }
      }
    }
  }, [open, isLocalhost]);

  const handleIpChange = (ip: string) => {
    setCustomIp(ip);
    localStorage.setItem('uc_dev_local_ip', ip);
    const cleanIp = ip.trim().replace(/^https?:\/\//, '').replace(/:.*$/, '');
    if (cleanIp) {
      setActiveUrl(`http://${cleanIp}:${port}`);
    }
  };

  // QR code generator
  const qrUrl = activeUrl && !activeUrl.includes('192.168.1.X')
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(activeUrl)}&margin=10`
    : '';

  const handleCopy = () => {
    if (!activeUrl || activeUrl.includes('192.168.1.X')) {
      toast.error('Please enter your computer’s Wi-Fi IP first');
      return;
    }
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl bg-slate-900 border-slate-800 text-white p-6 max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
            <Smartphone className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-black text-center text-white">
            Connect iPhone to Dev Server
          </DialogTitle>
          <DialogDescription className="text-xs text-center text-slate-400">
            Both your computer and iPhone must be on the <strong>same Wi-Fi network</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Localhost warning */}
          {isLocalhost && !customIp && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Why "localhost" fails on iPhone:</p>
                <p className="text-[11px] text-amber-200/90 mt-0.5">
                  Phones cannot open "localhost". Enter your computer's local Wi-Fi IP below to generate the exact iPhone QR code.
                </p>
              </div>
            </div>
          )}

          {/* Wi-Fi IP Entry Input */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Wifi className="w-4 h-4" /> Enter Computer's Wi-Fi IP Address:
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                value={customIp}
                onChange={(e) => handleIpChange(e.target.value)}
                placeholder="e.g. 192.168.1.45 (or 10.0.0.X)"
                className="bg-slate-900 border-slate-700 text-white font-mono text-xs rounded-xl h-10"
              />
              <Button
                size="sm"
                onClick={handleCopy}
                disabled={!customIp}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 shrink-0 h-10 gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            {/* Quick 2-second guide to get IP */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl text-[11px] text-slate-400 space-y-1 font-mono">
              <p className="text-slate-300 font-sans font-semibold">How to find your IP in 5 seconds:</p>
              <p>• <strong>Windows:</strong> Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-sans">Win+R</kbd> $\rightarrow$ type <code className="text-sky-300">cmd</code> $\rightarrow$ type <code className="text-sky-300">ipconfig</code> $\rightarrow$ look for <strong>IPv4 Address</strong>.</p>
              <p>• <strong>Mac:</strong> System Settings $\rightarrow$ Wi-Fi $\rightarrow$ Details $\rightarrow$ IP Address.</p>
            </div>
          </div>

          {/* Live QR Code Display */}
          {qrUrl ? (
            <div className="flex flex-col items-center space-y-2 pt-1">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-700">
                <img
                  src={qrUrl}
                  alt="Scan to open on iPhone"
                  className="w-44 h-44 rounded-lg"
                />
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold text-center flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Point your iPhone camera at this QR code!
              </p>
              <p className="text-[11px] font-mono text-slate-400 text-center truncate max-w-xs">
                {activeUrl}
              </p>
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400">
              Type your computer's IPv4 address above to generate your iPhone QR code instantly.
            </div>
          )}

          {/* Quick Troubleshooting checklist */}
          <div className="p-3.5 bg-blue-950/30 border border-blue-900/40 rounded-2xl text-[11px] text-slate-300 space-y-1.5 text-left">
            <div className="font-bold text-blue-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> iPhone Troubleshooting:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>Confirm your iPhone is connected to the <strong>same Wi-Fi</strong> (disable Cellular 5G/LTE while connecting).</li>
              <li>If Windows Defender asks, allow network access on Private Networks for Node/Vite.</li>
              <li>Once loaded in Safari, tap <strong>Share</strong> $\rightarrow$ <strong>"Add to Home Screen"</strong> to run in app mode.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};