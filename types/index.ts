export interface FormType {
    topic: string;
    note: string;
    file: string;
    difficulty: string;
    quizCount: number;
    timer: number;
  }
  
  
  export interface QuizType {
    id: number;
    question: string;
    description?: string;
    options: {
      a: string;
      b: string;
      c: string;
      d: string;
    };
    answer: string;
    resources?: string[];
    explanation?: string;
  }
  
  export interface QuizResponse {
    quiz: QuizType[];
  }

  export interface Exercise {
    id: string;
    title: string;
    description: string;
    initialCode: string;
    tests: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  export interface TestResult {
    passed: boolean;
    message: string;
  }