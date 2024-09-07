import { OrbitControls } from '@react-three/drei';
import { Box, Sphere, PerspectiveCamera } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import roadTextureImage from '@/../public/assets/roadTexture.jpg';
import { FallingShapes } from "./FallingShapes";

interface VehicleProps {
  isGameOver: boolean;
  setIsGameOver: (isGameOver: boolean) => void;
}

const Vehicle: React.FC<VehicleProps> = ({ isGameOver, setIsGameOver }) => {
  const [isMovingForward, setIsMovingForward] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const controlsRef = useRef<any>(null);
  const vehicleRef = useRef<RapierRigidBody>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const forwardSpeed = 5;
  const reverseSpeed = 3;
  const roadTexture = new THREE.TextureLoader().load(roadTextureImage.src);
  roadTexture.wrapS = THREE.RepeatWrapping;
  roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(50, 50);

  useFrame((state) => {
    const { x, y } = state.pointer;
    const camera = state.camera as THREE.PerspectiveCamera;

    if (vehicleRef.current && camera) {
      const raycaster = new THREE.Raycaster();
      const pointerVector = new THREE.Vector2(x, y);
      raycaster.setFromCamera(pointerVector, camera);


      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); 
      const targetPosition = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, targetPosition);

      const vehiclePosition = new THREE.Vector3(
        vehicleRef.current.translation().x,
        vehicleRef.current.translation().y,
        vehicleRef.current.translation().z
      );

      const direction = new THREE.Vector3()
        .subVectors(targetPosition, vehiclePosition)
        .normalize();

      const impulse = new THREE.Vector3();

      if (isMovingForward) {
        impulse.copy(direction).multiplyScalar(forwardSpeed);
        vehicleRef.current.applyImpulse(impulse, true);
        const angle = Math.atan2(direction.x, direction.z); 
        vehicleRef.current.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0)),false);
      } else if (isReversing) {
        const angle = Math.atan2(-direction.x, -direction.z); 
        vehicleRef.current.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0)),false);
        impulse.copy(direction).multiplyScalar(-reverseSpeed);
        vehicleRef.current.applyImpulse(impulse, true);
      }

      if (cameraRef.current && controlsRef.current) {
        controlsRef.current.target.copy(vehiclePosition);
        controlsRef.current.update();
      }
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "w") {
      setIsMovingForward(true);
    } else if (e.key === "s") {
      setIsReversing(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "w") {
      setIsMovingForward(false);
    } else if (e.key === "s") {
      setIsReversing(false);
    }
  };

  const handleGameOver = () => {
    if (!isGameOver) {
      setIsGameOver(true);
      console.log('Game Over');
    }
  };

  const onCollisionWithShape = (collider: string) => {
    if (collider === "fallingShape") {
      handleGameOver();
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

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.updateProjectionMatrix();
    }
  }, [cameraRef.current]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <PerspectiveCamera makeDefault ref={cameraRef} fov={80} near={0.5} far={1000} position={[0, 5, 10]} />
      <OrbitControls
        ref={controlsRef}
        maxDistance={10}
        minDistance={10}
        enableDamping={true}
        dampingFactor={0.1}
      />
      <RigidBody
        ref={vehicleRef}
        position={[0, 1.5, 0]}
        colliders="hull"
        rotation={[0, 0, 0]}
        linearDamping={0.5}
        angularDamping={0.5}
        name="vehicle"
      >
        <Box args={[2, 1, 4]}>
          <meshStandardMaterial color="royalblue" />
        </Box>
        <Sphere args={[0.5, 32, 32]} position={[0, -0.5, 1.5]}>
          <meshStandardMaterial color="black" />
        </Sphere>
        <Box args={[0.3, 0.3, 0.5]} position={[-0.9, -0.5, -1.5]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="black" />
        </Box>
        <Box args={[0.3, 0.3, 0.5]} position={[0.9, -0.5, -1.5]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="black" />
        </Box>
      </RigidBody>
      <FallingShapes onCollision={onCollisionWithShape} />
      <RigidBody type="fixed" name="floor">
        <Box position={[0, 0, 0]} args={[1000, 1, 1000]}>
          <meshStandardMaterial map={roadTexture} />
        </Box>
      </RigidBody>
    </>
  );
};

export default Vehicle;
