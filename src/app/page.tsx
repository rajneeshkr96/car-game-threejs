"use client";
import Vehicle from "@/Components/Vehicle";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const [isGameOver, setIsGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (!isGameOver) {
      // Update max score if necessary
      setMaxScore((prevMaxScore) => Math.max(prevMaxScore, score));
      localStorage.setItem("maxScore", maxScore.toString());

      // Reset score after game over
      setScore(0);

      // Calculate and set game duration
      const time = new Date();
      const duration = (time.getTime() - startTime);
      setMaxScore(duration);
    }
  }, [isGameOver, score, startTime]);

  useEffect(() => {
    const storedMaxScore = localStorage.getItem("maxScore");
    
    // Set max score from local storage
    if (storedMaxScore) {
      setMaxScore(parseInt(storedMaxScore));
    }
  }, []);

  const handleStart = () => {
    setIsGameOver(false);
    const time = new Date();
    setStartTime(time.getTime());
  };

  return (
    <>
      {isGameOver ? (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black text-white flex justify-center items-center text-center">
          <div className="w-1/3 max-w-64 bg-[#FFF7FC] bg-opacity-60 backdrop-blur-sm text-[#01204E] px-6 py-3 rounded-lg">
            <h1 className="text-2xl font-bold">Welcome to the game</h1>
            <p>Score: {maxScore}</p>
            <button onClick={handleStart} className="px-4 py-2 border rounded-md">Start Game</button>
          </div>
        </div>
      ) : (
        <Canvas shadows camera={{ position: [10, 10, 10], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Suspense>
            <Physics>
              <Vehicle isGameOver={isGameOver} setIsGameOver={setIsGameOver} />
            </Physics>
          </Suspense>
        </Canvas>
      )}
    </>
  );
}
