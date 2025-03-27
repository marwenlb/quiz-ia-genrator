import { useState } from "react";
import TabComponent from "../shared/TabComponent";
import FileNote from "./FileNote";
import TextNote from "./TextNote";
import FormField from "./FormField";
import { toast } from "sonner";

// Define the exercise interface based on the JSON structure
interface Exercise {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  solution: string;
  tests: string;
  difficulty: string;
}

export default function Form({
  onSubmit,
  timer,
  onSetTimer,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  timer: number;
  onSetTimer: (index: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);

  const handleExerciseGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Collect form data
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/generate-exercise', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to generate exercise');
      }

      const data = await response.json();

      if (data.exercise) {
        setGeneratedExercise(data.exercise);
        toast.success('Exercise Generated Successfully!');
      } else {
        toast.error('No exercise was generated');
      }
    } catch (error) {
      console.error('Exercise generation error:', error);
      toast.error('Failed to generate exercise');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormField>
      <form 
        onSubmit={step === 2 ? handleExerciseGeneration : onSubmit}
      >
        <header className="text-center mb-10">
          <h2 className="text-lg font-semibold mb-1">
            {step === 2 ? "Generate Exercise" : "Add Notes"}
          </h2>
          <p className="text-xs text-zinc-400">
            {step === 2
              ? "Write and test your code"
              : "Paste your notes as text or upload a file"}
          </p>
        </header>

        <TabComponent step={step} onSetStep={setStep} children={undefined} />

        {step === 2 ? (
          <div className="flex flex-col gap-3 mb-4">
            <label htmlFor="topic" className="block mb-3">
              <span className="block text-sm font-semibold text-zinc-600 mb-2">
                Topic
              </span>
              <input
                type="text"
                name="topic"
                id="topic"
                placeholder="Object-oriented programming in Java"
                className="font-geistmono appearance-none w-full p-3 border border-zinc-200 placeholder-zinc-400 text-zinc-700 rounded-md focus:outline-none focus:ring-zinc-300 text-sm"
                required
              />
            </label>

            <label htmlFor="description" className="block mb-3">
              <span className="block text-sm font-semibold text-zinc-600 mb-2">
                Description
              </span>
              <textarea
                name="description"
                id="description"
                placeholder="Describe the exercise requirements"
                className="font-geistmono appearance-none w-full p-3 border border-zinc-200 placeholder-zinc-400 text-zinc-700 rounded-md focus:outline-none focus:ring-zinc-300 text-sm"
                required
              ></textarea>
            </label>

            <label htmlFor="difficulty">
              <p className="text-sm mb-2 text-zinc-500">Select difficulty level</p>
              <select
                className="font-geistmono block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs text-sm"
                name="difficulty"
                id="difficulty"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label htmlFor="timer">
              <p className="text-sm mb-2 text-zinc-500">Completion Time</p>
              <select
                className="font-geistmono block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs text-sm"
                name="timer"
                id="timer"
                value={timer}
                onChange={(e) => onSetTimer(+e.target.value)}
              >
                <option value="1">1 min</option>
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
              </select>
            </label>

            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center justify-center w-full text-center max-w-lg mx-auto duration-200 text-sm gap-x-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-3 rounded-full disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Exercise'}
            </button>

          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-4">
            <label htmlFor="topic" className="block mb-3">
              <span className="block text-sm font-semibold text-zinc-600 mb-2">
                Topic
              </span>
              <input
                type="text"
                name="topic"
                id="topic"
                placeholder="Object-oriented programming in Java"
                className="font-geistmono appearance-none w-full p-3 border border-zinc-200 placeholder-zinc-400 text-zinc-700 rounded-md focus:outline-none focus:ring-zinc-300 text-sm"
              />
            </label>
            {step === 0 ? <TextNote /> : <FileNote />}
          </div>
        )}

        {/* Generated Exercise Display */}
        {generatedExercise && (
          <div className="mt-6 p-4 bg-zinc-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">{generatedExercise.title}</h3>
            <p className="text-sm text-zinc-600 mb-4">{generatedExercise.description}</p>
            
            <div className="mb-4">
              <h4 className="font-medium text-zinc-700">Initial Code Template:</h4>
              <pre className="bg-zinc-100 p-3 rounded-md text-sm overflow-x-auto">
                {generatedExercise.initialCode}
              </pre>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-zinc-700">Solution:</h4>
              <pre className="bg-zinc-100 p-3 rounded-md text-sm overflow-x-auto">
                {generatedExercise.solution}
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-zinc-700">Unit Tests:</h4>
              <pre className="bg-zinc-100 p-3 rounded-md text-sm overflow-x-auto">
                {generatedExercise.tests}
              </pre>
            </div>
          </div>
        )}

        {step !== 2 && (
          <fieldset className="grid md:grid-cols-2 grid-cols-1 gap-x-10 gap-8 mb-10">
            <label htmlFor="difficulty">
              <p className="text-sm mb-2 text-zinc-500">Select difficulty level</p>
              <select
                className="font-geistmono block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs text-sm"
                name="difficulty"
                id="difficulty"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label htmlFor="quizCount">
              <p className="text-sm mb-2 text-zinc-500">How many quizzes do you want to generate?</p>
              <select
                className="font-geistmono block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs text-sm"
                name="quizCount"
                id="quizCount"
              >
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </fieldset>
        )}

        {step !== 2 && (
          <button className="flex items-center justify-center w-full text-center max-w-lg mx-auto duration-200 text-sm gap-x-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-3 rounded-full">
            Generate Quiz
          </button>
        )}
      </form>
    </FormField>
  );
}