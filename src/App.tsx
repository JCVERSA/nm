import { useState, useEffect, useRef, FormEvent } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import GetStarted from "./components/GetStarted";
import ChatBubble from "./components/ChatBubble";
import MobileDock from "./components/MobileDock";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  LayoutDashboard,
  MessageSquare,
  Terminal,
  BarChart3,
  ScrollText,
  Download,
  Settings,
  Zap,
  RefreshCw,
  Sparkles,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Check,
  Play,
  Mic,
  Search,
  X,
  BookOpen,
  HelpCircle,
  Copy,
  KeyRound,
  Send,
  Code2,
  QrCode,
  Activity,
  Menu,
  Wifi,
  WifiOff,
  FileDown,
  Cpu,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Hourglass,
  Sun,
  Moon,
} from "lucide-react";
import BloomToggle from "./components/BloomToggle";
import StarBackground from "./components/StarBackground";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

import { BotConfig, BotCommand, ChatMessage, ConnectionStatus } from "./lib/types";
import { formatMessageLine, parseUsageAndParams } from "./lib/format";

type TabId = "overview" | "simulator" | "commands" | "analytics" | "logs" | "export" | "settings";

const PIE_COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#64748b"];

const NAV_MAIN: { id: TabId; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "simulator", label: "Simulator", icon: MessageSquare },
  { id: "commands", label: "Commands", icon: Terminal },
];

const NAV_INSIGHTS: { id: TabId; label: string; icon: any }[] = [
  { id: "analytics", label: "Analytics & AI", icon: BarChart3 },
  { id: "logs", label: "Console Logs", icon: ScrollText },
];

const NAV_SYSTEM: { id: TabId; label: string; icon: any }[] = [
  { id: "export", label: "Export", icon: Download },
  { id: "settings", label: "Settings", icon: Settings },
];

