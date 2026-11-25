import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BATHROOM_SUBCATEGORIES, INITIAL_TURKISH_ASSETS } from './catalogData';
import {
  computeSceneLayout,
  filterAssets,
  generateBatchSceneScript,
  generateBlenderPythonScript,
  generateLlmsTxt,
  hexToLinearRgb,
  normalizeTurkish,
  resolveFinish,
  resolvePattern,
} from './catalogLogic';
import {
  buildTaxonomyTree,
  classifyAssetGroup,
  getProductGroupMeta,
  getSimilarAssets,
} from './taxonomy';
import type { MaterialFinish } from './catalogTypes';

test('normalizeTurkish folds Turkish dotted/dotless I and diacritics accurately', () => {
  assert.equal(normalizeTurkish('İnegöl Köşe Koltuk'), 'inegol kose koltuk');
  assert.equal(normalizeTurkish('HALI & HAVLUPAN'), 'hali & havlupan');
  assert.equal(normalizeTurkish('Dış Cephe Şömine Ünitesi'), 'dis cephe somine unitesi');
  assert.equal(normalizeTurkish('DUŞAKABİN & TUVALET KAĞIDI'), 'dusakabin & tuvalet kagidi');
});

test('expanded catalog ships 725+ verified unique assets across full rooms, bathroom, laundry room, bedroom, kitchen, and architectural elements', () => {
  assert.ok(
    INITIAL_TURKISH_ASSETS.length >= 725,
    `Expected >=725 assets, got ${INITIAL_TURKISH_ASSETS.length}`,
  );
  const idSet = new Set(INITIAL_TURKISH_ASSETS.map((a) => a.id));
  assert.equal(idSet.size, INITIAL_TURKISH_ASSETS.length, 'Catalog contains duplicate asset IDs');

  const bathAssets = INITIAL_TURKISH_ASSETS.filter((a) => a.category === 'Banyo');
  assert.ok(bathAssets.length >= 200, `Expected >=200 Banyo assets, got ${bathAssets.length}`);

  const laundryAssets = INITIAL_TURKISH_ASSETS.filter((a) => a.category === 'Çamaşır Odası');
  assert.ok(laundryAssets.length >= 40, `Expected >=40 Çamaşır Odası assets, got ${laundryAssets.length}`);

  const roomAssets = INITIAL_TURKISH_ASSETS.filter((a) => a.category === 'Oda Tasarımları');
  assert.ok(roomAssets.length >= 12, `Expected >=12 Oda Tasarımları scenes, got ${roomAssets.length}`);

  const bedroomAssets = INITIAL_TURKISH_ASSETS.filter((a) => a.category === 'Yatak Odası');
  assert.ok(bedroomAssets.length >= 40, `Expected >=40 Yatak Odası assets, got ${bedroomAssets.length}`);

  const archOfficeAssets = INITIAL_TURKISH_ASSETS.filter((a) => a.category === 'Mimari & Çalışma');
  assert.ok(archOfficeAssets.length >= 80, `Expected >=80 Mimari & Çalışma assets, got ${archOfficeAssets.length}`);

  const externalCount = INITIAL_TURKISH_ASSETS.filter(
    (a) =>
      a.modelSource.provider === 'polyhaven' ||
      a.modelSource.provider === 'khronos' ||
      a.modelSource.provider === 'abo' ||
      a.modelSource.provider === 'hf',
  ).length;
  assert.ok(externalCount >= 690, `Expected >=690 ready-made external 3D models, got ${externalCount}`);

  // Every single bathroom sub-category must have multiple curated models
  for (const sub of BATHROOM_SUBCATEGORIES) {
    if (sub === 'Tümü') continue;
    const count = bathAssets.filter((a) => a.subCategory === sub).length;
    assert.ok(count >= 10, `Expected >=10 bathroom assets in '${sub}', got ${count}`);
  }

  for (const asset of INITIAL_TURKISH_ASSETS) {
    assert.ok(asset.patterns.length >= 2, `${asset.id} must have pattern variants`);
    assert.ok(asset.finishes.length >= 2, `${asset.id} must have finish variants`);
    assert.ok(asset.modelingSpec.aiRenderPrompt.length > 40, `${asset.id} missing aiRenderPrompt`);
    assert.ok(
      asset.modelingSpec.aiBlenderMasterPrompt.length > 40,
      `${asset.id} missing aiBlenderMasterPrompt`,
    );
    assert.ok(
      asset.modelingSpec.geometryBreakdown.length >= 2,
      `${asset.id} missing geometryBreakdown`,
    );
    assert.ok(asset.modelingSpec.microDetails.length >= 2, `${asset.id} missing microDetails`);
  }
});

test('filterAssets accurately finds Turkish bathroom & furniture queries plus sub-categories', () => {
  const mustFindTerms: Array<[string, number]> = [
    ['duşakabin', 12],
    ['duş başlığı', 8],
    ['lavabo bataryası', 10],
    ['havlu askılığı', 10],
    ['havlupan', 6],
    ['tuvalet kağıdı', 7],
    ['banyo halısı', 10],
    ['klozet', 10],
    ['küvet', 5],
    ['banyo dolabı', 12],
    ['sabunluk', 6],
    ['klozet fırçalığı', 5],
    ['mermer sehpa', 6],
    ['kose koltuk', 6],
    ['oda tasarımı', 12],
    ['gardırop', 6],
    ['mutfak adası', 5],
    ['buzdolabı', 6],
    ['iç kapı', 8],
    ['çalışma masası', 8],
    ['çamaşır dolabı', 6],
    ['üst üste çamaşır', 3],
    ['yan yana çamaşır', 2],
    ['kirli sepetli', 3],
    ['ütü', 5],
    ['kurutmalık', 2],
  ];

  for (const [term, minCount] of mustFindTerms) {
    const res = filterAssets(INITIAL_TURKISH_ASSETS, {
      query: term,
      category: 'Tümü',
      placement: 'all',
    });
    assert.ok(
      res.length >= minCount,
      `Expected >=${minCount} matches for '${term}', got ${res.length}`,
    );
  }

  const klozetWall = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: 'asma klozet',
    category: 'Banyo',
    placement: 'wall-mounted',
  });
  assert.ok(klozetWall.length >= 3, `Expected >=3 wall-hung toilets, got ${klozetWall.length}`);

  const showerSub = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Banyo',
    subCategory: 'Duşakabin & Küvet',
    placement: 'all',
  });
  assert.ok(showerSub.length >= 18, `Expected >=18 Duşakabin & Küvet models, got ${showerSub.length}`);
});

