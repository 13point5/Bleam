import { useRef } from "react";
import { Button, Dialog, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { Question, OnAnswerEvent } from "../types.d";

interface Props {
  open: boolean;
  onAnswer: OnAnswerEvent;
  question: Question;
}

const QuestionModal = ({ open, question, onAnswer }: Props) => {
  const answerFieldRef = useRef<HTMLInputElement | null>(null);

  const handleAnswer = () => {
    if (!answerFieldRef.current) return;

    const val = answerFieldRef.current.value;
    console.log("val :>> ", val);
    onAnswer(question.id, answerFieldRef.current.value);
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="h5">Question</Typography>

          <Typography variant="body1">{question.question}</Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="h5">Answer</Typography>

          <input ref={answerFieldRef} />
        </Stack>
      </DialogContent>

      <Button variant="contained" onClick={handleAnswer}>
        Submit My Answer
      </Button>
    </Dialog>
  );
};

export default QuestionModal;
