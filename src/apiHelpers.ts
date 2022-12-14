import * as R from "ramda";
import { API, Storage } from "aws-amplify";
import { getGame as getGameQuery } from "./graphql/queries";
import { ActualGameSchema, GameData } from "./types.d";
import { Game as GameSchema } from "./API";
import { imgPaths, defaultGameData } from "./constants";

export const getGame = async (id: string, authStatus: string): Promise<ActualGameSchema> => {
  const response: any = await API.graphql({
    query: getGameQuery,
    variables: { id },
    authMode: authStatus === "authenticated" ? "AMAZON_COGNITO_USER_POOLS" : "AWS_IAM",
  });
  const gameData: GameSchema = response.data.getGame;
  let actualGameData: GameData = gameData.data ? JSON.parse(gameData.data) : defaultGameData;

  const imgUrls = await Promise.all(imgPaths.map((path) => Storage.get(R.path(path, actualGameData) as string)));

  imgPaths.forEach((path, pathIndex) => {
    actualGameData = R.assocPath(path, imgUrls[pathIndex], actualGameData);
  });

  return R.mergeDeepRight(gameData, { data: actualGameData });
};
