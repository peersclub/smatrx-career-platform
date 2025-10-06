'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@smatrx/ui';
import { Card } from '@smatrx/ui';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { ErrorAlert } from '@/components/error-alert';

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  profile?: {
    bio?: string;
    title?: string;
    company?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    yearsExperience?: number;
    careerStage?: string;
    industries: string[];
    languages: string[];
    availability?: string;
    remotePreference?: string;
    salaryExpectation?: {
      min: number;
      max: number;
      currency: string;
    };
  };
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: profile?.bio || '',
    title: profile?.title || '',
    company: profile?.company || '',
    location: profile?.location || '',
    linkedinUrl: profile?.linkedinUrl || '',
    githubUrl: profile?.githubUrl || '',
    websiteUrl: profile?.websiteUrl || '',
    yearsExperience: profile?.yearsExperience || 0,
    careerStage: profile?.careerStage || 'mid',
    industries: profile?.industries.join(', ') || '',
    languages: profile?.languages.join(', ') || '',
    availability: profile?.availability || 'full-time',
    remotePreference: profile?.remotePreference || 'hybrid',
    salaryMin: profile?.salaryExpectation?.min || 0,
    salaryMax: profile?.salaryExpectation?.max || 0,
    currency: profile?.salaryExpectation?.currency || 'USD',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          profile: {
            bio: formData.bio,
            title: formData.title,
            company: formData.company,
            location: formData.location,
            linkedinUrl: formData.linkedinUrl,
            githubUrl: formData.githubUrl,
            websiteUrl: formData.websiteUrl,
            yearsExperience: Number(formData.yearsExperience),
            careerStage: formData.careerStage,
            industries: formData.industries.split(',').map(i => i.trim()).filter(Boolean),
            languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
            availability: formData.availability,
            remotePreference: formData.remotePreference,
            salaryExpectation: {
              min: Number(formData.salaryMin),
              max: Number(formData.salaryMax),
              currency: formData.currency,
            },
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
      )}
      
      {success && (
        <div className="p-4 rounded-lg border bg-green-900/20 border-green-800 text-green-400 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm">Profile updated successfully!</p>
        </div>
      )}

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 opacity-50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </Card>

      {/* Professional Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={e => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              min="0"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Career Stage</label>
            <select
              value={formData.careerStage}
              onChange={e => setFormData({ ...formData, careerStage: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
        </div>
      </Card>

      {/* Skills & Interests */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Skills & Interests</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Industries (comma-separated)</label>
            <input
              type="text"
              value={formData.industries}
              onChange={e => setFormData({ ...formData, industries: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="e.g. Technology, Finance, Healthcare"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Languages (comma-separated)</label>
            <input
              type="text"
              value={formData.languages}
              onChange={e => setFormData({ ...formData, languages: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="e.g. English, Spanish, Mandarin"
            />
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Social Links</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Personal Website</label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Work Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Availability</label>
            <select
              value={formData.availability}
              onChange={e => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Remote Preference</label>
            <select
              value={formData.remotePreference}
              onChange={e => setFormData({ ...formData, remotePreference: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite Only</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Salary Expectations</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={e => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                placeholder="Min"
                min="0"
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={e => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                placeholder="Max"
                min="0"
              />
            </div>
            <div>
              <select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
