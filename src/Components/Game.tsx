import { Box, Cylinder, Sphere, OrbitControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useState, useRef, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

const Vehicle: React.FC = () => {
  const [hover, setHover] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const vehicleRef = useRef<RapierRigidBody>(null);
  const { rapier } = useRapier();

  // Store the direction and speed of the vehicle
  const direction = useRef(new THREE.Vector3());
  const speed = 5;

  // Update the vehicle's position each frame based on input
  useFrame((state) => {
    const { pointer, camera } = state;
    if (vehicleRef.current) {
      // Calculate the direction from the vehicle to the pointer
      const vector = new THREE.Vector3(pointer.x * 10, 0, pointer.y * 10);
      vector.applyQuaternion(camera.quaternion);

      // Calculate direction from the vehicle to the pointer
      direction.current.copy(vector.sub(vehicleRef.current.translation()).normalize());

      if (isMoving) {
        vehicleRef.current.applyImpulse(
          { x: direction.current.x * speed, y: 0, z: direction.current.z * speed },
          true
        );
      }
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "w" || e.key === "s") {
      setIsMoving(true);
      if (e.key === "s") {
        direction.current.negate();
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "w" || e.key === "s") {
      setIsMoving(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />
      {/* car  */}
      <RigidBody
        ref={vehicleRef}
        position={[0, 1, 0]}
        colliders="hull"
        rotation={[0, 0, 0]}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        {/* Vehicle Body */}
        <Box args={[2, 1, 4]}>
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>

        {/* Front spherical wheel */}
        <Sphere args={[0.5, 32, 32]} position={[0, -0.5, 1.5]}>
          <meshStandardMaterial color="black" />
        </Sphere>

        {/* Back left cylindrical wheel */}
        <Cylinder args={[0.3, 0.3, 0.5, 32]} position={[-0.9, -0.5, -1.5]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="black" />
        </Cylinder>

        {/* Back right cylindrical wheel */}
        <Cylinder args={[0.3, 0.3, 0.5, 32]} position={[0.9, -0.5, -1.5]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
      </RigidBody>

      {/* Infinite Floor */}
      <RigidBody type="fixed" name="floor">
        <Box position={[0, 0, 0]} args={[1000, 1, 1000]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
};

export default Vehicle;