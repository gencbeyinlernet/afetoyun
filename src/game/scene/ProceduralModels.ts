import * as THREE from 'three';

// Reusable shared materials for performance and low memory footprint
export const Materials = {
  grass: new THREE.MeshStandardMaterial({
    color: 0x488b39,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  }),
  slopeRock: new THREE.MeshStandardMaterial({
    color: 0x5c6954,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true,
  }),
  teaBush: new THREE.MeshStandardMaterial({
    color: 0x2e6629,
    roughness: 0.8,
    metalness: 0.0,
    flatShading: true,
  }),
  riverWater: new THREE.MeshStandardMaterial({
    color: 0x3d9ab0,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
  }),
  floodWater: new THREE.MeshStandardMaterial({
    color: 0x6e6347, // muddy brown flood water
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.92,
  }),
  roadAsphalt: new THREE.MeshStandardMaterial({
    color: 0x374151,
    roughness: 0.85,
    metalness: 0.15,
  }),
  woodTimber: new THREE.MeshStandardMaterial({
    color: 0x6d4c33,
    roughness: 0.75,
    metalness: 0.05,
  }),
  woodPlanks: new THREE.MeshStandardMaterial({
    color: 0x8d5b36,
    roughness: 0.7,
    metalness: 0.0,
  }),
  stoneWall: new THREE.MeshStandardMaterial({
    color: 0x8a877e,
    roughness: 0.9,
    metalness: 0.05,
  }),
  whiteWall: new THREE.MeshStandardMaterial({
    color: 0xe8edf2,
    roughness: 0.6,
    metalness: 0.05,
  }),
  roofRed: new THREE.MeshStandardMaterial({
    color: 0xa83b24,
    roughness: 0.55,
    metalness: 0.05,
  }),
  roofDark: new THREE.MeshStandardMaterial({
    color: 0x473c38,
    roughness: 0.6,
    metalness: 0.1,
  }),
  windowGlass: new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.15,
    metalness: 0.8,
  }),
  metalGrey: new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.4,
    metalness: 0.8,
  }),
  hazardRed: new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.4,
    metalness: 0.2,
  }),
  hazardYellow: new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.4,
    metalness: 0.2,
  }),
  safeGreen: new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.4,
    metalness: 0.2,
  }),
  treePine: new THREE.MeshStandardMaterial({
    color: 0x1e4620,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true,
  }),
  treeTrunk: new THREE.MeshStandardMaterial({
    color: 0x4a3319,
    roughness: 0.9,
    metalness: 0.0,
  }),
};

// 1. Traditional Karadeniz Wooden/Stone House (Rize style with cumba, stone base, wooden upper floors)
export function createKaradenizHouse(): THREE.Group {
  const group = new THREE.Group();

  // Part 1: Stone foundation base (ground floor)
  const baseGeo = new THREE.BoxGeometry(1.6, 0.7, 1.4);
  const baseMesh = new THREE.Mesh(baseGeo, Materials.stoneWall);
  baseMesh.position.y = 0.35;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Part 2: Wooden timber upper floor with cumba cantilever
  const upperGeo = new THREE.BoxGeometry(1.8, 0.8, 1.6);
  const upperMesh = new THREE.Mesh(upperGeo, Materials.woodPlanks);
  upperMesh.position.y = 0.7 + 0.4;
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  group.add(upperMesh);

  // Part 3: Timber corner posts
  const postGeo = new THREE.BoxGeometry(0.08, 0.82, 0.08);
  [-0.88, 0.88].forEach(x => {
    [-0.78, 0.78].forEach(z => {
      const post = new THREE.Mesh(postGeo, Materials.woodTimber);
      post.position.set(x, 1.1, z);
      group.add(post);
    });
  });

  // Part 4: Gabled Terracotta Tile Roof
  const roofGeo = new THREE.ConeGeometry(1.4, 0.7, 4);
  const roofMesh = new THREE.Mesh(roofGeo, Materials.roofRed);
  roofMesh.position.y = 1.5 + 0.35;
  roofMesh.rotation.y = Math.PI / 4;
  roofMesh.scale.set(1.4, 1.0, 1.25);
  roofMesh.castShadow = true;
  group.add(roofMesh);

  // Part 5: Small Stone Chimney
  const chimneyGeo = new THREE.BoxGeometry(0.18, 0.5, 0.18);
  const chimney = new THREE.Mesh(chimneyGeo, Materials.stoneWall);
  chimney.position.set(0.45, 1.9, 0.25);
  chimney.castShadow = true;
  group.add(chimney);

  // Part 6: Front Door & Windows
  const doorGeo = new THREE.BoxGeometry(0.25, 0.45, 0.05);
  const door = new THREE.Mesh(doorGeo, Materials.woodTimber);
  door.position.set(0, 0.225, 0.72);
  group.add(door);

  const windowGeo = new THREE.BoxGeometry(0.28, 0.28, 0.04);
  [-0.5, 0.5].forEach(x => {
    const win = new THREE.Mesh(windowGeo, Materials.windowGlass);
    win.position.set(x, 1.1, 0.81);
    group.add(win);
  });

  return group;
}

