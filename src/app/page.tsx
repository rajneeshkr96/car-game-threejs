"use client";
import Vehicle from "@/Components/Vehicle";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const [isGameOver, setIsGameOver] = useState(true);
  const [score,setScore] = useState(0);
  const [maxScore,setMaxScore] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (!isGameOver) {
      interval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 1000); // Adjust the interval time as needed for faster or slower scoring
    } else if (isGameOver && score > 0) {
      setMaxScore((prevMaxScore) => Math.max(prevMaxScore, score));
      localStorage.setItem("maxScore", score.toString());
      // setforapi todo
      // fetch(`/api/score/${score}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      // }).then((res) => res.json()).then((data) => {
      //   setScore(data.data.score);
      // });

      setScore(0); // Reset score after game over
    }

    return () => clearInterval(interval);
  }, [isGameOver, score]); 
  useEffect(() => {
    const score = localStorage.getItem("maxScore");
    // todo 
    // fetch(`/api/getScore`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // }).then((res) => res.json()).then((data) => {
    //   setScore(data.data.score);
    // });

    if (score) {
      setMaxScore(parseInt(score));
    }
  }, [isGameOver, score]);

  return (
    <>
      {isGameOver ? <div onClick={() => setIsGameOver(false)} className="absolute top-0 left-0 w-screen h-screen bg-black text-white flex justify-center items-center text-center">
        <div className="w-1/3 max-w-64 bg-[#FFF7FC] bg-opacity-60 backdrop-blur-sm text-[#01204E] px-6 py-3 rounded-lg">
          <h1 className="text-2xl font-bold">Welcome to the game</h1>
          <p>Score: {maxScore}</p>
          <button className="px-4 py-2 border rounded-md">Start Game</button>
        </div>
      </div> : <Canvas shadows camera={{ position: [10, 10, 10], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Suspense>
          <Physics >
            <Vehicle isGameOver={isGameOver} setIsGameOver={setIsGameOver} />
          </Physics>
        </Suspense>
      </Canvas>}
    </>
  );
}