test('resolvePattern and resolveFinish support both presets and custom RAL/HEX finishes', () => {
  const rug = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-hali-anatolia-dokuma')!;
  assert.equal(resolvePattern(rug).id, 'geometric_relief');
  assert.equal(resolvePattern(rug, 'anatolian_diamond').label, 'Anadolu Baklava');
  assert.equal(resolvePattern(rug, 'nonexistent').id, 'geometric_relief');

  const showerHead = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-uc-ds-r789-01')!;
  const goldFinish = resolveFinish(showerHead, 'fircali-pirinc-gold');
  assert.equal(goldFinish.label, 'Fırçalı Pirinç (Gold)');
  assert.ok(goldFinish.metalness >= 0.9);

  const customFinish: MaterialFinish = {
    id: 'ozel-1e3a8a-metallic',
    label: 'Özel Metalik PVD (#1E3A8A)',
    materialKind: 'metal',
    primaryHex: '#1E3A8A',
    secondaryHex: '#F5F6F8',
    accentHex: '#1E3A8A',
    roughness: 0.2,
    metalness: 0.94,
    preserveOriginalTextures: false,
  };
  const resolvedCustom = resolveFinish(showerHead, customFinish.id, customFinish);
  assert.equal(resolvedCustom.primaryHex, '#1E3A8A');
});

test('computeSceneLayout separates floor, wall-mounted, ceiling, and exterior items in Blender Z-up coordinates', () => {
  const sofa = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-sofa-03')!;
  const toilet = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-sim-sanitary-toilet-wallmounted-a01')!;
  const lamp = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-modern-ceiling-lamp')!;
  const pergola = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-dis-bioklimatik-pergola')!;

  const placed = computeSceneLayout([
    { asset: sofa, finishId: sofa.defaultFinishId, quantity: 1, addedBy: 'user' },
    { asset: toilet, finishId: 'mat-antrasit-seramik', quantity: 1, addedBy: 'ai' },
    { asset: lamp, finishId: lamp.defaultFinishId, quantity: 1, addedBy: 'ai' },
    { asset: pergola, finishId: pergola.defaultFinishId, quantity: 1, addedBy: 'user' },
  ]);

  assert.equal(placed.length, 4);
  assert.equal(placed[0].positionMeters.z, 0);
  assert.equal(placed[1].positionMeters.z, 0.4);
  assert.equal(placed[1].finish.id, 'mat-antrasit-seramik');
  assert.ok(placed[2].positionMeters.z >= 1.8);
  assert.equal(placed[3].positionMeters.y, -4.5);
});

test('generateBlenderPythonScript imports HF/ABO/PolyHaven GLBs and injects selected finish Principled BSDF overrides', () => {
  const showerHead = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-uc-ds-r789-01')!;
  const goldScript = generateBlenderPythonScript(
    showerHead,
    'fircali-pirinc-gold',
    { x: 0, y: 2.6, z: 2.1 },
    'http://localhost:3000',
    undefined,
    'brushed_pvd',
  );
  assert.match(goldScript, /bpy\.ops\.import_scene\.gltf/);
  assert.match(goldScript, /\/api\/v1\/hf\/glb\/usdcraft-glb\/ds_r789_01/);
  assert.match(goldScript, /Fırçalı Pirinç \(Gold\)/);
  assert.match(goldScript, /BSDF_PRINCIPLED/);
  assert.match(goldScript, /"Metallic"/);
  assert.match(goldScript, /ShaderNodeTexNoise/);
  assert.match(goldScript, /ShaderNodeBump/);

  const roomAsset = INITIAL_TURKISH_ASSETS.find((a) => a.category === 'Oda Tasarımları')!;
  const roomScript = generateBlenderPythonScript(
    roomAsset,
    roomAsset.defaultFinishId,
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
    undefined,
    'fluted_ribbed',
  );
  assert.match(roomScript, /extracted_parts/);
  assert.match(roomScript, /ShaderNodeTexWave/);

  const phSofa = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-sofa-03')!;
  assert.ok(phSofa.patterns.length >= 9, 'External models must expose full 9 tactile PBR patterns');
  const phScript = generateBlenderPythonScript(
    phSofa,
    'orijinal-pbr',
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
  );
  assert.match(phScript, /\/api\/v1\/polyhaven\/sofa_03\/model\.gltf/);
  assert.doesNotMatch(phScript, /BSDF_PRINCIPLED/);

  const havlupan = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-banyo-havlupan-siyah')!;
  const cadScript = generateBlenderPythonScript(havlupan, 'mat-altin-pirinc', {
    x: 1.2,
    y: 2.6,
    z: 0.75,
  });
  assert.match(cadScript, /import bpy/);
  assert.match(cadScript, /col\.asset_mark\(\)/);
  assert.match(cadScript, /Fırçalı Altın Pirinç/);

  const laundryCabinet = INITIAL_TURKISH_ASSETS.find(
    (a) => a.id === 'tr-camasir-yanyana-yukseltilmis',
  )!;
  const laundryScript = generateBlenderPythonScript(
    laundryCabinet,
    'gece-lacivert-pirinc',
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
    undefined,
    'fluted_ribbed',
  );
  assert.match(laundryScript, /import bpy/);
  assert.match(laundryScript, /col\.asset_mark\(\)/);
  assert.match(laundryScript, /ShaderNodeTexWave/);
  assert.match(laundryScript, /Gece Lacivert/);
});

test('generateBatchSceneScript combines HF Bathroom + Poly Haven + Turkish CAD assets cleanly', () => {
  const showerDoor = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-uc-ds-r778-03')!;
  const rug = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-hali-anatolia-dokuma')!;
  const batch = generateBatchSceneScript([
    { asset: showerDoor, finishId: 'fircali-gold-profil', quantity: 1, addedBy: 'user' },
    { asset: rug, finishId: rug.defaultFinishId, quantity: 1, addedBy: 'ai' },
  ]);

  assert.match(batch, /def import_banyo_ds_r778_03_1/);
  assert.match(batch, /def build_anatolia_kabartmali_salon_halisi_2/);
  assert.match(batch, /2 adet 3D mimari varlık sahneye eklendi/);
});

test('hexToLinearRgb and generateLlmsTxt return expected values', () => {
  const [r, g, b] = hexToLinearRgb('#FFFFFF');
  assert.equal(r, 1);
  assert.equal(g, 1);
  assert.equal(b, 1);

  const manifest = generateLlmsTxt('http://localhost:3000', INITIAL_TURKISH_ASSETS);
  assert.match(manifest, /GET http:\/\/localhost:3000\/api\/v1\/catalog/);
  assert.match(manifest, /GET http:\/\/localhost:3000\/api\/v1\/master-instructions/);
  assert.match(manifest, /bath-uc-ds-r789-01/);
});

