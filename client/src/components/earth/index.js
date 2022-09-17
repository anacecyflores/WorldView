import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SAVE_MOMENT } from '../../utils/mutations';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useMutation,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
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

import history18 from './era18';
import history19 from './era19';
import history20 from './era20';

import EarthDayMap from '../../assets/textures/8k_earth_daymap.jpg';
import EarthNormalMap from '../../assets/textures/8k_earth_normal_map.jpg';
import EarthSpecularMap from '../../assets/textures/8k_earth_specular_map.jpg';
import EarthCloudsMap from '../../assets/textures/8k_earth_clouds.jpg';
import { AutoComplete } from 'antd';

export function Earth(props) {
  //-------APOLLO-------
  const httpLink = createHttpLink({
    uri: '/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  //-------APOLLO-------

  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
  );

  //eslint-disable-next-line
  let worldEvents18 = history18;
  //eslint-disable-next-line
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

    //save event using graphql

    //eslint-disable-next-line
    const [momentId, setid] = useState(false);
    //eslint-disable-next-line
    const [header, setheader] = useState(false);
    //eslint-disable-next-line
    const [location, setlocation] = useState(false);
    //eslint-disable-next-line
    const [date, setdate] = useState(false);
    //eslint-disable-next-line
    const [summary, setsummary] = useState(false);
    //eslint-disable-next-line
    const [lat, setlat] = useState(false);
    //eslint-disable-next-line
    const [lng, setlng] = useState(false);
    //eslint-disable-next-line
    const [link, setlink] = useState(false);

    //eslint-disable-next-line
    const [saveMoment, { error }] = useMutation(SAVE_MOMENT);

    const addEvent = () => {
      let historyData = {
        momentId: wEvent.id,
        header: wEvent.header,
        location: wEvent.location,
        date: wEvent.date,
        summary: wEvent.summary,
        lat: wEvent.lat,
        lng: wEvent.lng,
        link: wEvent.link,
      };

      localStorage.setItem('historyKey', JSON.stringify(historyData));

      // saveMoment({
      //   variables: {
      //     momentId: wEvent.id,
      //     header: wEvent.header,
      //     location: wEvent.location,
      //     date: wEvent.date,
      //     summary: wEvent.summary,
      //     lat: wEvent.lat,
      //     lng: wEvent.lng,
      //     link: wEvent.link,
      //   },
      // });

      // if (error) {
      //   console.log(error);
      // }
    };

    return (
      <mesh
        key={wEvent.header}
        ref={coordRef}
        {...props}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        // onPointerLeave={(e) => {
        //   e.stopPropagation();
        //   setHover(false);
        // }}
        // onPointerOver={(e) => {
        //   e.stopPropagation();
        //   setHover(true);
        // }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
        }}
        // onDoubleClick={(e) => (e.stopPropagation(), setActive(true))}
        onClick={(e) => (e.stopPropagation(), setActive(true))}
        // onPointerMissed={(e) => setActive(false)}
        position={[pos.x, pos.z, pos.y]}
        userData={wEvent}
      >
        <Html
          scaleFactor={6}
          style={{
            pointerEvents: 'none',
            display: hovered ? 'block' : 'none',
            color: 'black',
            backgroundColor: 'white',
            width: '12rem',
            fontSize: '11px',
          }}
        >
          <div className="card">
            <div className="card-body">
              <div className="text-bold card-title">
                {wEvent.header}
                <br></br>
                <strong>{wEvent.location}</strong>
              </div>
            </div>
          </div>
        </Html>
        <Html
          scaleFactor={8}
          style={{
            display: active ? 'block' : 'none',
            color: 'black',
            width: '20rem',
            fontSize: '11px',
          }}
          location={wEvent.link}
        >
          <div className="card">
            <div className="card-body">
              <div className="text-bold card-title">{wEvent.header}</div>
              <div className="mb-2">
                <strong>{wEvent.location}</strong> {wEvent.date}
              </div>
              <p className="small-font-size">{wEvent.summary}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addEvent()}
              >
                Save Event
              </button>
              <a
                className="btn btn-success"
                href={wEvent.link}
                rel="noreferrer"
                target={'_blank'}
              >
                Learn More
              </a>
              <button
                type="button"
                className="btn btn-warning"
                onClick={(e) => (
                  e.stopPropagation(), setActive(false), setHover(false)
                )}
              >
                Close Event
              </button>
            </div>
          </div>
        </Html>
        <sphereGeometry args={[0.01, 20, 20]} />
        <meshBasicMaterial color={hovered ? 'green' : 'orange'} />
      </mesh>
    );
  }

  function SelectToZoom({ children }) {
    const api = useBounds();
    //eslint-disable-next-line
    // const [active, setActive] = useState(false);
    return (
      <group
        onClick={(e) => (
          e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
          // setActive(true)
        )}
        // onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
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
      {/* <ApolloProvider client={client}> */}
      {/* light from all directions */}
      <ambientLight intensity={2} />

      {/* stars background effect */}
      <Stars
        radius={50}
        depth={5}
        count={20000}
        factor={2}
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

      <Bounds fit clip observe margin={0.9}>
        <SelectToZoom>
          {/* coordinates */}
          {worldEvents18.map((w) => createMesh(w))}
          {worldEvents19.map((w) => createMesh(w))}
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
          zoomSpeed={0.8}
          panSpeed={0.5}
          rotationSpeed={0.4}
        />
      </mesh>
      {/* </ApolloProvider> */}
    </>
  );
}
