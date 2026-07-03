import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus, Environment, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Play, Sparkles, Zap, Globe, Code, Rocket } from 'lucide-react';
import { GlassCard } from '@pv/ui';

// 3D Floating Globe Component
function FloatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[2, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Floating Cubes Component
function FloatingCubes() {
  const cubes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    ] as [number, number, number],
    scale: Math.random() * 0.5 + 0.3,
    color: i % 2 === 0 ? '#06b6d4' : '#a855f7',
  }));

  return (
    <>
      {cubes.map((cube) => (
        <Float key={cube.id} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <Box position={cube.position} scale={cube.scale}>
            <meshStandardMaterial
              color={cube.color}
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.6}
            />
          </Box>
        </Float>
      ))}
    </>
  );
}

// Interactive Nodes Component
function InteractiveNodes() {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
    ] as [number, number, number],
  }));

  return (
    <>
      {nodes.map((node) => (
        <Float key={node.id} speed={2} floatIntensity={1.5}>
          <Torus position={node.position} args={[0.2, 0.05, 16, 32]}>
            <meshStandardMaterial
              color="#22d3ee"
              roughness={0.2}
              metalness={0.9}
              emissive="#22d3ee"
              emissiveIntensity={0.5}
            />
          </Torus>
        </Float>
      ))}
    </>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      
      <FloatingGlobe />
      <FloatingCubes />
      <InteractiveNodes />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}</span>;
}

// Main Landing Page Component
export default function LandingPage({ onEnter }: { onEnter?: () => void } = {}) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-black/80 z-10" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            PV Platform
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          {['Features', 'Applications', 'Pricing', 'About'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: [0, 100, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            Your Personal Operating System
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Portfolio, Career, CRM, Learning, Finance, AI Studio, BuildHub — all in one powerful platform.
            Built for creators, developers, and entrepreneurs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={onEnter}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Enter Mission Control
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-semibold text-lg flex items-center gap-2"
            >
              <Globe className="w-5 h-5" />
              Explore Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10"
        >
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </motion.section>

      {/* Live Statistics Section */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Active Users', value: 10000, suffix: '+' },
              { label: 'Projects Built', value: 50000, suffix: '+' },
              { label: 'AI Interactions', value: 1000000, suffix: '+' },
              { label: 'Uptime', value: 99.9, suffix: '%' },
            ].map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                  <AnimatedCounter end={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            Powerful Applications
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Rocket className="w-12 h-12 text-cyan-400" />,
                title: 'Mission Control',
                description: 'Your personal dashboard with AI-powered insights and real-time analytics',
              },
              {
                icon: <Code className="w-12 h-12 text-purple-400" />,
                title: 'BuildHub',
                description: 'Build and deploy software with AI assistance and GitHub integration',
              },
              {
                icon: <Zap className="w-12 h-12 text-yellow-400" />,
                title: 'AI Studio',
                description: 'Chat with AI, generate content, and automate workflows',
              },
              {
                icon: <Globe className="w-12 h-12 text-green-400" />,
                title: 'Portfolio',
                description: 'Dynamic portfolio with projects, skills, and achievements',
              },
              {
                icon: <Sparkles className="w-12 h-12 text-pink-400" />,
                title: 'Career',
                description: 'Track applications, manage resume, and advance your career',
              },
              {
                icon: <Code className="w-12 h-12 text-blue-400" />,
                title: 'CRM',
                description: 'Manage leads, clients, and business relationships',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-8 h-full">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard glow className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators, developers, and entrepreneurs already using PV Platform
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg"
            >
              Get Started Free
            </motion.button>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 PV Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}