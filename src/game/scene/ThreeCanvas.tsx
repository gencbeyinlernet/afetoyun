import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  BUILDINGS, 
  MAP_WIDTH, 
  MAP_HEIGHT, 
  getTileElevation, 
  isRiverTile, 
  isRoadTile, 
  RIVER_TILES,
  HAZARD_ZONES 
} from '../../data/mapData';
import { 
  createKaradenizHouse, 
  createModernHouse, 
  createSchoolBuilding, 
  createHospitalBuilding, 
  createShopBuilding, 
  createGatheringAreaMarker, 
  createConcreteBridge, 
  createWoodenBridge, 
  createSlopeCrackMarker, 
  createCloggedDrain, 
  createPineTree, 
  Materials 
} from './ProceduralModels';
import { WeatherSystem } from './WeatherSystem';
import { soundEngine } from '../audio';
import { MapBuilding, WeatherState } from '../../types/game';

interface ThreeCanvasProps {
  weather: WeatherState;
  riverLevel: number; // 0 to 1
  selectedBuildingId: string | null;
  activeLayers: {
    floodRisk: boolean;
    landslideRisk: boolean;
    closedRoads: boolean;
    safeRoutes: boolean;
  };
  onSelectBuilding: (building: MapBuilding) => void;
  onTileHover?: (x: number, y: number, name: string | null) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  weather,
  riverLevel,
  selectedBuildingId,
  activeLayers = { floodRisk: true, landslideRisk: true, closedRoads: true, safeRoutes: false },
  onSelectBuilding,
  onTileHover,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const weatherSystemRef = useRef<WeatherSystem | null>(null);
  const riverWaterGroupRef = useRef<THREE.Group | null>(null);
  const woodenBridgeGroupRef = useRef<THREE.Group | null>(null);
  const selectionRingRef = useRef<THREE.Mesh | null>(null);
  const hazardOverlaysGroupRef = useRef<THREE.Group | null>(null);
  const safeRouteOverlaysGroupRef = useRef<THREE.Group | null>(null);

  // Keep references to interactive meshes for raycasting
  const interactiveObjectsRef = useRef<{ mesh: THREE.Object3D; building: MapBuilding }[]>([]);