test('hierarchical taxonomy classifies every asset into a valid productGroup with accurate tree counts', () => {
  const tree = buildTaxonomyTree(INITIAL_TURKISH_ASSETS);
  assert.equal(tree.length, 14, 'Expected 14 top-level architectural categories');

  const totalTreeCount = tree.reduce((sum, node) => sum + node.count, 0);
  assert.equal(totalTreeCount, INITIAL_TURKISH_ASSETS.length);

  for (const node of tree) {
    const groupSum = node.groups.reduce((sum, g) => sum + g.count, 0);
    assert.equal(
      groupSum,
      node.count,
      `Category '${node.category}' group counts (${groupSum}) must equal category count (${node.count})`,
    );
  }

  for (const asset of INITIAL_TURKISH_ASSETS) {
    const group = classifyAssetGroup(asset);
    const meta = getProductGroupMeta(group.id);
    assert.ok(meta, `Asset ${asset.id} mapped to unknown group '${group.id}'`);
    assert.equal(
      meta.category,
      asset.category,
      `Asset ${asset.id} (${asset.category}) mapped to mismatched group category ${meta.category}`,
    );
  }

  const banyoNode = tree.find((n) => n.category === 'Banyo')!;
  const faucetGroup = banyoNode.groups.find((g) => g.id === 'lavabo-bataryasi');
  assert.ok(faucetGroup && faucetGroup.count >= 10, 'Expected >=10 Lavabo Bataryası models');
  const tubGroup = banyoNode.groups.find((g) => g.id === 'kuvet');
  assert.ok(tubGroup && tubGroup.count >= 7, `Expected >=7 Küvet models, got ${tubGroup?.count}`);

  const laundryNode = tree.find((n) => n.category === 'Çamaşır Odası')!;
  assert.ok(laundryNode, 'Expected Çamaşır Odası category node in taxonomy tree');
  assert.equal(laundryNode.groups.length, 6, 'Expected all 6 Çamaşır Odası sub-groups populated');
  assert.ok(laundryNode.count >= 40, `Expected >=40 Çamaşır Odası assets, got ${laundryNode.count}`);

  const kidsNode = tree.find((n) => n.category === 'Çocuk & Oyun')!;
  assert.ok(kidsNode, 'Expected Çocuk & Oyun category node in taxonomy tree');
  assert.equal(kidsNode.groups.length, 4, 'Expected all 4 Çocuk & Oyun sub-groups populated');
  assert.ok(kidsNode.count >= 30, `Expected >=30 Çocuk & Oyun assets, got ${kidsNode.count}`);

  const studyNode = tree.find((n) => n.category === 'Mimari & Çalışma')!;
  assert.ok(studyNode, 'Expected Mimari & Çalışma category node in taxonomy tree');
  assert.equal(studyNode.groups.length, 8, 'Expected all 8 Mimari & Çalışma sub-groups populated');
});

test('filterAssets supports productGroup filtering and deterministic sort modes', () => {
  const faucets = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Banyo',
    productGroup: 'lavabo-bataryasi',
    placement: 'all',
    sortBy: 'width-asc',
  });
  assert.ok(faucets.length >= 10, `Expected >=10 faucets, got ${faucets.length}`);
  for (let i = 1; i < faucets.length; i++) {
    assert.ok(
      faucets[i - 1].dimensionsCm.width <= faucets[i].dimensionsCm.width,
      'width-asc sort order violated',
    );
  }

  const byPoly = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Salon',
    placement: 'all',
    sortBy: 'poly-desc',
  });
  assert.ok(byPoly.length >= 50);
  for (let i = 1; i < byPoly.length; i++) {
    assert.ok(
      byPoly[i - 1].polyEstimate >= byPoly[i].polyEstimate,
      'poly-desc sort order violated',
    );
  }
});

test('getSimilarAssets prioritizes exact same productGroup siblings (e.g. Lavabo Bataryası -> other Lavabo Bataryası)', () => {
  const faucets = INITIAL_TURKISH_ASSETS.filter(
    (a) => classifyAssetGroup(a).id === 'lavabo-bataryasi',
  );
  assert.ok(faucets.length >= 10);

  const activeFaucet = faucets[0];
  const similarFaucets = getSimilarAssets(activeFaucet, INITIAL_TURKISH_ASSETS, 8);
  assert.equal(similarFaucets.groupId, 'lavabo-bataryasi');
  assert.equal(similarFaucets.groupLabel, 'Lavabo Bataryası');
  assert.equal(similarFaucets.items.length, 8);
  assert.ok(
    similarFaucets.items.every((a) => a.id !== activeFaucet.id),
    'Similar recommendations must never include the active asset itself',
  );
  assert.ok(
    similarFaucets.items.every((a) => classifyAssetGroup(a).id === 'lavabo-bataryasi'),
    'When inspecting a Lavabo Bataryası, all top recommendations must be Lavabo Bataryası models',
  );

  const tpHolders = INITIAL_TURKISH_ASSETS.filter(
    (a) => classifyAssetGroup(a).id === 'tuvalet-kagitligi',
  );
  assert.ok(tpHolders.length >= 6);
  const similarTp = getSimilarAssets(tpHolders[0], INITIAL_TURKISH_ASSETS, 5);
  assert.equal(similarTp.groupId, 'tuvalet-kagitligi');
  assert.ok(
    similarTp.items.every((a) => classifyAssetGroup(a).id === 'tuvalet-kagitligi'),
    'When inspecting a Tuvalet Kağıtlığı, top recommendations must be other Tuvalet Kağıtlığı models',
  );

  const sideBySideCabinet = INITIAL_TURKISH_ASSETS.find(
    (a) => a.id === 'tr-camasir-yanyana-yukseltilmis',
  )!;
  const similarLaundry = getSimilarAssets(sideBySideCabinet, INITIAL_TURKISH_ASSETS, 6);
  assert.equal(similarLaundry.groupId, 'camasir-yan-yana-dolap');
  assert.ok(similarLaundry.items.length >= 4);
  assert.ok(
    similarLaundry.items.every((a) => a.id !== sideBySideCabinet.id && a.category === 'Çamaşır Odası'),
    'Similar laundry models must belong to Çamaşır Odası and exclude self',
  );
});

test('all 16 salon, runner, and bathroom rugs ship with curated 3-tone designer palettes, accurate taxonomy, and Blender ColorRamp export', async () => {
  const { isRugAsset } = await import('./catalogData');
  const allRugs = INITIAL_TURKISH_ASSETS.filter((a) => isRugAsset(a));
  assert.ok(allRugs.length >= 16, `Expected >=16 rugs across catalog, got ${allRugs.length}`);

  for (const rug of allRugs) {
    assert.ok(
      rug.finishes.length >= 7,
      `Rug ${rug.id} must have >=7 curated multi-tone designer palettes, got ${rug.finishes.length}`,
    );
    for (const fin of rug.finishes) {
      assert.equal(
        fin.paletteRecolorMode,
        'tri-tone-rug',
        `Rug ${rug.id} finish ${fin.id} must use tri-tone-rug palette mode`,
      );
      assert.notEqual(
        fin.primaryHex.toLowerCase(),
        fin.secondaryHex.toLowerCase(),
        `Rug ${rug.id} finish ${fin.id} must not be flat monochrome`,
      );
      assert.notEqual(
        fin.secondaryHex.toLowerCase(),
        fin.accentHex.toLowerCase(),
        `Rug ${rug.id} finish ${fin.id} must include distinct accent tone`,
      );
    }
  }

  // Verify all 6 Salon rugs (including previously misclassified ABO rugs) map to salon-halisi
  const salonRugs = INITIAL_TURKISH_ASSETS.filter(
    (a) => classifyAssetGroup(a).id === 'salon-halisi',
  );
  assert.ok(salonRugs.length >= 6, `Expected >=6 salon-halisi rugs, got ${salonRugs.length}`);
  for (const id of ['abo-b075zbjl11', 'abo-b07b4zlj7d', 'abo-b071zj6bgg']) {
    const item = INITIAL_TURKISH_ASSETS.find((a) => a.id === id);
    assert.ok(item, `Missing salon rug ${id}`);
    assert.equal(classifyAssetGroup(item).id, 'salon-halisi', `${id} must classify as salon-halisi`);
  }

  // Verify Blender .PY export for a large ABO rug emits Cycles RGBToBW + ColorRamp nodes
  const featherRunner = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-abo-b07qb8jywz')!;
  assert.ok(featherRunner, 'Expected bath-abo-b07qb8jywz in catalog');
  const triTonePy = generateBlenderPythonScript(
    featherRunner,
    'anadolu-terracotta-ekru',
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
  );
  assert.match(triTonePy, /ShaderNodeRGBToBW/);
  assert.match(triTonePy, /ShaderNodeValToRGB/);
  assert.match(triTonePy, /Anadolu Terracotta & Ekru/);
});

