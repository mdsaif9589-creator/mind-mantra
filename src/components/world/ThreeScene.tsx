import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Sparkles, ContactShadows, Float, Cloud, Sky } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { WorldTheme, BackgroundPreset } from '../../types';

export function ThreeScene() {
  const { profile } = useAppStore();
  const quality = profile.graphicsQuality || 'Auto';
  const isLowQuality = quality === 'Low';
  const isHighQuality = quality === 'High' || quality === 'Auto';

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        shadows={!isLowQuality}
        gl={{ antialias: !isLowQuality, powerPreference: 'high-performance', alpha: false }}
        dpr={isLowQuality ? 1 : [1, 2]}
      >
        <color attach="background" args={[profile.backgroundColor || '#0a192f']} />
        
        <SceneContent />
        
        {isHighQuality && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} opacity={1} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

// Separate component to use `useThree` and `useFrame`
function SceneContent() {
  const { profile, growth, isCalmMode } = useAppStore();
  const { selectedObject, backgroundPreset, backgroundColor, theme } = profile;
  const sceneGroup = useRef<THREE.Group>(null);
  const cameraGroup = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();

  const quality = profile.graphicsQuality || 'Auto';
  const isLowQuality = quality === 'Low';

  let sparkleColor = '#ffffff';
  if (backgroundPreset === 'Sunset' || backgroundPreset === 'Warm Sand') {
    sparkleColor = '#ffcc80';
  } else if (backgroundPreset === 'Forest') {
    sparkleColor = '#a5d6a7';
  } else if (backgroundPreset === 'Ocean') {
    sparkleColor = '#80deea';
  } else if (backgroundPreset === 'Lavender' || backgroundPreset === 'Dream') {
    sparkleColor = '#ce93d8';
  } else if (backgroundPreset === 'Custom' && backgroundColor) {
    sparkleColor = backgroundColor;
  }

  // Idle Camera Breathing & Parallax
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = isCalmMode ? 0.2 : 0.5;

    if (sceneGroup.current) {
      const targetX = (pointer.x * 0.2);
      const targetY = (pointer.y * 0.2);
      
      // Idle breathing (applied to the scene instead of the camera to avoid OrbitControls conflict)
      sceneGroup.current.position.y = -0.5 + Math.sin(t * speed) * 0.1;

      // Scene parallax (subtle inverse)
      sceneGroup.current.rotation.y += (-targetX * 0.5 - sceneGroup.current.rotation.y) * 0.02;
      sceneGroup.current.rotation.x += (-targetY * 0.2 - sceneGroup.current.rotation.x) * 0.02;
    }

    if (cameraGroup.current) {
      const targetX = (pointer.x * 0.2);
      const targetY = (pointer.y * 0.2);
      cameraGroup.current.position.x += (targetX - cameraGroup.current.position.x) * 0.05;
      cameraGroup.current.position.y += (targetY - cameraGroup.current.position.y) * 0.05;
    }
  });

  return (
    <>
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        target={[0, 1, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 - 0.05}
        autoRotate={!isCalmMode}
        autoRotateSpeed={0.3}
        enableDamping={true}
        dampingFactor={0.05}
        makeDefault
      />
      <group ref={cameraGroup}>
        {/* Atmosphere / Background Layer */}
        <Atmosphere preset={backgroundPreset as BackgroundPreset} theme={theme} customColor={backgroundColor} isLowQuality={isLowQuality} />

        {/* Lighting Layer */}
        <LightingLayer preset={backgroundPreset as BackgroundPreset} theme={theme} customColor={backgroundColor} isCalmMode={isCalmMode} isLowQuality={isLowQuality} />
      </group>

      {/* Midground & Foreground Particles */}
      {!isLowQuality && (
        <group position={[0, 2, 6]}>
          <CustomParticles 
            count={isCalmMode ? 40 : 120} 
            color={sparkleColor} 
            isCalmMode={isCalmMode} 
          />
        </group>
      )}

      {/* Main Object Layer */}
      <group ref={sceneGroup} position={[0, -1, 0]}>
        {selectedObject === 'Bonsai' && <StylizedTree scale={0.6} isBonsai growth={growth.progress} isCalmMode={isCalmMode} />}
        {selectedObject === 'Mountain' && <StylizedMountain growth={growth.progress} />}
        {selectedObject === 'Planet' && <SolarSystem growth={growth.progress} />}
        {selectedObject === 'Island' && <StylizedIsland growth={growth.progress} />}
        {selectedObject === 'Flower' && <StylizedFlower growth={growth.progress} />}
        {selectedObject === 'Cactus' && <StylizedCactus growth={growth.progress} />}
        {selectedObject === 'Ocean' && <StylizedOcean growth={growth.progress} />}
        {selectedObject === 'Lantern' && <StylizedLantern growth={growth.progress} />}
        {selectedObject === 'Crystal' && <StylizedCrystal growth={growth.progress} />}
      </group>
    </>
  );
}