  // Camera pan / zoom mutable state
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraZoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe);
    // Disable fog so isometric tiles and low poly models are razor-sharp
    scene.fog = null;
    sceneRef.current = scene;

    // 2. Camera (Orthographic Isometric view)
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const frustumSize = 40;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      600
    );

    // Standard isometric camera angle (45° azimuth, 35.26° elevation)
    const distance = 45;
    camera.position.set(distance, distance, distance);
    camera.lookAt(0, 0, 0);
    camera.zoom = 1.0;
    camera.updateProjectionMatrix();
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment lighting (RoomEnvironment PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Hemisphere Light (sky / ground bounce)
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x488b39, 0.8);
    scene.add(hemiLight);

    // Weather system
    const weatherSys = new WeatherSystem(scene, dirLight, hemiLight);
    weatherSys.setWeather(weather);
    weatherSystemRef.current = weatherSys;

    // 4. Construct 40x30 Isometric Terrain
    const terrainGroup = new THREE.Group();
    const halfW = MAP_WIDTH / 2;
    const halfH = MAP_HEIGHT / 2;

    // Tile geometry reusable
    const tileGeo = new THREE.BoxGeometry(0.96, 0.4, 0.96);

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const posX = x - halfW;
        const posZ = y - halfH;
        const elev = getTileElevation(x, y);

        let mat = Materials.grass;
        if (isRiverTile(x, y)) {
          mat = Materials.riverWater;
        } else if (isRoadTile(x, y)) {
          mat = Materials.roadAsphalt;
        } else if (y < 4 && x > 15) {
          mat = Materials.teaBush; // Karadeniz tea plantations on upper hills
        } else if (elev > 1.2) {
          mat = Materials.slopeRock;
        }

        const tileMesh = new THREE.Mesh(tileGeo, mat);
        tileMesh.position.set(posX, elev, posZ);
        tileMesh.receiveShadow = true;
        if (elev > 0.5) tileMesh.castShadow = true;

        // Custom metadata for raycast
        tileMesh.userData = { tileX: x, tileY: y, isTile: true };
        terrainGroup.add(tileMesh);
      }
    }
    scene.add(terrainGroup);

    // 5. River Water Meshes (only on river tiles, with dynamic height)
    const riverWaterGroup = new THREE.Group();
    const riverTileGeo = new THREE.BoxGeometry(0.96, 0.35, 0.96);
    RIVER_TILES.forEach(t => {
      const rw = new THREE.Mesh(riverTileGeo, Materials.riverWater);
      rw.position.set(t.x - halfW, -0.15, t.y - halfH);
      riverWaterGroup.add(rw);
    });
    scene.add(riverWaterGroup);
    riverWaterGroupRef.current = riverWaterGroup;

    // 6. Hazard & Safe Route Overlays Group
    const hazardGroup = new THREE.Group();
    scene.add(hazardGroup);
    hazardOverlaysGroupRef.current = hazardGroup;

    const safeGroup = new THREE.Group();
    scene.add(safeGroup);
    safeRouteOverlaysGroupRef.current = safeGroup;

    // 7. Populate Buildings & Interactive Entities
    const buildingsGroup = new THREE.Group();
    const interactiveList: { mesh: THREE.Object3D; building: MapBuilding }[] = [];

    BUILDINGS.forEach((bld) => {
      const posX = bld.tileX - halfW;
      const posZ = bld.tileY - halfH;
      const elev = getTileElevation(bld.tileX, bld.tileY) + 0.2;

      let model: THREE.Group;
      if (bld.type === 'school') {
        model = createSchoolBuilding();
      } else if (bld.type === 'hospital') {
        model = createHospitalBuilding();
      } else if (bld.type === 'market') {
        model = createShopBuilding('market');
      } else if (bld.type === 'pharmacy') {
        model = createShopBuilding('pharmacy');
      } else if (bld.type === 'gathering_area') {
        model = createGatheringAreaMarker(bld.name);
      } else if (bld.type === 'bridge') {
        if (bld.id === 'bld_north_bridge') {
          model = createWoodenBridge(false);
          woodenBridgeGroupRef.current = model;
        } else {
          model = createConcreteBridge();
        }
      } else if (bld.id === 'bld_crack_slope') {
        model = createSlopeCrackMarker();
      } else if (bld.id === 'bld_drain_clogged') {
        model = createCloggedDrain();
      } else if (bld.type === 'karadeniz_house') {
        model = createKaradenizHouse();
      } else {
        model = createModernHouse();
      }

      model.position.set(posX, elev, posZ);
      model.userData = { building: bld };

      // Make all children carry reference for raycaster
      model.traverse((child) => {
        child.userData = { building: bld };
      });

      buildingsGroup.add(model);
      interactiveList.push({ mesh: model, building: bld });
    });

    scene.add(buildingsGroup);
    interactiveObjectsRef.current = interactiveList;

    // 8. Instanced Pine Trees on Slopes & Mountain Ridges
    const treeGroup = new THREE.Group();
    // Scatter ~120 pine trees naturally on high slopes and ridges
    for (let i = 0; i < 110; i++) {
      const tx = Math.floor(Math.random() * MAP_WIDTH);
      const ty = Math.floor(Math.random() * MAP_HEIGHT);
      if (isRiverTile(tx, ty) || isRoadTile(tx, ty)) continue;
      const elev = getTileElevation(tx, ty);
      // Place mostly on mountains or hill fringes
      if (elev > 0.6 || (tx > 30 && ty > 15)) {
        const tree = createPineTree(0.75 + Math.random() * 0.45);
        tree.position.set(tx - halfW + (Math.random() - 0.5) * 0.4, elev + 0.2, ty - halfH + (Math.random() - 0.5) * 0.4);
        tree.rotation.y = Math.random() * Math.PI * 2;
        treeGroup.add(tree);
      }
    }
    scene.add(treeGroup);

    // 9. Selection Indicator Ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const selectionRing = new THREE.Mesh(ringGeo, ringMat);
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.visible = false;
    scene.add(selectionRing);
    selectionRingRef.current = selectionRing;

    // 10. Animation Loop with Software WebGL pacing
    let frameId = 0;
    let timerId = 0;
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        const syncState = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (syncState === gl.UNSIGNALED) {
          timerId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timerId = window.setTimeout(cb, 60);
        }
      };
      timerId = window.setTimeout(poll, 5);
    };

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update weather particles
      weatherSys.update(delta);

      // Smooth camera position lerping towards target
      const targetPos = new THREE.Vector3(
        cameraTargetRef.current.x + distance,
        cameraTargetRef.current.y + distance,
        cameraTargetRef.current.z + distance
      );
      camera.position.lerp(targetPos, 0.12);
      camera.lookAt(cameraTargetRef.current);

      // Selection ring gentle breathing animation
      if (selectionRing.visible) {
        const s = 1 + Math.sin(time * 0.005) * 0.08;
        selectionRing.scale.set(s, s, s);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(() => animate(performance.now()));
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      animate(performance.now());
    } else {
      frameId = requestAnimationFrame(animate);
    }

    // Handle Window Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      const newAspect = w / h;
      cameraRef.current.left = (-frustumSize * newAspect) / 2;
      cameraRef.current.right = (frustumSize * newAspect) / 2;
      cameraRef.current.top = frustumSize / 2;
      cameraRef.current.bottom = -frustumSize / 2;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
      if (rendererRef.current && rendererRef.current.domElement) {
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update Weather & Sound dynamically
  useEffect(() => {
    if (weatherSystemRef.current) {
      weatherSystemRef.current.setWeather(weather);
      soundEngine.updateWeatherSound(weather);
    }
  }, [weather]);

  // Update River water level and Bridge closure
  useEffect(() => {
    if (riverWaterGroupRef.current) {
      // Dynamic water rising along river bed
      riverWaterGroupRef.current.position.y = riverLevel * 0.45;
    }

    // In Chapter 4+ when riverLevel >= 0.7, update North wooden bridge to show closure barrier
    if (woodenBridgeGroupRef.current) {
      const isClosed = riverLevel >= 0.7;
      // Re-create or toggle closed barrier
      const existingBarrier = woodenBridgeGroupRef.current.children.find(c => c.position.y > 0.5);
      if (isClosed && !existingBarrier) {
        const barrierGeo = new THREE.BoxGeometry(1.2, 0.3, 0.08);
        const barrierMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
        const barrier = new THREE.Mesh(barrierGeo, barrierMat);
        barrier.position.set(0, 0.55, 1.15);
        woodenBridgeGroupRef.current.add(barrier);
      } else if (!isClosed && existingBarrier) {
        woodenBridgeGroupRef.current.remove(existingBarrier);
      }
    }
  }, [riverLevel]);

  // Update Hazard & Safe Route Overlays
  useEffect(() => {
    if (!hazardOverlaysGroupRef.current || !safeRouteOverlaysGroupRef.current) return;

    // Clear old overlays
    while (hazardOverlaysGroupRef.current.children.length > 0) {
      hazardOverlaysGroupRef.current.remove(hazardOverlaysGroupRef.current.children[0]);
    }
    while (safeRouteOverlaysGroupRef.current.children.length > 0) {
      safeRouteOverlaysGroupRef.current.remove(safeRouteOverlaysGroupRef.current.children[0]);
    }

    const halfW = MAP_WIDTH / 2;
    const halfH = MAP_HEIGHT / 2;
    const overlayGeo = new THREE.BoxGeometry(0.98, 0.06, 0.98);

    // Flood Risk Layer
    if (activeLayers?.floodRisk) {
      const floodMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45 });
      HAZARD_ZONES.filter(hz => hz.type === 'flood').forEach(hz => {
        hz.coordinates.forEach(c => {
          const m = new THREE.Mesh(overlayGeo, floodMat);
          m.position.set(c.x - halfW, getTileElevation(c.x, c.y) + 0.22, c.y - halfH);
          hazardOverlaysGroupRef.current?.add(m);
        });
      });
    }

    // Landslide Risk Layer
    if (activeLayers?.landslideRisk) {
      const lsMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.55 });
      HAZARD_ZONES.filter(hz => hz.type === 'landslide').forEach(hz => {
        hz.coordinates.forEach(c => {
          const m = new THREE.Mesh(overlayGeo, lsMat);
          m.position.set(c.x - halfW, getTileElevation(c.x, c.y) + 0.22, c.y - halfH);
          hazardOverlaysGroupRef.current?.add(m);
        });
      });
    }

    // Closed Roads Layer
    if (activeLayers?.closedRoads) {
      const closedMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c, transparent: true, opacity: 0.75 });
      HAZARD_ZONES.filter(hz => hz.type === 'blocked_road').forEach(hz => {
        hz.coordinates.forEach(c => {
          const m = new THREE.Mesh(overlayGeo, closedMat);
          m.position.set(c.x - halfW, getTileElevation(c.x, c.y) + 0.35, c.y - halfH);
          hazardOverlaysGroupRef.current?.add(m);
        });
      });
    }

    // Safe Routes Layer (Green verified highway to gathering area)
    if (activeLayers?.safeRoutes) {
      const safeMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.55 });
      // Highlights safe arterial road across South Bridge to West Gathering Area
      for (let x = 4; x <= 28; x++) {
        const m = new THREE.Mesh(overlayGeo, safeMat);
        m.position.set(x - halfW, getTileElevation(x, 18) + 0.24, 18 - halfH);
        safeRouteOverlaysGroupRef.current?.add(m);
      }
    }
  }, [activeLayers]);

  // Update Selection Ring when selectedBuildingId changes
  useEffect(() => {
    if (!selectionRingRef.current) return;

    if (selectedBuildingId) {
      const bld = BUILDINGS.find(b => b.id === selectedBuildingId);
      if (bld) {
        const halfW = MAP_WIDTH / 2;
        const halfH = MAP_HEIGHT / 2;
        const posX = bld.tileX - halfW;
        const posZ = bld.tileY - halfH;
        const elev = getTileElevation(bld.tileX, bld.tileY) + 0.24;

        selectionRingRef.current.position.set(posX, elev, posZ);
        selectionRingRef.current.visible = true;

        // Smoothly focus camera towards selected object
        cameraTargetRef.current.set(posX, elev, posZ);
        return;
      }
    }
    selectionRingRef.current.visible = false;
  }, [selectedBuildingId]);

  // Mouse & Touch Controls: Pan, Zoom, and Raycast Selection
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current && cameraRef.current) {
      const dx = (e.clientX - dragStartRef.current.x) * 0.05;
      const dy = (e.clientY - dragStartRef.current.y) * 0.05;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      // In 45 degree isometric perspective, screen X moves along (X - Z) axis, screen Y moves along (X + Z) axis
      cameraTargetRef.current.x -= (dx - dy) * 0.7;
      cameraTargetRef.current.z += (dx + dy) * 0.7;

      // Restrict camera bounds
      cameraTargetRef.current.x = Math.max(-18, Math.min(18, cameraTargetRef.current.x));
      cameraTargetRef.current.z = Math.max(-14, Math.min(14, cameraTargetRef.current.z));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // If it was a small movement, consider it a Click for Raycasting selection
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);

    if (dx < 6 && dy < 6 && cameraRef.current && sceneRef.current && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr) {
          if (curr.userData && curr.userData.building) {
            const bld = curr.userData.building as MapBuilding;
            soundEngine.playInspect();
            onSelectBuilding(bld);
            return;
          }
          curr = curr.parent;
        }
      }
    }

    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.max(0.6, Math.min(2.5, cameraRef.current.zoom * zoomFactor));
    cameraRef.current.zoom = newZoom;
    cameraZoomRef.current = newZoom;
    cameraRef.current.updateProjectionMatrix();
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    />
  );
};
