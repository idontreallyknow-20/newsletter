'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { TorusKnot } from 'three/examples/jsm/curves/CurveExtras.js'

/**
 * A chrome ribbon that carries the newsletter's own headlines as a scrolling
 * ticker. Procedural geometry: a flat strip extruded along a torus-knot curve.
 */
function ribbonGeometry(width: number, segments = 900): THREE.BufferGeometry {
  const curve = new TorusKnot(1)
  const frames = curve.computeFrenetFrames(segments, true)
  const positions: number[] = []
  const uvs: number[] = []
  const normals: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const p = curve.getPointAt(t)
    const b = frames.binormals[i].clone().multiplyScalar(width / 2)
    const n = frames.normals[i]
    const a = p.clone().add(b), c = p.clone().sub(b)
    positions.push(a.x, a.y, a.z, c.x, c.y, c.z)
    normals.push(n.x, n.y, n.z, n.x, n.y, n.z)
    uvs.push(t * 3, 0, t * 3, 1)
    if (i < segments) {
      const k = i * 2
      indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  g.setIndex(indices)
  g.computeBoundingSphere()
  return g
}

function headlineTexture(lines: string[]): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 8192; c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#E7E9E6'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = '#0C0E14'
  ctx.font = '700 150px "Arial Narrow", "Helvetica Neue Condensed", Impact, sans-serif'
  ctx.textBaseline = 'middle'
  // Short, punchy fragments read better on a curved strip than full titles.
  const fragments = ['DAILY BRIEF', ...lines.map(l => l.split(/[:.?]/)[0].trim().toUpperCase()).filter(l => l.length > 3 && l.length < 48), 'ECONOMICS AND AI, BEFORE SCHOOL']
  let x = 40
  let i = 0
  while (x < c.width) {
    const t = fragments[i % fragments.length]
    ctx.fillStyle = '#0C0E14'
    ctx.fillText(t, x, c.height / 2 + 6)
    x += ctx.measureText(t).width + 70
    ctx.fillStyle = '#FF5A1F'
    ctx.beginPath(); ctx.arc(x, c.height / 2 + 4, 14, 0, Math.PI * 2); ctx.fill()
    x += 70
    i++
  }
  ctx.fillStyle = '#FF5A1F'
  ctx.fillRect(0, 0, c.width, 10); ctx.fillRect(0, c.height - 10, c.width, 10)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Ribbon({ lines }: { lines: string[] }) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => ribbonGeometry(0.5), [])
  const texture = useMemo(() => headlineTexture(lines), [lines])
  const target = useRef({ x: 0, y: 0 })
  const { size } = useThree()

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const scroll = typeof window !== 'undefined' ? window.scrollY / Math.max(1, window.innerHeight) : 0
    g.rotation.y += dt * 0.12
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.35 + target.current.y * 0.18 + scroll * 0.9, 3, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.25 + target.current.x * 0.12, 3, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.sin(t * 0.6) * 0.08 - scroll * 1.6, 3, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, target.current.x * 0.12, 3, dt)
    texture.offset.x -= dt * 0.045
  })

  const scale = size.width < 700 ? 0.58 : 0.7

  return (
    <group ref={group} scale={scale}>
      <mesh ref={mesh} geometry={geometry} castShadow={false}>
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.3}
          envMapIntensity={1.6}
          color="#ffffff"
        />
      </mesh>
    </group>
  )
}

function Scene({ lines }: { lines: string[] }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-6, -2, 3]} intensity={1.1} color="#FF5A1F" />
      <directionalLight position={[2, -5, -3]} intensity={0.9} color="#7C93FF" />
      <Ribbon lines={lines} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={6} color="#E7E9E6" position={[0, 4, -4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={4} color="#FF5A1F" position={[-5, 1, 3]} scale={[2, 6, 1]} rotation={[0, Math.PI / 3, 0]} />
        <Lightformer form="ring" intensity={3} color="#7C93FF" position={[5, -2, 2]} scale={4} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} />
      </Environment>
    </>
  )
}

export default function TickerRibbon({ lines }: { lines: string[] }) {
  const [dpr, setDpr] = useState(1.5)
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6.4], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0) }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} flipflops={2} />
      <Scene lines={lines} />
    </Canvas>
  )
}
