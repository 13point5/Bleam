import "./styles.css";
import useCharacter from "../../hooks/useCharacter";
import { handleAttack } from "./utils";

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
  preview: string | null;
  bg: {
    img: string | null;
    style?: Record<string, unknown>;
  };
  player: CharacterProps;
  enemy: CharacterProps;
}

const Game = ({ name, bg, player, enemy }: Props) => {
  const playerObj = useCharacter(player.name);
  const enemyObj = useCharacter(enemy.name);

  const handleEnemyAttack = () => {
    handleAttack(enemyObj, playerObj, "L");
  };

  const handlePlayerAttack = () => {
    handleAttack(playerObj, enemyObj);
  };

  return (
    <div className="game">
      <h1>{name}</h1>
      <div
        className="arena"
        style={{
          backgroundImage: `url(${bg.img})`,
          ...bg.style,
        }}
      >
        <div className="stats player-stats">
          <span>{player.name}</span>
          <progress ref={playerObj.healthRef} max={100} />
        </div>

        <div className="stats enemy-stats">
          <span>{enemy.name}</span>
          <progress ref={enemyObj.healthRef} max={100} />
        </div>

        <img ref={playerObj.ref} className="character" alt="" src={player.img || ""} style={player.style} />

        <img
          ref={playerObj.attackRef}
          className="attack"
          src={player.attack.img || ""}
          style={player.attack.style}
          alt=""
        />
        <img
          ref={enemyObj.attackRef}
          className="attack"
          src={enemy.attack.img || ""}
          style={enemy.attack.style}
          alt=""
        />

        <img ref={enemyObj.ref} className="character enemy" alt="" src={enemy.img || ""} style={enemy.style} />
      </div>

      <div className="attacks-bar">
        <button type="button" className="attack-btn" onClick={handlePlayerAttack}>
          {player.name} - {player.attack.name}
        </button>

        <button type="button" className="attack-btn" onClick={handleEnemyAttack}>
          {enemy.name} - {enemy.attack.name}
        </button>
      </div>
    </div>
  );
};

export default Game;
