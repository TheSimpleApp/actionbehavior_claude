'use client';

import { useState } from 'react';
import { RegistrationForm } from '@/components/registration/RegistrationForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ABC Summit 2025 Registration
            </h1>
            <p className="text-gray-600 mt-2">
              Complete your registration for the conference
            </p>
          </div>

          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
