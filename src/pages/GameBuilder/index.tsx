import * as R from "ramda";
import { useState, useEffect, ChangeEvent } from "react";
import { Storage, API } from "aws-amplify";
import { updateGame as updateGameMutation } from "../../graphql/mutations";
import { useParams } from "react-router-dom";
import { getGame } from "../../apiHelpers";
import {
  Stack,
  Divider,
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import GamePreview from "../../components/Game";
import { GameState } from "../../types.d";
import { imgPaths } from "../../constants";
import { getAssetName, urlToObject } from "./utils";
import * as styles from "./styles";
import { LoadingButton } from "@mui/lab";

const drawerWidth = 400;

const GameBuilder = () => {
  const params = useParams();
  const { id } = params;

  const [game, setGame] = useState<GameState>({
    data: null,
    fetching: true,
    error: null,
  });
  const [updatingGame, setUpdatingGame] = useState(false);

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

  useEffect(() => {
    fetchGame();
  }, []);

  const handleTextChange = (path: R.Path) => (e: ChangeEvent<HTMLInputElement>) => {
    setGame(R.assocPath(["data", ...path], e.target.value));
  };

  const handleImgChange = (path: R.Path) => (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const fileData = e.currentTarget.files[0];
      const dataPath = ["data", ...path];
      setGame(R.assocPath(dataPath, URL.createObjectURL(fileData)));
    }
  };

  const handlePublicStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGame(R.assocPath(["data", "public"], event.target.checked));
  };

  const updateGame = async () => {
    if (!id || !game.data) return;

    setUpdatingGame(true);

    try {
      const changedAssetPaths = imgPaths.filter((path) => (R.path(path, game.data.data) as string).startsWith("blob"));

      const imgFiles = await Promise.all(
        changedAssetPaths.map((path) => urlToObject(R.path(path, game.data.data) as string, getAssetName(id, path))),
      );

      await Promise.all(imgFiles.map((file) => Storage.put(file.name, file)));

      let updatedGameData = game.data.data;
      imgPaths.forEach((path) => {
        updatedGameData = R.assocPath(path, getAssetName(id, path), updatedGameData);
      });

      await API.graphql({
        query: updateGameMutation,
        variables: {
          input: {
            id,
            name: game.data.name,
            public: game.data.public,
            data: JSON.stringify(updatedGameData),
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingGame(false);
    }
  };

  if (!id) return <p>Invalid URL</p>;

  if (game.fetching) return <p>fetching...</p>;

  if (game.error || !game.data) return <p>Something went wrong!</p>;

  const gameData = game.data.data;

  return (
    <Stack direction="row">
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          overflow: "hidden",
        }}
      >
        <Toolbar />
        <List>
          <ListItem sx={styles.topLevelListItem}>
            <ListItemText primary="Game Details" />

            <List sx={styles.nestedList} component={Stack} spacing={3}>
              <Stack spacing={1}>
                <Typography>Name</Typography>
                <TextField value={game.data.name} onChange={handleTextChange(["name"])} variant="outlined" />
              </Stack>

              <Stack spacing={1}>
                <Typography>Background</Typography>
                <Button variant="contained" fullWidth component="label">
                  {gameData.bg.img ? "Change" : "Upload"}
                  <input
                    onChange={handleImgChange(["data", "bg", "img"])}
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                  />
                </Button>
              </Stack>

              <Stack spacing={1}>
                <Typography>Preview</Typography>
                <Button variant="contained" fullWidth component="label">
                  {gameData.preview ? "Change" : "Upload"}
                  <input
                    onChange={handleImgChange(["data", "preview"])}
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                  />
                </Button>
              </Stack>
            </List>
          </ListItem>

          <Divider />

          <ListItem sx={styles.topLevelListItem}>
            <ListItemText primary="Player Details" />

            <List sx={styles.nestedList} component={Stack} spacing={3}>
              <Stack spacing={1}>
                <Typography>Name</Typography>
                <TextField
                  value={gameData.player.name}
                  onChange={handleTextChange(["data", "player", "name"])}
                  variant="outlined"
                />
              </Stack>

              <Stack spacing={1}>
                <Typography>Avatar</Typography>
                <Button variant="contained" fullWidth component="label">
                  {gameData.player.img ? "Change" : "Upload"}
                  <input
                    onChange={handleImgChange(["data", "player", "img"])}
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                  />
                </Button>
              </Stack>

              <Stack spacing={1}>
                <Typography>Attack Name</Typography>
                <TextField
                  value={gameData.player.attack.name}
                  onChange={handleTextChange(["data", "player", "attack", "name"])}
                  variant="outlined"
                />
              </Stack>

              <Stack spacing={1}>
                <Typography>Attack Image</Typography>
                <Button variant="contained" fullWidth component="label">
                  {gameData.player.attack.img ? "Change" : "Upload"}
                  <input
                    onChange={handleImgChange(["data", "player", "attack", "img"])}
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                  />
                </Button>
              </Stack>
            </List>
          </ListItem>

          <Divider />

          <ListItem sx={styles.topLevelListItem}>
            <ListItemText primary="Enemy Details" />

            <List sx={styles.nestedList} component={Stack} spacing={3}>
              <Stack spacing={1}>
                <Typography>Name</Typography>
                <TextField
                  value={gameData.enemy.name}
                  onChange={handleTextChange(["data", "enemy", "name"])}
                  variant="outlined"
                />
              </Stack>

              <Stack spacing={1}>
                <Typography>Avatar</Typography>
                <Button variant="contained" fullWidth component="label">
                  {gameData.enemy.img ? "Change" : "Upload"}
                  <input
                    onChange={handleImgChange(["data", "enemy", "img"])}
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                  />
                </Button>
              </Stack>

              <Stack spacing={1}>
                <Typography>Attack Name</Typography>
                <TextField
                  value={gameData.enemy.attack.name}
                  onChange={handleTextChange(["data", "enemy", "attack", "name"])}
                  variant="outlined"
                />
              </Stack>

              <Stack spacing={1}>
                <Typography>Attack Image</Typography>
                <Button variant="contained" fullWidth component="label">
                  {gameData.enemy.attack.img ? "Change" : "Upload"}
                  <input
                    onChange={handleImgChange(["data", "enemy", "attack", "img"])}
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                  />
                </Button>
              </Stack>
            </List>
          </ListItem>

          <Divider />

          <ListItem sx={styles.topLevelListItem}>
            <ListItemText primary="Actions" />

            <List sx={styles.nestedList} component={Stack} spacing={3}>
              <FormControlLabel
                label="Public"
                control={<Switch checked={Boolean(game.data.public)} onChange={handlePublicStatusChange} />}
                sx={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  mx: 0,
                }}
              />

              <LoadingButton onClick={updateGame} loading={updatingGame} variant="contained" fullWidth>
                Update game
              </LoadingButton>
            </List>
          </ListItem>
        </List>
      </Drawer>

      <Box
        sx={{
          width: "100%",
          pt: 2,
        }}
      >
        <GamePreview {...gameData} name={game.data.name} />
      </Box>
    </Stack>
  );
};

export default GameBuilder;
