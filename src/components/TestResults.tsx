import { CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';
import { TestResult } from '../../types';

interface TestResultsProps {
  results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Test Results</h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg ${
              result.passed ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="text-green-500 mr-2" size={20} />
            ) : (
              <XCircle className="text-red-500 mr-2" size={20} />
            )}
            <span
              className={`${
                result.passed ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {result.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}