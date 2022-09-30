import { Props as GameProps } from "./components/Game";
import { Game as GameSchema } from "./API";

export type GameData = Omit<GameProps, "name">;

export type ActualGameSchema = Omit<GameSchema, "data"> & {
  data: GameData;
};

export type GameState =
  | {
      data: null;
      fetching: true;
      error: null;
    }
  | {
      data: null;
      fetching: false;
      error: string;
    }
  | {
      data: ActualGameSchema;
      fetching: false;
      error: null;
    };