test('Phase 1 (365/896 assets: Banyo, Salon, Oda Tasarımları) ship with curated multi-part retail color combinations & zero flat monochrome finishes', async () => {
  const { isRugAsset } = await import('./catalogData');
  const { isPhase1RetailAsset } = await import('./retailColorCombos');

  const phase1Assets = INITIAL_TURKISH_ASSETS.filter((a) => isPhase1RetailAsset(a));
  const phase2Assets = INITIAL_TURKISH_ASSETS.filter((a) => !isPhase1RetailAsset(a));

  assert.equal(phase1Assets.length, 365, `Expected 365 Phase 1 assets, got ${phase1Assets.length}`);
  assert.equal(phase2Assets.length, 531, `Expected 531 Phase 2 assets, got ${phase2Assets.length}`);

  for (const asset of phase1Assets) {
    if (isRugAsset(asset)) {
      assert.ok(
        asset.finishes.every((f) => f.paletteRecolorMode === 'tri-tone-rug'),
        `Rug ${asset.id} must retain tri-tone-rug mode`,
      );
      continue;
    }

    assert.ok(
      asset.finishes.length >= 5,
      `Phase 1 asset ${asset.id} must have >=5 curated retail combinations, got ${asset.finishes.length}`,
    );

    const nonOriginal = asset.finishes.filter((f) => !f.preserveOriginalTextures);
    assert.ok(
      nonOriginal.length >= 5,
      `Phase 1 asset ${asset.id} must have >=5 selectable multi-part retail combinations`,
    );

    for (const fin of nonOriginal) {
      assert.equal(
        fin.paletteRecolorMode,
        'multi-part-retail',
        `${asset.id}/${fin.id} must use multi-part-retail mode`,
      );
      assert.ok(fin.partFinishes, `${asset.id}/${fin.id} missing partFinishes spec`);
      assert.ok(fin.comboSummary && fin.comboSummary.length > 10, `${asset.id}/${fin.id} missing comboSummary`);
      const distinctTones = new Set([
        fin.partFinishes.primary.hex.toLowerCase(),
        fin.partFinishes.secondary.hex.toLowerCase(),
        fin.partFinishes.accent.hex.toLowerCase(),
      ]);
      assert.ok(
        distinctTones.size >= 2,
        `${asset.id}/${fin.id} must not be flat single-color monochrome`,
      );
    }
  }

  // Verify multi-part Blender .PY output for a Banyo vanity cabinet and a Salon sofa
  const vanity = INITIAL_TURKISH_ASSETS.find((a) => classifyAssetGroup(a).id === 'banyo-dolabi')!;
  const vanityPy = generateBlenderPythonScript(
    vanity,
    'dogal-mese-beyaz-siyah',
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
  );
  assert.match(vanityPy, /Çok Parçalı Gerçek Satış Kombinasyonu/);
  assert.match(vanityPy, /is_ceramic_part/);
  assert.match(vanityPy, /is_metal_part/);

  const sofa = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-sofa-03')!;
  const sofaPy = generateBlenderPythonScript(
    sofa,
    'krem-bukle-ceviz',
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
  );
  assert.match(sofaPy, /Krem Bukle · Ceviz Ayak/);
  assert.match(sofaPy, /is_secondary_part/);
});

test('Phase 2 (531/896) & Full Catalog (896/896 = 100%) ship with curated multi-part retail combinations & zero flat monochrome finishes', async () => {
  const { isRugAsset } = await import('./catalogData');
  const { isPhase2RetailAsset } = await import('./retailColorCombos');

  const phase2Assets = INITIAL_TURKISH_ASSETS.filter((a) => isPhase2RetailAsset(a));
  assert.equal(phase2Assets.length, 531, `Expected 531 Phase 2 assets, got ${phase2Assets.length}`);

  // Verify 100% of ALL 795 assets (Phase 1 + Phase 2) have multi-part retail or tri-tone-rug combinations
  for (const asset of INITIAL_TURKISH_ASSETS) {
    if (isRugAsset(asset)) {
      assert.ok(
        asset.finishes.every((f) => f.paletteRecolorMode === 'tri-tone-rug'),
        `Rug ${asset.id} must retain tri-tone-rug mode`,
      );
      continue;
    }

    const nonOriginal = asset.finishes.filter((f) => !f.preserveOriginalTextures);
    assert.ok(
      nonOriginal.length >= 5,
      `Asset ${asset.id} (${asset.category}) must have >=5 multi-part retail combos, got ${nonOriginal.length}`,
    );

    for (const fin of nonOriginal) {
      assert.equal(
        fin.paletteRecolorMode,
        'multi-part-retail',
        `${asset.id}/${fin.id} must use multi-part-retail mode`,
      );
      assert.ok(fin.partFinishes, `${asset.id}/${fin.id} missing partFinishes`);
      assert.ok(fin.comboSummary && fin.comboSummary.length > 10, `${asset.id}/${fin.id} missing comboSummary`);
      const distinctTones = new Set([
        fin.partFinishes.primary.hex.toLowerCase(),
        fin.partFinishes.secondary.hex.toLowerCase(),
        fin.partFinishes.accent.hex.toLowerCase(),
      ]);
      assert.ok(
        distinctTones.size >= 2,
        `${asset.id}/${fin.id} must not be flat single-color monochrome`,
      );
    }
  }

  // Verify specialized Phase 2 semantic roles & Blender .PY exports
  const plant = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-potted-plant-01')!;
  const plantCombo = plant.finishes.find((f) => f.id === 'terracotta-saksi-siyah-stand')!;
  assert.equal(plantCombo.comboRole, 'botanical_plant');
  const plantPy = generateBlenderPythonScript(
    plant,
    plantCombo.id,
    { x: 0, y: 0, z: 0 },
    'http://localhost:3000',
  );
  assert.match(plantPy, /botanical_plant/);
  assert.match(plantPy, /foliage/);

  const bed = INITIAL_TURKISH_ASSETS.find((a) => classifyAssetGroup(a).id === 'cift-kisilik-yatak')!;
  const bedCombo = bed.finishes.find((f) => f.id === 'antrasit-kadife-yatak-ceviz')!;
  assert.equal(bedCombo.comboRole, 'bed_frame');
  assert.ok(bedCombo.partFinishes?.ceramic, 'Bed combo must include crisp bedding ceramic spec');

  const fridge = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'kh-paslanmaz-buzdolabi')!;
  const fridgeCombo = fridge.finishes.find((f) => f.id === 'mat-siyah-cam-inox')!;
  assert.equal(fridgeCombo.comboRole, 'appliance');

  const lamp = INITIAL_TURKISH_ASSETS.find((a) => classifyAssetGroup(a).id === 'lambader-aplik')!;
  const lampCombo = lamp.finishes.find((f) => f.id === 'mat-siyah-opal-pirinc')!;
  assert.equal(lampCombo.comboRole, 'lighting_fixture');
  assert.ok(lampCombo.partFinishes?.ceramic, 'Lamp combo must preserve warm opal/linen shade');

  const pergola = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-dis-bioklimatik-pergola')!;
  assert.equal(pergola.finishes[0].id, 'antrasit-ral7016');
  assert.equal(pergola.finishes.length, 5);

  const officeChair = INITIAL_TURKISH_ASSETS.find(
    (a) => a.id === 'exp-obj-ergonomic_mesh_office_chair_cd5ef030',
  )!;
  assert.equal(
    officeChair.finishes.find((f) => !f.preserveOriginalTextures)?.comboRole,
    'seating',
    'Ergonomic office chair ("Çalışma Koltuğu") must route to seating combos',
  );

  const succulent = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-potted-plant-04')!;
  assert.equal(
    succulent.finishes.find((f) => !f.preserveOriginalTextures)?.comboRole,
    'botanical_plant',
    'Tabletop succulent ("Sehpa Üstü Sukulent") must route to botanical_plant combos',
  );

  const chefRange = INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r005-05')!;
  assert.equal(
    chefRange.finishes.find((f) => !f.preserveOriginalTextures)?.comboRole,
    'appliance',
    'Chef range ("Villa Ocağı") must route to appliance combos',
  );
});

