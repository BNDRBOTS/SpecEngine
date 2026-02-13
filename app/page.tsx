"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Database, Shield, Zap, CheckCircle2,
  Cpu, Activity, GitBranch, BrainCircuit, Users,
  ArrowRightLeft, Lock, Key, Copy, Check
} from "lucide-react";

// --- UI COMPONENTS ---
const StatusLine = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.1 }} className="flex items-center space-x-2 text-xs font-mono text-green-400/80">
    <CheckCircle2 className="w-3 h-3 text-green-500" /><span>{text}</span>
  </motion.div>
);

const FeatureChip = ({ text }: { text: string }) => (
  <span className="text-[10px] bg-blue-500/10 text-blue-200 px-2 py-1 rounded border border-blue-500/20 whitespace-nowrap">{text}</span>
);

export default function DivineSpecEngine() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SCANNING" | "COMPLETE">("IDLE");
  const [spec, setSpec] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Access Control State
  const [accessState, setAccessState] = useState<"LOCKED" | "VERIFYING" | "UNLOCKED" | "ERROR">("LOCKED");
  const [licenseKey, setLicenseKey] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      setAccessState("VERIFYING");
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          setAccessState("UNLOCKED");
          setLogs(prev => [...prev, "SESSION RESTORED :: READY"]);
        } else {
          setAccessState("LOCKED");
        }
      } catch {
        setAccessState("LOCKED");
      }
    };
    checkSession();
  }, []);

  const verifyLicense = async () => {
    if (!licenseKey.trim()) return;
    setAccessState("VERIFYING");

    try {
      const res = await fetch("/api/gumroad/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey })
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setAccessState("UNLOCKED");
        setLogs(prev => [...prev, "ACCESS GRANTED :: LICENSE VERIFIED"]);
      } else {
        setAccessState("ERROR");
        setLogs(prev => [...prev, `ACCESS DENIED :: ${data.message || "INVALID LICENSE"}`]);
      }
    } catch {
      setAccessState("ERROR");
      setLogs(prev => [...prev, "SYSTEM ERROR :: VERIFICATION FAILED"]);
    }
  };

  const copySchema = async () => {
    if (!spec?.schema) return;
    try {
      await navigator.clipboard.writeText(spec.schema);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — silently fail
    }
  };

  // ─────────────────────────────────────────
  // CALLS THE SERVER — logic is no longer in the browser bundle
  // ─────────────────────────────────────────
  const runDiagnostics = async () => {
    if (accessState !== "UNLOCKED") return;
    if (!input.trim()) return;
    if (status === "SCANNING") return;

    setStatus("SCANNING");
    setLogs([]);
    setSpec(null);

    const steps = [
      "Parsing semantic intent...",
      "Validating entity scoring...",
      "Injecting strict relational bindings...",
      "Checking for multi-tenancy requirements...",
      "Compiling module integration...",
      "Verifying structural integrity..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 150));
      setLogs(prev => [...prev, steps[i]]);
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });

      if (res.status === 401) {
        // Session expired mid-use — reset to locked
        setAccessState("LOCKED");
        setLogs(prev => [...prev, "SESSION EXPIRED :: PLEASE RE-VERIFY LICENSE"]);
        setStatus("IDLE");
        return;
      }

      if (!res.ok) {
        setLogs(prev => [...prev, "GENERATION ERROR :: PLEASE RETRY"]);
        setStatus("IDLE");
        return;
      }

      const result = await res.json();

      if (result.warnings?.length > 0) {
        setLogs(prev => [...prev, ...result.warnings.map((w: string) => `WARN: ${w}`)]);
      }

      setSpec(result);
      setStatus("COMPLETE");
    } catch {
      setLogs(prev => [...prev, "NETWORK ERROR :: CHECK CONNECTION"]);
      setStatus("IDLE");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans p-4 md:p-8 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-900/10 border border-blue-500/20 mb-2">
          <GitBranch className="w-3 h-3 text-blue-400 mr-2" />
          <span className="text-[10px] font-mono text-blue-300 tracking-[0.2em]">DIVINE::ARCHITECT::V9.0</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
          SPEC<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">GENESIS</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">Generates system architectures that enforce structural harmony.</p>
      </motion.div>

      <div className="w-full max-w-2xl relative z-10 mb-8">
        <div className={`relative bg-[#0A0A0A] rounded-xl border ${accessState === "ERROR" ? "border-red-500/50" : "border-white/10"} p-1 flex items-center shadow-2xl focus-within:border-blue-500/50 transition-colors`}>
          <div className="pl-4 pr-2">
            {accessState === "UNLOCKED" ? <Terminal className="w-5 h-5 text-gray-500" /> : <Key className={`w-5 h-5 ${accessState === "ERROR" ? "text-red-500" : "text-yellow-500"}`} />}
          </div>

          {accessState === "UNLOCKED" ? (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && status !== "SCANNING" && runDiagnostics()}
              placeholder="Describe system (e.g. 'Platform for therapists to sell courses to families')"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-700 font-mono h-12 text-sm md:text-base outline-none"
              spellCheck={false}
            />
          ) : (
            <input
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                // ✅ Reset error state when user starts typing a new key
                if (accessState === "ERROR") setAccessState("LOCKED");
              }}
              onKeyDown={(e) => e.key === 'Enter' && accessState !== "VERIFYING" && verifyLicense()}
              placeholder="ENTER GUMROAD LICENSE KEY..."
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 font-mono h-12 text-sm md:text-base outline-none"
              spellCheck={false}
            />
          )}

          {accessState === "UNLOCKED" ? (
            <button
              onClick={runDiagnostics}
              disabled={status === "SCANNING"}
              className="bg-white hover:bg-gray-200 text-black px-6 h-10 rounded-lg font-bold text-xs tracking-widest transition-all flex items-center justify-center min-w-[100px]"
            >
              {status === "SCANNING" ? <Zap className="w-4 h-4 animate-spin" /> : "EXECUTE"}
            </button>
          ) : (
            <button
              onClick={verifyLicense}
              disabled={accessState === "VERIFYING"}
              className={`${accessState === "ERROR" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"} text-black px-6 h-10 rounded-lg font-bold text-xs tracking-widest transition-all flex items-center justify-center min-w-[100px]`}
            >
              {accessState === "VERIFYING" ? <Zap className="w-4 h-4 animate-spin" /> : "VERIFY"}
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-xl p-6 flex flex-col h-full shadow-lg">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center border-b border-white/5 pb-2">
            <Shield className="w-3 h-3 mr-2" /> Kernel Output
          </h3>
          <div ref={scrollRef} className="space-y-3 font-mono text-sm overflow-y-auto flex-1 max-h-[400px]">
            {logs.map((log, i) => <StatusLine key={i} text={log} delay={0} />)}
            {status === "IDLE" && accessState === "UNLOCKED" && <div className="text-gray-800 italic text-xs">Waiting for architectural intent...</div>}
            {accessState !== "UNLOCKED" && <div className="text-yellow-600/50 italic text-xs">System Locked. Verification required.</div>}
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {status === "COMPLETE" && spec ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-black border border-blue-500/20 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
                <div className="bg-white/5 border-b border-white/5 p-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                      <BrainCircuit className="w-5 h-5 mr-3 text-blue-400" /> Architecture Blueprint
                    </h2>
                    <div className="flex gap-2">
                      <div className="text-[10px] font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider">{spec.type}</div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-gray-500 mb-1">INTEGRITY</div>
                    <div className="text-2xl font-bold text-white font-mono">{spec.warnings?.length > 0 ? "80%" : "100%"}</div>
                  </div>
                </div>
                <div className="p-6 grid gap-8">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold flex items-center">
                      <Cpu className="w-3 h-3 mr-2" /> Functional Core
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {spec.stack.features.map((feat: string, i: number) => <FeatureChip key={i} text={feat} />)}
                      {spec.stack.ai !== "None" && (
                        <span className="text-[10px] bg-purple-500/10 text-purple-200 px-2 py-1 rounded border border-purple-500/20 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {spec.stack.ai}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center">
                        <Database className="w-3 h-3 mr-2" /> Prisma Schema
                      </div>
                    </div>
                    <div className="relative group">
                      {/* ✅ Copy button — now actually works */}
                      <button
                        onClick={copySchema}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-1.5 rounded z-10"
                        title="Copy schema"
                      >
                        {copied
                          ? <Check className="w-3 h-3 text-green-400" />
                          : <Copy className="w-3 h-3 text-white" />
                        }
                      </button>
                      <pre className="text-[11px] leading-relaxed text-blue-100/80 font-mono bg-[#0F0F0F] p-4 rounded-lg border border-white/10 overflow-x-auto shadow-inner max-h-[400px]">
                        {spec.schema}
                      </pre>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold flex items-center">
                        <Activity className="w-3 h-3 mr-2" /> Endpoints
                      </div>
                      <div className="space-y-1">
                        {spec.routes.map((r: string, i: number) => (
                          <div key={i} className="text-[10px] font-mono text-gray-400 bg-white/5 px-3 py-2 rounded border-l-2 border-blue-500/50 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>{r}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold flex items-center">
                        <ArrowRightLeft className="w-3 h-3 mr-2" /> Suggested Stack
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(spec.stack).filter(([k]) => k !== 'features').map(([key, val]: any, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1">
                            <span className="text-gray-500 uppercase">{key}</span>
                            <span className="text-gray-300 font-mono text-right truncate ml-4">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-700 font-mono space-y-4 min-h-[400px]">
                {accessState === "UNLOCKED" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-sm tracking-widest">[ AWAITING USER INPUT ]</div>
                    <div className="text-xs text-gray-800 max-w-xs text-center">Enter a system description to generate a harmonized structural blueprint.</div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center border border-red-500/20">
                      <Lock className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-sm tracking-widest text-red-400">[ SYSTEM LOCKED ]</div>
                    <div className="text-xs text-gray-600 max-w-xs text-center">Valid Gumroad license required to operate Divine Spec Engine.</div>
                    <a
                      href={process.env.NEXT_PUBLIC_GUMROAD_URL || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-[10px] text-blue-500 hover:text-blue-400 border-b border-blue-500/30"
                    >
                      Don't have a license? Get one here.
                    </a>
                  </>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
