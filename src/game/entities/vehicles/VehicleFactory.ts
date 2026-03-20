import * as THREE from 'three';
import type { VehicleId } from '../../../types';
import { createShinkansen } from './Shinkansen';
import { createAirplane } from './Airplane';
import { createBus } from './Bus';
import { createPoliceCar } from './PoliceCar';
import { createExcavator } from './Excavator';
import { createHelicopter } from './Helicopter';
import { createRocket } from './Rocket';
import { createShip } from './Ship';
import { createWhale } from '../sea/Whale';
import { createDolphin } from '../sea/Dolphin';
import { createClownfish } from '../sea/Clownfish';
import { createOctopus } from '../sea/Octopus';
import { createSeaTurtle } from '../sea/SeaTurtle';
import { createJellyfish } from '../sea/Jellyfish';
import { createManta } from '../sea/Manta';
import { createSeahorse } from '../sea/Seahorse';
import { createFlagJapan, createFlagUSA, createFlagBrazil, createFlagFrance, createFlagChina, createFlagAustralia, createFlagIndia, createFlagKorea } from '../flags/Flags';
import { createPiano, createGuitar, createTaiko, createTrumpet, createViolin, createHarmonica, createCymbal, createRecorder } from '../instruments/Instruments';
import { createTrex, createTriceratops, createStegosaurus, createPteranodon, createBrachiosaurus, createVelociraptor, createAnkylosaurus, createParasaurolophus } from '../dinosaurs/Dinosaurs';
import { createBeetleKabuto, createBeetleKuwagata, createButterfly, createLadybug, createDragonfly, createGrasshopper, createFirefly, createMantis } from '../insects/Insects';

const CREATORS: Record<VehicleId, () => THREE.Group> = {
  // のりもの
  shinkansen: createShinkansen,
  airplane: createAirplane,
  bus: createBus,
  policeCar: createPoliceCar,
  excavator: createExcavator,
  helicopter: createHelicopter,
  rocket: createRocket,
  ship: createShip,
  // うみのいきもの
  whale: createWhale,
  dolphin: createDolphin,
  clownfish: createClownfish,
  octopus: createOctopus,
  seaTurtle: createSeaTurtle,
  jellyfish: createJellyfish,
  manta: createManta,
  seahorse: createSeahorse,
  // こっき
  flagJapan: createFlagJapan,
  flagUSA: createFlagUSA,
  flagBrazil: createFlagBrazil,
  flagFrance: createFlagFrance,
  flagChina: createFlagChina,
  flagAustralia: createFlagAustralia,
  flagIndia: createFlagIndia,
  flagKorea: createFlagKorea,
  // がっき
  piano: createPiano,
  guitar: createGuitar,
  taiko: createTaiko,
  trumpet: createTrumpet,
  violin: createViolin,
  harmonica: createHarmonica,
  cymbal: createCymbal,
  recorder: createRecorder,
  // きょうりゅう
  trex: createTrex,
  triceratops: createTriceratops,
  stegosaurus: createStegosaurus,
  pteranodon: createPteranodon,
  brachiosaurus: createBrachiosaurus,
  velociraptor: createVelociraptor,
  ankylosaurus: createAnkylosaurus,
  parasaurolophus: createParasaurolophus,
  // むし
  beetleKabuto: createBeetleKabuto,
  beetleKuwagata: createBeetleKuwagata,
  butterfly: createButterfly,
  ladybug: createLadybug,
  dragonfly: createDragonfly,
  grasshopper: createGrasshopper,
  firefly: createFirefly,
  mantis: createMantis,
};

export function createVehicleModel(id: VehicleId): THREE.Group {
  const creator = CREATORS[id];
  return creator();
}
