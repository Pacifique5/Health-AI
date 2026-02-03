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
  const [showEmergency, setShowEmergency] = useState(false);
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
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await analyzeSymptoms(trimmedContent);
      const botMsg: ChatMessage = {
        id: `${Date.now()}-bot`,
        role: "bot",
        content: res.message,
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

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <aside className="relative flex w-64 flex-col border-r border-theme bg-slate-950 dark:bg-black px-4 py-6 text-white">
        <h2 className="mb-4 text-center text-lg font-semibold">All Conversations</h2>
        <button
          onClick={startNewConversation}
          className="mb-4 rounded-xl bg-emerald-300 px-4 py-2 font-semibold text-slate-900 transition hover:bg-emerald-200"
        >
          + New Conversation
        </button>
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => selectConversation(conv.id)}
              className={`w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm transition ${
                conv.id === activeConversationId
                  ? "border-emerald-300 bg-slate-800 dark:bg-gray-900 font-semibold"
                  : "bg-transparent hover:bg-slate-900/60 dark:hover:bg-gray-800/60"
              }`}
              title={conv.title}
            >
              {conv.title}
            </button>
          ))}
        </div>
        
        {/* Profile Section with Dropdown */}
        <div className="relative mt-4 border-t border-slate-700 dark:border-gray-600 pt-4" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex w-full items-center justify-between rounded-lg bg-slate-800 dark:bg-gray-900 p-3 transition hover:bg-slate-700 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  {userInfo?.username || "User"}
                </p>
                <p className="text-xs text-slate-400">Online</p>
              </div>
            </div>
            {showProfileDropdown ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-slate-800 dark:bg-gray-900 border border-slate-600 dark:border-gray-700 shadow-xl animate-in slide-in-from-bottom-2 duration-200">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    handleDownloadApp();
                    setShowProfileDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-slate-700 dark:hover:bg-gray-800"
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

      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col">
          <header className="border-b border-white/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-green-400 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    SymptomAI
                  </h1>
                  <p className="text-sm text-theme-secondary">Your Smart Health Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button
                  onClick={() => setShowEmergency(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white shadow-lg transition hover:from-red-600 hover:to-red-700"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Emergency
                </Button>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                  <span className="text-sm font-medium text-theme-secondary">FIQUE&apos;S-AI</span>
                </div>
              </div>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-theme-primary">Welcome to SymptomAI</h2>
                <p className="mb-8 text-theme-secondary">
                  I&apos;m here to help you understand your symptoms and provide health guidance. How can I assist you today?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Card
                      key={action.text}
                      className="group cursor-pointer border-0 bg-white/60 dark:bg-gray-800/60 p-4 backdrop-blur-sm transition hover:scale-105 hover:bg-white/80 dark:hover:bg-gray-800/80"
                      onClick={() => handleQuickAction(action.text)}
                    >
                      <div
                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r ${action.color} transition group-hover:scale-110`}
                      >
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-medium text-theme-secondary">{action.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse text-right" : ""}`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                          : "bg-gradient-to-br from-blue-500 to-cyan-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block max-w-lg rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                            : "border border-white/20 dark:border-gray-700/20 bg-white/80 dark:bg-gray-800/80 text-theme-primary"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <p className="mt-2 text-xs text-theme-muted">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="mt-6 flex items-start gap-3">
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

          <footer className="border-t border-white/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Describe your signs and symptoms ..."
                  className="w-full rounded-2xl border-white/20 dark:border-gray-700/20 bg-white/80 dark:bg-gray-800/80 py-3 pl-4 pr-12 text-theme-primary placeholder:text-theme-muted focus:border-transparent focus:ring-2 focus:ring-blue-500/40"
                  disabled={isLoading}
                />
                <Heart className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-400" />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-white shadow-lg transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="mt-3 text-center text-xs text-theme-muted">
              ⚠️ This is for informational purposes only. Always consult healthcare professionals for medical advice.
            </p>
          </footer>
        </div>
      </main>

      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-theme-card shadow-2xl">
            <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Emergency Contacts</h2>
                  <p className="text-sm text-red-100">Quick access to emergency services</p>
                </div>
              </div>
              <Button
                onClick={() => setShowEmergency(false)}
                variant="ghost"
                size="sm"
                className="rounded-xl text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="m-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 text-blue-700 dark:text-blue-300">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">When to Call Emergency Services</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Difficulty breathing or shortness of breath</li>
                <li>• Chest pain or pressure</li>
                <li>• Severe bleeding or trauma</li>
                <li>• Loss of consciousness</li>
                <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
                <li>• Severe allergic reactions</li>
              </ul>
            </div>

            <div className="space-y-4 p-6">
              {emergencyContacts.map((contact) => (
                <Card
                  key={contact.name}
                  className={`cursor-pointer border-0 p-4 shadow-lg transition hover:scale-[1.02] hover:shadow-xl ${
                    contact.urgent ? "ring-2 ring-red-200" : ""
                  }`}
                  onClick={() => {
                    if (contact.number.toLowerCase().startsWith("text")) {
                      window.open(`sms:${contact.number.replace(/\D/g, "")}`, "_blank");
                    } else {
                      window.open(`tel:${contact.number.replace(/\D/g, "")}`, "_blank");
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${contact.color} text-white shadow-lg`}
                      >
                        <contact.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-theme-primary">{contact.name}</h3>
                          {contact.urgent && (
                            <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-theme-secondary">{contact.description}</p>
                        <p className="mt-1 font-mono text-lg font-bold text-theme-primary">{contact.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-theme-muted">00">
                      <Phone className="h-5 w-5" />
                      Tap to call
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-3 rounded-b-3xl bg-theme-secondary p-6">
              <h3 className="flex items-center gap-2 font-semibold text-theme-primary">
                <MapPin className="h-5 w-5" />
                Additional Resources
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
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
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-xs text-blue-700 dark:text-blue-300">
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