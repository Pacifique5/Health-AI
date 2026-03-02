"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Heart,
  Shield,
  Clock,
  Bot,
  CheckCircle,
  Users,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Zap,
  Star,
  TrendingUp,
  Brain,
  Stethoscope,
  Pill,
  HeartPulse,
  MessageCircle,
  Search,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = "Your AI Health Companion";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isTyping && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (typedText.length === fullText.length) {
      setIsTyping(false);
    }
  }, [typedText, isTyping]);

  const features = [
    {
      icon: Brain,
      title: "AI Symptom Analysis",
      description: "Advanced machine learning algorithms analyze your symptoms across 41+ diseases with weighted severity scoring for accurate predictions.",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Stethoscope,
      title: "Comprehensive Treatment Plans",
      description: "Get detailed medication recommendations, medical procedures, and specialist referrals tailored to your condition.",
      color: "from-emerald-500 to-teal-500",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: HeartPulse,
      title: "Real-time Health Monitoring",
      description: "Track your symptoms over time with confidence scoring and personalized health insights powered by medical data.",
      color: "from-rose-500 to-pink-500",
      gradient: "from-rose-500/20 to-pink-500/20",
    },
    {
      icon: Shield,
      title: "Privacy & Security First",
      description: "Your health data is encrypted and secure. We never share your information with third parties. HIPAA compliant.",
      color: "from-violet-500 to-purple-500",
      gradient: "from-violet-500/20 to-purple-500/20",
    },
  ];

  const stats = [
    { number: "41+", label: "Diseases Covered", icon: Activity },
    { number: "131", label: "Symptoms Tracked", icon: Zap },
    { number: "24/7", label: "Available Support", icon: Clock },
    { number: "100%", label: "Privacy Protected", icon: Shield },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Healthcare Professional",
      content: "SymptomAI has revolutionized preliminary health assessments. The accuracy and comprehensive treatment recommendations are impressive.",
      rating: 5,
      avatar: "SJ",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Michael Chen",
      role: "Regular User",
      content: "The AI helped me understand my symptoms better and guided me to seek the right medical care. The confidence scoring gives me peace of mind.",
      rating: 5,
      avatar: "MC",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Medical Consultant",
      content: "An excellent tool for health awareness. The integration of symptom severity weights and treatment data is particularly well done.",
      rating: 5,
      avatar: "ER",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const team = [
    {
      name: "Mugisha Pacifique",
      role: "Lead Developer",
      avatar: "MP",
      color: "from-blue-400 to-blue-500",
      bio: "Full-stack engineer & AI specialist",
    },
    {
      name: "Ruyange Arnold",
      role: "Backend Engineer",
      avatar: "RY",
      color: "from-emerald-400 to-emerald-500",
      bio: "Systems architect & data expert",
    },
    {
      name: "Nyumbayire Laurent",
      role: "Frontend Developer",
      avatar: "LT",
      color: "from-purple-400 to-purple-500",
      bio: "UI/UX designer & React specialist",
    },
    {
      name: "Mbabazi Christopher",
      role: "Product Manager",
      avatar: "FG",
      color: "from-rose-400 to-rose-500",
      bio: "Healthcare tech innovator",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Describe Your Symptoms",
      description: "Tell us what you're experiencing in your own words. Our AI understands natural language.",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our advanced AI analyzes your symptoms against 41+ diseases with medical-grade accuracy.",
      icon: Search,
      color: "from-emerald-500 to-teal-500",
    },
    {
      step: "3",
      title: "Get Personalized Insights",
      description: "Receive detailed health insights, treatment recommendations, and guidance on next steps.",
      icon: FileText,
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-400/10 via-pink-400/5 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-20 animate-float opacity-20" style={{ animationDelay: "0s" }}>
          <Stethoscope className="h-12 w-12 text-blue-400" />
        </div>
        <div className="absolute top-40 right-32 animate-float opacity-20" style={{ animationDelay: "1s" }}>
          <Heart className="h-16 w-16 text-rose-400" />
        </div>
        <div className="absolute bottom-32 left-40 animate-float opacity-20" style={{ animationDelay: "2s" }}>
          <Pill className="h-10 w-10 text-purple-400" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float opacity-20" style={{ animationDelay: "1.5s" }}>
          <Brain className="h-14 w-14 text-cyan-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SymptomAI
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Testimonials
              </a>
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600 transition"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600 transition"
                >
                  Log In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-in slide-in-from-top duration-200">
              <a href="#features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Features
              </a>
              <a href="#how-it-works" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                How It Works
              </a>
              <a href="#testimonials" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Testimonials
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {isAuthenticated ? (
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 text-white shadow-lg"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 text-white shadow-lg"
                  >
                    Log In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI-Powered Health Analysis • 41+ Diseases • Medical-Grade Accuracy
              </span>
              <Zap className="h-4 w-4 text-purple-500" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in leading-tight">
              <span className="bg-gradient-to-r from-slate-700 via-blue-600 to-purple-600 dark:from-slate-200 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className="animate-pulse text-blue-600 dark:text-blue-400">|</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, AI-powered health insights. Analyze symptoms across <span className="text-blue-600 dark:text-blue-400 font-semibold">41+ diseases</span> with <span className="text-purple-600 dark:text-purple-400 font-semibold">medical-grade accuracy</span>. Your health, simplified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in mb-10">
              <Button
                onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signup")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start Free Analysis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              <Button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="rounded-xl px-8 py-6 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>100% Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-6 bg-gradient-to-r from-blue-500/90 to-purple-500/90 dark:from-blue-600/80 dark:to-purple-600/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg group-hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-white/90 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-blue-600 dark:from-slate-300 dark:to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need for comprehensive health analysis and monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 hover:scale-105 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-6 bg-white/40 dark:bg-gray-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get health insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={step.step}
                className="relative animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 h-full hover:scale-105 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 dark:text-gray-700">
                    {step.step}
                  </div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-lg relative z-10`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="h-8 w-8 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
              <Star className="h-4 w-4 fill-current" />
              Loved by Thousands
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300%">
              What People Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trusted by healthcare professionals and users worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="group relative overflow-hidden border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 hover:scale-105 transition-all duration-500 cursor-pointer animate-scale-in shadow-xl hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Animated Carousel */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Meet Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-700 via-blue-600 to-purple-600 dark:from-slate-300 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              The Minds Behind FIQUE'S-AI
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A passionate team dedicated to making healthcare accessible through AI
            </p>
          </div>

          {/* Animated scrolling container */}
          <div className="relative">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling track */}
            <div className="flex gap-6 animate-scroll-slow hover:pause-animation">
              {/* Duplicate team members for seamless loop */}
              {[...team, ...team].map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="flex-shrink-0 w-72 group"
                >
                  <Card className="relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 hover:scale-105 hover:shadow-xl transition-all duration-500 cursor-pointer h-full">
                    {/* Subtle gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      {/* Avatar */}
                      <div className="mb-6 flex justify-center">
                        <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-all duration-500`}>
                          {member.avatar}
                          {/* Subtle pulse ring */}
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color} animate-ping opacity-10`} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">
                          {member.role}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 p-12 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-xl mb-8 text-blue-50">
                Join thousands of users who trust SymptomAI for their health insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signup")}
                  className="group rounded-xl bg-white text-blue-600 px-8 py-6 text-lg font-semibold shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 transition"
                >
                  Sign In
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>100% Private & Secure</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-white/40 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  SymptomAI
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your trusted AI health companion for symptom analysis and health insights.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:support@symptomai.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    support@symptomai.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+250788123456" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    +250 788 123 456
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Kigali, Rwanda</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 SymptomAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Users className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <TrendingUp className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Heart className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
