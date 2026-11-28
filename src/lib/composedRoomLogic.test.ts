import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_TURKISH_ASSETS } from './catalogData';
import { COMPOSED_ROOM_ASSETS } from './composedRoomsCatalog';
import {
  buildComposedRoomBlenderScript,
  buildComposedRoomBom,
  validateComposedRoom,
} from './composedRoomLogic';
import { classifyAssetGroup } from './taxonomy';
import { generateBlenderPythonScript } from './catalogLogic';

test('all 24 curated Pinterest composed room sets exist, reference only valid catalog assets, stay in bounds, and have zero furniture collisions', () => {
  assert.equal(COMPOSED_ROOM_ASSETS.length, 24, 'Expected 24 curated composed rooms');

  const catalogById = new Map(INITIAL_TURKISH_ASSETS.map((a) => [a.id, a]));
  const allErrors: string[] = [];

  for (const room of COMPOSED_ROOM_ASSETS) {
    assert.ok(room.composedRoom, `Room ${room.id} must define composedRoom spec`);
    assert.equal(room.category, 'Oda Tasarımları');
    assert.equal(room.archetype, 'composed_room');
    assert.ok(room.finishes.length >= 5, `Room ${room.id} must offer >=5 curated architectural palettes`);

    const result = validateComposedRoom(room.id, room.composedRoom, catalogById);
    if (!result.valid) {
      for (const issue of result.issues) {
        allErrors.push(`[${issue.roomId}] ${issue.code}: ${issue.message}`);
      }
    }
    assert.ok(
      result.resolvedCount >= 6,
      `Room ${room.id} must contain at least 6 real catalog models, got ${result.resolvedCount}`,
    );
  }

  assert.deepEqual(allErrors, [], `Composed room layout validation failed:\n${allErrors.join('\n')}`);
});

test('composed room taxonomy covers Mutfak (6), Salon (6), Yatak (5), Banyo (4), and Özel Alan (3)', () => {
  const counts = new Map<string, number>();
  for (const room of COMPOSED_ROOM_ASSETS) {
    const grp = classifyAssetGroup(room);
    counts.set(grp.id, (counts.get(grp.id) ?? 0) + 1);
  }

  assert.equal(counts.get('oda-mutfak'), 6);
  assert.equal(counts.get('oda-salon'), 6);
  assert.equal(counts.get('oda-yatak'), 5);
  assert.equal(counts.get('oda-banyo'), 4);
  assert.equal(counts.get('oda-ozel'), 3);
});

test('buildComposedRoomBom groups repeated chairs/stools cleanly and Blender script includes all placed sub-assets', () => {
  const catalogById = new Map(INITIAL_TURKISH_ASSETS.map((a) => [a.id, a]));
  const kitchen = COMPOSED_ROOM_ASSETS.find((r) => r.id === 'oda-mutfak-kasmir-ada')!;
  assert.ok(kitchen && kitchen.composedRoom);

  const bom = buildComposedRoomBom(kitchen.composedRoom, catalogById);
  const stoolEntry = bom.find((b) => b.assetId === 'abo-b07hsfj2pf');
  assert.ok(stoolEntry, 'Kitchen island BOM must include bar stools');
  assert.equal(stoolEntry.quantity, 3, '3 island bar stools should group to quantity 3');

  const script = generateBlenderPythonScript(
    kitchen,
    kitchen.defaultFinishId,
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
    undefined,
    undefined,
    catalogById,
  );
  assert.ok(script.includes('Kompoze Oda Tasarımı Oluşturucu'));
  assert.ok(script.includes('Kitchen_Island'));
  assert.ok(script.includes('abo-b07hsfj2pf'));
  assert.ok(script.includes('tr-bosch-serie8-ankastre-firin'));

  const directScript = buildComposedRoomBlenderScript(
    kitchen,
    kitchen.finishes[0],
    kitchen.patterns[0],
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
    catalogById,
  );
  assert.equal(script, directScript);
});
