import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { Storage } from "aws-amplify";
import { Game } from "../../API";

interface Props {
  game: Game;
  edit?: boolean;
}

const GamePreviewCard = ({ game, edit }: Props) => {
  const gameData = game.data ? JSON.parse(game.data) : null;
  const previewKey = gameData?.preview;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileUrl = async () => {
      const res = await Storage.get(previewKey);
      setPreviewUrl(res);
    };

    if (previewKey) {
      fetchFileUrl();
    }
  }, [previewKey]);

  return (
    <Stack
      spacing={1}
      component={Link}
      to={`/game/${game.id}${edit ? "/edit" : ""}`}
      sx={{
        p: {
          textDecoration: "none",
          color: "white",
        },
      }}
    >
      <img
        src={previewUrl || "src/assets/placeholder.png"}
        alt=""
        style={{
          borderRadius: "10px",
          width: "300px",
          aspectRatio: "16/9",
        }}
      />

      <Typography>{game.name}</Typography>
    </Stack>
  );
};

export default GamePreviewCard;
