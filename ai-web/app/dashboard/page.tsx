"use client";

import {
  Activity,
  AlertTriangle,
  Bot,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  User,
  Send,
  X,
  Settings,
  Download,
  Mail,
  LogOut,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  FileDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { analyzeSymptoms } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SettingsModal from "@/components/SettingsModal";
import QuickActionModal from "@/components/QuickActionModals";
import ThemeToggle from "@/components/ThemeToggle";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp?: Date;
  confidence?: number;
  feedback?: "positive" | "negative" | null;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const quickActions = [
  { icon: Activity, text: "Check symptoms", color: "from-blue-500 to-cyan-500" },
  { icon: Heart, text: "Heart health", color: "from-red-500 to-pink-500" },
  { icon: Shield, text: "Preventive care", color: "from-green-500 to-emerald-500" },
  { icon: Clock, text: "Medication reminder", color: "from-purple-500 to-violet-500" },
] as const;

const emergencyContacts = [
  {
    name: "Isange One Stop Center",
    number: "3029",
    description:
      "Victims of gender-based violence, including medical and legal.",
    icon: MessageCircle,
    color: "from-yellow-500 to-orange-600",
    urgent: true,
  },
  {
    name: "Emergency Call",
    number: "116",
    description: "Life-threatening emergencies",
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
    urgent: true,
  },
  {
    name: "Medical Emergency",
    number: "114",
    description: "Health advice and nurse hotline",
    icon: Activity,
    color: "from-blue-500 to-blue-600",
    urgent: false,
  },
  {
    name: "Gender Based Violence",
    number: "3029",
    description: "All violences done due to one's gender.",
    icon: Shield,
    color: "from-orange-500 to-orange-600",
    urgent: true,
  },
  {
    name: "Child/Drug Abuse",
    number: "116",
    description: "Mental health crisis support",
    icon: MapPin,
    color: "from-purple-500 to-purple-600",
    urgent: false,
  },
  {
    name: "Human Trafficking",
    number: "166",
    description: "Report human trafficking or get help for victims.",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    urgent: true,
  },
] as const;

export default function DashboardPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmergencyCards, setShowEmergencyCards] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState<{username: string, email: string} | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [quickActionType, setQuickActionType] = useState<"symptoms" | "heart" | "preventive" | "medication">("symptoms");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setIsTyping(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const storedUserInfo = typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
    
    if (!token || !storedUserId) {
      router.replace("/login");
    } else {
      setIsAuth(true);
      setUserId(storedUserId);
      
      // Try to get user info from localStorage
      if (storedUserInfo) {
        try {
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (error) {
          console.error("Error parsing user info:", error);
          // Set default user info
          setUserInfo({ username: storedUserId, email: storedUserId });
        }
      } else {
        // Set default user info if not found
        setUserInfo({ username: storedUserId, email: storedUserId });
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuth || !userId) return;
    const key = `conversations_${userId.toLowerCase()}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: Conversation[] = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      } else {
        localStorage.setItem(key, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      localStorage.setItem(key, JSON.stringify([]));
    }
  }, [isAuth, userId]);

  useEffect(() => {
    if (!isAuth || !userId) return;
    const key = `conversations_${userId.toLowerCase()}`;
    try {
      localStorage.setItem(key, JSON.stringify(conversations));
    } catch (error) {
      console.error("Error saving conversations:", error);
    }
  }, [conversations, isAuth, userId]);

  useEffect(() => {
    if (!isAuth || !activeConversationId) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId ? { ...conv, messages } : conv
      )
    );
  }, [messages, activeConversationId, isAuth]);

  useEffect(() => {
    if (!activeConversationId) return;
    if (messages.length === 1 && messages[0].role === "user") {
      const firstMessage = messages[0].content.slice(0, 30);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId ? { ...conv, title: firstMessage } : conv
        )
      );
    }
  }, [messages, activeConversationId]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const startNewConversation = () => {
    const newId = uuidv4();
    const newConv: Conversation = {
      id: newId,
      title: "New Conversation",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find((conv) => conv.id === id);
    if (!conversation) return;
    setActiveConversationId(id);
    setMessages(conversation.messages);
  };

  const sendMessage = async (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await analyzeSymptoms(trimmedContent);
      
      // Extract confidence score from response if available
      const confidenceMatch = res.message.match(/confidence[:\s]+(\d+)%/i);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : undefined;
      
      const botMsg: ChatMessage = {
        id: `${Date.now()}-bot`,
        role: "bot",
        content: res.message,
        timestamp: new Date(),
        confidence,
        feedback: null,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          role: "bot",
          content:
            "I'm sorry, I couldn't find a match for your symptoms right now. Please try rephrasing or listing your symptoms differently, and I'll do my best to help!",
          timestamp: new Date(),
          feedback: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentInput = input.trim();
    if (!currentInput) return;
    setInput("");
    await sendMessage(currentInput);
  };

  const handleLogout = () => {
    if (!userId) return;
    const key = `conversations_${userId.toLowerCase()}`;
    try {
      localStorage.setItem(key, JSON.stringify(conversations));
    } catch (error) {
      console.error("Error saving conversations during logout:", error);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    
    // Redirect to landing page instead of login
    window.location.href = "/";
  };

  const handleDownloadApp = () => {
    // Create a modal or redirect for mobile app download
    const downloadInfo = `
📱 SymptomAI Mobile App

Coming Soon to:
• 📱 iOS App Store
• 🤖 Google Play Store
• 🌐 Progressive Web App (PWA)

Features:
✅ Offline symptom analysis
✅ Push notifications for health reminders
✅ Sync across devices
✅ Enhanced privacy controls
✅ Voice input support

Stay tuned for updates!
    `;
    
    if (confirm("Would you like to be notified when the mobile app is available?")) {
      // In a real app, this would subscribe to notifications
      alert("Great! We'll notify you at " + (userInfo?.email || "your email") + " when the app is ready.");
    } else {
      alert(downloadInfo);
    }
  };

  const handleContactUs = () => {
    // Create a more comprehensive contact us modal or redirect
    const contactInfo = `
SymptomAI Support

📧 Email: support@symptomai.com
📱 Phone: +250 788 123 456
🌐 Website: www.symptomai.com

For technical support, feature requests, or general inquiries, please reach out to us using any of the above methods.

We typically respond within 24 hours during business days.
    `;
    
    if (confirm("Would you like to open your email client to contact us?")) {
      window.open(`mailto:support@symptomai.com?subject=SymptomAI Support Request&body=Hello SymptomAI Team,%0D%0A%0D%0AI would like to...`, "_blank");
    } else {
      alert(contactInfo);
    }
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleUserInfoUpdate = (newUserInfo: { username: string; email: string }) => {
    setUserInfo(newUserInfo);
  };

  const handleQuickAction = (actionText: string) => {
    const actionMap: { [key: string]: "symptoms" | "heart" | "preventive" | "medication" } = {
      "Check symptoms": "symptoms",
      "Heart health": "heart",
      "Preventive care": "preventive",
      "Medication reminder": "medication",
    };
    
    const actionType = actionMap[actionText];
    if (actionType) {
      setQuickActionType(actionType);
      setShowQuickActionModal(true);
    }
  };

  const handleQuickActionSubmit = async (data: any) => {
    // Create a formatted message based on the action type
    let message = "";
    
    switch (quickActionType) {
      case "symptoms":
        message = `I'm experiencing the following symptoms: ${data.symptoms}`;
        if (data.duration) message += `\nDuration: ${data.duration}`;
        if (data.severity) message += `\nSeverity: ${data.severity}`;
        break;
      case "heart":
        message = `I have heart health concerns: ${data.concerns}`;
        if (data.age) message += `\nAge: ${data.age}`;
        if (data.bloodPressure) message += `\nBlood Pressure: ${data.bloodPressure}`;
        if (data.riskFactors?.length) message += `\nRisk Factors: ${data.riskFactors.join(", ")}`;
        break;
      case "preventive":
        message = `I'm interested in preventive care for: ${data.careType}`;
        if (data.ageGroup) message += `\nAge Group: ${data.ageGroup}`;
        if (data.goals) message += `\nHealth Goals: ${data.goals}`;
        break;
      case "medication":
        message = `I need a medication reminder for: ${data.medicationName} (${data.dosage})`;
        if (data.frequency) message += `\nFrequency: ${data.frequency}`;
        if (data.reminderTimes?.length) message += `\nReminder Times: ${data.reminderTimes.join(", ")}`;
        if (data.instructions) message += `\nInstructions: ${data.instructions}`;
        break;
    }
    
    // Send the formatted message
    await sendMessage(message);
  };

  const handleMessageFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Message copied to clipboard!");
  };

  const handleExportChat = () => {
    const chatText = messages
      .map((msg) => {
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "N/A";
        return `[${time}] ${msg.role === "user" ? "You" : "SymptomAI"}: ${msg.content}`;
      })
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `symptom-ai-chat-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    
    let color = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    let label = "Low Confidence";
    
    if (confidence > 70) {
      color = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      label = "High Confidence";
    } else if (confidence > 50) {
      color = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      label = "Medium Confidence";
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Sparkles className="h-3 w-3" />
        {confidence}% {label}
      </span>
    );
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-cyan-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Left Sidebar - Conversations */}
      <aside className="relative flex w-72 flex-col border-r border-white/20 dark:border-gray-700/20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-indigo-950 px-4 py-6 text-white h-screen overflow-y-auto backdrop-blur-xl shadow-2xl">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 mb-2">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-sm font-bold text-cyan-300">AI Assistant</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Conversations
          </h2>
        </div>
        
        <button
          onClick={startNewConversation}
          className="mb-6 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 px-4 py-3 font-bold text-white transition hover:from-blue-600 hover:via-cyan-600 hover:to-purple-600 hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/50 animate-shimmer bg-300%"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            New Conversation
          </span>
        </button>
        
        <div className="flex-1 space-y-2 overflow-y-auto pr-1 mb-4">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => selectConversation(conv.id)}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition-all duration-300 ${
                conv.id === activeConversationId
                  ? "border-cyan-400/50 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 font-semibold shadow-lg shadow-cyan-500/20 scale-105"
                  : "border-transparent bg-white/5 hover:bg-white/10 hover:scale-102"
              }`}
              title={conv.title}
            >
              <div className="truncate">{conv.title}</div>
            </button>
          ))}
        </div>
        
        {/* Profile Section with Dropdown */}
        <div className="relative mt-auto border-t border-white/10 pt-4" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-3 transition hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 shadow-lg animate-pulse">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">
                  {userInfo?.username || "User"}
                </p>
                <p className="text-xs text-cyan-300">● Online</p>
              </div>
            </div>
            {showProfileDropdown ? (
              <ChevronUp className="h-4 w-4 text-cyan-300" />
            ) : (
              <ChevronDown className="h-4 w-4 text-cyan-300" />
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-400/30 shadow-2xl animate-scale-in backdrop-blur-xl">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    handleDownloadApp();
                    setShowProfileDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20"
                >
                  <Download className="h-4 w-4" />
                  Download mobile App
                </button>
                <button
                  onClick={() => {
                    handleSettings();
                    setShowProfileDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-slate-700 dark:hover:bg-gray-800"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleContactUs();
                    setShowProfileDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-slate-700 dark:hover:bg-gray-800"
                >
                  <Mail className="h-4 w-4" />
                  Contact us
                </button>
                <div className="border-t border-slate-600 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowProfileDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-slate-700 dark:hover:bg-gray-800 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="relative flex-1 flex flex-col min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />

        {/* Header - Sticky at top with glass effect */}
        <header className="flex-shrink-0 sticky top-0 relative z-20 border-b border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 shadow-2xl">
                  <Bot className="h-7 w-7 text-white animate-pulse" />
                </div>
                <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-green-400 animate-pulse shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300%">
                  FIQUE'S-AI
                </h1>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                  Your Smart Health Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {messages.length > 0 && (
                <Button
                  onClick={handleExportChat}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-700 hover:scale-105 duration-300"
                >
                  <FileDown className="h-4 w-4" />
                  <span className="hidden sm:inline font-semibold">Export</span>
                </Button>
              )}
              <Button
                onClick={() => setShowEmergencyCards(!showEmergencyCards)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white shadow-lg transition hover:from-red-600 hover:to-red-700 hover:scale-105 duration-300 animate-pulse"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="font-semibold">Emergency</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Chat Messages - Scrollable area */}
        <section className="flex-1 min-h-0 relative z-10 overflow-y-auto p-6">
          {/* Welcome screen - ALWAYS at the top, visible when scrolling up */}
          <div className="mx-auto max-w-xl text-center animate-fade-in mb-8">
            <div className="relative mx-auto mb-8 inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 shadow-2xl">
                <MessageCircle className="h-12 w-12 text-white animate-bounce-slow" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-300%">
              Welcome to FIQUE'S-AI
            </h2>
            <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              I'm here to help you understand your symptoms and provide health guidance. How can I assist you today?
            </p>
            <div className="grid grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Card
                  key={action.text}
                  className="group cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 p-6 backdrop-blur-sm transition hover:scale-110 hover:shadow-2xl duration-300 animate-scale-in rounded-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleQuickAction(action.text)}
                >
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                    <div
                      className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${action.color} transition group-hover:scale-110 group-hover:rotate-6 shadow-xl duration-300`}
                    >
                      <action.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{action.text}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Divider - shows when there are messages */}
          {messages.length > 0 && (
            <div className="mb-8 mx-auto max-w-4xl">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Conversation
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
              </div>
            </div>
          )}

          {/* Messages - scroll below welcome screen */}
          {messages.length > 0 && (
            <div className="space-y-6 mx-auto max-w-4xl">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 animate-in slide-in-from-bottom duration-300 ${
                      message.role === "user" ? "flex-row-reverse text-right" : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-2xl animate-pulse ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-6 w-6 text-white" />
                      ) : (
                        <Bot className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block max-w-2xl rounded-2xl p-5 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-102 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
                            : "border-2 border-blue-200/50 dark:border-blue-700/50 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-base leading-relaxed font-medium">{message.content}</p>
                        
                        {/* Confidence Badge for Bot Messages */}
                        {message.role === "bot" && message.confidence && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {getConfidenceBadge(message.confidence)}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {message.timestamp
                            ? new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        
                        {message.role === "bot" && (
                          <div className={`flex items-center gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                            <button
                              onClick={() => handleCopyMessage(message.content)}
                              className="p-1.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all duration-300"
                              title="Copy message"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, "positive")}
                              className={`p-1 rounded transition ${
                                message.feedback === "positive"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, "negative")}
                              className={`p-1 rounded transition ${
                                message.feedback === "negative"
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isTyping && (
            <div className="mt-6 mx-auto max-w-4xl flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl border border-white/20 dark:border-gray-700/20 bg-white/80 dark:bg-gray-800/80 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-theme-muted" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-theme-muted [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-theme-muted [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </section>

        {/* Input Footer - Fixed at bottom */}
        <footer className="mt-auto flex-shrink-0 relative z-20 border-t border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg">
            <div className="px-4 pt-4 pb-1">
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <Input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Describe your signs and symptoms (e.g., fever, cough, headache)..."
                    className="w-full rounded-2xl border-0 bg-white dark:bg-gray-800 py-3 pl-4 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-white shadow-lg transition hover:from-blue-600 hover:to-cyan-600 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-4xl mx-auto mt-2">
                ⚠️ This is for informational purposes only. Always consult healthcare professionals for medical advice.
              </p>
            </div>
          </footer>
      </main>

      {/* Emergency Modal Overlay - Shows on top when button is clicked */}
      {showEmergencyCards && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto p-4">
          <div className="w-full max-w-4xl mt-20 mb-8 animate-in slide-in-from-top duration-300">
            <div className="rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-4 text-white shadow-2xl mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 animate-pulse">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Emergency Contacts</h2>
                    <p className="text-xs text-blue-100">Quick access to emergency services</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmergencyCards(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl space-y-4">
              {/* When to Call Section */}
              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  When to Call Emergency Services:
                </p>
                <ul className="space-y-1 text-xs ml-6">
                  <li>• Difficulty breathing or shortness of breath</li>
                  <li>• Chest pain or pressure</li>
                  <li>• Severe bleeding or trauma</li>
                  <li>• Loss of consciousness</li>
                  <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
                  <li>• Severe allergic reactions</li>
                </ul>
              </div>

              {/* Emergency Contact Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <Card
                    key={contact.name}
                    className={`cursor-pointer border-2 p-4 shadow-lg transition hover:scale-105 hover:shadow-2xl animate-in slide-in-from-bottom duration-300 ${
                      contact.urgent 
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10" 
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => {
                      if (contact.number.toLowerCase().startsWith("text")) {
                        window.open(`sms:${contact.number.replace(/\D/g, "")}`, "_blank");
                      } else {
                        window.open(`tel:${contact.number.replace(/\D/g, "")}`, "_blank");
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${contact.color} text-white shadow-lg`}
                      >
                        <contact.icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base text-gray-900 dark:text-white">{contact.name}</h3>
                          {contact.urgent && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white flex-shrink-0">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{contact.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">{contact.number}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                            <Phone className="h-4 w-4" />
                            Tap to call
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Find Nearby Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                <Button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      alert("Geolocation is not supported by your browser.");
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        window.open(
                          `https://www.google.com/maps/search/hospital/@${latitude},${longitude},14z`,
                          "_blank"
                        );
                      },
                      () => {
                        alert("Unable to access your location. Please enable location services and try again.");
                      }
                    );
                  }}
                >
                  <Clock className="h-5 w-5" />
                  Find Nearest Hospital
                </Button>
                <Button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-semibold text-white shadow-lg transition hover:from-green-600 hover:to-emerald-600"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      alert("Geolocation is not supported by your browser.");
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        window.open(
                          `https://www.google.com/maps/search/urgent+care/@${latitude},${longitude},14z`,
                          "_blank"
                        );
                      },
                      () => {
                        alert("Unable to access your location. Please enable location services and try again.");
                      }
                    );
                  }}
                >
                  <Activity className="h-5 w-5" />
                  Urgent Care Locator
                </Button>
              </div>

              <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3 text-xs text-orange-800 dark:text-orange-300 text-center">
                <strong>Note:</strong> These contacts are for Rwanda. International users should contact their local emergency services.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        userInfo={userInfo}
        onUserInfoUpdate={handleUserInfoUpdate}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={showQuickActionModal}
        onClose={() => setShowQuickActionModal(false)}
        actionType={quickActionType}
        onSubmit={handleQuickActionSubmit}
      />
    </div>
  );
}