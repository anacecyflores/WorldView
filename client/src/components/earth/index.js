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

import historyArr from './events';

import EarthDayMap from '../../assets/textures/8k_earth_daymap.jpg';
import EarthNormalMap from '../../assets/textures/8k_earth_normal_map.jpg';
import EarthSpecularMap from '../../assets/textures/8k_earth_specular_map.jpg';
import EarthCloudsMap from '../../assets/textures/8k_earth_clouds.jpg';

export function Earth(props) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
  );

  //north/east are positive and west/south are negative
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
    // console.log(wEvent.location);

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
            width: '18rem',
          }}
        >
          <div className="card">
            <div className="card-body">
              <div className="card-title">{wEvent.header}</div>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
            </div>
          </div>
        </Html>
        <sphereGeometry args={[0.01, 20, 20]} />
        <meshBasicMaterial color={hovered ? 'red' : 'orange'} />
      </mesh>
    );
  }

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

  let worldEvents = historyArr;

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
      <mesh>
        <sphereGeometry args={[1.005, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.3}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* <Bounds fit clip observe margin={6.5}>
        <SelectToZoom> */}
      {/* coordinates */}
      {worldEvents.map((w) => createMesh(w))}
      {/* </SelectToZoom>
      </Bounds> */}

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