test('all 107 authentic Turkish branded architectural, wardrobe, bookcase, study, laptop, stationery, kids toys, kitchen built-in, entryway, electrical, lighting, MEP, exterior & elevator models register cleanly with official finishes, taxonomy groups, and Blender .PY scripts', async () => {
  const { TURKISH_GAP_ASSETS, TURKISH_GAP_ASSET_IDS } = await import('./turkishGapAssets');
  assert.equal(TURKISH_GAP_ASSETS.length, 107);
  assert.equal(TURKISH_GAP_ASSET_IDS.size, 107);

  const expectedGroups: Record<string, string> = {
    'tr-vitra-arkitekt-alaturka': 'klozet-pisuvar',
    'tr-geberit-sigma20-panel': 'gomme-rezervuar-panel',
    'tr-geberit-sigma30-panel': 'gomme-rezervuar-panel',
    // Elektrik Tesisatı (15 models across 4 groups)
    'tr-viko-sigorta-kutusu-24': 'sigorta-dagitim-panosu',
    'tr-siemens-sigorta-panosu-18': 'sigorta-dagitim-panosu',
    'tr-viko-siva-ustu-sigorta-kutusu-12': 'sigorta-dagitim-panosu',
    'tr-legrand-siva-alti-sigorta-kutusu-36': 'sigorta-dagitim-panosu',
    'tr-siemens-schneider-otomat-grubu': 'otomat-salter-koruma',
    'tr-schneider-zayif-akim-multimedia-pano': 'zayif-akim-data-pano',
    'tr-estap-rack-kabinet-9u': 'zayif-akim-data-pano',
    'tr-viko-karre-priz': 'priz-anahtar-sayac',
    'tr-viko-karre-ip44-kapakli-priz': 'priz-anahtar-sayac',
    'tr-schneider-asfora-cift-priz-usb': 'priz-anahtar-sayac',
    'tr-schneider-asfora-komutator': 'priz-anahtar-sayac',
    'tr-makel-elektrik-sayac-panosu': 'priz-anahtar-sayac',
    'tr-mavili-gaz-duman-dedektoru': 'priz-anahtar-sayac',
    'tr-audio-goruntulu-diafon-7': 'priz-anahtar-sayac',
    'tr-viko-karre-tv-data-priz': 'priz-anahtar-sayac',
    // Aydınlatma (10 Turkish CAD models across 4 lighting groups)
    'tr-pelsan-ray-spot-lineer': 'alcipan-spot-ray',
    'tr-jupiter-alcipan-gomme-spot': 'alcipan-spot-ray',
    'tr-pelsan-ikili-kardan-alcipan-spot': 'alcipan-spot-ray',
    'tr-jupiter-panel-led-downlight': 'alcipan-spot-ray',
    'tr-alcipan-gizli-serit-led-profil': 'serit-led-lineer',
    'tr-lineer-siva-alti-led-profil': 'serit-led-lineer',
    'tr-avonni-modern-kristal-halka-avize': 'avize-sarkit',
    'tr-apliqa-yemek-masasi-lineer-avize': 'avize-sarkit',
    'tr-villa-galeri-kaskad-sarkit-avize': 'avize-sarkit',
    'tr-modern-mimari-duvar-apligi-updown': 'lambader-aplik',
    // Mekanik, Doğalgaz, Asansör & Dış Cephe
    'tr-vaillant-ecotec-kombi': 'mekanik-dogalgaz-isitma',
    'tr-eca-proteus-premix-kombi': 'mekanik-dogalgaz-isitma',
    'tr-demirdokum-nitromix-kombi': 'mekanik-dogalgaz-isitma',
    'tr-bosch-condens-2500w-kombi': 'mekanik-dogalgaz-isitma',
    'tr-baymak-duotec-kombi': 'mekanik-dogalgaz-isitma',
    'tr-demirdokum-panel-radyator': 'mekanik-dogalgaz-isitma',
    'tr-eca-dikey-aluminyum-radyator': 'mekanik-dogalgaz-isitma',
    'tr-eca-dogalgaz-vana-tesisat': 'mekanik-dogalgaz-isitma',
    'tr-elster-dogalgaz-sayaci-g4': 'mekanik-dogalgaz-isitma',
    'tr-rehau-kollektor-dolabi-8': 'mekanik-dogalgaz-isitma',
    'tr-cosa-akilli-oda-termostati': 'mekanik-dogalgaz-isitma',
    'tr-daikin-split-klima-12k': 'mekanik-dogalgaz-isitma',
    'tr-baylan-su-sayaci-vana-grubu': 'mekanik-dogalgaz-isitma',
    'tr-yangin-dolabi-siva-alti': 'mekanik-dogalgaz-isitma',
    'tr-demirdokum-dt4-termosifon-65l': 'mekanik-dogalgaz-isitma',
    'tr-kone-apartman-asansor-kapisi': 'merdiven-yapi',
    'tr-ake-asansor-kabini-630kg': 'merdiven-yapi',
    // Antre & Giriş (15 Turkish CAD models across 4 entryway groups)
    'tr-sur-kale-celik-kapi': 'celik-villa-kapisi',
    'tr-sur-albero-villa-pivot-kapi': 'celik-villa-kapisi',
    'tr-kale-formet-cift-kanat-villa-kapi': 'celik-villa-kapisi',
    'tr-daire-kapi-numarasi-led-zil': 'celik-villa-kapisi',
    'tr-citali-oturakli-led-vestiyer': 'vestiyer-portmanto',
    'tr-aynali-surgulu-antre-vestiyer': 'vestiyer-portmanto',
    'tr-kompakt-dar-antre-portmanto': 'vestiyer-portmanto',
    'tr-duser-kapakli-slim-ayakkabilik': 'ayakkabilik-puf-bank',
    'tr-minderli-antre-oturma-banki': 'ayakkabilik-puf-bank',
    'tr-antre-paspas-semsiyelik-seti': 'ayakkabilik-puf-bank',
    'tr-traverten-mermer-dresuar-ayna-seti': 'dresuar-boy-aynasi',
    'tr-kemerli-led-boy-aynasi': 'dresuar-boy-aynasi',
    'tr-asimetrik-organik-duvar-aynasi': 'dresuar-boy-aynasi',
    'tr-akustik-ahsap-duvar-citasi-askilik': 'dresuar-boy-aynasi',
    'tr-duvar-anahtarlik-raf-modulu': 'dresuar-boy-aynasi',
    // Mutfak Ankastre (20 Turkish CAD models across 6 built-in kitchen groups)
    'tr-bosch-serie6-uclu-ankastre-set': 'ankastre-setler',
    'tr-siemens-iq500-uclu-ankastre-set': 'ankastre-setler',
    'tr-vestel-rustik-uclu-ankastre-set': 'ankastre-setler',
    'tr-bosch-serie8-ankastre-firin': 'ankastre-firin-mikrodalga',
    'tr-siemens-iq700-ankastre-firin': 'ankastre-firin-mikrodalga',
    'tr-vestel-af8784-ankastre-firin': 'ankastre-firin-mikrodalga',
    'tr-arcelik-ankastre-firin': 'ankastre-firin-mikrodalga',
    'tr-bosch-siemens-ankastre-mikrodalga': 'ankastre-firin-mikrodalga',
    'tr-bosch-pue611-induksiyon-ocak': 'ankastre-ocak',
    'tr-siemens-pop6-gazli-cam-ocak': 'ankastre-ocak',
    'tr-franke-5goz-wok-gazli-ocak-75': 'ankastre-ocak',
    'tr-siemens-davlumbazli-induksiyon-ocak': 'ankastre-ocak',
    'tr-silverline-egimli-cam-davlumbaz': 'ankastre-davlumbaz',
    'tr-franke-t-tipi-ada-davlumbaz-90': 'ankastre-davlumbaz',
    'tr-teka-silverline-gomme-davlumbaz': 'ankastre-davlumbaz',
    'tr-bosch-serie6-bulasik': 'ankastre-bulasik-buzdolabi',
    'tr-siemens-iq500-bulasik': 'ankastre-bulasik-buzdolabi',
    'tr-beko-ankastre-bulasik': 'ankastre-bulasik-buzdolabi',
    'tr-bosch-siemens-ankastre-buzdolabi-kule': 'ankastre-bulasik-buzdolabi',
    'tr-siemens-bosch-ankastre-kahve-makinesi': 'ankastre-kahve-sarap',
    'tr-eca-artema-spiralli-mutfak-batarya': 'mutfak-dolabi-ada',
    'tr-modern-tv-bioetanol-somine': 'tv-unitesi-konsol',
    'tr-daikin-klima-dis-unite': 'dis-mekan-peyzaj',
    'tr-igdas-dogalgaz-servis-kutusu': 'dis-mekan-peyzaj',
    'tr-sukar-lineer-dus-suzgeci': 'dusakabin',
    // Gardırop, Kitaplık, Çalışma, Laptop, Kırtasiye, Ders Kitapları & Çocuk Oyuncakları (22 Turkish CAD models)
    'tr-6kapak-aynali-gardirop': 'gardirop-giyinme',
    'tr-camli-giyinme-dolabi': 'gardirop-giyinme',
    'tr-surgulu-citali-gardirop': 'gardirop-giyinme',
    'tr-cocuk-3kapak-gardirop': 'gardirop-giyinme',
    'tr-dolgulu-5kat-kitaplik': 'kitaplik-raf',
    'tr-kemerli-villa-kitaplik': 'kitaplik-raf',
    'tr-kitaplikli-calisma-masasi': 'calisma-ofis',
    'tr-montessori-cocuk-kitapligi': 'cocuk-calisma-kitaplik',
    'tr-kalemlik-kirtasiye-seti': 'kalemlik-kirtasiye',
    'tr-ahsap-masaustu-duzenleyici': 'kalemlik-kirtasiye',
    'tr-turkce-ders-kitaplari-seti': 'ders-kitaplari-defter',
    'tr-acik-ders-kitabi-calisma-seti': 'ders-kitaplari-defter',
    'tr-mermer-kitap-tutuculu-dizi': 'ders-kitaplari-defter',
    'tr-ultrabook-laptop-mimar': 'laptop-bilgisayar',
    'tr-stantli-laptop-klavye-seti': 'laptop-bilgisayar',
    'tr-cift-monitor-mimar-istasyon': 'laptop-bilgisayar',
    'tr-montessori-gokkusagi-blok': 'bebek-kucuk-oyuncak',
    'tr-ahsap-abakus-ksilofon-seti': 'bebek-kucuk-oyuncak',
    'tr-cocuk-oyun-cadiri-tipi': 'oyun-cadiri-mutfak',
    'tr-ahsap-cocuk-oyun-mutfagi': 'oyun-cadiri-mutfak',
    'tr-9kutulu-oyuncak-dolabi': 'cocuk-calisma-kitaplik',
    'tr-3katli-ahsap-bebek-evi': 'oyun-cadiri-mutfak',
  };

  for (const [assetId, expectedGroup] of Object.entries(expectedGroups)) {
    const asset = INITIAL_TURKISH_ASSETS.find((a) => a.id === assetId);
    assert.ok(asset, `Missing Turkish gap asset ${assetId} in INITIAL_TURKISH_ASSETS`);
    assert.equal(
      classifyAssetGroup(asset).id,
      expectedGroup,
      `${assetId} must classify into '${expectedGroup}'`,
    );
    assert.ok(
      asset.finishes.length >= 5,
      `${assetId} must expose >=5 brand-authentic retail finishes`,
    );
    assert.match(asset.thumbnailUrl, /^\/assets\/turkish-gaps\/.+\.png$/);

    const py = generateBlenderPythonScript(asset, asset.defaultFinishId, { x: 0, y: 0, z: 0 });
    assert.match(py, /import bpy/);
    assert.match(py, /col\.asset_mark\(\)/);
  }

  // Verify brand search hits authentic Turkish market queries
  const boschHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: 'Bosch',
    category: 'Tümü',
    placement: 'all',
  });
  assert.ok(boschHits.some((a) => a.id === 'tr-bosch-serie6-bulasik'));
  assert.ok(boschHits.some((a) => a.id === 'tr-bosch-condens-2500w-kombi'));

  const kombiHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: 'kombi',
    category: 'Tümü',
    placement: 'all',
  });
  assert.ok(kombiHits.length >= 5, `Expected >=5 Turkish condensing boilers, got ${kombiHits.length}`);
  for (const id of [
    'tr-eca-proteus-premix-kombi',
    'tr-demirdokum-nitromix-kombi',
    'tr-bosch-condens-2500w-kombi',
    'tr-baymak-duotec-kombi',
  ]) {
    const boiler = INITIAL_TURKISH_ASSETS.find((a) => a.id === id)!;
    assert.ok(
      boiler.finishes.every((f) => !/vaillant/i.test(f.label) && !/vaillant/i.test(f.comboSummary || '')),
      `${id} must not leak Vaillant brand in finish labels`,
    );
  }

  const schukoHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: 'Schuko priz',
    category: 'Tümü',
    placement: 'all',
  });
  assert.ok(schukoHits.length >= 2, 'Expected Viko & Schneider Schuko socket search hits');

  const alaturkaHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: 'alaturka',
    category: 'Tümü',
    placement: 'all',
  });
  assert.ok(alaturkaHits.some((a) => a.id === 'tr-vitra-arkitekt-alaturka'));

  // Verify newly added Turkish Electrical Installation, Lighting, MEP, Exterior, Fire & Elevator searches
  for (const q of [
    'sigorta kutusu',
    'sıva üstü sigorta',
    'otomat',
    'parafudr',
    'zayıf akım',
    'rack kabinet',
    'alçıpan spot',
    'kardan spot',
    'panel led',
    'şerit led',
    'lineer led',
    'halka avize',
    'kaskad avize',
    'duvar apliği',
    'doğalgaz vanası',
    'kollektör dolabı',
    'görüntülü diafon',
    'asansör',
    'yangın dolabı',
    'igdaş',
    'klima dış ünite',
    'elektrik sayacı',
    'termosifon',
    'lineer süzgeç',
    'kapaklı priz',
    'doğalgaz dedektörü',
    'vestiyer',
    'pivot kapı',
    'düşer kapaklı ayakkabılık',
    'dresuar',
    'kemerli ayna',
    'organik ayna',
    'kapı paspası',
    'akustik duvar çıtası',
    'kapı numarası',
    'anahtarlık',
    'ankastre set',
    'indüksiyon ocak',
    'wok ocak',
    'eğimli davlumbaz',
    'ada davlumbaz',
    'gömme davlumbaz',
    'ankastre mikrodalga',
    'ankastre kahve',
    'vestel rustik',
    'bosch serie 8',
    'siemens iq700',
    'kalemlik',
    'laptop',
    'ders kitabı',
    'oyuncak',
    'montessori',
    'bebek evi',
    'oyun çadırı',
    'gardırop',
    'kitaplık',
    'peluş',
    'abaküs',
    'ksilofon',
    'gökkuşağı',
    'çift monitör',
    'satranç',
    'sallanan at',
  ]) {
    const hits = filterAssets(INITIAL_TURKISH_ASSETS, {
      query: q,
      category: 'Tümü',
      placement: 'all',
    });
    assert.ok(hits.length >= 1, `Expected Turkish MEP/Electrical/Lighting/Entryway/Kitchen/Study/Toys search '${q}' to return >=1 asset`);
  }

  // Verify Elektrik Tesisatı, Antre & Giriş, Mutfak Ankastre & Çocuk & Oyun top-level category filters work cleanly
  const electricalHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Elektrik Tesisatı',
    placement: 'all',
  });
  assert.equal(electricalHits.length, 15, `Expected 15 assets in Elektrik Tesisatı, got ${electricalHits.length}`);

  const entrywayHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Antre & Giriş',
    placement: 'all',
  });
  assert.equal(entrywayHits.length, 32, `Expected 32 assets in Antre & Giriş, got ${entrywayHits.length}`);
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-drawer-cabinet')!).id, 'dresuar-boy-aynasi');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'ph-shelf-01')!).id, 'ayakkabilik-puf-bank');

  const kitchenBuiltInHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Mutfak Ankastre',
    placement: 'all',
  });
  assert.equal(kitchenBuiltInHits.length, 61, `Expected 61 assets in Mutfak Ankastre, got ${kitchenBuiltInHits.length}`);
  const kitchenTree = buildTaxonomyTree(INITIAL_TURKISH_ASSETS).find((n) => n.category === 'Mutfak Ankastre')!;
  assert.equal(kitchenTree.groups.length, 6, 'Expected all 6 Mutfak Ankastre sub-groups populated');

  const kidsToyHits = filterAssets(INITIAL_TURKISH_ASSETS, {
    query: '',
    category: 'Çocuk & Oyun',
    placement: 'all',
  });
  assert.equal(kidsToyHits.length, 32, `Expected 32 assets in Çocuk & Oyun, got ${kidsToyHits.length}`);
});

