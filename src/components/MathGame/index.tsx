import * as R from "ramda";
import { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import useCharacter from "../../hooks/useCharacter";
import { handleAttack, getQuestions } from "./utils";
import { OnAnswerEvent } from "./types.d";
import QuestionModal from "./QuestionModal";
import styles from "./styles.module.css";

interface GameObject {
  name: string;
  img: string | null;
  style?: Record<string, unknown>;
}

interface CharacterProps extends GameObject {
  attack: GameObject;
}

export interface Props {
  name: string;
  data: {
    preview: string | null;
    bg: {
      img: string | null;
      style?: Record<string, unknown>;
    };
    player: CharacterProps;
    enemy: CharacterProps;
  };
}

const questions = getQuestions(6);
const maxHealth = questions.reduce((sum, question) => sum + question.difficulty, 0);

const Game = ({ name, data: { bg, player, enemy } }: Props) => {
  const playerObj = useCharacter(player.name, maxHealth);
  const enemyObj = useCharacter(enemy.name, maxHealth);

  console.log("questions", questions);

  const [questionModal, setQuestionModal] = useState({
    open: false,
    questionIndex: 0,
  });

  const [gameOverModal, setGameOverModal] = useState<{
    open: boolean;
    message: string | null;
  }>({
    open: false,
    message: null,
  });

  useEffect(() => {
    if (playerObj.health <= 0) {
      setGameOverModal({
        open: true,
        message: `${enemy.name} Won the Battle!`,
      });
    } else if (enemyObj.health <= 0) {
      setGameOverModal({
        open: true,
        message: `${player.name} Won the Battle!`,
      });
    }
  }, [playerObj.health, enemyObj.health]);

  const restartGame = () => {
    playerObj.resetHealth();
    enemyObj.resetHealth();
    setGameOverModal({
      open: false,
      message: null,
    });
  };

  const handleEnemyAttack = () => {
    handleAttack(enemyObj, playerObj, "L");
  };

  const handlePlayerAttack = () => {
    setQuestionModal(
      R.mergeDeepLeft({
        open: true,
      }),
    );
  };

  const handleAnswer: OnAnswerEvent = (questionId, userAnswer) => {
    const question = questions.find(R.propEq("id", questionId));

    if (!question) throw new Error("Question not found");

    const correctAnswer = question.answer;

    if (userAnswer === correctAnswer) {
      handleAttack(playerObj, enemyObj, "R");
    } else {
      handleEnemyAttack();
    }

    setQuestionModal((prev) =>
      R.mergeDeepLeft({
        open: false,
        questionIndex: prev.questionIndex + 1,
      })(prev),
    );
  };

  return (
    <div className={styles.game}>
      <h1>{name}</h1>
      <div
        className={styles.arena}
        style={{
          backgroundImage: `url(${bg.img})`,
          ...bg.style,
        }}
      >
        <div className={`${styles.stats} ${styles["player-stats"]}`}>
          <span>{player.name}</span>
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <progress ref={playerObj.healthRef} max={maxHealth} />

            <Typography color="black">{playerObj.health}</Typography>
          </Stack>
        </div>

        <div className={`${styles.stats} ${styles["enemy-stats"]}`}>
          <span>{enemy.name}</span>
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <progress ref={enemyObj.healthRef} max={maxHealth} />

            <Typography color="black">{enemyObj.health}</Typography>
          </Stack>
        </div>

        <img ref={playerObj.ref} className={styles.character} alt="" src={player.img || ""} style={player.style} />

        <img
          ref={playerObj.attackRef}
          className={styles.attack}
          src={player.attack.img || ""}
          style={player.attack.style}
          alt=""
        />
        <img
          ref={enemyObj.attackRef}
          className={styles.attack}
          src={enemy.attack.img || ""}
          style={enemy.attack.style}
          alt=""
        />

        <img
          ref={enemyObj.ref}
          className={`${styles.character} ${styles.enemy}`}
          alt=""
          src={enemy.img || ""}
          style={enemy.style}
        />
      </div>

      <div className={styles["attacks-bar"]}>
        <button type="button" className={styles["attack-btn"]} onClick={handlePlayerAttack}>
          {player.name} - {player.attack.name}
        </button>
      </div>

      <Dialog open={gameOverModal.open} disableEscapeKeyDown>
        <DialogContent>{gameOverModal.message}</DialogContent>
        <Button variant="contained" onClick={restartGame}>
          Restart
        </Button>
      </Dialog>

      <QuestionModal
        open={questionModal.open}
        question={questions[questionModal.questionIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default Game;