// 2. Standard Residential Building / Apartment
export function createModernHouse(): THREE.Group {
  const group = new THREE.Group();

  // Part 1: Main concrete body
  const bodyGeo = new THREE.BoxGeometry(1.7, 1.3, 1.5);
  const bodyMesh = new THREE.Mesh(bodyGeo, Materials.whiteWall);
  bodyMesh.position.y = 0.65;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Part 2: Roof
  const roofGeo = new THREE.BoxGeometry(1.85, 0.15, 1.65);
  const roofMesh = new THREE.Mesh(roofGeo, Materials.roofDark);
  roofMesh.position.y = 1.37;
  roofMesh.castShadow = true;
  group.add(roofMesh);

  // Part 3: Windows grid
  const winGeo = new THREE.BoxGeometry(0.3, 0.35, 0.04);
  [-0.45, 0.45].forEach(x => {
    [0.4, 0.95].forEach(y => {
      const win = new THREE.Mesh(winGeo, Materials.windowGlass);
      win.position.set(x, y, 0.77);
      group.add(win);
    });
  });

  // Entrance door
  const doorGeo = new THREE.BoxGeometry(0.3, 0.5, 0.05);
  const door = new THREE.Mesh(doorGeo, Materials.woodTimber);
  door.position.set(0, 0.25, 0.77);
  group.add(door);

  return group;
}

// 3. School Building (Okul - with flag mast, classrooms, clock gable)
export function createSchoolBuilding(): THREE.Group {
  const group = new THREE.Group();

  // Central main block
  const mainGeo = new THREE.BoxGeometry(2.8, 1.5, 1.8);
  const mainMesh = new THREE.Mesh(mainGeo, Materials.whiteWall);
  mainMesh.position.y = 0.75;
  mainMesh.castShadow = true;
  mainMesh.receiveShadow = true;
  group.add(mainMesh);

  // Side Wings
  const wingGeo = new THREE.BoxGeometry(0.8, 1.2, 2.2);
  [-1.5, 1.5].forEach(x => {
    const wing = new THREE.Mesh(wingGeo, Materials.whiteWall);
    wing.position.set(x, 0.6, 0);
    wing.castShadow = true;
    wing.receiveShadow = true;
    group.add(wing);
  });

  // Roof
  const roofGeo = new THREE.BoxGeometry(3.0, 0.2, 2.0);
  const roof = new THREE.Mesh(roofGeo, Materials.roofRed);
  roof.position.y = 1.6;
  roof.castShadow = true;
  group.add(roof);

  // Clock / Triangular Pediment Gable
  const pedGeo = new THREE.ConeGeometry(0.7, 0.5, 4);
  const ped = new THREE.Mesh(pedGeo, Materials.roofRed);
  ped.position.set(0, 1.85, 0.9);
  ped.rotation.y = Math.PI / 4;
  ped.scale.set(1.2, 0.8, 0.5);
  group.add(ped);

  // Flag Pole
  const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4);
  const pole = new THREE.Mesh(poleGeo, Materials.metalGrey);
  pole.position.set(0, 2.3, 0.9);
  group.add(pole);

  // Turkish Red Flag
  const flagGeo = new THREE.BoxGeometry(0.35, 0.22, 0.02);
  const flagMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.5 });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(0.18, 2.8, 0.9);
  group.add(flag);

  // Classroom Windows
  const winGeo = new THREE.BoxGeometry(0.24, 0.32, 0.04);
  [-0.9, -0.45, 0.45, 0.9].forEach(x => {
    [0.45, 1.05].forEach(y => {
      const win = new THREE.Mesh(winGeo, Materials.windowGlass);
      win.position.set(x, y, 0.92);
      group.add(win);
    });
  });

  // School steps & door
  const stepGeo = new THREE.BoxGeometry(0.8, 0.1, 0.3);
  const steps = new THREE.Mesh(stepGeo, Materials.stoneWall);
  steps.position.set(0, 0.05, 1.0);
  group.add(steps);

  return group;
}