function Atmosphere({ preset, theme, customColor, isLowQuality }: { preset: BackgroundPreset, theme: WorldTheme, customColor: string, isLowQuality: boolean }) {
  const fogColor = preset !== 'Custom' ? customColor : customColor;
  const isNight = theme === 'Night' || theme === 'Space' || preset === 'Deep Night' || preset === 'Midnight Blue';

  return (
    <>
      <fogExp2 attach="fog" args={[fogColor, 0.06]} />
      {!isLowQuality && isNight && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />}
      {!isLowQuality && (theme === 'Dream' || preset === 'Dream') && (
        <Cloud position={[0, 5, -10]} opacity={0.2} speed={0.2} bounds={[10, 2, 2]} />
      )}
      {!isLowQuality && (theme === 'Sunrise' || preset === 'Sunset' || preset === 'Dawn') && (
        <Sky distance={450000} sunPosition={[0, 0, -1]} inclination={0} azimuth={0.25} turbidity={10} rayleigh={3} mieCoefficient={0.005} mieDirectionalG={0.8} />
      )}
      {!isLowQuality && (theme === 'Space') && (
        <Sparkles count={500} scale={20} size={1} speed={0.2} opacity={0.5} color="#ffffff" />
      )}
    </>
  );
}

function LightingLayer({ preset, theme, customColor, isCalmMode, isLowQuality }: { preset: BackgroundPreset, theme: WorldTheme, customColor: string, isCalmMode: boolean, isLowQuality: boolean }) {
  const ambientIntensity = isCalmMode ? 0.3 : 0.6;
  const dirIntensity = isCalmMode ? 1.0 : 1.5;
  
  let lightColor = '#ffffff';
  let rimColor = '#8ab4f8';

  if (preset === 'Sunset' || preset === 'Warm Sand') {
    lightColor = '#ffcc80';
    rimColor = '#ff8a65';
  } else if (preset === 'Forest') {
    lightColor = '#e8f5e9';
    rimColor = '#81c784';
  } else if (preset === 'Ocean') {
    lightColor = '#e0f7fa';
    rimColor = '#4dd0e1';
  } else if (preset === 'Lavender' || preset === 'Dream') {
    lightColor = '#f3e5f5';
    rimColor = '#ce93d8';
  }

  let envPreset: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby' = 'city';
  if (theme === 'Night' || theme === 'Space') envPreset = 'night';
  else if (theme === 'Sunrise') envPreset = 'dawn';
  else if (theme === 'Garden') envPreset = 'forest';
  else if (theme === 'Minimal') envPreset = 'studio';
  else if (theme === 'Dream') envPreset = 'park';

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={lightColor} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={dirIntensity}
        color={lightColor}
        castShadow={!isLowQuality}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      {/* Rim Light for object depth */}
      <pointLight position={[-5, 2, -5]} intensity={1.5} color={rimColor} distance={20} />
      {/* Fill Light */}
      <pointLight position={[0, 5, 5]} intensity={0.5} color={lightColor} distance={15} />
      
      {!isLowQuality && <Environment preset={envPreset} environmentIntensity={0.2} />}
    </>
  );
}

