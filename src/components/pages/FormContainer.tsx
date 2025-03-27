"use client";
import { useFormStore } from "@/store/form";
import Form from "./Form";
import Loading from "@/components/shared/Loading";
import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/quiz";
import { useTimerStore } from "@/store/timer";
import QuizContainer from "./QuizContainer";
import FormField from "./FormField";
import Summary from "./Summary";
import { QuizResponse } from "../../../types";

export default function FormContainer() {
  const status = useFormStore((state) => state.status);
  const setStatus = useFormStore((state) => state.setStatus);
  const setQuizzes = useQuizStore((state) => state.setQuizzes);
  const reset = useQuizStore((state) => state.reset);
  const timer = useTimerStore((state) => state.timer);
  const setTimer = useTimerStore((state) => state.setTimer);

  async function generateQuiz(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("streaming");

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data: QuizResponse = await res.json();
      
      if (Array.isArray(data.quiz) && data.quiz.length > 0) {
        setQuizzes(data.quiz);
        setStatus("done");
      } else {
        throw new Error("Invalid quiz data format");
      }
    } catch (error) {
      console.error(error);
      alert(`Error generating quizzes, try again!`);
      reset();
      setStatus("idle");
    }
  }

  return (
    <section>
      {status === "idle" && (
        <Form timer={timer} onSetTimer={setTimer} onSubmit={generateQuiz} />
      )}
      {status === "streaming" && <Loading />}
      {status === "done" && (
        <FormField>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center ">
            <p className="max-w-sm text-center text-sm text-zinc-500 mb-4">
              Quiz successfully generated! Click the button to begin whenever
              you&apos;re ready!
            </p>
            <button
              onClick={() => setStatus("start")}
              className="font-geistmono font-semibold tracking-widest bg-primary hover:bg-secondary duration-200 text-white rounded-full px-6 py-3"
            >
              Start Quiz
            </button>
          </div>
        </FormField>
      )}
      {status === "start" && <QuizContainer />}
      {status === "summary" && <Summary />}
    </section>
  );
}