// 4. Health Center / Hospital (Aile Sağlığı Merkezi - with Red Crescent)
export function createHospitalBuilding(): THREE.Group {
  const group = new THREE.Group();

  // Main white clinic body
  const bodyGeo = new THREE.BoxGeometry(2.4, 1.4, 1.6);
  const bodyMesh = new THREE.Mesh(bodyGeo, Materials.whiteWall);
  bodyMesh.position.y = 0.7;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Ambulance Bay canopy
  const canopyGeo = new THREE.BoxGeometry(1.2, 0.1, 0.9);
  const canopy = new THREE.Mesh(canopyGeo, Materials.metalGrey);
  canopy.position.set(0, 0.9, 1.25);
  canopy.castShadow = true;
  group.add(canopy);

  // Canopy support pillars
  const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9);
  [-0.5, 0.5].forEach(x => {
    const pillar = new THREE.Mesh(pillarGeo, Materials.metalGrey);
    pillar.position.set(x, 0.45, 1.65);
    group.add(pillar);
  });

  // Roof
  const roofGeo = new THREE.BoxGeometry(2.55, 0.18, 1.75);
  const roof = new THREE.Mesh(roofGeo, Materials.stoneWall);
  roof.position.y = 1.45;
  roof.castShadow = true;
  group.add(roof);

  // Red Crescent / Cross symbol on roof
  const signBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), Materials.whiteWall);
  signBase.position.set(0, 1.9, 0.5);
  group.add(signBase);

  // Horizontal bar
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.12), Materials.hazardRed);
  hBar.position.set(0, 1.9, 0.51);
  group.add(hBar);

  // Vertical bar
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.12), Materials.hazardRed);
  vBar.position.set(0, 1.9, 0.51);
  group.add(vBar);

  return group;
}

// 5. Market / Pharmacy Commercial Building
export function createShopBuilding(type: 'market' | 'pharmacy'): THREE.Group {
  const group = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(1.8, 1.2, 1.5);
  const bodyMesh = new THREE.Mesh(bodyGeo, Materials.whiteWall);
  bodyMesh.position.y = 0.6;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Shopfront Awning (Tente)
  const awningGeo = new THREE.BoxGeometry(1.6, 0.1, 0.6);
  const awningMat = new THREE.MeshStandardMaterial({
    color: type === 'pharmacy' ? 0xdc2626 : 0x2563eb,
    roughness: 0.5,
  });
  const awning = new THREE.Mesh(awningGeo, awningMat);
  awning.position.set(0, 0.85, 0.95);
  awning.rotation.x = 0.2;
  awning.castShadow = true;
  group.add(awning);

  // Large display window
  const windowGeo = new THREE.BoxGeometry(1.4, 0.5, 0.04);
  const win = new THREE.Mesh(windowGeo, Materials.windowGlass);
  win.position.set(0, 0.45, 0.77);
  group.add(win);

  // Signboard (Eczane / Market)
  const signGeo = new THREE.BoxGeometry(1.0, 0.25, 0.08);
  const sign = new THREE.Mesh(signGeo, Materials.whiteWall);
  sign.position.set(0, 1.05, 0.78);
  group.add(sign);

  return group;
}