test('all 896 catalog assets pass strict Turkish retail market authenticity audit (23 non-Turkish foreign items pruned, zero foreign names, zero US imperial sizes, 896/896 TR brands)', async () => {
  const { NON_TURKISH_PRUNED_IDS } = await import('./turkishMarketRegistry');
  assert.equal(NON_TURKISH_PRUNED_IDS.size, 23);
  assert.equal(INITIAL_TURKISH_ASSETS.length, 896);

  for (const prunedId of NON_TURKISH_PRUNED_IDS) {
    assert.ok(
      !INITIAL_TURKISH_ASSETS.some((a) => a.id === prunedId),
      `Pruned non-Turkish US clutter asset '${prunedId}' must not remain in INITIAL_TURKISH_ASSETS`,
    );
  }

  const forbiddenNameRe =
    /\b(andover|goodwin|rylee|dalton|vermont|alejandra|hughes|woodley|blaine|kristin|simready|ottoman|settee|freestanding|steamer|barn lamp|french door|farmhouse|mid-century)\b|\(\d+k\s*Tri\)/i;
  const forbiddenBrandRe = /\b(simready|poly\s*haven|khronos|amazon|abo)\b/i;

  for (const asset of INITIAL_TURKISH_ASSETS) {
    assert.ok(asset.turkishMarket, `${asset.id} missing turkishMarket metadata`);
    assert.ok(asset.turkishMarket.brand.length >= 2, `${asset.id} missing Turkish brand`);
    assert.ok(asset.turkishMarket.series.length >= 3, `${asset.id} missing Turkish series`);
    assert.ok(asset.turkishMarket.originLabel.length >= 8, `${asset.id} missing Turkish originLabel`);
    assert.ok(asset.turkishMarket.designLanguage.length >= 10, `${asset.id} missing Turkish designLanguage`);
    assert.ok(asset.turkishMarket.retailChannel.length >= 5, `${asset.id} missing Turkish retailChannel`);

    assert.doesNotMatch(
      asset.name,
      forbiddenNameRe,
      `${asset.id} contains non-Turkish/foreign token in name: ${asset.name}`,
    );
    assert.doesNotMatch(
      asset.brandStyle,
      forbiddenBrandRe,
      `${asset.id} contains dataset jargon in brandStyle: ${asset.brandStyle}`,
    );

    // Ensure no US imperial rug/furniture dimensions remain
    const { width: w, depth: d } = asset.dimensionsCm;
    for (const usVal of [152, 229, 122, 183, 244, 409, 91, 61, 196]) {
      assert.notEqual(w, usVal, `${asset.id} has US-imperial width ${w} cm`);
      assert.notEqual(d, usVal, `${asset.id} has US-imperial depth ${d} cm`);
    }

    // Ensure no accidental duplicate adjacent words
    assert.doesNotMatch(asset.name, /\b(Modern Retro\s+Modern|Geniş\s+Geniş)\b/i, `${asset.id} duplicate word: ${asset.name}`);
  }

  // Verify corrected taxonomy placements
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'abo-b07jm714d5')!).id, 'banyo-aynasi-aplik');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'abo-b07b8fhtj4')!).id, 'banyo-dolabi');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'abo-b07gfld57t')!).id, 'calisma-ofis');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'abo-b07b4y45h5')!).id, 'cift-kisilik-yatak');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-sim-tv_a01')!).id, 'tv-unitesi-konsol');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-eca-artema-spiralli-mutfak-batarya')!).id, 'mutfak-dolabi-ada');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r002-03')!).id, 'ankastre-bulasik-buzdolabi');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r006-05')!).id, 'ankastre-davlumbaz');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r110-01')!).id, 'gardirop-giyinme');
  assert.equal(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r153-02')!).id, 'pencere-perde');
  assert.notEqual(classifyAssetGroup(INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-uc-ds-r782-04')!).id, 'klozet-pisuvar');
  assert.equal(
    INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-uc-ds-r228-05')?.turkishMarket?.series,
    'V-Tondo / Etna Klozet',
  );

  // Verify zero semantic brand-to-product mismatches across mixed groups
  assert.equal(
    INITIAL_TURKISH_ASSETS.find((a) => a.id === 'tr-dis-bioklimatik-pergola')?.turkishMarket?.brand,
    'Albert Genau',
  );
  assert.ok(
    ['Ekon Merdiven', 'Artstyle Merdiven'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-obj-staircase_15f208e0')!.turkishMarket!.brand,
    ),
  );
  assert.ok(
    ['Avonni', 'Özcan Aydınlatma', 'Apliqa'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'bath-abo-b07b4yvx5q')!.turkishMarket!.brand,
    ),
    'Bathroom sconce must use a lighting brand',
  );
  assert.ok(
    ['Pelsan', 'Jupiter', 'Özcan Aydınlatma'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'abo-b07hkcrwsy')!.turkishMarket!.brand,
    ),
    'Outdoor wall sconce must use an exterior lighting brand',
  );
  assert.ok(
    ['Lineadecor', 'İntema Mutfak', 'Kelebek Mutfak', 'Vanucci'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r020-05')!.turkishMarket!.brand,
    ),
    'Under-sink kitchen cabinet must use a kitchen cabinet brand',
  );
  assert.ok(
    ['Perilla', 'Doğrular'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'laundry-uc-ds-r794-02')!.turkishMarket!.brand,
    ),
    'Wall drying rack must not receive an electric iron brand',
  );
  assert.ok(
    ['Arçelik', 'Fakir', 'Arzum'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'laundry-uc-ds-r246-07')!.turkishMarket!.brand,
    ),
    'Steam iron station must receive a small-appliance iron brand',
  );
  assert.ok(
    ['VitrA', 'Franke', 'Teka', 'Kale Banyo'].includes(
      INITIAL_TURKISH_ASSETS.find((a) => a.id === 'exp-uc-ds-r793-04')!.turkishMarket!.brand,
    ),
    'Laundry sink must receive a sanitaryware/sink brand',
  );

  // Verify searching Turkey's top retail brands across all major categories returns results
  const requiredBrands = [
    'Merinos',
    'Padişah',
    'Pierre Cardin',
    'Saray Halı',
    'Dinarsu',
    'Kaşmir Halı',
    'Enza Home',
    'Doğtaş',
    'Bellona',
    'İstikbal',
    'Kelebek',
    'Mondihome',
    'Alfemo',
    'Lazzoni',
    'Artema',
    'VitrA',
    'Serel',
    'Tema Banyo',
    'Hammam',
    'Carisa',
    'E.C.A.',
    'DemirDöküm',
    'Vaillant',
    'Bosch',
    'Profilo',
    'Silverline',
    'Teka',
    'Franke',
    'Orka',
    'Lineadecor',
    'İntema Mutfak',
    'Yataş',
    'Bambi Yatak',
    'İşbir Yatak',
    'İdaş',
    'Çilek',
    'Nurus',
    'Tuna Ofis',
    'Avonni',
    'English Home',
    'Madame Coco',
    'Porland',
    'Kütahya Porselen',
    'Egepen Deceuninck',
    'Winsa',
    'Fıratpen',
    'Pimapen',
    'Variodor',
    'Fakir',
    'Arzum',
    'Perilla',
    'Doğrular',
    'Albert Genau',
    'L’unica',
    'Siesta',
    'Ekon Merdiven',
    'Artstyle Merdiven',
    'Baymak',
    'Audio Elektronik',
    'Elster',
    'Rehau',
    'Cosa',
    'Daikin',
    'Baylan',
    'KONE',
    'Ake Asansör',
    'Otis',
    'İGDAŞ',
    'Makel',
    'Mavili',
    'Sukar',
    'Üçyıldız',
    'Legrand',
    'Estap',
    'Cata',
    'Jupiter',
    'Apliqa',
    'Özcan Aydınlatma',
    'Formet',
    'Rani',
    'Dekorister',
  ];
  for (const brand of requiredBrands) {
    const hits = filterAssets(INITIAL_TURKISH_ASSETS, {
      query: brand,
      category: 'Tümü',
      placement: 'all',
    });
    assert.ok(hits.length >= 1, `Expected Turkish brand search '${brand}' to return >=1 asset`);
  }
});

test('every local catalog thumbnail image referenced by INITIAL_TURKISH_ASSETS exists on disk', () => {
  const missing: string[] = [];
  for (const asset of INITIAL_TURKISH_ASSETS) {
    if (asset.thumbnailUrl.startsWith('/assets/')) {
      const diskPath = path.resolve(process.cwd(), 'public', asset.thumbnailUrl.slice(1));
      if (!fs.existsSync(diskPath) || fs.statSync(diskPath).size < 1024) {
        missing.push(`${asset.id} -> ${asset.thumbnailUrl}`);
      }
    }
  }
  assert.deepEqual(missing, [], `Missing or empty local thumbnail files:\n${missing.join('\n')}`);
});






