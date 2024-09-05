import { Box, Cone, Sphere } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React, { useEffect, useState } from "react";
import * as THREE from "three";

interface FallingShapesProps {
  onCollision: (collider: string) => void; // Pass collider type
}

export const FallingShapes: React.FC<FallingShapesProps> = ({ onCollision }) => {
  const [shapes, setShapes] = useState<{ id: number; position: THREE.Vector3; type: string }[]>([]);

  useEffect(() => {
    const dropShape = () => {
      const id = Date.now();
      const x = Math.random() * 100 - 50;
      const y = 50;
      const z = Math.random() * 100 - 50;
      const types = ['Box', 'Sphere', 'Pyramid'];
      const type = types[Math.floor(Math.random() * types.length)];

      setShapes((prevShapes) => [...prevShapes, { id, position: new THREE.Vector3(x, y, z), type }]);
    };

    const interval = setInterval(dropShape, 2000); // Drop a shape every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {shapes.map((shape) => (
        <RigidBody
          key={shape.id}
          position={shape.position.toArray()}
          type="dynamic"
          colliders="hull"
          onCollisionEnter={(event) => {
            // Use a property or tag to distinguish
            if (event.other.rigidBodyObject?.name === "vehicle") {
              onCollision("fallingShape");
            }
          }}
          name="fallingShape" // Add a name to identify falling shapes
        >
          {shape.type === 'Box' && (
            <Box args={[1, 1, 1]}>
              <meshStandardMaterial color={new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`)} />
            </Box>
          )}
          {shape.type === 'Sphere' && (
            <Sphere args={[1, 32, 32]}>
              <meshStandardMaterial color={new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`)} />
            </Sphere>
          )}
          {shape.type === 'Pyramid' && (
            <Cone args={[1, 1, 4]}>
              <meshStandardMaterial color={new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`)} />
            </Cone>
          )}
        </RigidBody>
      ))}
    </>
  );
};
