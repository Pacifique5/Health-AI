"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  User,
  Heart,
  Activity,
  Shield,
  Sparkles,
  MessageCircle,
  Clock,
  X,
  Phone,
  AlertTriangle,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { analyzeSymptoms } from "@/lib/api"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string
  role: "user" | "bot"
  content: string
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export default function SymptomAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setIsTyping(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      const storedUserId = localStorage.getItem('userId')
      if (!token || !storedUserId) {
        router.replace('/login')
      } else {
        setIsAuth(true)
        setUserId(storedUserId)
      }
    }
  }, [router])

  // Load conversations from localStorage on mount
  useEffect(() => {
    if (isAuth && userId) {
      const saved = localStorage.getItem(`conversations_${userId.toLowerCase()}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConversations(parsed);
          if (parsed.length > 0) {
            setActiveConversationId(parsed[0].id);
            setMessages(parsed[0].messages);
          }
        } catch (error) {
          console.error('Error loading conversations:', error);
          // Initialize with empty array if there's an error
          setConversations([]);
          localStorage.setItem(`conversations_${userId.toLowerCase()}`, JSON.stringify([]));
        }
      } else {
        // Initialize with empty array if no conversations exist
        setConversations([]);
        localStorage.setItem(`conversations_${userId.toLowerCase()}`, JSON.stringify([]));
      }
    }
  }, [isAuth, userId]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isAuth && userId && conversations) {
      try {
        localStorage.setItem(`conversations_${userId.toLowerCase()}`, JSON.stringify(conversations));
      } catch (error) {
        console.error('Error saving conversations:', error);
      }
    }
  }, [conversations, isAuth, userId]);

  // Save messages to the active conversation
  useEffect(() => {
    if (isAuth && activeConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId ? { ...conv, messages } : conv
        )
      );
    }
  }, [messages]);

  // Start a new conversation
  const startNewConversation = () => {
    const newId = uuidv4();
    const newConv = {
      id: newId,
      title: 'New Conversation',
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  // Set title after first user message
  useEffect(() => {
    if (activeConversationId && messages.length === 1 && messages[0].role === 'user') {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId ? { ...conv, title: messages[0].content.slice(0, 30) } : conv
        )
      );
    }
  }, [messages, activeConversationId]);

  // Select a conversation
  const selectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      setMessages(conv.messages);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: Date.now() + "-user",
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)
    try {
      const res = await analyzeSymptoms(userMsg.content)
      const botMsg: ChatMessage = {
        id: Date.now() + "-bot",
        role: "bot",
        content: res.message,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + "-bot", role: "bot", content: "I'm sorry, I couldn't find a match for your symptoms right now. Please try rephrasing or listing your symptoms differently, and I'll do my best to help!" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { icon: Activity, text: "Check symptoms", color: "from-blue-500 to-cyan-500" },
    { icon: Heart, text: "Heart health", color: "from-red-500 to-pink-500" },
    { icon: Shield, text: "Preventive care", color: "from-green-500 to-emerald-500" },
    { icon: Clock, text: "Medication reminder", color: "from-purple-500 to-violet-500" },
  ]

  const emergencyContacts = [
    {
      name: "Isange One Stop Center",
      number: "3029",
      description: "Victims of gender-based violence, including medical and legal.",
      icon:MessageCircle ,
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
      icon: User, // Changed from Heart to Shield
      color: "from-blue-500 to-cyan-500",
      urgent: true,
    },
   
  ]

  // Logout handler
  const handleLogout = () => {
    if (typeof window !== 'undefined' && userId) {
      // Save current conversations before logging out
      try {
        localStorage.setItem(`conversations_${userId.toLowerCase()}`, JSON.stringify(conversations));
      } catch (error) {
        console.error('Error saving conversations during logout:', error);
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  };

  if (!isAuth) return null;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: '#181c2b', color: '#fff', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid #23263a' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>All Conversations</h2>
        <button
          style={{ marginBottom: '1rem', background: '#7fffd4', color: '#181c2b', border: 'none', borderRadius: '12px', padding: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
          onClick={startNewConversation}
        >
          + New Conversation
        </button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              style={{
                padding: '0.7rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '10px',
                background: conv.id === activeConversationId ? '#23263a' : 'transparent',
                cursor: 'pointer',
                fontWeight: conv.id === activeConversationId ? 700 : 500,
                border: conv.id === activeConversationId ? '2px solid #7fffd4' : '2px solid transparent',
                transition: 'background 0.2s, border 0.2s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={conv.title}
            >
              {conv.title}
            </div>
          ))}
        </div>
        <button
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, padding: '0.5rem 1.2rem', background: '#181c2b', color: '#7fffd4', border: 'none', borderRadius: '18px', fontWeight: 600, cursor: 'pointer' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {/* Main Chat UI */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto">
            {/* Header */}
            <header className="p-6 border-b border-white/20 backdrop-blur-sm bg-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      SymptomAI
                    </h1>
                    <p className="text-sm text-slate-600">Your Smart Health Assistant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setShowEmergency(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 animate-pulse"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">FIQUE&apos;S-AI</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to SymptomAI</h2>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    I&apos;m here to help you understand your symptoms and provide health guidance. How can I assist you today?
                  </p>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {quickActions.map((action, index) => (
                      <Card
                        key={index}
                        className="p-4 cursor-pointer hover:scale-105 transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 group"
                        onClick={() => {
                          setInput(action.text);
                          handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                        }}
                      >
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                        >
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">{action.text}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                          : "bg-gradient-to-br from-blue-500 to-cyan-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${message.role === "user" ? "text-right" : ""}`}
                    >
                      <div
                        className={`inline-block p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                            : "bg-white/80 text-slate-800 border border-white/20"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className={`text-xs text-slate-500 mt-2 ${message.role === "user" ? "text-right" : ""}`}>
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-6 border-t border-white/20 backdrop-blur-sm bg-white/10">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Describe your signs and symptoms ..."
                    className="w-full pl-4 pr-12 py-3 bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-slate-800 placeholder-slate-500"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-3 text-center">
                ⚠️ This is for informational purposes only. Always consult healthcare professionals for medical advice.
              </p>
            </div>
            {/* Emergency Modal */}
            {showEmergency && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Emergency Contacts</h2>
                          <p className="text-red-100 text-sm">Quick access to emergency services</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowEmergency(false)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Emergency Warning */}
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 m-6 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-800">When to Call Emergency Services</h3>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                          <li>• Difficulty breathing or shortness of breath</li>
                          <li>• Chest pain or pressure</li>
                          <li>• Severe bleeding or trauma</li>
                          <li>• Loss of consciousness</li>
                          <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
                          <li>• Severe allergic reactions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contacts List */}
                  <div className="p-6 space-y-4">
                    {emergencyContacts.map((contact, index) => (
                      <Card
                        key={index}
                        className={`p-4 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                          contact.urgent ? "ring-2 ring-red-200" : ""
                        }`}
                        onClick={() => {
                          if (contact.number.startsWith("Text")) {
                            // Handle text message
                            window.open(`sms:741741?body=HOME`, "_blank")
                          } else {
                            // Handle phone call
                            window.open(`tel:${contact.number.replace(/[^\d]/g, "")}`, "_blank")
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center shadow-lg`}
                            >
                              <contact.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                                {contact.name}
                                {contact.urgent && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                                    URGENT
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">{contact.description}</p>
                              <p className="text-lg font-mono font-bold text-gray-800 mt-1">{contact.number}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">Tap to call</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Additional Resources */}
                  <div className="p-6 bg-gray-50 rounded-b-3xl">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Additional Resources</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 mt-2 mb-2"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                // Open Google Maps with a marker at the user's location and search for hospitals
                                window.open(
                                  `https://www.google.com/maps/search/hospital/@${latitude},${longitude},14z/data=!3m1!4b1!4m5!2m4!5m2!1s${latitude},${longitude}!2e0`,
                                  "_blank"
                                );
                              },
                              () => {
                                alert("Unable to access your location. Please enable location services and try again.");
                              }
                            );
                          } else {
                            alert("Geolocation is not supported by your browser.");
                          }
                        }}
                      >
                        <Clock className="w-5 h-5 mr-2" />
                        Find Nearest Hospital
                      </Button>
                      <Button
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 mt-2 mb-2"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                // Open Google Maps with a marker at the user's location and search for urgent care
                                window.open(
                                  `https://www.google.com/maps/search/urgent+care/@${latitude},${longitude},14z/data=!3m1!4b1!4m5!2m4!5m2!1s${latitude},${longitude}!2e0`,
                                  "_blank"
                                );
                              },
                              () => {
                                alert("Unable to access your location. Please enable location services and try again.");
                              }
                            );
                          } else {
                            alert("Geolocation is not supported by your browser.");
                          }
                        }}
                      >
                        <Activity className="w-5 h-5 mr-2" />
                        Urgent Care Locator
                      </Button>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> These contacts are for Rwanda. International users should contact
                        their local emergency services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
