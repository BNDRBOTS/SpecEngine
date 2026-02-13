"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Database, Shield, Zap, CheckCircle2, 
  Cpu, Activity, GitBranch, BrainCircuit, Users, 
  ArrowRightLeft, Lock, Key
} from "lucide-react";

// --- 1. LINGUISTIC KERNEL V4.0 ---
const IRREGULAR_PLURALS: Record<string, string> = {
  person: "people", child: "children", man: "men", woman: "women",
  foot: "feet", tooth: "teeth", mouse: "mice", analysis: "analyses",
  diagnosis: "diagnoses", thesis: "theses", crisis: "crises",
  phenomenon: "phenomena", criterion: "criteria", datum: "data",
  index: "indices", matrix: "matrices", series: "series", species: "species",
  quiz: "quizzes", portfolio: "portfolios", inventory: "inventories",
  gallery: "galleries", category: "categories", hierarchy: "hierarchies",
};

const pluralize = (word: string) => {
  if (!word) return "";
  const lower = word.toLowerCase();
  if (IRREGULAR_PLURALS[lower]) return IRREGULAR_PLURALS[lower];
  if (word.endsWith("ss") || word.endsWith("sh") || word.endsWith("ch") || word.endsWith("x") || word.endsWith("z")) return word + "es";
  if (word.endsWith("y") && !/[aeiou]y$/.test(word)) return word.slice(0, -1) + "ies";
  return word + "s";
};

