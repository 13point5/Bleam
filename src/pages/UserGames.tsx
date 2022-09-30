import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { API, graphqlOperation } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { listGames } from "../graphql/queries";
import { createGame } from "../graphql/mutations";
import { GamesState } from "./Home";
import GamePreviewCard from "../components/GamePreviewCard";

const UserGames = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  const [games, setGames] = useState<GamesState>({
    data: [],
    fetching: true,
    error: null,
  });

  const [isCreateGameModalOpen, setCreateGameModalVisibility] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [creatingNewGame, setCreatingNewGame] = useState(false);

  const handleClickOpen = () => {
    setCreateGameModalVisibility(true);
  };

  const handleClose = () => {
    setCreateGameModalVisibility(false);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response: any = await API.graphql(graphqlOperation(listGames));
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

  const handleCreateGame = async () => {
    setCreatingNewGame(true);
    const res: any = await API.graphql(
      graphqlOperation(createGame, {
        input: {
          name: newGameName,
        },
      }),
    );
    const gameId = res.data.createGame.id;
    navigate(`/game/${gameId}/edit`);
    setCreatingNewGame(false);
  };

  const usersGames = games.data.filter((game) => game.owner === user?.username);

  return (
    <Stack
      spacing={2}
      sx={{
        px: 5,
        py: 3,
      }}
    >
      <Button
        variant="contained"
        sx={{
          width: "fit-content",
        }}
        onClick={handleClickOpen}
      >
        + Create game
      </Button>

      <Dialog open={isCreateGameModalOpen} onClose={handleClose}>
        <DialogTitle>Create Game</DialogTitle>
        <DialogContent>
          <TextField
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            margin="dense"
            id="name"
            label="Name of your game"
            type="text"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <LoadingButton onClick={handleCreateGame} loading={creatingNewGame} variant="contained">
            Create
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {games.fetching ? (
        <p>fetching...</p>
      ) : (
        <Grid
          container
          sx={{
            width: "100%",
          }}
        >
          {usersGames.map((game) => (
            <Grid key={game.id}>
              <GamePreviewCard game={game} edit />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default UserGames;
