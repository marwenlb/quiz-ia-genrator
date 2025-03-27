import { Play } from 'lucide-react';
import React, { useState } from 'react';
import { CodeEditor } from '../CodeEditor';
import { ExerciseDescription } from '../ExerciseDescription';
import { TestResults } from '../TestResults';
import { Exercise, TestResult } from '../../../types';

function ExerciceComponent({ exercise }: { exercise: Exercise | null }) {
  if (!exercise) {
    return <p className="text-center text-gray-500">No exercise generated yet.</p>;
  }

  const [code, setCode] = useState(exercise.initialCode);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = () => {
    try {
      const fn = new Function('return ' + code)();
      const testResults: TestResult[] = [];

      testResults.push({
        passed: fn("racecar") === true,
        message: 'Test 1: "racecar" should return true'
      });

      testResults.push({
        passed: fn("hello") === false,
        message: 'Test 2: "hello" should return false'
      });

      setResults(testResults);
    } catch (error) {
      setResults([{ passed: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <ExerciseDescription exercise={exercise} />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Solution</h3>
              <button
                onClick={runTests}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Play size={16} />
                Run Tests
              </button>
            </div>
            <CodeEditor code={code} onChange={setCode} />
          </div>
          {results.length > 0 && <TestResults results={results} />}
        </div>
      </div>
    </div>
  );
}

export default ExerciceComponent;
