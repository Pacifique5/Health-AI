"use client";

import { useState, useEffect } from "react";
import { X, User, Bell, Shield, Palette, Globe, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: { username: string; email: string } | null;
  onUserInfoUpdate: (newUserInfo: { username: string; email: string }) => void;
}

export default function SettingsModal({ isOpen, onClose, userInfo, onUserInfoUpdate }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: userInfo?.username || "",
    email: userInfo?.email || "",
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    healthReminders: true,
    dataCollection: false,
    conversationHistory: true,
    theme: "light",
    language: "en",
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username,
        email: userInfo.email,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      try {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    
    try {
      // Update localStorage
      localStorage.setItem("userInfo", JSON.stringify(formData));
      
      // Update parent component
      onUserInfoUpdate(formData);
      
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("idle");
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  const handleExportData = () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      
      const conversations = localStorage.getItem(`conversations_${userId}`);
      const userInfo = localStorage.getItem("userInfo");
      const appSettings = localStorage.getItem("appSettings");
      
      const exportData = {
        conversations: conversations ? JSON.parse(conversations) : [],
        userInfo: userInfo ? JSON.parse(userInfo) : null,
        settings: appSettings ? JSON.parse(appSettings) : {},
        exportDate: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `symptomai-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all conversation history? This action cannot be undone.")) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        localStorage.setItem(`conversations_${userId}`, JSON.stringify([]));
        alert("Conversation history cleared successfully!");
      }
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-xl hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Profile Settings</h3>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter your email"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={saveStatus === "saving"}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                      {saveStatus === "saving" && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                      {saveStatus === "saved" && <Check className="h-4 w-4" />}
                      {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Notification Settings</h3>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Health Reminders</h4>
                        <p className="text-sm text-gray-600">Get reminders for health checkups</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={settings.healthReminders}
                        onChange={(e) => handleSettingChange("healthReminders", e.target.checked)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Privacy Settings</h3>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Data Collection</h4>
                        <p className="text-sm text-gray-600">Allow anonymous usage analytics</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={settings.dataCollection}
                        onChange={(e) => handleSettingChange("dataCollection", e.target.checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Conversation History</h4>
                        <p className="text-sm text-gray-600">Save conversation history locally</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={settings.conversationHistory}
                        onChange={(e) => handleSettingChange("conversationHistory", e.target.checked)}
                      />
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="font-medium text-gray-800 mb-3">Data Management</h4>
                      <div className="space-y-2">
                        <Button
                          onClick={handleExportData}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          Export My Data
                        </Button>
                        <Button
                          onClick={handleClearData}
                          variant="outline"
                          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Clear Conversation History
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Appearance Settings</h3>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Theme</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="theme" 
                            value="light" 
                            checked={settings.theme === "light"}
                            onChange={(e) => handleSettingChange("theme", e.target.value)}
                          />
                          Light
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="theme" 
                            value="dark" 
                            checked={settings.theme === "dark"}
                            onChange={(e) => handleSettingChange("theme", e.target.value)}
                          />
                          Dark
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="theme" 
                            value="auto" 
                            checked={settings.theme === "auto"}
                            onChange={(e) => handleSettingChange("theme", e.target.value)}
                          />
                          Auto (System)
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "language" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Language Settings</h3>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interface Language
                      </label>
                      <select 
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={settings.language}
                        onChange={(e) => handleSettingChange("language", e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="rw">Kinyarwanda</option>
                        <option value="sw">Kiswahili</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}