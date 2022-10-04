import { gsap } from "gsap";
import { Character } from "../../hooks/useCharacter";
import { Question } from "./types.d";

type FaceDirection = "L" | "R";

const hurtCharacter = (character: Character, faceDirection: FaceDirection = "R") => {
  const characterRef = character.ref.current;

  // Blink
  gsap
    .timeline({ repeat: 2 })
    .to(characterRef, { visibility: "hidden", duration: 0.1 })
    .to(characterRef, { visibility: "visible", duration: 0.1 });

  const xAxisMultiplier = faceDirection === "R" ? 1 : -1;

  // Move back and forward
  gsap
    .timeline({
      repeat: 2,
    })
    .to(characterRef, {
      x: 20 * xAxisMultiplier,
      duration: 0.08,
    })
    .to(characterRef, {
      x: 0 * xAxisMultiplier,
      duration: 0.08,
    });

  // Decrease character's health
  character.decreaseHealth(20);
};

export const handleAttack = (
  source: Character,
  destination: Character,
  faceDirection: FaceDirection = "R",
  onComplete?: () => void,
) => {
  if (!(source.ref.current && destination.ref.current && source.attackRef.current)) return;

  const attackDOMRect = source.attackRef.current.getBoundingClientRect();
  const sourceDOMRect = source.ref.current.getBoundingClientRect();
  const destinationDOMRect = destination.ref.current.getBoundingClientRect();

  const attackSourcePosition = {
    x:
      faceDirection === "R"
        ? source.ref.current.offsetLeft + source.ref.current.offsetWidth
        : source.ref.current.offsetLeft - attackDOMRect.width,
    y: source.ref.current.offsetTop + 0.2 * sourceDOMRect.height,
  };

  const attackDestinationPosition = {
    x:
      faceDirection === "R"
        ? destination.ref.current.offsetLeft - attackDOMRect.width
        : destination.ref.current.offsetLeft + destination.ref.current.offsetWidth,
    y: destination.ref.current.offsetTop + 0.2 * destinationDOMRect.height,
  };

  const dy = attackDestinationPosition.y - attackSourcePosition.y;
  const dx = attackDestinationPosition.x - attackSourcePosition.x;
  const radians = Math.atan2(dy, dx);
  const deg = (radians * 180) / Math.PI;

  gsap
    .timeline()
    .fromTo(
      source.attackRef.current,
      {
        visibility: "visible",
        ...attackSourcePosition,
        rotate: deg,
      },
      {
        ...attackDestinationPosition,
      },
    )
    .set(source.attackRef.current, {
      visibility: "hidden",
      onComplete: () => {
        hurtCharacter(destination);
        onComplete && onComplete();
      },
    });
};

const difficulties = [10, 20, 30];

export const getQuestions = (count: number): Question[] => {
  const questions = [];

  for (let qsnId = 1; qsnId <= count; qsnId += 1) {
    const difficulty = difficulties[(qsnId - 1) % difficulties.length];

    questions.push({
      id: String(qsnId),
      question: `Question ${qsnId} - Difficulty ${difficulty}`,
      answer: "1",
      difficulty,
    });
  }

  return questions;
};
