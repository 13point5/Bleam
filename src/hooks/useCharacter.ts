import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

type HealthUpdater = (delta: number) => void;

export interface Character {
  id: string;
  ref: React.MutableRefObject<HTMLImageElement | null>;
  attackRef: React.MutableRefObject<HTMLImageElement | null>;
  healthRef: React.MutableRefObject<HTMLProgressElement | null>;
  health: number;
  increaseHealth: HealthUpdater;
  decreaseHealth: HealthUpdater;
  resetHealth: () => void;
}

const useCharacter = (id: string): Character => {
  const ref: Character["ref"] = useRef(null);
  const attackRef = useRef<HTMLImageElement | null>(null);
  const healthRef: Character["healthRef"] = useRef(null);
  const [health, setHealth] = useState<Character["health"]>(100);

  const increaseHealth: HealthUpdater = (delta) => {
    setHealth((prev) => Math.min(prev + delta, 100));
  };

  const decreaseHealth: HealthUpdater = (delta) => {
    setHealth((prev) => Math.max(prev - delta, 0));
  };

  const resetHealth = () => {
    setHealth(100);
  };

  // Update character's health
  useEffect(() => {
    gsap.to(healthRef.current, {
      value: health,
    });
  }, [health]);

  return {
    id,
    ref,
    attackRef,
    healthRef,
    health,
    increaseHealth,
    decreaseHealth,
    resetHealth,
  };
};

export default useCharacter;
