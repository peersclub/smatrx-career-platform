'use client';

import { Badge } from '@smatrx/ui';
import { CheckCircle, Clock, Shield, Star } from 'lucide-react';

interface ExpertVerificationBadgeProps {
  verified: boolean;
  verifierName?: string;
  verifierTitle?: string;
  verifiedAt?: Date;
  confidence?: number;
}

export default function ExpertVerificationBadge({
  verified,
  verifierName,
  verifierTitle,
  verifiedAt,
  confidence = 95
}: ExpertVerificationBadgeProps) {
  if (!verified) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-4 h-4" />
        <span className="text-sm">Pending verification</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-800">
      <Shield className="w-8 h-8 text-green-500" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-medium text-green-400">Verified by Industry Expert</span>
          <Badge variant="outline" className="text-xs border-green-600 text-green-400">
            {confidence}% confidence
          </Badge>
        </div>
        {verifierName && (
          <p className="text-sm text-gray-400">
            {verifierName}
            {verifierTitle && <span className="text-gray-500"> • {verifierTitle}</span>}
          </p>
        )}
        {verifiedAt && (
          <p className="text-xs text-gray-500 mt-1">
            Verified on {new Date(verifiedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(confidence / 20)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 mt-1">Trust Score</span>
      </div>
    </div>
  );
}
