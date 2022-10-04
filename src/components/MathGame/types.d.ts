export interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: number;
}

export type OnAnswerEvent = (questionId: Question["id"], answer: Question["answer"]) => void;
