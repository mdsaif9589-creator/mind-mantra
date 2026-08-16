import fs from 'fs';

let content = fs.readFileSync('src/components/world/ThreeScene.tsx', 'utf-8');

const newComponents = `
function SolarSystem({ growth = 0 }: { growth?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.5;
    }
  });

  const growthScale = 1 + (growth / 100) * 0.2;

  return (
    <group scale={growthScale} position={[0, 1.5, -2]}>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={1} />
      </mesh>
      <pointLight color="#FDB813" intensity={2} distance={20} />
      
      {/* Planetary System */}
      <group ref={groupRef}>
        {/* Earth */}
        <mesh ref={earthRef} position={[0, 0, 4]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#2E86C1" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Moon */}
        <mesh position={[0.8, 0, 4]}>
           <sphereGeometry args={[0.15, 16, 16]} />
           <meshStandardMaterial color="#BDC3C7" />
        </mesh>
        {/* Mars */}
        <mesh position={[5.5, 0, 1]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#E74C3C" />
        </mesh>
        {/* Venus */}
        <mesh position={[-3, 0, -1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#F5B041" />
        </mesh>
      </group>
    </group>
  );
}

function StylizedIsland({ growth = 0 }: { growth?: number }) {
  const growthScale = 1 + (growth / 100) * 0.2;
  return (
    <group scale={growthScale} position={[0, 0, 0]}>
      {/* Island Base */}
      <mesh receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.5, 3, 0.4, 8]} />
        <meshStandardMaterial color="#D4AC0D" roughness={1} />
      </mesh>
      {/* Tree Trunk */}
      <mesh castShadow receiveShadow position={[-0.5, 1, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.1, 0.15, 1.5]} />
        <meshStandardMaterial color="#795548" roughness={0.9} />
      </mesh>
      {/* Palm Leaves */}
      <group position={[-0.3, 1.7, 0]}>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} castShadow rotation={[0, (i * Math.PI * 2) / 5, Math.PI / 4]}>
            <boxGeometry args={[1, 0.05, 0.3]} />
            <meshStandardMaterial color="#2ECC71" roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* Rock */}
      <mesh castShadow receiveShadow position={[1, 0.5, 0.5]} rotation={[Math.PI/4, Math.PI/3, 0]}>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#7F8C8D" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StylizedFlower({ growth = 0 }: { growth?: number }) {
  const growthScale = 0.8 + (growth / 100) * 0.8;
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  return (
    <group scale={growthScale} position={[0, 0, 0]} ref={groupRef}>
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 2]} />
        <meshStandardMaterial color="#27AE60" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#F1C40F" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} castShadow receiveShadow position={[
          Math.cos((i * Math.PI) / 4) * 0.4,
          2,
          Math.sin((i * Math.PI) / 4) * 0.4
        ]} rotation={[
          Math.sin((i * Math.PI) / 4) * 0.5,
          -(i * Math.PI) / 4,
          Math.cos((i * Math.PI) / 4) * 0.5
        ]}>
          <cylinderGeometry args={[0.15, 0.05, 0.8]} />
          <meshStandardMaterial color="#E74C3C" />
        </mesh>
      ))}
    </group>
  );
}

function StylizedCactus({ growth = 0 }: { growth?: number }) {
  const growthScale = 0.8 + (growth / 100) * 0.4;
  return (
    <group scale={growthScale} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.4, 0.8]} />
        <meshStandardMaterial color="#D35400" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
        <capsuleGeometry args={[0.4, 2]} />
        <meshStandardMaterial color="#229954" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.5, 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial color="#229954" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.5, 2.2, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <capsuleGeometry args={[0.2, 0.6]} />
        <meshStandardMaterial color="#229954" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StylizedOcean({ growth = 0 }: { growth?: number }) {
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (waterRef.current) {
      const positions = waterRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 2 + state.clock.elapsedTime) * 0.1 + Math.cos(y * 2 + state.clock.elapsedTime) * 0.1;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;
    }
  });
  return (
    <group position={[0, 0.5, 0]}>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15, 32, 32]} />
        <meshStandardMaterial color="#3498DB" transparent opacity={0.8} roughness={0.1} metalness={0.1} />
      </mesh>
      <Float speed={2} floatIntensity={0.5}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 1.5]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
      </Float>
    </group>
  );
}

function StylizedLantern({ growth = 0 }: { growth?: number }) {
  const growthScale = 1 + (growth / 100) * 0.2;
  return (
    <group scale={growthScale} position={[0, 1.5, 0]}>
      <Float speed={2} floatIntensity={0.5}>
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 1.5, 6]} />
          <meshStandardMaterial color="#E67E22" wireframe />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1.4, 16]} />
          <meshStandardMaterial color="#F1C40F" emissive="#F1C40F" emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
        <pointLight color="#F1C40F" intensity={1.5} distance={5} />
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 6]} />
          <meshStandardMaterial color="#34495E" />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 6]} />
          <meshStandardMaterial color="#34495E" />
        </mesh>
      </Float>
    </group>
  );
}

function StylizedCrystal({ growth = 0 }: { growth?: number }) {
  const growthScale = 1 + (growth / 100) * 0.5;
  return (
    <group scale={growthScale} position={[0, 1, 0]}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={1}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.4} transparent opacity={0.8} roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, 0, 0.4]} rotation={[0, 0, 0.3]} castShadow>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.3} transparent opacity={0.8} roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0.5, 0.2, -0.5]} rotation={[0.2, 0, -0.2]} castShadow>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#2980B9" emissive="#2980B9" emissiveIntensity={0.3} transparent opacity={0.8} roughness={0.1} metalness={0.8} />
        </mesh>
        <pointLight color="#9B59B6" intensity={1} distance={5} position={[0, 0.5, 0]} />
      </Float>
    </group>
  );
}
`;

fs.writeFileSync('src/components/world/ThreeScene.tsx', content + newComponents);
