export const imgPaths = [
  ["bg", "img"],
  ["player", "img"],
  ["player", "attack", "img"],
  ["enemy", "img"],
  ["enemy", "attack", "img"],
  ["preview"],
];

export const defaultGameData = {
  preview: null,
  bg: {
    img: null,
  },
  player: {
    name: "Player",
    img: null,
    attack: {
      name: "Player Attack",
      img: null,
    },
  },
  enemy: {
    name: "Enemy",
    img: null,
    attack: {
      name: "Enemy Attack",
      img: null,
    },
  },
};
