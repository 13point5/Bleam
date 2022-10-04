import { useState, useEffect } from "react";
import useCharacter from "../../hooks/useCharacter";
import { handleAttack } from "./utils";
import styles from "./styles.module.css";
import { Button, Dialog, DialogContent } from "@mui/material";

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

const Game = ({ name, data: { bg, player, enemy } }: Props) => {
  const playerObj = useCharacter(player.name);
  const enemyObj = useCharacter(enemy.name);

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
    handleAttack(playerObj, enemyObj, "R", () => {
      handleEnemyAttack();
    });
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
          <progress ref={playerObj.healthRef} max={100} />
        </div>

        <div className={`${styles.stats} ${styles["enemy-stats"]}`}>
          <span>{enemy.name}</span>
          <progress ref={enemyObj.healthRef} max={100} />
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
    </div>
  );
};

export default Game;