const TAB_TITLES: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Connection status and quick actions" },
  simulator: { title: "Simulation Playground", subtitle: "Test commands live in a WhatsApp-style chat" },
  commands: { title: "Command Customizer", subtitle: "Edit, create and browse all bot commands" },
  analytics: { title: "Analytics & AI", subtitle: "Usage metrics and Gemini AI playground" },
  logs: { title: "Engine Console", subtitle: "Live output from the bot engine" },
  export: { title: "Export", subtitle: "Download a self-contained bot package" },
  settings: { title: "Settings", subtitle: "Bot parameters and API secrets" },
};

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const config: Record<ConnectionStatus, { label: string; dot: string; text: string; bg: string }> = {
    connected: { label: "Connected", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    connecting: { label: "Connecting", dot: "bg-amber-400 animate-pulse", text: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    qr_ready: { label: "Scan QR", dot: "bg-indigo-500 animate-pulse", text: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
    disconnected: { label: "Offline", dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100 border-slate-200" },
    error: { label: "Error", dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  };
  // Defensive: unknown/undefined status must never crash the UI
  const c = config[status] ?? config.disconnected;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

const VALID_STATUSES: ConnectionStatus[] = ["disconnected", "connecting", "qr_ready", "connected", "error"];

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: any; label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 truncate">{value}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, action, children, className = "" }: { title?: string; icon?: any; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{title}</h3>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function App() {
  // ------------------------------------------------------------------ state
  const [panelToken, setPanelToken] = useState<string | null>(() => {
    return sessionStorage.getItem("panel_token");
  });
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [botLang, setBotLang] = useState<"en" | "fr">("en");
  const [compactActive, setCompactActive] = useState(false);
  const [cardsActive, setCardsActive] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("nebula-dark") === "true"; } catch { return false; }
  });
  const [cmdSubView, setCmdSubView] = useState<"editor" | "reference">("editor");

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [apiLocked, setApiLocked] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLogFilters, setActiveLogFilters] = useState<string[]>(["Errors", "System", "Cognitive", "Sandbox"]);
  const [qrReceivedAt, setQrReceivedAt] = useState<number | null>(null);
  const [qrTimeLeft, setQrTimeLeft] = useState<number>(50);
  const [commands, setCommands] = useState<BotCommand[]>([]);
  const [config, setConfig] = useState<BotConfig>({
    botName: "Nebula Bot",
    prefix: ".",
    botImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    ownerNumber: "",
    newsletterUrl: "https://whatsapp.com/channel/0029VaNebulaChannel",
    newsletterName: "Nebula Bot Official News",
  });

  const [analyticsStats, setAnalyticsStats] = useState<Record<string, number>>({});

  // Audio transcription
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Voice conversation
  const [voiceInput, setVoiceInput] = useState("");
  const [voiceReplyText, setVoiceReplyText] = useState("");
  const [isVoiceResponding, setIsVoiceResponding] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Command editor
  const [selectedCommand, setSelectedCommand] = useState<BotCommand | null>(null);
  const [commandCode, setCommandCode] = useState<string>("");
  const [isSavingCode, setIsSavingCode] = useState(false);
  const [editorMessage, setEditorMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // AI builder
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCmdName, setAiCmdName] = useState("");
  const [aiCmdCategory, setAiCmdCategory] = useState("Utility");
  const [aiCmdDesc, setAiCmdDesc] = useState("");
  const [isGeneratingCommand, setIsGeneratingCommand] = useState(false);
  const [aiGenMessage, setAiGenMessage] = useState("");

  // Simulator
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      senderName: "Nebula Bot",
      text: "👋 Welcome to the *Nebula Bot* Control Simulator!\n\nI am fully active. Try typing `.menu` or `.ping` below to test my command routing live in your browser!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Settings
  const [formConfig, setFormConfig] = useState<BotConfig>({ ...config });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  // Secrets
  const [secretStatus, setSecretStatus] = useState<{ configured: boolean; masked: string | null } | null>(null);
  const [secretValue, setSecretValue] = useState("");
  const [isSavingSecret, setIsSavingSecret] = useState(false);
  const [secretMessage, setSecretMessage] = useState("");

  // Docs
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [docSelectedCategory, setDocSelectedCategory] = useState("All");
  const [editorFilter, setEditorFilter] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState({ title: "Done", desc: "Success" });
  const [pairPhone, setPairPhone] = useState("");
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [isPairing, setIsPairing] = useState(false);
  const [copiedCommandName, setCopiedCommandName] = useState<string | null>(null);

  // Project ZIP as text (for environments where file downloads are blocked)
  const [zipB64, setZipB64] = useState<string>("");
  const [zipB64Loading, setZipB64Loading] = useState(false);
  const [zipB64Copied, setZipB64Copied] = useState(false);
  const zipB64Ref = useRef<HTMLTextAreaElement | null>(null);

  const loadZipAsBase64 = async () => {
    setZipB64Loading(true);
    try {
      const res = await fetch("/nebula-bot-latest.zip");
      if (!res.ok) throw new Error("Archive not available");
      const buf = new Uint8Array(await res.arrayBuffer());
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < buf.length; i += chunk) {
        binary += String.fromCharCode(...buf.subarray(i, i + chunk));
      }
      setZipB64(btoa(binary));
    } catch (e: any) {
      setZipB64(`ERROR: ${e.message || e}`);
    } finally {
      setZipB64Loading(false);
    }
  };

  const copyZipB64 = async () => {
    const text = zipB64Ref.current?.value ?? zipB64;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setZipB64Copied(true);
    } catch {
      zipB64Ref.current?.select();
      document.execCommand("copy");
      setZipB64Copied(true);
    }
    setTimeout(() => setZipB64Copied(false), 2000);
  };

  // ------------------------------------------------------------- data fetch
  const [isSyncingSession, setIsSyncingSession] = useState(false);

  const fetchToken = async (): Promise<string | null> => {
    try {
      const res = await fetch("/auth/token");
      if (res.ok) {
        const data = await res.json();
        if (data && data.token) {
          setPanelToken(data.token);
          sessionStorage.setItem("panel_token", data.token);
          return data.token;
        }
      }
    } catch (err) {
      console.error("Failed to fetch panel token:", err);
    }
    return null;
  };

  const reSyncSession = async () => {
    setIsSyncingSession(true);
    const token = await fetchToken();
    if (token) {
      setApiLocked(false);
      // Re-trigger global diagnostic updates
      fetchConfig();
      fetchCommands();
      fetchStatus();
      fetchAnalytics();
      fetchSecretStatus();
    }
    setTimeout(() => setIsSyncingSession(false), 800);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    try { localStorage.setItem("nebula-dark", darkMode ? "true" : "false"); } catch {}
  }, [darkMode]);

  useEffect(() => {
    // Only query protected endpoints once we have acquired a token (or if session storage had it)
    fetchConfig();
    fetchCommands();
    fetchStatus();
    fetchAnalytics();
    fetchSecretStatus();

    const interval = setInterval(() => {
      fetchStatus();
      fetchAnalytics();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelToken]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!qrReceivedAt || status !== "qr_ready") {
      setQrTimeLeft(50);
      return;
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - qrReceivedAt) / 1000);
      const remaining = 50 - elapsed;
      if (remaining <= -5) {
        clearInterval(timer);
        retryConnection();
      } else {
        setQrTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [qrReceivedAt, status]);

  /** Central fetch wrapper: tracks auth failures, attempts silent auto-refresh, and retries. */
  const apiFetch = async (url: string, init?: RequestInit): Promise<Response | null> => {
    try {
      const headers = new Headers(init?.headers || {});
      let activeToken = panelToken || sessionStorage.getItem("panel_token");
      if (activeToken) {
        headers.set("Authorization", `Bearer ${activeToken}`);
      }
      
      let res = await fetch(url, {
        ...init,
        headers,
      });

      // If we encounter a 401, attempt to silently refresh the token and retry once
      if (res.status === 401) {
        console.warn(`[API Access] Received 401 on ${url}. Attempting silent session refresh...`);
        const refreshedToken = await fetchToken();
        if (refreshedToken && refreshedToken !== activeToken) {
          console.log(`[API Access] Token refreshed successfully. Retrying request to ${url}...`);
          const retryHeaders = new Headers(init?.headers || {});
          retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
          res = await fetch(url, {
            ...init,
            headers: retryHeaders,
          });
        }
      }

      if (res.status === 401) {
        setApiLocked(true);
      } else if (res.ok) {
        setApiLocked(false);
      }
      return res;
    } catch (err) {
      console.error(`[API Access] Network failure requesting ${url}:`, err);
      return null;
    }
  };

  const fetchAnalytics = async () => {
    const res = await apiFetch("/api/bot/analytics");
    if (!res || !res.ok) return;
    try {
      const data = await res.json();
      if (data && typeof data.stats === "object" && data.stats !== null) {
        setAnalyticsStats(data.stats);
      }
    } catch (e) {}
  };

  const fetchConfig = async () => {
    const res = await apiFetch("/api/bot/config");
    if (!res || !res.ok) return;
    try {
      const data = await res.json();
      if (data && typeof data === "object" && typeof data.botName === "string") {
        setConfig(data);
        setFormConfig(data);
      }
    } catch (e) {}
  };

  const fetchCommands = async () => {
    const res = await apiFetch("/api/bot/commands");
    if (!res || !res.ok) return;
    try {
      const data = await res.json();
      if (Array.isArray(data)) setCommands(data);
    } catch (e) {}
  };

  const fetchStatus = async () => {
    const res = await apiFetch("/api/bot/status");
    if (!res || !res.ok) return;
    try {
      const data = await res.json();
      // Defensive: never let an unexpected payload poison the UI state
      if (data && VALID_STATUSES.includes(data.status)) setStatus(data.status);
      if (data && Array.isArray(data.logs)) setLogs(data.logs);

      if (data?.status === "qr_ready") {
        const qrRes = await fetch("/api/bot/qr");
        if (qrRes.ok) {
          const qrData = await qrRes.json();
          if (qrData && qrData.qrUrl) {
            setQrUrl(qrData.qrUrl);
            setQrReceivedAt((prev) => prev || Date.now());
          }
        }
      } else {
        setQrUrl(null);
        setQrReceivedAt(null);
      }
    } catch (e) {}
  };

  const fetchSecretStatus = async () => {
    try {
      const res = await fetch("/api/bot/secrets");
      if (!res.ok) return;
      const data = await res.json();
      const gemini = Array.isArray(data?.secrets)
        ? data.secrets.find((s: { name: string }) => s.name === "GEMINI_API_KEY")
        : null;
      setSecretStatus(gemini || null);
    } catch (e) {}
  };

  // ------------------------------------------------------------- bot actions
  const startBot = async () => {
    try {
      await fetch("/api/bot/start", { method: "POST" });
      fetchStatus();
    } catch (e) {}
  };

  const stopBot = async () => {
    try {
      await fetch("/api/bot/stop", { method: "POST" });
      fetchStatus();
    } catch (e) {}
  };

  const clearBotLogs = async () => {
    try {
      await fetch("/api/bot/clear-logs", { method: "POST" });
      fetchStatus();
    } catch (e) {}
  };

  const retryConnection = async () => {
    setIsRetrying(true);
    addSystemLog("🔌 Retrying QR Code Connection... (clearing session auth cache)");
    try {
      await fetch("/api/bot/clear-auth", { method: "POST" });
      addSystemLog("🗑️ Cleared session auth cache via server");
    } catch (e: any) {
      console.error("[Retry] Failed to clear auth cache:", e.message);
    }
    setQrReceivedAt(Date.now());
    setQrTimeLeft(50);
    try {
      await fetch("/api/bot/stop", { method: "POST" });
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetch("/api/bot/start", { method: "POST" });
      await fetchStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRetrying(false);
    }
  };

  const addSystemLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev]);
  };

  // ------------------------------------------------------------- settings
  const saveConfig = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setConfigMessage("");
    try {
      const res = await fetch("/api/bot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formConfig),
      });
      const data = await res.json();
      if (!res.ok) {
        setConfigMessage(`❌ ${data.error || `Failed (${res.status})`}`);
        return;
      }
      setConfig(data);
      setFormConfig(data);
      setConfigMessage("✅ Configuration saved and persisted.");
      addSystemLog("SYSTEM: Config updated successfully.");
    } catch (e) {
      setConfigMessage("❌ Could not reach the server.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const saveSecret = async () => {
    if (!secretValue.trim()) return;
    setIsSavingSecret(true);
    setSecretMessage("");
    try {
      const res = await fetch("/api/bot/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "GEMINI_API_KEY", value: secretValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setSecretValue("");
        setSecretMessage(
          data.fileSaved
            ? "✅ Secret saved to the .env file and applied to the running bot."
            : "✅ Secret applied to the running bot (this deployment does not allow writing .env)."
        );
        addSystemLog("🔑 GEMINI_API_KEY updated from panel.");
        fetchSecretStatus();
      } else {
        setSecretMessage(`❌ ${data.error || "Failed to save secret."}`);
      }
    } catch (e) {
      setSecretMessage("❌ Could not reach the server to save the secret.");
    } finally {
      setIsSavingSecret(false);
    }
  };

  const clearSecret = async () => {
    setIsSavingSecret(true);
    setSecretMessage("");
    try {
      const res = await fetch("/api/bot/secrets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "GEMINI_API_KEY" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSecretValue("");
        setSecretMessage("✅ Secret removed. AI features are now disabled until a new key is added.");
        addSystemLog("🔑 GEMINI_API_KEY removed from panel.");
        fetchSecretStatus();
      } else {
        setSecretMessage(`❌ ${data.error || "Failed to remove secret."}`);
      }
    } catch (e) {
      setSecretMessage("❌ Could not reach the server to remove the secret.");
    } finally {
      setIsSavingSecret(false);
    }
  };

  // ------------------------------------------------------------- commands
  const loadCommandCode = async (cmd: BotCommand) => {
    try {
      setSelectedCommand(cmd);
      setCommandCode("// Loading command code...");
      setEditorMessage("");
      setValidationError(null);
      const res = await fetch(`/api/bot/commands/${cmd.name}`);
      const data = await res.json();
      setCommandCode(data.code || "");
    } catch (e) {}
  };

  const validateCommandCode = (code: string): string | null => {
    // 1. Check for basic syntax: matching braces, brackets, and parentheses
    const stack: string[] = [];
    const pairs: Record<string, string> = { '}': '{', ']': '[', ')': '(' };
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (['{', '[', '('].includes(char)) {
        stack.push(char);
      } else if (['}', ']', ')'].includes(char)) {
        if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
          return `Syntax Error: Unmatched closing character '${char}' at index ${i}. Check your brackets/braces structure.`;
        }
        stack.pop();
      }
    }
    if (stack.length > 0) {
      return `Syntax Error: Unclosed opening character '${stack[stack.length - 1]}'. Ensure all brackets are balanced.`;
    }

    // 2. Check for the required 'execute' function
    const hasExecute = code.includes("execute") && 
      (code.includes("function") || code.includes("=>") || code.includes("execute(") || code.includes("execute:"));
    if (!hasExecute) {
      return "Validation Error: The command code must contain the required 'execute' function/method (e.g., 'async execute' or 'execute: async').";
    }

    // 3. Check for correct imports
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("import ") && !line.includes("from ")) {
        return `Syntax Error: Invalid import statement at line ${i + 1}. Import statements must contain 'from'.`;
      }
    }

    return null; // Passed
  };

  const saveCommandCode = async () => {
    if (!selectedCommand) return;
    
    // Pre-save validation
    const valError = validateCommandCode(commandCode);
    if (valError) {
      setValidationError(valError);
      setEditorMessage("");
      addSystemLog(`VALIDATION FAILED: ${selectedCommand.name} contains syntax or logical errors: ${valError}`);
      return;
    }

    setValidationError(null);
    setIsSavingCode(true);
    setEditorMessage("");
    try {
      const res = await fetch("/api/bot/commands/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedCommand.name, code: commandCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditorMessage(`✅ ${data.message || "Command saved."}`);
        addSystemLog(`SUCCESS: ${data.message || `Command ${selectedCommand.name} saved.`}`);
        fetchCommands();
      } else {
        setEditorMessage(`❌ ${data.error || "Failed to save command."}`);
        addSystemLog(`ERROR: ${data.error || "Failed to save command."}`);
      }
    } catch (e) {
      setEditorMessage("❌ Could not reach the server to save the command.");
    } finally {
      setIsSavingCode(false);
    }
  };

  const generateAICommand = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt || !aiCmdName) return;
    setIsGeneratingCommand(true);
    setAiGenMessage("🧬 Nebula AI is synthesizing the code...");
    try {
      const res = await fetch("/api/bot/commands/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          commandName: aiCmdName,
          category: aiCmdCategory,
          description: aiCmdDesc,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiGenMessage(`✅ ${data.message || `Command ${aiCmdName} created and hot-loaded!`}`);
        setAiPrompt("");
        setAiCmdName("");
        setAiCmdDesc("");
        fetchCommands();
      } else {
        setAiGenMessage(`❌ ${data.error || "Generation failed"}`);
      }
    } catch (e: any) {
      setAiGenMessage(`❌ ${e.message}`);
    } finally {
      setIsGeneratingCommand(false);
    }
  };

  // ------------------------------------------------------------- simulator
  const simulateCommandFromDoc = async (cmdText: string) => {
    if (isSimulating) return;
    setActiveTab("simulator");
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      senderName: "Owner",
      text: cmdText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsSimulating(true);

    try {
      const res = await fetch("/api/bot/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: "Owner", text: cmdText }),
      });
      const data = await res.json();
      // Introduce an artificial typing simulation delay to show typing indicator
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const botReply: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        senderName: config.botName,
        text: data.text || `🤖 Commands start with prefix \`${config.prefix}\`. Type \`${config.prefix}menu\` for services!`,
        imageUrl: data.imageUrl,
        emoji: data.emoji,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botReply]);
    } catch (e) {
      setChatMessages((prev) => [...prev, {
        id: Math.random().toString(),
        sender: "bot",
        senderName: config.botName,
        text: "❌ *Error contacting bot simulator engine.* Is the server running?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMsgText = inputValue;
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      senderName: "Owner",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSimulating(true);

    try {
      const res = await fetch("/api/bot/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: "Owner", text: userMsgText }),
      });
      const data = await res.json();
      // Introduce an artificial typing simulation delay to show typing indicator
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const botReply: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        senderName: config.botName,
        text: data.text || `🤖 Commands start with prefix \`${config.prefix}\`. Type \`${config.prefix}menu\` for services!`,
        imageUrl: data.imageUrl,
        emoji: data.emoji,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botReply]);
    } catch (e) {
      setChatMessages((prev) => [...prev, {
        id: Math.random().toString(),
        sender: "bot",
        senderName: config.botName,
        text: "❌ *Error contacting bot simulator engine.* Is the server running?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSendVoiceNote = async () => {
    if (isSimulating) return;
    const voiceMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      senderName: "Owner",
      text: "🎙️ Voice note (0:07)",
      isAudio: true,
      audioDuration: "0:07",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, voiceMsg]);
    setIsSimulating(true);

    try {
      const res = await fetch("/api/bot/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: "Owner", text: "🎙️ [Voice Note]" }),
      });
      const data = await res.json();
      // Introduce an artificial typing simulation delay to show typing indicator
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const botReply: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        senderName: config.botName,
        text: data.text || "🤖 Thank you for the voice note!",
        imageUrl: data.imageUrl,
        emoji: data.emoji,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botReply]);
    } catch (e) {
      setChatMessages((prev) => [...prev, {
        id: Math.random().toString(),
        sender: "bot",
        senderName: config.botName,
        text: "❌ *Error contacting bot simulator engine.* Is the server running?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsSimulating(false);
    }
  };

  // ------------------------------------------------------------- audio
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startRecording = async () => {
    setTranscriptionText("");
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setIsTranscribing(true);
        try {
          const base64Audio = await blobToBase64(audioBlob);
          const response = await fetch("/api/gemini/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioBase64: base64Audio, mimeType: "audio/webm" }),
          });
          const result = await response.json();
          if (result.transcript) setTranscriptionText(result.transcript);
          else if (result.error) setTranscriptionText(`⚠️ Error: ${result.error}`);
          else setTranscriptionText("⚠️ Failed to transcribe audio content.");
        } catch (err: any) {
          setTranscriptionText(`❌ Network/Server Error: ${err.message || err}`);
        } finally {
          setIsTranscribing(false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      audioTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
        audioTimerRef.current = null;
      }
    }
  };

  const handleVoiceCallConvo = async (textPrompt: string) => {
    if (!textPrompt.trim()) return;
    setIsVoiceResponding(true);
    setVoiceReplyText("");
    setIsPlayingVoice(false);

    try {
      const res = await fetch("/api/gemini/voice-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textPrompt }),
      });
      const data = await res.json();
      if (data.text) {
        setVoiceReplyText(data.text);
        if (data.audioBase64) {
          const rawAudioUrl = `data:audio/mp3;base64,${data.audioBase64}`;
          setTimeout(() => {
            if (audioPlayerRef.current) {
              audioPlayerRef.current.src = rawAudioUrl;
              audioPlayerRef.current.play()
                .then(() => setIsPlayingVoice(true))
                .catch(() => {});
            }
          }, 200);
        }
      } else if (data.error) {
        setVoiceReplyText(`⚠️ Voice engine error: ${data.error}`);
      }
    } catch (err: any) {
      setVoiceReplyText(`❌ Failed to connect to Voice Engine: ${err.message || err}`);
    } finally {
      setIsVoiceResponding(false);
    }
  };

  const startVoiceRecording = async () => {
    setVoiceInput("");
    setRecordingSeconds(0);
    voiceChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(voiceChunksRef.current, { type: "audio/webm" });
        setIsTranscribing(true);
        try {
          const base64Audio = await blobToBase64(audioBlob);
          const response = await fetch("/api/gemini/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioBase64: base64Audio, mimeType: "audio/webm" }),
          });
          const result = await response.json();
          if (result.transcript) {
            setVoiceInput(result.transcript);
            handleVoiceCallConvo(result.transcript);
          }
        } catch (err: any) {
          console.error("Transcribing voice input failed:", err);
        } finally {
          setIsTranscribing(false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsVoiceRecording(true);
      audioTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorderRef.current && isVoiceRecording) {
      voiceRecorderRef.current.stop();
      setIsVoiceRecording(false);
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
        audioTimerRef.current = null;
      }
    }
  };

  // ------------------------------------------------------------- derived
  const filteredMessages = chatMessages.filter((msg) => {
    if (!chatSearchQuery.trim()) return true;
    const query = chatSearchQuery.toLowerCase();
    return (
      msg.text.toLowerCase().includes(query) ||
      (msg.senderName && msg.senderName.toLowerCase().includes(query))
    );
  });

  const totalSimulated = chatMessages.length - 1;

  // ------------------------------------------------------------------ render
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-900/40">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-white text-sm tracking-tight">{config.botName}</h1>
          <p className="text-[10px] text-slate-400 font-semibold">v1.1.0 · Controller</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Main</p>
          {NAV_MAIN.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition cursor-pointer mb-0.5 ${
                activeTab === id
                  ? "bg-indigo-500/15 text-white border border-indigo-400/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {activeTab === id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
            </button>
          ))}
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Insights</p>
          {NAV_INSIGHTS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition cursor-pointer mb-0.5 ${
                activeTab === id
                  ? "bg-indigo-500/15 text-white border border-indigo-400/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {activeTab === id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
            </button>
          ))}
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">System</p>
          {NAV_SYSTEM.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition cursor-pointer mb-0.5 ${
                activeTab === id
                  ? "bg-indigo-500/15 text-white border border-indigo-400/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {activeTab === id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer status */}
      <div className="p-4">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
          <div className="flex items-center gap-2.5">
            {status === "connected" ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-slate-500" />
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white">WhatsApp Engine</p>
              <p className="text-[10px] text-slate-400 truncate">
                {status === "connected" ? "Online — listening for commands" : "Standby"}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3" />
            Token-protected API
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans" id="app_root">
      <Sidebar active={activeTab} onChange={(t) => setActiveTab(t as any)} open={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-20">
        <Topbar title={TAB_TITLES[activeTab].title} subtitle={TAB_TITLES[activeTab].subtitle} onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-[1400px] w-full mx-auto">
      <SuccessAlert visible={showSuccess} title={successMsg.title} description={successMsg.desc} onClose={() => setShowSuccess(false)} />
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-slate-950 border-r border-slate-800 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
          <div className="px-4 md:px-6 py-3.5 flex items-center gap-3">
            <AboutCard onClick={() => { setShowSuccess(true); setSuccessMsg({title:"About", desc:"By Jcversa — Nebula Bot Controller"}); setTimeout(()=>setShowSuccess(false),4000); }} />
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-slate-900 truncate">{TAB_TITLES[activeTab].title}</h2>
              <p className="text-[11px] text-slate-500 truncate">{TAB_TITLES[activeTab].subtitle}</p>
            </div>

            <div className="hidden md:block">
              <StatusBadge status={status} />
            </div>

            {status === "disconnected" || status === "error" ? (
              <button
                onClick={startBot}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-500/25 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                Start Bot
              </button>
            ) : (
              <button
                onClick={stopBot}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Disconnect
              </button>
            )}

            <a
              href="/nebula-bot-latest.zip"
              title="Download the full project as ZIP"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md cursor-pointer shrink-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Project</span>
            </a>

            <button
              onClick={async () => { const next = botLang === "en" ? "fr" : "en"; setBotLang(next); try { await fetch("/api/bot/config", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({language:next})}); } catch(e){}}}
              title={botLang === "fr" ? "Passer en anglais" : "Passer en français"}
              className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/30 rounded-xl transition cursor-pointer text-xs font-bold"
            >
              {botLang === "fr" ? "FR" : "EN"}
            </button>

            <BloomToggle checked={darkMode} onChange={(v) => setDarkMode(v)} />

            <button
              onClick={fetchStatus}
              title="Refresh status"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* API locked banner */}
        {apiLocked && (
          <div className="px-4 md:px-6 py-2.5 bg-rose-50/90 border-b border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
            <p className="text-[11px] font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500 animate-bounce" />
              <span>Panel API access is locked (401). Secure iFrame sandbox policies may have blocked cookies or your session has timed out.</span>
            </p>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={reSyncSession}
                disabled={isSyncingSession}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingSession ? "animate-spin" : ""}`} />
                {isSyncingSession ? "Re-syncing..." : "Re-sync Session"}
              </button>
              <button
                onClick={() => { window.location.reload(); }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {darkMode && <StarBackground />}
        <main className="flex-1 p-4 md:p-6 max-w-[1400px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <div className="space-y-6"><GetStarted /><div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-800/30"><h2 className="font-extrabold text-xl">Active</h2><p className="text-sm text-indigo-200/70">Dashboard running clean — all heavy animations removed for stability.</p></div></div>{/* ============================================================ ANALYTICS */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card title="Command Frequencies" icon={BarChart3} action={
                      <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Live tracking
                      </span>
                    }>
                      <div className="h-[280px] flex items-center justify-center">
                        {Object.keys(analyticsStats).length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={Object.entries(analyticsStats).map(([name, value]) => ({ name: `${config.prefix}${name}`, value }))}
                                cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value"
                              >
                                {Object.entries(analyticsStats).map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "11px", fontWeight: "600" }} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "600" }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No usage data yet — commands you run will appear here.</p>
                        )}
                      </div>
                    </Card>

                    {/* Transcribe */}
                    <Card title="Transcribe Audio" icon={Mic}>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[110px] flex flex-col justify-center items-center text-center">
                        {isTranscribing ? (
                          <div className="space-y-2">
                            <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin mx-auto" />
                            <p className="text-[10px] text-indigo-600 font-semibold">Gemini is transcribing...</p>
                          </div>
                        ) : transcriptionText ? (
                          <p className="text-xs text-slate-800 font-medium italic leading-relaxed">"{transcriptionText}"</p>
                        ) : isRecording ? (
                          <div className="space-y-1.5 animate-pulse">
                            <div className="flex items-center justify-center gap-1">
                              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                              <span className="text-xs font-bold text-rose-600">RECORDING</span>
                            </div>
                            <p className="text-[10px] text-slate-500">{recordingSeconds}s elapsed</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400">Speak into your microphone — your transcription will appear here</p>
                        )}
                      </div>
                      <div className="mt-4">
                        {isRecording ? (
                          <button onClick={stopRecording} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer">
                            Stop & Transcribe
                          </button>
                        ) : (
                          <button
                            onClick={startRecording}
                            disabled={isTranscribing}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Mic className="w-3.5 h-3.5" /> Record Microphone
                          </button>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Voice conversation */}
                  <Card title="Voice Conversation (Live API)" icon={Sparkles}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[110px] flex flex-col justify-center items-center text-center">
                        <audio ref={audioPlayerRef} className="hidden" onEnded={() => setIsPlayingVoice(false)} />
                        {isVoiceResponding ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-1">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                            <p className="text-[10px] text-indigo-500 font-semibold">Gemini is thinking...</p>
                          </div>
                        ) : isVoiceRecording ? (
                          <div className="space-y-1 animate-pulse">
                            <span className="text-xs font-bold text-rose-500">LISTENING...</span>
                            <p className="text-[10px] text-slate-400">Say what you want to ask Gemini</p>
                          </div>
                        ) : voiceReplyText ? (
                          <div className="space-y-2 max-w-full">
                            <p className="text-xs font-semibold text-indigo-600">Gemini Speaks:</p>
                            <p className="text-xs text-slate-800 leading-relaxed italic">"{voiceReplyText}"</p>
                            {isPlayingVoice && (
                              <div className="flex items-center justify-center gap-0.5 pt-1.5">
                                {[...Array(8)].map((_, i) => (
                                  <div key={i} className="w-1 bg-indigo-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 16 + 6}px`, animationDuration: `${0.4 + Math.random() * 0.4}s` }} />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400">Start a conversation using mic or text</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={voiceInput}
                            onChange={(e) => setVoiceInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleVoiceCallConvo(voiceInput)}
                            placeholder="Type to converse..."
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <button
                            onClick={() => handleVoiceCallConvo(voiceInput)}
                            disabled={isVoiceResponding || !voiceInput.trim()}
                            className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            Call
                          </button>
                        </div>
                        {isVoiceRecording ? (
                          <button onClick={stopVoiceRecording} className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-xl transition shadow-sm cursor-pointer">
                            Stop Speaking
                          </button>
                        ) : (
                          <button
                            onClick={startVoiceRecording}
                            disabled={isVoiceResponding}
                            className="w-full py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Mic className="w-3 h-3" /> Record Voice Response
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ============================================================ LOGS */}
              {activeTab === "logs" && (() => {
                const getLogCategory = (log: string): string => {
                  if (log.includes("❌") || log.includes("Error") || log.includes("failed") || log.includes("Blocked") || log.includes("🛡️") || log.includes("Guardrail") || log.includes("⚠️") || log.includes("WARNING")) {
                    return "Errors";
                  } else if (log.includes("🤖") || log.includes("Gemini") || log.includes("Asking")) {
                    return "Cognitive";
                  } else if (log.includes("Simulator") || log.includes("Playground") || log.includes("Message from")) {
                    return "Sandbox";
                  }
                  return "System";
                };

                const filteredLogs = logs.filter(log => activeLogFilters.includes(getLogCategory(log)));

                return (
                  <Card title="Engine Console Output" icon={Terminal} action={
                    <button
                      onClick={clearBotLogs}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </button>
                  }>
                    <div className="flex flex-col gap-3">
                      {/* Category Filter Chips */}
                      <div className="flex items-center gap-2 flex-wrap bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider mr-1.5 select-none">Filter Logs:</span>
                        {["Errors", "System", "Cognitive", "Sandbox"].map((category) => {
                          const isActive = activeLogFilters.includes(category);
                          const count = logs.filter(log => getLogCategory(log) === category).length;
                          return (
                            <button
                              key={category}
                              onClick={() => {
                                if (isActive) {
                                  if (activeLogFilters.length > 1) {
                                    setActiveLogFilters(activeLogFilters.filter(c => c !== category));
                                  }
                                } else {
                                  setActiveLogFilters([...activeLogFilters, category]);
                                }
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition cursor-pointer select-none flex items-center gap-1.5 border ${
                                isActive
                                  ? category === "Errors"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-sm"
                                    : category === "Cognitive"
                                    ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25 shadow-sm"
                                    : category === "Sandbox"
                                    ? "bg-sky-500/10 text-sky-400 border-sky-500/25 shadow-sm"
                                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/25 shadow-sm"
                                  : "bg-slate-950/40 text-slate-500 border-slate-950 hover:text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                category === "Errors" ? "bg-rose-500" :
                                category === "Cognitive" ? "bg-fuchsia-500" :
                                category === "Sandbox" ? "bg-sky-400" : "bg-indigo-400"
                              } ${isActive ? "animate-pulse" : "opacity-40"}`} />
                              <span>{category}</span>
                              <span className="text-[9px] bg-black/30 px-1.5 py-0.2 rounded font-medium select-none text-slate-400">{count}</span>
                            </button>
                          );
                        })}
                        {activeLogFilters.length < 4 && (
                          <button
                            onClick={() => setActiveLogFilters(["Errors", "System", "Cognitive", "Sandbox"])}
                            className="ml-auto text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300 transition cursor-pointer select-none"
                          >
                            Show All
                          </button>
                        )}
                      </div>

                      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 shadow-lg min-h-[420px] max-h-[560px] overflow-y-auto flex flex-col font-mono text-[11px] leading-relaxed select-text text-slate-200">
                        {filteredLogs.length === 0 ? (
                          <span className="text-slate-500 text-center py-12 italic">_no activity matching the selected filters_</span>
                        ) : (
                          filteredLogs.map((log, index) => {
                            let colorClass = "text-slate-300";
                            let badgeText = "SYSTEM";
                            let badgeColor = "bg-slate-800 text-slate-400 border border-slate-700/50";

                            if (log.includes("❌") || log.includes("Error") || log.includes("failed") || log.includes("Blocked")) {
                              colorClass = "text-rose-400";
                              badgeText = "ERROR";
                              badgeColor = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                            } else if (log.includes("🛡️") || log.includes("Guardrail")) {
                              colorClass = "text-indigo-400";
                              badgeText = "GUARD";
                              badgeColor = "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
                            } else if (log.includes("⚠️") || log.includes("WARNING")) {
                              colorClass = "text-amber-400";
                              badgeText = "WARN";
                              badgeColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                            } else if (log.includes("✅") || log.includes("connected") || log.includes("SUCCESS")) {
                              colorClass = "text-emerald-400";
                              badgeText = "SUCCESS";
                              badgeColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                            } else if (log.includes("🤖") || log.includes("Gemini") || log.includes("Asking")) {
                              colorClass = "text-fuchsia-400";
                              badgeText = "COGNITIVE";
                              badgeColor = "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20";
                            } else if (log.includes("Simulator") || log.includes("Playground") || log.includes("Message from")) {
                              colorClass = "text-sky-400";
                              badgeText = "SANDBOX";
                              badgeColor = "bg-sky-500/10 text-sky-400 border border-sky-500/20";
                            }

                            return (
                              <div key={index} className="flex items-center gap-3 py-1.5 border-b border-slate-900/40 last:border-0 hover:bg-slate-900/20 px-1 transition-colors">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase select-none ${badgeColor} shrink-0`}>
                                  {badgeText}
                                </span>
                                <span className={`${colorClass} break-words`}>{log}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })()}

              {/* ============================================================ EXPORT */}
              {activeTab === "export" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/25 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left max-w-lg">
                      <h3 className="font-extrabold text-lg">Run Nebula Bot Locally</h3>
                      <p className="text-xs text-indigo-100 leading-relaxed">
                        Export your current configuration, commands and runtime into a self-contained Node package — with automatic QR output, session handling, and all dependencies listed.
                      </p>
                    </div>
                    <a
                      href="/api/bot/download-zip"
                      className="px-6 py-3 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-sm rounded-xl flex items-center gap-2 transition shadow-lg whitespace-nowrap cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      Download Complete ZIP
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { n: "01", t: "Extract & Install", d: "Unzip the package, run npm install in the folder." },
                      { n: "02", t: "Set API Keys", d: "Edit the generated .env with your GEMINI_API_KEY (never shared automatically)." },
                      { n: "03", t: "Launch & Link", d: "npm start prints a QR code — scan it with Linked Devices on your phone." },
                    ].map((step) => (
                      <div key={step.n} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{step.n}</div>
                        <h5 className="font-bold text-slate-800 text-sm">{step.t}</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{step.d}</p>
                      </div>
                    ))}
                  </div>

                  <Card title="Download Full Project Source" icon={FileDown}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                        Grab the complete Nebula Bot project as a ZIP — full source code, tests, configs, CI workflow and
                        README, ready to run with <code className="bg-slate-100 px-1 rounded">npm install</code>. Ideal
                        for backups or moving the project to another machine.
                      </p>
                      <a
                        href="/nebula-bot-latest.zip"
                        className="shrink-0 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer"
                      >
                        <FileDown className="w-4 h-4" />
                        Download Project ZIP
                      </a>
                    </div>
                  </Card>

                  <Card title="Downloads blocked? Copy the project as text" icon={Copy}>
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        If your browser blocks the file download (some preview environments do), encode the ZIP as
                        base64 text, copy it, then decode it locally:
                      </p>
                      <ol className="text-[11px] text-slate-500 list-decimal list-inside space-y-1">
                        <li>Click <b>Encode as Base64</b> below</li>
                        <li>Click <b>Copy</b>, then paste into a new file named <code className="bg-slate-100 px-1 rounded">nebula.txt</code></li>
                        <li>Run <code className="bg-slate-100 px-1 rounded">python3 -c "import base64;open('nebula-bot-latest.zip','wb').write(base64.b64decode(open('nebula.txt').read()))"</code></li>
                      </ol>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={loadZipAsBase64}
                          disabled={zipB64Loading}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          {zipB64Loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Code2 className="w-3.5 h-3.5" />}
                          {zipB64 ? "Re-encode" : "Encode as Base64"}
                        </button>
                        {zipB64 && !zipB64.startsWith("ERROR") && (
                          <button
                            onClick={copyZipB64}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                          >
                            {zipB64Copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {zipB64Copied ? "Copied!" : "Copy"}
                          </button>
                        )}
                      </div>
                      {zipB64 && (
                        <textarea
                          ref={zipB64Ref}
                          readOnly
                          value={zipB64}
                          rows={7}
                          onFocus={(e) => e.currentTarget.select()}
                          className="w-full p-3 font-mono text-[10px] bg-slate-950 text-slate-100 rounded-xl border border-slate-800 leading-relaxed resize-y"
                        />
                      )}
                      {zipB64.startsWith("ERROR") && (
                        <p className="text-[11px] font-semibold text-rose-600">{zipB64}</p>
                      )}
                    </div>
                  </Card>

                  <Card title="What's included" icon={CheckCircle}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "All 21 built-in commands (transpiled to CommonJS)",
                        "Shared runtime modules (AI client, group database)",
                        "config.json with your current settings",
                        "Auto-reconnect & session management",
                        "Environment template with placeholders only",
                        "README with quick-start instructions",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> {item}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ============================================================ SETTINGS */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card title="Bot Parameters" icon={Settings}>
                    <form onSubmit={saveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Bot Name</label>
                        <input
                          type="text"
                          value={formConfig.botName || ""}
                          onChange={(e) => setFormConfig({ ...formConfig, botName: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-indigo-500 transition shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Prefix</label>
                        <input
                          type="text"
                          value={formConfig.prefix || ""}
                          onChange={(e) => setFormConfig({ ...formConfig, prefix: e.target.value })}
                          maxLength={2}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-indigo-500 transition shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-600">Bot Image URL (Avatar)</label>
                        <input
                          type="url"
                          value={formConfig.botImage || ""}
                          onChange={(e) => setFormConfig({ ...formConfig, botImage: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-indigo-500 transition shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Owner Number (With Country Code)</label>
                        <input
                          type="text"
                          value={formConfig.ownerNumber || ""}
                          placeholder="e.g. 2376XXXXXXXX"
                          onChange={(e) => setFormConfig({ ...formConfig, ownerNumber: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-indigo-500 transition shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Newsletter Channel Name</label>
                        <input
                          type="text"
                          value={formConfig.newsletterName || ""}
                          onChange={(e) => setFormConfig({ ...formConfig, newsletterName: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-indigo-500 transition shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-600">Newsletter Channel URL</label>
                        <input
                          type="url"
                          value={formConfig.newsletterUrl || ""}
                          onChange={(e) => setFormConfig({ ...formConfig, newsletterUrl: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-indigo-500 transition shadow-sm"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                        {configMessage && <span className="text-[11px] text-slate-600 font-medium">{configMessage}</span>}
                        <button
                          type="submit"
                          disabled={isSavingConfig}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          {isSavingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Save Config Settings
                        </button>
                      </div>
                    </form>
                  </Card>

                  {/* Secrets */}
                  <Card title="API Secrets" icon={KeyRound} action={
                    secretStatus?.configured ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Configured
                      </span>
                    ) : (
                      <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">Not configured</span>
                    )
                  }>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-800">GEMINI_API_KEY</span>
                        {secretStatus?.configured && secretStatus.masked && (
                          <span className="text-[11px] text-slate-400 font-mono">{secretStatus.masked}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {secretStatus?.configured
                          ? "Current value is masked. Paste a new key to replace it."
                          : "Add your key to enable AI chat, image generation, transcription and voice features."}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <input
                          type="password"
                          value={secretValue}
                          onChange={(e) => setSecretValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveSecret()}
                          placeholder="Paste your Gemini API key..."
                          autoComplete="off"
                          className="flex-1 min-w-[220px] px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-indigo-500 transition shadow-sm font-mono"
                        />
                        <button
                          onClick={saveSecret}
                          disabled={isSavingSecret || !secretValue.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          {isSavingSecret ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Save Secret
                        </button>
                        {secretStatus?.configured && (
                          <button
                            onClick={clearSecret}
                            disabled={isSavingSecret}
                            title="Remove the key"
                            className="p-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl transition shadow-sm cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Stored in the server's <code className="bg-slate-100 px-1 rounded">.env</code> file and applied immediately — no restart needed. Values are masked and never leave the server.
                      </p>
                      {secretMessage && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-700 font-medium">{secretMessage}</div>
                      )}
                    </div>
                  </Card>

                  {/* Channel link */}
                  <Card title="Community" icon={Globe}>
                    <a
                      href={config.newsletterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{config.newsletterName}</p>
                          <p className="text-[10px] text-slate-500">Official updates & announcements</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition" />
                    </a>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 text-center text-slate-400 text-[11px] border-t border-slate-200 bg-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 max-w-[1400px] mx-auto">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Nebula Bot Project Dashboard & Controller
            </span>
            <span>© 2026 Nebula Bot Engine · v1.1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