// Reusing StylizedTree, StylizedMountain, GenericObject from previous iteration but optimized
function StylizedTree({ scale = 1, isBonsai = false, growth = 0, isCalmMode = false }: { scale?: number, isBonsai?: boolean, growth?: number, isCalmMode?: boolean }) {
  const leavesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (leavesRef.current) {
      const windSpeed = isCalmMode ? 0.2 : 0.5;
      const windSway = isCalmMode ? 0.02 : 0.05;
      leavesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * windSpeed) * windSway;
      leavesRef.current.rotation.z = Math.cos(state.clock.elapsedTime * (windSpeed * 0.6)) * (windSway * 0.4);
    }
  });

  const trunkColor = isBonsai ? "#3e2723" : "#4e342e";
  const leafColor = isBonsai ? "#2e7d32" : "#388e3c";

  const growthScale = 1 + (growth / 100) * 0.5;
  const extraLeaves = Math.floor(growth / 20);

  return (
    <group scale={scale * growthScale}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[isBonsai ? 0.3 : 0.4, 0.6, 3, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={1} />
      </mesh>

      {/* Leaves/Canopy */}
      <group ref={leavesRef} position={[0, 3.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <icosahedronGeometry args={[isBonsai ? 1.5 : 2, 1]} />
          <meshStandardMaterial color={leafColor} roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[1, -0.5, 0.5]} scale={0.7}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={leafColor} roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[-1, -0.2, -0.5]} scale={0.8}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={leafColor} roughness={0.8} />
        </mesh>
        
        {extraLeaves > 0 && (
           <mesh castShadow receiveShadow position={[0, 1.2, 0]} scale={0.6}>
             <icosahedronGeometry args={[1.5, 1]} />
             <meshStandardMaterial color={leafColor} roughness={0.8} />
           </mesh>
        )}
        {extraLeaves > 1 && (
           <mesh castShadow receiveShadow position={[-1.2, 0.5, 0.5]} scale={0.5}>
             <icosahedronGeometry args={[1.5, 1]} />
             <meshStandardMaterial color={leafColor} roughness={0.8} />
           </mesh>
        )}
        {extraLeaves > 2 && (
           <mesh castShadow receiveShadow position={[1.2, 0.5, -0.5]} scale={0.5}>
             <icosahedronGeometry args={[1.5, 1]} />
             <meshStandardMaterial color={leafColor} roughness={0.8} />
           </mesh>
        )}
      </group>
    </group>
  );
}

function StylizedMountain({ growth = 0 }: { growth?: number }) {
  const snowScale = 1.1 + (growth / 100) * 0.4;
  
  return (
    <group>
      {/* Foothills */}
      <mesh castShadow receiveShadow position={[2, 1, 1]} rotation={[0, Math.PI/4, 0]}>
        <coneGeometry args={[1.5, 2, 4]} />
        <meshStandardMaterial color="#263238" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.5, 1.25, 1.5]} rotation={[0, Math.PI/3, 0]}>
        <coneGeometry args={[1.8, 2.5, 4]} />
        <meshStandardMaterial color="#263238" roughness={0.9} flatShading />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <coneGeometry args={[3, 4, 8]} />
        <meshStandardMaterial color="#37474f" roughness={0.9} flatShading />
      </mesh>
      
      <mesh castShadow receiveShadow position={[0, 4 - (snowScale * 0.8), 0]} scale={[1, snowScale, 1]}>
        <coneGeometry args={[1.1, 1.6, 8]} />
        <meshStandardMaterial color="#eceff1" roughness={0.5} flatShading />
      </mesh>
    </group>
  );
}

function GenericObject({ name, growth = 0 }: { name: string, growth?: number }) {
  const growthScale = 1 + (growth / 100) * 0.3;
  return (
    <group scale={growthScale}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#b0bec5" roughness={0.3} metalness={0.4} wireframe />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.8 + (growth / 100) * 0.4, 0]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2 + (growth / 100) * 0.5} />
        </mesh>
      </Float>
    </group>
  );
}

function CustomParticles({ count, color, isCalmMode }: { count: number, color: string, isCalmMode: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * (isCalmMode ? 1.5 : 3.0) + 0.5;
    }
    return { positions, sizes };
  }, [count, isCalmMode]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), []);

  // Update color dynamically when theme changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(color);
    }
  }, [color]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * (isCalmMode ? 0.2 : 0.5);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.positions.length / 3}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particlesPosition.sizes.length}
          array={particlesPosition.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          attribute float size;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            // Gentle floating motion
            pos.y += sin(uTime + pos.x * 2.0) * 0.2;
            pos.x += cos(uTime + pos.y * 2.0) * 0.1;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (15.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            // Fade particles based on distance
            vAlpha = smoothstep(10.0, 1.0, -mvPosition.z) * 0.6;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            // Soft circular particle shape
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Soft edge fading radially
            float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}

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
