'use client';

import { useState } from 'react';
import { Card, Button } from '@smatrx/ui';
import { ArrowRight, ArrowLeft, Briefcase, Home, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreferencesStepProps {
  user: {
    id: string;
  };
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function PreferencesStep({ user, onComplete, onSkip, onBack }: PreferencesStepProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    availability: '',
    remotePreference: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    willingToRelocate: false,
    preferredLocations: [] as string[],
  });

  const availabilityOptions = [
    { value: 'full-time', label: 'Full-time', icon: '💼' },
    { value: 'part-time', label: 'Part-time', icon: '⏰' },
    { value: 'contract', label: 'Contract', icon: '📄' },
    { value: 'freelance', label: 'Freelance', icon: '🚀' },
  ];

  const remoteOptions = [
    { value: 'remote', label: 'Remote Only', icon: '🌍' },
    { value: 'hybrid', label: 'Hybrid', icon: '🏢' },
    { value: 'onsite', label: 'Onsite Only', icon: '🏛️' },
  ];

  const locationOptions = [
    'San Francisco', 'New York', 'London', 'Berlin', 'Toronto',
    'Singapore', 'Sydney', 'Tokyo', 'Remote', 'Other',
  ];

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            availability: formData.availability,
            remotePreference: formData.remotePreference,
            salaryExpectation: formData.salaryMin && formData.salaryMax ? {
              min: Number(formData.salaryMin),
              max: Number(formData.salaryMax),
              currency: formData.currency,
            } : undefined,
            willingToRelocate: formData.willingToRelocate,
            preferredLocations: formData.preferredLocations,
          },
        }),
      });

      if (response.ok) {
        showToast('success', 'Preferences saved!');
        onComplete();
      }
    } catch (error) {
      showToast('error', 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const isValid = formData.availability && formData.remotePreference;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Work Preferences</h2>
        <p className="text-gray-400">
          Let us know your ideal work setup to find the perfect opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Availability</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {availabilityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, availability: option.value })}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  formData.availability === option.value
                    ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                    : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-lg mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Remote Preference */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold">Work Location</h3>
          </div>
          <div className="space-y-3">
            {remoteOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, remotePreference: option.value })}
                className={`w-full p-3 rounded-lg border text-sm transition-all text-left ${
                  formData.remotePreference === option.value
                    ? 'bg-pink-900/30 border-pink-500 text-pink-300'
                    : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-lg mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Salary Expectations */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Salary Expectations (Optional)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Salary</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                placeholder="80,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Salary</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                placeholder="120,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Preferred Locations */}
        {formData.remotePreference !== 'remote' && (
          <Card className="p-6 md:col-span-2">
            <h3 className="font-semibold mb-4">Preferred Locations</h3>
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.willingToRelocate}
                  onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                  className="rounded border-gray-700 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm">I'm willing to relocate</span>
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {locationOptions.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => toggleLocation(location)}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    formData.preferredLocations.includes(location)
                      ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300'
                      : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-gray-400"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="gap-2"
          >
            Complete Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
