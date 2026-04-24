"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { Download, Loader2, ShieldCheck, User, IdCard, CheckCircle2 } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import QRCode from 'qrcode';

function DownloadContent() {
  const searchParams = useSearchParams();
  const studentId = (searchParams.get("studentId") || "").toUpperCase();
  const name = (searchParams.get("name") || "").toUpperCase();
  
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (studentId) {
      QRCode.toDataURL(studentId, { margin: 1, width: 200 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error("QR Generation failed", err));
    }
  }, [studentId]);

  const handleDownload = async () => {
    if (!cardRef.current || !studentId) return;
    
    setLoading(true);
    try {
      // Small delay to ensure styles are fully applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3, // High quality
        backgroundColor: '#000000',
      });
      
      const link = document.createElement('a');
      link.download = `CAMS_ID_Card_${studentId}.png`;
      link.href = dataUrl;
      link.click();
      
      setDownloaded(true);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to generate image. Please try again or take a screenshot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
           <ShieldCheck className="w-3 h-3" />
           <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Secure Access Verified</span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Your Identity Card</h1>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">CAMS Central Registry</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-start">
        
        {/* Left Side: Preview & Download */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3" /> Student Name
                </label>
                <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-lg text-white font-bold text-sm uppercase">
                  {name || "N/A"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <IdCard className="w-3 h-3" /> Student ID
                </label>
                <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-lg text-white font-mono text-sm tracking-tight">
                  {studentId || "N/A"}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={loading || !studentId || !name}
              className={`w-full py-4 font-mono text-[10px] uppercase font-black tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-xl shadow-lg active:scale-[0.98] ${
                downloaded 
                ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Downloaded Successfully
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Card (PNG)
                </>
              )}
            </button>

            <p className="text-[9px] text-slate-600 text-center uppercase leading-relaxed tracking-wider font-medium">
              This card is prefilled from the central database.<br/>
              Modifications are restricted by CAMS HQ protocols.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-[10px] text-slate-400 font-mono leading-relaxed">
            <strong className="text-white block mb-1">PRO TIP:</strong>
            For best results, save this image to your phone and use it as a lock screen wallpaper for quick attendance marking.
          </div>
        </div>

        {/* Right Side: The Actual Card (Visual & Capture Target) */}
        <div className="flex flex-col items-center gap-6 order-1 lg:order-2 sticky top-8">
           <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Card Preview</div>
           
           {/* Card Container for html-to-image */}
           <div 
             ref={cardRef}
             className="flex flex-col gap-6 p-4 bg-black"
             style={{ width: '372px' }} // 340px card + padding
           >
              {/* Card Style Definitions */}
              <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap');
                
                .card-container-inner {
                  width: 340px;
                  font-family: 'Outfit', sans-serif;
                  display: flex;
                  flex-direction: column;
                  gap: 30px;
                  align-items: center;
                }

                .card-unit {
                  width: 340px;
                  height: 215px;
                  border-radius: 18px;
                  position: relative;
                  overflow: hidden;
                }

                .front-unit {
                  background: linear-gradient(120deg, #1b4d3e 0%, #0d2e23 100%);
                  color: white;
                  display: flex;
                  flex-direction: column;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .front-unit::before {
                  content: '';
                  position: absolute;
                  top: -50px;
                  right: -50px;
                  width: 180px;
                  height: 180px;
                  background: linear-gradient(135deg, #8b2323, transparent);
                  border-radius: 50%;
                  opacity: 0.6;
                  filter: blur(40px);
                }

                .glass-overlay {
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
                  z-index: 1;
                }

                .card-content {
                  position: relative;
                  z-index: 2;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  padding: 18px 22px;
                }

                .card-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }

                .brand {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                }

                .card-logo {
                  height: 40px;
                  width: 40px;
                  object-fit: contain;
                  background: white;
                  border-radius: 8px;
                  padding: 4px;
                }

                .uni-name h3 {
                  font-size: 14px;
                  font-weight: 800;
                  line-height: 1;
                  margin-bottom: 3px;
                  letter-spacing: 0.5px;
                  color: white;
                }

                .uni-name span {
                  font-size: 8px;
                  opacity: 0.8;
                  font-weight: 500;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  color: white;
                }

                .card-body {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }

                .student-info { flex: 1; }

                .info-label {
                  font-size: 8px;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  color: rgba(255,255,255,0.7);
                  margin-bottom: 3px;
                  font-weight: 600;
                }

                .student-id-display {
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 16px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                  margin-bottom: 6px;
                  color: white;
                }

                .student-name-display {
                  font-size: 13px;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                  margin-bottom: 6px;
                  text-transform: uppercase;
                  color: white;
                }

                .course-tag {
                  display: inline-block;
                  padding: 4px 10px;
                  background: rgba(251, 191, 36, 0.9);
                  border-radius: 18px;
                  font-size: 9px;
                  font-weight: 700;
                  color: #1f2937;
                  letter-spacing: 0.5px;
                }

                .qr-box {
                  background: white;
                  padding: 5px;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-top: -30px;
                  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .qr-box img {
                  width: 90px;
                  height: 90px;
                }

                .card-footer {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-top: 1px solid rgba(255,255,255,0.1);
                  padding-top: 10px;
                  margin-top: auto;
                }

                .validity {
                  font-size: 8px;
                  opacity: 0.8;
                  color: white;
                }

                .back-unit {
                  background: white;
                  display: flex;
                  flex-direction: column;
                  border: 2px solid #1b4d3e;
                }

                .back-header-strip {
                  background: #1b4d3e;
                  height: 35px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 9px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                }

                .back-body {
                  padding: 15px;
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                }

                .terms-list {
                  list-style: none;
                  margin-bottom: 12px;
                }

                .terms-list li {
                  font-size: 9px;
                  color: #4b5563;
                  margin-bottom: 4px;
                  font-weight: 500;
                }

                .credit-box {
                  border: 1px dashed #e5e7eb;
                  padding: 6px 12px;
                  border-radius: 8px;
                  background: #f9fafb;
                }

                .credit-text {
                  font-size: 8px;
                  color: #6b7280;
                  line-height: 1.4;
                }

                .credit-text span {
                  color: #8b2323;
                  font-weight: 700;
                }
              ` }} />

              <div className="card-container-inner">
                {/* FRONT CARD */}
                <div className="card-unit front-unit">
                  <div className="glass-overlay"></div>
                  <div className="card-content">
                    <div className="card-header">
                      <div className="brand">
                        <img src="/logo.png" alt="SMIU" className="card-logo" />
                        <div className="uni-name">
                          <h3>SMIU</h3>
                          <span>SOFTWARE ENGINEERING</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="student-info">
                        <div className="info-label">Student Identity</div>
                        <div className="student-id-display">{studentId || "BSE-00X-000"}</div>
                        <div className="student-name-display">{name || "STUDENT NAME"}</div>
                      </div>
                      <div className="qr-box">
                        {qrCodeDataUrl ? (
                          <img src={qrCodeDataUrl} alt="QR Code" />
                        ) : (
                          <div className="w-[90px] h-[90px] bg-slate-100 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="course-tag">BSSE Fall '25</div>
                      <div className="validity">ATTENDANCE ONLY</div>
                    </div>
                  </div>
                </div>

                {/* BACK CARD */}
                <div className="card-unit back-unit">
                  <div className="back-header-strip">CAMS - Official Use Only</div>
                  <div className="back-body">
                    <ul className="terms-list">
                      <li>• Use strictly for marking classroom attendance.</li>
                      <li>• Non-transferable property of the student.</li>
                      <li>• Proxy marking will result in strict action.</li>
                    </ul>
                    <div className="credit-box">
                      <div className="credit-text">
                        CAMS Designed & Developed by<br />
                        <span>CR Okasha Nadeem</span> (BSSE Fall '25)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4 text-white font-mono">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs uppercase tracking-widest animate-pulse">Initializing Secure Tunnel...</p>
        </div>
      }>
        <DownloadContent />
      </Suspense>
    </main>
  );
}
