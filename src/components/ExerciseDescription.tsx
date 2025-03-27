import { BookOpen, Code2, Timer } from 'lucide-react';
import React from 'react';
import { Exercise } from '../../types';

interface ExerciseDescriptionProps {
  exercise: Exercise;
}

export function ExerciseDescription({ exercise }: ExerciseDescriptionProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{exercise.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
            exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`}>
          {exercise.difficulty}
        </span>
      </div>
      
      <div className="flex gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <BookOpen size={16} />
          <span>Exercise</span>
        </div>
        <div className="flex items-center gap-1">
          <Code2 size={16} />
          <span>JavaScript</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer size={16} />
          <span>~15 mins</span>
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{exercise.description}</p>
      </div>
    </div>
  );
}