// 6. Safe Gathering Area (Toplanma Alanı Marker & Siren Tower)
export function createGatheringAreaMarker(name: string): THREE.Group {
  const group = new THREE.Group();

  // Green turf perimeter boundary
  const padGeo = new THREE.BoxGeometry(2.4, 0.08, 2.4);
  const pad = new THREE.Mesh(padGeo, Materials.safeGreen);
  pad.position.y = 0.04;
  pad.receiveShadow = true;
  group.add(pad);

  // Mast pole
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2);
  const pole = new THREE.Mesh(poleGeo, Materials.metalGrey);
  pole.position.y = 1.1;
  pole.castShadow = true;
  group.add(pole);

  // AFAD Official Gathering Area Signboard (Green with white icons)
  const boardGeo = new THREE.BoxGeometry(1.0, 0.9, 0.1);
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 1.9, 0);
  board.castShadow = true;
  group.add(board);

  // Solar panel & emergency light on top
  const lightGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const lightMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, emissive: 0x10b981, emissiveIntensity: 0.6 });
  const light = new THREE.Mesh(lightGeo, lightMat);
  light.position.set(0, 2.4, 0);
  group.add(light);

  return group;
}

// 7. Reinforced Concrete Bridge (Güney Ana Yüksek Köprü - Open & Safe)
export function createConcreteBridge(): THREE.Group {
  const group = new THREE.Group();

  // Elevated Road Deck
  const deckGeo = new THREE.BoxGeometry(1.6, 0.25, 2.6);
  const deck = new THREE.Mesh(deckGeo, Materials.roadAsphalt);
  deck.position.y = 0.65;
  deck.castShadow = true;
  deck.receiveShadow = true;
  group.add(deck);

  // Concrete piers (legs)
  const pierGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
  [-0.6, 0.6].forEach(x => {
    [-0.8, 0.8].forEach(z => {
      const pier = new THREE.Mesh(pierGeo, Materials.stoneWall);
      pier.position.set(x, 0.4, z);
      pier.castShadow = true;
      group.add(pier);
    });
  });

  // Safety Crash Barriers (Otokorkuluk)
  const railGeo = new THREE.BoxGeometry(0.08, 0.35, 2.6);
  [-0.75, 0.75].forEach(x => {
    const rail = new THREE.Mesh(railGeo, Materials.metalGrey);
    rail.position.set(x, 0.88, 0);
    rail.castShadow = true;
    group.add(rail);
  });

  return group;
}

// 8. Low Wooden/Timber Bridge (Kuzey Alçak Köprü - Floods & Closed by Authorities)
export function createWoodenBridge(isClosed: boolean = false): THREE.Group {
  const group = new THREE.Group();

  // Low timber deck
  const deckGeo = new THREE.BoxGeometry(1.4, 0.15, 2.4);
  const deck = new THREE.Mesh(deckGeo, Materials.woodPlanks);
  deck.position.y = 0.25;
  deck.castShadow = true;
  deck.receiveShadow = true;
  group.add(deck);

  // Wooden piles
  const pileGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5);
  [-0.55, 0.55].forEach(x => {
    [-0.7, 0, 0.7].forEach(z => {
      const pile = new THREE.Mesh(pileGeo, Materials.woodTimber);
      pile.position.set(x, 0.15, z);
      group.add(pile);
    });
  });

  // Wooden handrails
  const railGeo = new THREE.BoxGeometry(0.06, 0.25, 2.4);
  [-0.65, 0.65].forEach(x => {
    const rail = new THREE.Mesh(railGeo, Materials.woodTimber);
    rail.position.set(x, 0.42, 0);
    group.add(rail);
  });

  // If closed: Police / AFAD closure barrier across entrance
  if (isClosed) {
    const barrierGeo = new THREE.BoxGeometry(1.2, 0.3, 0.08);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(0, 0.55, 1.15);
    group.add(barrier);

    // Warning sign
    const signGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16);
    const signMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 0.75, 1.17);
    sign.rotation.x = Math.PI / 2;
    group.add(sign);
  }

  return group;
}