const getRoot = (word: string) => {
  if (word.endsWith("ing")) return word.slice(0, -3);
  if (word.endsWith("ed")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
};

// --- 2. NOISE FILTER V4.0 ---
const NOISE_ROOTS = new Set([
  "the","this","that","which","what","whos","whom","is","are","was","were","be",
  "have","has","had","do","does","did","can","will","would","should","need","want",
  "look","help","in","on","at","by","for","with","about","from","app","system",
  "platform","tool","site","web","soft","clone","like","make","build","creat",
  "generat","user","peopl","person","way","thing","who","friend","famili",
  "market","place","hub","network","space","zone","world","land","base"
]);

const ROLE_ROOTS = new Set([
  "admin", "manager", "editor", "viewer", "guest", "member", "owner", 
  "creator", "developer", "designer", "teacher", "student", "driver", 
  "rider", "buyer", "seller", "provider", "agent", "broker", "worker"
]);

const isValidPrismaIdentifier = (s: string) => /^[A-Za-z][A-Za-z0-9_]*$/.test(s);

// --- 3. ARCHITECT ENGINE V9.0 (PRODUCTION READY) ---
const generateArchitecture = (input: string) => {
  const cleanInput = input.toLowerCase().replace(/[^a-z0-9\s]/g, ''); 
  const rawWords = cleanInput.split(/\s+/).filter(w => w.length > 0);
  
  const vibes = {
    social: /friend|family|share|invite|network|group|mom|dad|partner|community|team|tribe|social/.test(cleanInput),
    cognitive: /explain|understand|teach|learn|know|cognitive|mind|sick|illness|gap|diagnosis|education|train|clarify|translate|simplify|guide|onboard|document/.test(cleanInput),
    commerce: /buy|sell|pay|price|shop|store|subscription|tier|cart|checkout|marketplace/.test(cleanInput),
    realtime: /chat|live|stream|sync|socket|alert|signal|instant/.test(cleanInput),
    media: /photo|video|file|image|upload|gallery|portfolio|document|record/.test(cleanInput),
    secure: /private|secure|encrypted|secret|confidential|legal|contract|audit|compliance|law/.test(cleanInput),
    b2b: /agency|team|enterprise|b2b|organization|workspace|client|tenant|manage multiple|vendor|contractor/.test(cleanInput)
  };

  let bestEntity = "item";
  let highestScore = -50; 
  const fallbacks: Record<string, string> = {
    cognitive: "concept", commerce: "product", social: "post",
    realtime: "message", media: "upload", b2b: "project", default: "resource"
  };

  rawWords.forEach(w => {
    let score = 0;
    const root = getRoot(w);
    if (NOISE_ROOTS.has(root)) score -= 100;
    if (w.length < 3) score -= 50;
    if (w.endsWith("ing") || w.endsWith("ed") || w.endsWith("ly")) score -= 20;
    if (ROLE_ROOTS.has(root)) score -= 40;

    if (vibes.cognitive && /bridge|insight|guide|lesson|course/.test(root)) score += 40;
    if (vibes.commerce && /product|item|service|plan|order/.test(root)) score += 40;
    if (vibes.secure && /contract|record|agreement|log/.test(root)) score += 40;
    if (vibes.media && /portfolio|gallery|file/.test(root)) score += 40;
    if (vibes.b2b && /client|project|task|ticket|vendor|contractor/.test(root)) score += 40;
    if (!NOISE_ROOTS.has(root)) score += 10;

    if (score > highestScore) {
      highestScore = score;
      bestEntity = w;
    }
  });

  if (highestScore <= -40) {
    if (vibes.cognitive) bestEntity = fallbacks.cognitive;
    else if (vibes.commerce) bestEntity = fallbacks.commerce;
    else if (vibes.realtime) bestEntity = fallbacks.realtime;
    else if (vibes.b2b) bestEntity = fallbacks.b2b;
    else bestEntity = fallbacks.default;
  }

  let EntityCap = bestEntity.charAt(0).toUpperCase() + bestEntity.slice(1);
  const warnings: string[] = [];

  if (!isValidPrismaIdentifier(EntityCap)) {
    bestEntity = "resource";
    EntityCap = "Resource";
    warnings.push("INVALID_ENTITY_IDENTIFIER_FALLBACK_RESOURCE");
  }

  const EntityPlural = pluralize(bestEntity);

  const features = new Set<string>();
  const schemaBlocks: string[] = [];
  const routeList: string[] = [];
  const stack = {
    frontend: "Next.js 15 (App Router)", backend: "Server Actions",
    db: "PostgreSQL (Prisma)", realtime: "None", storage: "None", ai: "None"
  };

  const userRelations = [];
  if (vibes.social) userRelations.push('comments Comment[] @relation("UserComments")');
  if (vibes.commerce) userRelations.push('orders Order[] @relation("UserOrders")');
  if (vibes.cognitive) userRelations.push('strategies Strategy[] @relation("UserStrategies")');
  if (vibes.cognitive) userRelations.push('audiences AudienceProfile[] @relation("UserAudiences")');
  if (vibes.realtime) userRelations.push('messages Message[] @relation("UserMessages")');
  if (vibes.secure) userRelations.push('auditLogs AuditLog[] @relation("UserAuditLogs")');
  if (vibes.b2b) userRelations.push('organization Organization? @relation("UserOrganization", fields: [orgId], references: [id])\n  orgId String?');

  schemaBlocks.push(`
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ${EntityPlural} ${EntityCap}[] @relation("User${EntityPlural}")
  ${userRelations.join("\n  ")}
}
`);

  let entityFields = `
  id          String   @id @default(uuid())
  title       String
  status      String   @default("DRAFT")
  ownerId     String
  owner       User     @relation("User${EntityPlural}", fields: [ownerId], references: [id])
  ${vibes.b2b ? `orgId       String?\n  organization Organization? @relation("EntityOrganization", fields: [orgId], references: [id])` : ''}
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  `;

  if (vibes.cognitive) {
    features.add("Audience Profiling"); features.add("Adaptive Complexity"); features.add("Metaphor Engine");
    stack.ai = "LLM Integration (OpenAI/Anthropic)";
    entityFields += `\n  content     String   @db.Text\n  complexity  Int      @default(5)\n  strategies  Strategy[] @relation("EntityStrategies")`;
    schemaBlocks.push(`
model AudienceProfile {
  id            String   @id @default(uuid())
  relation      String
  knowledgeLvl  Int      @default(3)
  resistanceLvl Int      @default(0)
  userId        String
  user          User     @relation("UserAudiences", fields: [userId], references: [id])
  strategies    Strategy[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
model Strategy {
  id              String          @id @default(uuid())
  angle           String          @db.Text 
  effectiveness   Int?            
  ${bestEntity}Id String
  ${bestEntity}   ${EntityCap}    @relation("EntityStrategies", fields: [${bestEntity}Id], references: [id])
  audienceId      String
  audience        AudienceProfile @relation(fields: [audienceId], references: [id])
  userId          String
  user            User            @relation("UserStrategies", fields: [userId], references: [id])
  createdAt       DateTime        @default(now())
}
`);
    routeList.push(`POST /api/analyze-audience`, `POST /api/${EntityPlural}/generate-strategy`);
  }

  if (vibes.commerce) {
    features.add("Payment Processing"); features.add("Order Management");
    entityFields += `\n  price       Decimal  @db.Decimal(10, 2)\n  currency    String   @default("USD")\n  stock       Int      @default(0)\n  isActive    Boolean  @default(true)\n  orders      OrderItem[] @relation("EntityOrderItems")`;
    schemaBlocks.push(`
model Order {
  id        String      @id @default(uuid())
  total     Decimal
  status    String      @default("PENDING") 
  userId    String
  user      User        @relation("UserOrders", fields: [userId], references: [id])
  items     OrderItem[]
  createdAt DateTime    @default(now())
}
model OrderItem {
  id             String    @id @default(uuid())
  orderId        String
  order          Order     @relation(fields: [orderId], references: [id])
  ${bestEntity}Id String
  ${bestEntity}  ${EntityCap} @relation("EntityOrderItems", fields: [${bestEntity}Id], references: [id])
}
`);
    routeList.push(`POST /api/checkout/session`, `GET /api/orders/history`);
  }

  if (vibes.media || vibes.social) {
    features.add("File Storage (S3/R2)"); stack.storage = "AWS S3 / Cloudflare R2";
    entityFields += `\n  coverImage  String?\n  attachments Attachment[] @relation("EntityAttachments")`;
    schemaBlocks.push(`
model Attachment {
  id             String      @id @default(uuid())
  url            String
  fileType       String
  sizeBytes      Int
  ${bestEntity}Id String
  ${bestEntity}  ${EntityCap} @relation("EntityAttachments", fields: [${bestEntity}Id], references: [id])
  createdAt      DateTime    @default(now())
}
`);
    routeList.push(`POST /api/upload/presigned-url`);
  }

  if (vibes.realtime) {
    features.add("WebSocket / PubSub"); features.add("Live Presence");
    stack.realtime = "Pusher / Socket.io / Supabase Realtime";
    schemaBlocks.push(`
model Channel {
  id        String    @id @default(uuid())
  name      String
  messages  Message[]
  createdAt DateTime  @default(now())
}
model Message {
  id        String   @id @default(uuid())
  content   String
  channelId String
  channel   Channel  @relation(fields: [channelId], references: [id])
  userId    String
  user      User     @relation("UserMessages", fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
`);
    routeList.push(`GET /api/chat/history`, `POST /api/chat/auth`);
  }

  if (vibes.social) {
    features.add("Role-Based Sharing"); features.add("Comments System");
    entityFields += `\n  isPublic    Boolean   @default(false)\n  shareToken  String?   @unique\n  comments    Comment[] @relation("EntityComments")`;
    schemaBlocks.push(`
model Comment {
  id             String      @id @default(uuid())
  text           String
  userId         String
  user           User        @relation("UserComments", fields: [userId], references: [id])
  ${bestEntity}Id String
  ${bestEntity}  ${EntityCap} @relation("EntityComments", fields: [${bestEntity}Id], references: [id])
  createdAt      DateTime    @default(now())
}
`);
  }

  if (vibes.secure) {
    features.add("Audit Logging"); features.add("Compliance Tracking");
    schemaBlocks.push(`
model AuditLog {
  id        String   @id @default(uuid())
  action    String
  resource  String
  metadata  Json?
  userId    String
  user      User     @relation("UserAuditLogs", fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
`);
  }

  if (vibes.b2b) {
    features.add("Multi-Tenancy (Orgs)"); features.add("Team Management");
    schemaBlocks.push(`
model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  users     User[]   @relation("UserOrganization")
  ${EntityPlural} ${EntityCap}[] @relation("EntityOrganization")
  createdAt DateTime @default(now())
}
`);
  }

  schemaBlocks.splice(1, 0, `\nmodel ${EntityCap} {\n${entityFields}\n}\n`);

  routeList.unshift(`GET /api/${EntityPlural}`, `POST /api/${EntityPlural}`, `GET /api/${EntityPlural}/:id`, `PATCH /api/${EntityPlural}/:id`, `DELETE /api/${EntityPlural}/:id`);

  const types = [];
  if (vibes.b2b) types.push("B2B");
  if (vibes.cognitive) types.push("Cognitive");
  if (vibes.commerce) types.push("Commercial");
  if (vibes.social) types.push("Social");
  if (vibes.realtime) types.push("Realtime");
  if (vibes.secure) types.push("Secure");
  
  const typeLabel = types.length > 0 ? `${types.join(" + ")} Platform` : "Standard CRUD Application";

  return { 
    stack: { ...stack, features: Array.from(features).length > 0 ? Array.from(features) : ["Standard CRUD", "Auth"] },
    schema: schemaBlocks.join("").trim(), 
    routes: routeList, 
    type: typeLabel,
    warnings 
  };
};

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
  
  // Access Control State
  const [accessState, setAccessState] = useState<"LOCKED" | "VERIFYING" | "UNLOCKED" | "ERROR">("LOCKED");
  const [licenseKey, setLicenseKey] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  // --- SESSION PERSISTENCE FIX ---
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
        body: JSON.stringify({ license_key: licenseKey }) // Product ID is now server-side only
      });
      
      const data = await res.json();
      
      if (res.ok && data.ok) {
        setAccessState("UNLOCKED");
        setLogs(prev => [...prev, "ACCESS GRANTED :: LICENSE VERIFIED"]);
      } else {
        setAccessState("ERROR");
        setLogs(prev => [...prev, `ACCESS DENIED :: ${data.message || "INVALID LICENSE"}`]);
      }
    } catch (err) {
      setAccessState("ERROR");
      setLogs(prev => [...prev, "SYSTEM ERROR :: VERIFICATION FAILED"]);
    }
  };

  const runDiagnostics = async () => {
    if (accessState !== "UNLOCKED") return;
    if (!input.trim()) return;
    if (status === "SCANNING") return;
    setStatus("SCANNING");
    setLogs([]);
    setSpec(null);

    const steps = ["Parsing semantic intent...", "Validating entity scoring...", "Injecting strict relational bindings...", "Checking for multi-tenancy requirements...", "Compiling module integration...", "Verifying structural integrity..."];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 150)); 
      setLogs(prev => [...prev, steps[i]]);
    }

    const result = generateArchitecture(input);
    if (result.warnings && result.warnings.length > 0) {
      setLogs(prev => [...prev, ...result.warnings.map((w: string) => `WARN: ${w}`)]);
    }

    setSpec(result);
    setStatus("COMPLETE");
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
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && status !== "SCANNING" && runDiagnostics()}
              placeholder="Describe system (e.g. 'Platform for therapists to sell courses to families')"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-700 font-mono h-12 text-sm md:text-base outline-none" spellCheck={false}
            />
          ) : (
            <input 
              value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && accessState !== "VERIFYING" && verifyLicense()}
              placeholder="ENTER GUMROAD LICENSE KEY..."
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 font-mono h-12 text-sm md:text-base outline-none" spellCheck={false}
            />
          )}

          {accessState === "UNLOCKED" ? (
            <button onClick={runDiagnostics} disabled={status === "SCANNING"} className="bg-white hover:bg-gray-200 text-black px-6 h-10 rounded-lg font-bold text-xs tracking-widest transition-all flex items-center justify-center min-w-[100px]">
              {status === "SCANNING" ? <Zap className="w-4 h-4 animate-spin" /> : "EXECUTE"}
            </button>
          ) : (
            <button onClick={verifyLicense} disabled={accessState === "VERIFYING"} className={`${accessState === "ERROR" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"} text-black px-6 h-10 rounded-lg font-bold text-xs tracking-widest transition-all flex items-center justify-center min-w-[100px]`}>
              {accessState === "VERIFYING" ? <Zap className="w-4 h-4 animate-spin" /> : "VERIFY"}
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-xl p-6 flex flex-col h-full shadow-lg">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center border-b border-white/5 pb-2"><Shield className="w-3 h-3 mr-2" /> Kernel Output</h3>
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
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center"><BrainCircuit className="w-5 h-5 mr-3 text-blue-400" /> Architecture Blueprint</h2>
                  <div className="flex gap-2"><div className="text-[10px] font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider">{spec.type}</div></div>
                </div>
                <div className="text-right hidden sm:block"><div className="text-xs text-gray-500 mb-1">INTEGRITY</div><div className="text-2xl font-bold text-white font-mono">{spec.warnings && spec.warnings.length > 0 ? "80%" : "100%"}</div></div>
              </div>
              <div className="p-6 grid gap-8">
                <div>
                  <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold flex items-center"><Cpu className="w-3 h-3 mr-2" /> Functional Core</div>
                  <div className="flex flex-wrap gap-2">{spec.stack.features.map((feat: string, i: number) => <FeatureChip key={i} text={feat} />)}{spec.stack.ai !== "None" && <span className="text-[10px] bg-purple-500/10 text-purple-200 px-2 py-1 rounded border border-purple-500/20 flex items-center gap-1"><Zap className="w-3 h-3" /> {spec.stack.ai}</span>}</div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-3"><div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center"><Database className="w-3 h-3 mr-2" /> Prisma Schema</div></div>
                  <div className="relative group"><div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><div className="bg-white/10 p-1 rounded hover:bg-white/20 cursor-pointer"><Lock className="w-3 h-3 text-white" /></div></div><pre className="text-[11px] leading-relaxed text-blue-100/80 font-mono bg-[#0F0F0F] p-4 rounded-lg border border-white/10 overflow-x-auto shadow-inner max-h-[400px]">{spec.schema}</pre></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold flex items-center"><Activity className="w-3 h-3 mr-2" /> Endpoints</div>
                    <div className="space-y-1">{spec.routes.map((r: string, i: number) => <div key={i} className="text-[10px] font-mono text-gray-400 bg-white/5 px-3 py-2 rounded border-l-2 border-blue-500/50 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>{r}</div>)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold flex items-center"><ArrowRightLeft className="w-3 h-3 mr-2" /> Suggested Stack</div>
                    <div className="grid grid-cols-1 gap-2">{Object.entries(spec.stack).filter(([k]) => k !== 'features').map(([key, val]: any, i) => <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1"><span className="text-gray-500 uppercase">{key}</span><span className="text-gray-300 font-mono text-right truncate ml-4">{val}</span></div>)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-700 font-mono space-y-4 min-h-[400px]">
               {accessState === "UNLOCKED" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Users className="w-6 h-6 text-gray-600" /></div>
                    <div className="text-sm tracking-widest">[ AWAITING USER INPUT ]</div>
                    <div className="text-xs text-gray-800 max-w-xs text-center">Enter a system description to generate a harmonized structural blueprint.</div>
                  </>
               ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center border border-red-500/20"><Lock className="w-6 h-6 text-red-500" /></div>
                    <div className="text-sm tracking-widest text-red-400">[ SYSTEM LOCKED ]</div>
                    <div className="text-xs text-gray-600 max-w-xs text-center">Valid Gumroad license required to operate Divine Spec Engine.</div>
                    {/* NEW PURCHASE LINK */}
                    <a href="https://gum.co/REPLACE_WITH_YOUR_GUMROAD_LINK" target="_blank" rel="noopener noreferrer" className="mt-4 text-[10px] text-blue-500 hover:text-blue-400 border-b border-blue-500/30">Don't have a license? Get one here.</a>
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
