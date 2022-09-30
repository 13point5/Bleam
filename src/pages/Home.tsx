import { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { listGames } from "../graphql/queries";
import { Game } from "../API";
import GamePreviewCard from "../components/GamePreviewCard";

export interface GamesState {
  data: Game[];
  fetching: boolean;
  error: string | null;
}

const Home = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [games, setGames] = useState<GamesState>({
    data: [],
    fetching: true,
    error: null,
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response: any = await API.graphql({
          query: listGames,
          variables: {
            filter: {
              public: {
                eq: true,
              },
            },
          },
          authMode: authStatus === "authenticated" ? "AMAZON_COGNITO_USER_POOLS" : "AWS_IAM",
        });

        setGames({
          data: response.data.listGames.items,
          fetching: false,
          error: null,
        });
      } catch (error) {
        console.error(error);
        setGames((prev) => ({
          data: prev.data,
          fetching: false,
          error: "Could not fetch games",
        }));
      }
    };

    fetchGames();
  }, []);

  return (
    <Stack
      sx={{
        px: 5,
        py: 3,
      }}
      spacing={4}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
        }}
      >
        Public Games
      </Typography>

      {games.fetching ? (
        <p>Fetching...</p>
      ) : (
        <Grid container spacing={2}>
          {games.data.map((game) => (
            <Grid key={game.id}>
              <GamePreviewCard game={game} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default Home;