// 9. Retaining Wall & Landslide Crack Indicator
export function createSlopeCrackMarker(): THREE.Group {
  const group = new THREE.Group();

  // Stone retaining wall section
  const wallGeo = new THREE.BoxGeometry(2.2, 0.8, 0.4);
  const wall = new THREE.Mesh(wallGeo, Materials.stoneWall);
  wall.position.y = 0.4;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // Tilted Utility / Electric pole (Warning sign of earth movement)
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.06, 2.0);
  const pole = new THREE.Mesh(poleGeo, Materials.woodTimber);
  pole.position.set(0.6, 1.0, 0);
  pole.rotation.z = -0.26; // Tilted 15 degrees!
  pole.castShadow = true;
  group.add(pole);

  // High-visibility hazard indicator flag
  const flagMast = new THREE.CylinderGeometry(0.03, 0.03, 1.2);
  const mast = new THREE.Mesh(flagMast, Materials.metalGrey);
  mast.position.set(-0.6, 1.1, 0);
  group.add(mast);

  const flagGeo = new THREE.ConeGeometry(0.25, 0.4, 3);
  const flag = new THREE.Mesh(flagGeo, Materials.hazardYellow);
  flag.position.set(-0.6, 1.7, 0);
  group.add(flag);

  return group;
}

// 10. Clogged Storm Drain (Tıkalı Izgara)
export function createCloggedDrain(): THREE.Group {
  const group = new THREE.Group();

  // Metal grill
  const grillGeo = new THREE.BoxGeometry(0.8, 0.05, 0.8);
  const grill = new THREE.Mesh(grillGeo, Materials.metalGrey);
  grill.position.y = 0.05;
  group.add(grill);

  // Debris & dry twigs blocking it
  const debrisGeo = new THREE.DodecahedronGeometry(0.25);
  const debris = new THREE.Mesh(debrisGeo, Materials.woodTimber);
  debris.position.set(0.1, 0.18, 0.05);
  debris.scale.set(1.4, 0.6, 1.2);
  group.add(debris);

  // Yellow warning pin
  const pinGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const pin = new THREE.Mesh(pinGeo, Materials.hazardYellow);
  pin.position.set(0, 0.6, 0);
  group.add(pin);

  return group;
}

// 11. Pine Tree (Layered cone foliage for Black Sea / Karadeniz mountain aesthetic)
export function createPineTree(scale: number = 1.0): THREE.Group {
  const group = new THREE.Group();

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.7 * scale);
  const trunk = new THREE.Mesh(trunkGeo, Materials.treeTrunk);
  trunk.position.y = 0.35 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  // 3-tiered foliage
  const tier1Geo = new THREE.ConeGeometry(0.7 * scale, 0.8 * scale, 6);
  const tier1 = new THREE.Mesh(tier1Geo, Materials.treePine);
  tier1.position.y = 0.8 * scale;
  tier1.castShadow = true;
  group.add(tier1);

  const tier2Geo = new THREE.ConeGeometry(0.55 * scale, 0.7 * scale, 6);
  const tier2 = new THREE.Mesh(tier2Geo, Materials.treePine);
  tier2.position.y = 1.25 * scale;
  tier2.castShadow = true;
  group.add(tier2);

  const tier3Geo = new THREE.ConeGeometry(0.38 * scale, 0.6 * scale, 6);
  const tier3 = new THREE.Mesh(tier3Geo, Materials.treePine);
  tier3.position.y = 1.65 * scale;
  tier3.castShadow = true;
  group.add(tier3);

  return group;
}
