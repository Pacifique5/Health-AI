"use client";

import { X, Activity, Heart, Shield, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: "symptoms" | "heart" | "preventive" | "medication";
  onSubmit: (data: any) => void;
}

export default function QuickActionModal({ isOpen, onClose, actionType, onSubmit }: QuickActionModalProps) {
  const [formData, setFormData] = useState<any>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    onClose();
  };

  const renderContent = () => {
    switch (actionType) {
      case "symptoms":
        return (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Check Symptoms</h2>
                <p className="text-sm text-gray-600">Tell us what you're experiencing</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What symptoms are you experiencing? *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., headache, fever, cough, fatigue..."
                  value={formData.symptoms || ""}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long have you had these symptoms?
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  <option value="">Select duration</option>
                  <option value="less-than-day">Less than a day</option>
                  <option value="1-3-days">1-3 days</option>
                  <option value="4-7-days">4-7 days</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="more-than-2-weeks">More than 2 weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity level
                </label>
                <div className="flex gap-2">
                  {["Mild", "Moderate", "Severe"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: level })}
                      className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                        formData.severity === level
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    This information will help our AI provide more accurate health insights. For emergencies, please call 116 immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Analyze Symptoms
                </Button>
              </div>
            </form>
          </>
        );

      case "heart":
        return (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Heart Health Check</h2>
                <p className="text-sm text-gray-600">Monitor your cardiovascular wellness</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have any heart-related concerns? *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="e.g., chest pain, irregular heartbeat, shortness of breath..."
                  value={formData.concerns || ""}
                  onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    placeholder="Your age"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure (if known)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    placeholder="e.g., 120/80"
                    value={formData.bloodPressure || ""}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk factors (select all that apply)
                </label>
                <div className="space-y-2">
                  {["Smoking", "High cholesterol", "Diabetes", "Family history", "Sedentary lifestyle"].map((factor) => (
                    <label key={factor} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={formData.riskFactors?.includes(factor) || false}
                        onChange={(e) => {
                          const current = formData.riskFactors || [];
                          setFormData({
                            ...formData,
                            riskFactors: e.target.checked
                              ? [...current, factor]
                              : current.filter((f: string) => f !== factor),
                          });
                        }}
                      />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">
                    <strong>Emergency Warning:</strong> If you're experiencing severe chest pain, call 116 immediately. Don't wait for an assessment.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  Get Heart Health Insights
                </Button>
              </div>
            </form>
          </>
        );

      case "preventive":
        return (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Preventive Care</h2>
                <p className="text-sm text-gray-600">Stay healthy with proactive measures</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What area of preventive care interests you? *
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  value={formData.careType || ""}
                  onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                >
                  <option value="">Select care type</option>
                  <option value="vaccinations">Vaccinations & Immunizations</option>
                  <option value="screenings">Health Screenings</option>
                  <option value="nutrition">Nutrition & Diet</option>
                  <option value="exercise">Exercise & Fitness</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="sleep">Sleep Hygiene</option>
                  <option value="stress">Stress Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age group
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  value={formData.ageGroup || ""}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                >
                  <option value="">Select age group</option>
                  <option value="child">Child (0-12)</option>
                  <option value="teen">Teen (13-19)</option>
                  <option value="adult">Adult (20-64)</option>
                  <option value="senior">Senior (65+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any specific health goals?
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  placeholder="e.g., lose weight, improve sleep, reduce stress..."
                  value={formData.goals || ""}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Prevention is key!</p>
                    <p>Regular check-ups and healthy habits can prevent many diseases. We'll provide personalized recommendations.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Get Recommendations
                </Button>
              </div>
            </form>
          </>
        );

      case "medication":
        return (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Medication Reminder</h2>
                <p className="text-sm text-gray-600">Never miss your medication</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication name *
                </label>
                <input
                  required
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="e.g., Aspirin, Metformin..."
                  value={formData.medicationName || ""}
                  onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="e.g., 500mg"
                    value={formData.dosage || ""}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    value={formData.frequency || ""}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="once-daily">Once daily</option>
                    <option value="twice-daily">Twice daily</option>
                    <option value="three-times-daily">Three times daily</option>
                    <option value="as-needed">As needed</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred reminder times
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                    <label key={time} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={formData.reminderTimes?.includes(time) || false}
                        onChange={(e) => {
                          const current = formData.reminderTimes || [];
                          setFormData({
                            ...formData,
                            reminderTimes: e.target.checked
                              ? [...current, time]
                              : current.filter((t: string) => t !== time),
                          });
                        }}
                      />
                      <span className="text-sm text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special instructions
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="e.g., Take with food, avoid alcohol..."
                  value={formData.instructions || ""}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                  <p className="text-sm text-purple-800">
                    We'll help you track your medication schedule. For now, this information will be saved locally on your device.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                >
                  Set Reminder
                </Button>
              </div>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex-1" />
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-xl hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}