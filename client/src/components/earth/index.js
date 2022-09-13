import React, { useRef, useState, useEffect } from 'react';
//eslint-disable-next-line
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import {
  OrbitControls,
  Stars,
  Html,
  Bounds,
  useBounds,
} from '@react-three/drei';
import * as THREE from 'three';
import Card from 'react-bootstrap/Card';

import history18 from './era18';
import history19 from './era19';
import history20 from './era20';

import EarthDayMap from '../../assets/textures/8k_earth_daymap.jpg';
import EarthNormalMap from '../../assets/textures/8k_earth_normal_map.jpg';
import EarthSpecularMap from '../../assets/textures/8k_earth_specular_map.jpg';
import EarthCloudsMap from '../../assets/textures/8k_earth_clouds.jpg';
import { Button } from 'antd';

export function Earth(props) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
  );

  let worldEvents18 = history18;
  let worldEvents19 = history19;
  let worldEvents20 = history20;

  //formula to convert coordinates to display accurately on a sphere
  function convertLatLngToCortesian(p) {
    let phi = (90 - p.lat) * (Math.PI / 180);
    let theta = (p.lng + 180) * (Math.PI / 180);

    let x = -(Math.sin(phi) * Math.cos(theta));
    let y = Math.sin(phi) * Math.sin(theta);
    let z = Math.cos(phi);
    // console.log(x, z, y);
    return {
      x,
      y,
      z,
    };
  }

  function createMesh(wEvent) {
    var pos = convertLatLngToCortesian(wEvent);

    //eslint-disable-next-line
    const coordRef = useRef();
    //eslint-disable-next-line
    const [hovered, setHover] = useState(false);
    //eslint-disable-next-line
    const [active, setActive] = useState(false);

    //eslint-disable-next-line
    useEffect(() => {
      document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    return (
      <mesh
        key={wEvent.header}
        ref={coordRef}
        {...props}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
        }}
        position={[pos.x, pos.z, pos.y]}
        userData={wEvent}
      >
        <Html
          scaleFactor={6}
          style={{
            pointerEvents: 'none',
            display: hovered ? 'block' : 'none',
            color: 'black',
            backgroundColor: 'black',
            width: '20rem',
            
          }}
        >
          <div className="card">
            <div className="card-body">
              <div className="text-bold card-title">{wEvent.header}</div>
              <p className="card-text font-weight-bold">
                <strong>{wEvent.location}</strong> <br></br> {wEvent.date}
              </p>
              <button className="btn btn-success mb-2" href={wEvent.link}>
                Learn More
              </button>
              <br></br>
              <button type="button" className="btn btn-primary">Save Moment</button>
            </div>
          </div>
        </Html>
        <sphereGeometry args={[0.01, 20, 20]} />
        <meshBasicMaterial color={hovered ? 'green' : 'orange'} />
      </mesh>
    );
  }

  //click to zoom function
  function SelectToZoom({ children }) {
    const api = useBounds();
    return (
      <group
        onClick={(e) => (
          e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
        )}
        onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
      >
        {children}
      </group>
    );
  }

  const cloudRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    cloudRef.current.rotation.y = elapsedTime / 40;
  });

  return (
    <>
      {/* light from all directions */}
      <ambientLight intensity={2} />

      {/* stars background effect */}
      <Stars
        radius={300}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />

      {/* cloud wrapper */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.005, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.3}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Bounds fit clip observe margin={6.5}>
        <SelectToZoom>
          {/* coordinates */}
          {worldEvents20.map((w) => createMesh(w))}
        </SelectToZoom>
      </Bounds>

      {/* earth wrapper */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.7}
        />

        {/* click and rotate earth controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotationSpeed={0.4}
        />
      </mesh>
    </>
  );
}
