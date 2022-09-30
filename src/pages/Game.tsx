import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { getGame } from "../apiHelpers";
import Game from "../components/Game";
import { GameState } from "../types.d";

const GamePage = () => {
  const params = useParams();
  const { id } = params;

  const [game, setGame] = useState<GameState>({
    data: null,
    fetching: true,
    error: null,
  });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (!id) throw new Error("Game not found");

        const gameData = await getGame(id);

        setGame({
          data: gameData,
          fetching: false,
          error: null,
        });
      } catch (error) {
        console.error(error);
        setGame({
          data: null,
          fetching: false,
          error: "Could not fetch game",
        });
      }
    };

    fetchGame();
  }, []);

  if (game.fetching) return <span>fetching...</span>;

  if (game.error || !game.data) return <span>Game not Found!!!</span>;

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Game name={game.data.name} {...game.data.data} />
    </Box>
  );
};

export default GamePage;
