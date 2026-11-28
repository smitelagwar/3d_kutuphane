import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Layers,
  Plus,
  Sparkles,
} from 'lucide-react';
import type {
  ArchitecturalAsset,
  AssetCategory,
  MaterialFinish,
  PatternId,
} from '../lib/catalogTypes';
import {
  formatDimensionsText,
  formatSourceLabel,
  generateBlenderPythonScript,
  resolveFinish,
  resolvePattern,
} from '../lib/catalogLogic';
import { PLACEMENT_LABELS } from '../lib/catalogData';
import { buildComposedRoomBom } from '../lib/composedRoomLogic';
import { classifyAssetGroup, getSimilarAssets } from '../lib/taxonomy';
import { CatalogCardMediaStage } from './CatalogSection';
import { PinchZoomPortal } from './PinchZoomPortal';
import { ThreeAssetViewport } from './ThreeAssetViewport';

interface StudioInspectorViewProps {
  assets: ArchitecturalAsset[];
  activeAsset: ArchitecturalAsset;
  initialFinishId?: string;
  onSelectAsset: (asset: ArchitecturalAsset, finishId?: string) => void;
  onAddToScene: (asset: ArchitecturalAsset, finishId: string, customFinish?: MaterialFinish) => void;
  onBackToCatalog: (category?: AssetCategory | 'Tümü', productGroup?: string) => void;
  selectedIds: Set<string>;
}

type InspectorTab = 'specs' | 'prompts' | 'code';

export const StudioInspectorView: React.FC<StudioInspectorViewProps> = ({
  assets,
  activeAsset,
  initialFinishId,
  onSelectAsset,
  onAddToScene,
  onBackToCatalog,
  selectedIds,
}) => {
  const [finishByAsset, setFinishByAsset] = useState<Record<string, string>>({});
  const [customFinishByAsset, setCustomFinishByAsset] = useState<
    Record<string, MaterialFinish | undefined>
  >({});
  const [patternByAsset, setPatternByAsset] = useState<Record<string, PatternId>>({});
  const [activeTab, setActiveTab] = useState<InspectorTab>('specs');
  const [codeFormat, setCodeFormat] = useState<'python' | 'json'>('python');
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [refPinching, setRefPinching] = useState(false);
  const refPlateRef = useRef<HTMLDivElement | null>(null);

  // Apply finish pre-selected from a catalog card swatch
  useEffect(() => {
    if (initialFinishId) {
      setFinishByAsset((prev) => ({ ...prev, [activeAsset.id]: initialFinishId }));
      setCustomFinishByAsset((prev) => ({ ...prev, [activeAsset.id]: undefined }));
    }
  }, [activeAsset.id, initialFinishId]);

  const activeCustomFinish = customFinishByAsset[activeAsset.id];
  const selectedFinishId = finishByAsset[activeAsset.id] || activeAsset.defaultFinishId;
  const activeFinish = activeCustomFinish ?? resolveFinish(activeAsset, selectedFinishId);

  const selectedPatternId = patternByAsset[activeAsset.id] || activeAsset.defaultPatternId;
  const activePattern = resolvePattern(activeAsset, selectedPatternId);

  const activeGroup = useMemo(() => classifyAssetGroup(activeAsset), [activeAsset]);
  const similar = useMemo(
    () => getSimilarAssets(activeAsset, assets, 12),
    [activeAsset, assets],
  );

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const referenceImageAbsUrl = activeAsset.thumbnailUrl.startsWith('http')
    ? activeAsset.thumbnailUrl
    : `${originUrl}${activeAsset.thumbnailUrl}`;
  const model3dAbsUrl = activeAsset.modelSource?.gltfUrl
    ? activeAsset.modelSource.gltfUrl.startsWith('http')
      ? activeAsset.modelSource.gltfUrl
      : `${originUrl}${activeAsset.modelSource.gltfUrl}`
    : null;

  const catalogById = useMemo(
    () => new Map<string, ArchitecturalAsset>(assets.map((a) => [a.id, a])),
    [assets],
  );
  const composedRoomBom = useMemo(
    () => (activeAsset.composedRoom ? buildComposedRoomBom(activeAsset.composedRoom, catalogById) : []),
    [activeAsset, catalogById],
  );

  const pythonScript = generateBlenderPythonScript(
    activeAsset,
    activeFinish.id,
    { x: 0, y: 0, z: 0 },
    originUrl,
    activeCustomFinish,
    activePattern.id,
    catalogById,
  );

  const dynamicRenderPrompt = `${activeAsset.modelingSpec.aiRenderPrompt} Selected finish: "${activeFinish.label}" (${activeFinish.primaryHex}), surface weave/pattern: "${activePattern.label}".`;
  const dynamicBlenderPrompt = `${activeAsset.modelingSpec.aiBlenderMasterPrompt} Aktif seçili kaplama: "${activeFinish.label}" (${activeFinish.primaryHex}), aktif desen/yüzey: "${activePattern.label}".${
    model3dAbsUrl ? ` Hazır 3D Model URL: ${model3dAbsUrl}` : ''
  }${activeAsset.modelSource?.blendUrl ? ` | Orijinal .blend URL: ${activeAsset.modelSource.blendUrl}` : ''}`;

  const aiJsonPayload = JSON.stringify(
    {
      id: activeAsset.id,
      slug: activeAsset.slug,
      name: activeAsset.name,
      brandStyle: activeAsset.brandStyle,
      turkishMarket: activeAsset.turkishMarket ?? null,
      category: activeAsset.category,
      productGroup: activeGroup.label,
      placement: activeAsset.placement,
      dimensionsCm: activeAsset.dimensionsCm,
      polyEstimate: activeAsset.polyEstimate,
      source: activeAsset.modelSource,
      referenceImageUrl: referenceImageAbsUrl,
      model3dUrl: model3dAbsUrl,
      blendUrl: activeAsset.modelSource?.blendUrl ?? null,
      selectedFinish: activeFinish,
      selectedPattern: activePattern,
      modelingSpec: {
        ...activeAsset.modelingSpec,
        aiRenderPrompt: dynamicRenderPrompt,
        aiBlenderMasterPrompt: dynamicBlenderPrompt,
      },
      blenderUnits: 'meters-z-up',
      apiEndpoint: `${originUrl}/api/v1/catalog/${activeAsset.id}`,
      blenderScriptEndpoint: `${originUrl}/api/v1/catalog/${activeAsset.id}/blender-script?finish=${activeFinish.id}&pattern=${activePattern.id}`,
    },
    null,
    2,
  );

  const handleDownloadPython = () => {
    const blob = new Blob([pythonScript], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeAsset.slug}_${activeFinish.id}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? '' : prev)), 1800);
    } catch {}
  };

  const isInScene = selectedIds.has(activeAsset.id);
  const spec = activeAsset.modelingSpec;

  return (
    <section aria-labelledby="studio-heading" className="py-4 space-y-6">
      {/* Slim 1-Row Breadcrumb & Primary Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs min-w-0">
          <button
            type="button"
            onClick={() => onBackToCatalog()}
            className="inline-flex items-center gap-1 h-7 px-2 font-medium text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5] rounded-md transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Katalog</span>
          </button>
          <span className="text-[#D4D4D8]" aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => onBackToCatalog(activeAsset.category, 'all')}
            className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            {activeAsset.category}
          </button>
          <span className="text-[#D4D4D8]" aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => onBackToCatalog(activeAsset.category, activeGroup.id)}
            className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            {activeGroup.label}
          </button>
          <span className="text-[#D4D4D8] hidden sm:inline" aria-hidden="true">/</span>
          <h1
            id="studio-heading"
            className="text-[13px] font-semibold text-[#09090B] truncate hidden sm:block"
          >
            {activeAsset.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 max-w-full sm:shrink-0">
          <button
            type="button"
            onClick={() => onAddToScene(activeAsset, activeFinish.id, activeCustomFinish)}
            className="inline-flex items-center gap-1.5 h-8 px-3 max-w-full text-xs font-medium text-white bg-[#09090B] hover:bg-[#1D4ED8] rounded-md transition-colors cursor-pointer"
          >
            {isInScene ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Sahnede (+1)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Sahneye Ekle · {activeFinish.label}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split-Stage Workbench: Left Large 3D Viewport + Right Compact Technical/AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[calc(100vh-128px)] lg:min-h-[560px] lg:max-h-[780px]">
        {/* Left 8-9 Columns: Full-Scale 3D Viewport */}
        <div className="lg:col-span-8 xl:col-span-9 h-full min-h-[520px]">
          <ThreeAssetViewport
            asset={activeAsset}
            allAssets={assets}
            finish={activeFinish}
            pattern={activePattern}
            isCustomFinishActive={Boolean(activeCustomFinish)}
            onSelectFinish={(fid) => {
              setCustomFinishByAsset((prev) => ({ ...prev, [activeAsset.id]: undefined }));
              setFinishByAsset((prev) => ({ ...prev, [activeAsset.id]: fid }));
            }}
            onApplyCustomFinish={(custom) => {
              setCustomFinishByAsset((prev) => ({ ...prev, [activeAsset.id]: custom }));
              setFinishByAsset((prev) => ({ ...prev, [activeAsset.id]: custom.id }));
            }}
            onSelectPattern={(pid) =>
              setPatternByAsset((prev) => ({ ...prev, [activeAsset.id]: pid }))
            }
            onDownloadPython={handleDownloadPython}
          />
        </div>

        {/* Right 3-4 Columns: Compact Tabbed Technical, Texture, Micro-Details & AI Panel */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-[#E5E7EB] rounded-lg flex flex-col overflow-hidden lg:h-full">
          {/* Inspector Tabs */}
          <div
            role="tablist"
            aria-label="Model detay sekmeleri"
            className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#FAFAFA] shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'specs'}
              onClick={() => setActiveTab('specs')}
              className={`h-9 inline-flex items-center justify-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-white text-[#09090B] border-[#09090B]'
                  : 'text-[#71717A] border-transparent hover:text-[#09090B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Detay</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'prompts'}
              onClick={() => setActiveTab('prompts')}
              className={`h-9 inline-flex items-center justify-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'prompts'
                  ? 'bg-white text-[#09090B] border-[#09090B]'
                  : 'text-[#71717A] border-transparent hover:text-[#09090B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>AI Prompt</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'code'}
              onClick={() => setActiveTab('code')}
              className={`h-9 inline-flex items-center justify-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-white text-[#09090B] border-[#09090B]'
                  : 'text-[#71717A] border-transparent hover:text-[#09090B]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>bpy / JSON</span>
            </button>
          </div>

          {/* Scrollable Inspector Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'specs' && (
              <>
                {/* Reference Photo Plate (1:1 consistency check + pinch-to-zoom breakout) */}
                {(() => {
                  const refPreviewSrc = activeAsset.roomRenderUrl || activeAsset.thumbnailUrl;
                  const refImgClass = activeAsset.roomRenderUrl
                    ? 'w-full h-full object-cover'
                    : activeAsset.modelSource?.provider === 'abo' ||
                        activeAsset.modelSource?.provider === 'hf' ||
                        activeAsset.modelSource?.provider === 'polyhaven' ||
                        activeAsset.modelSource?.provider === 'khronos'
                      ? 'w-full h-full object-contain p-2.5'
                      : 'w-full h-full object-cover';
                  return (
                    <div
                      ref={refPlateRef}
                      className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-[#E5E7EB] bg-white select-none"
                    >
                      <img
                        src={refPreviewSrc}
                        alt={`${activeAsset.name} referans görsel`}
                        draggable={false}
                        referrerPolicy="no-referrer"
                        className={`${refImgClass} transition-opacity duration-75 ${
                          refPinching ? 'opacity-0' : 'opacity-100'
                        }`}
                      />
                      {!refPinching && (
                        <a
                          href={referenceImageAbsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium bg-white/95 text-[#09090B] border border-[#E5E7EB] hover:border-[#09090B] rounded"
                        >
                          <span>Referans</span>
                          <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                        </a>
                      )}
                      <PinchZoomPortal
                        targetRef={refPlateRef}
                        imageSrc={refPreviewSrc}
                        imageAlt={`${activeAsset.name} referans görsel`}
                        imageClassName={refImgClass}
                        frameBgClassName="bg-white"
                        onPinchStateChange={setRefPinching}
                      />
                    </div>
                  );
                })()}

                {/* Metric Key Specs */}
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs pb-3.5 border-b border-[#F1F2F4]">
                  <div>
                    <dt className="text-[11px] text-[#71717A]">Ölçü (G×D×Y)</dt>
                    <dd className="font-mono tabular-nums font-medium text-[#09090B] mt-0.5">
                      {formatDimensionsText(activeAsset)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#71717A]">Poligon</dt>
                    <dd className="font-mono tabular-nums font-medium text-[#09090B] mt-0.5">
                      {activeAsset.polyEstimate.toLocaleString('tr-TR')} tri
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#71717A]">Yerleşim</dt>
                    <dd className="font-medium text-[#09090B] mt-0.5 truncate">
                      {PLACEMENT_LABELS[activeAsset.placement] ?? activeAsset.placement}
                      {activeAsset.dimensionsCm.mountHeight
                        ? ` (+${activeAsset.dimensionsCm.mountHeight} cm)`
                        : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#71717A]">Kaplama & Doku</dt>
                    <dd className="font-medium text-[#09090B] mt-0.5 truncate">
                      {activeFinish.label} · {activePattern.label}
                    </dd>
                  </div>
                </dl>

                {/* Dedicated 'Marka ve Kaynak' Section (Turkish Brand, Local Design Language & 3D Provenance) */}
                <section
                  aria-labelledby="brand-source-heading"
                  data-testid="brand-source-section"
                  className="rounded-md border border-[#E5E7EB] bg-[#FAFAFA] p-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E5E7EB]">
                    <h2
                      id="brand-source-heading"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#27272A]"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#52525B]" aria-hidden="true" />
                      <span>Marka ve Kaynak</span>
                    </h2>
                    <span className="text-[10.5px] font-medium text-[#52525B] truncate">
                      {activeAsset.turkishMarket?.matchType === 'exact-model'
                        ? 'Marka Baskılı TR CAD'
                        : 'TR Piyasası Eşleşmeli'}
                    </span>
                  </div>

                  <dl className="space-y-2 text-xs">
                    <div>
                      <dt className="text-[10.5px] text-[#71717A]">Türkiye Markası & Seri</dt>
                      <dd className="font-semibold text-[#09090B] mt-0.5">
                        {activeAsset.turkishMarket
                          ? `${activeAsset.turkishMarket.brand} · ${activeAsset.turkishMarket.series}`
                          : activeAsset.brandStyle}
                      </dd>
                      {activeAsset.turkishMarket?.originLabel && (
                        <dd className="text-[11px] text-[#52525B] mt-0.5">
                          {activeAsset.turkishMarket.originLabel}
                        </dd>
                      )}
                    </div>

                    {activeAsset.turkishMarket?.designLanguage && (
                      <div className="pt-1.5 border-t border-[#ECEEF0]">
                        <dt className="text-[10.5px] text-[#71717A]">Yerel Tasarım Dili</dt>
                        <dd className="text-[11.5px] font-medium text-[#27272A] leading-snug mt-0.5">
                          {activeAsset.turkishMarket.designLanguage}
                        </dd>
                      </div>
                    )}

                    {activeAsset.turkishMarket?.retailChannel && (
                      <div className="pt-1.5 border-t border-[#ECEEF0]">
                        <dt className="text-[10.5px] text-[#71717A]">Türkiye Satış Kanalı</dt>
                        <dd className="text-[11px] text-[#52525B] leading-snug mt-0.5">
                          {activeAsset.turkishMarket.retailChannel}
                        </dd>
                      </div>
                    )}

                    <div className="pt-1.5 border-t border-[#ECEEF0]">
                      <dt className="text-[10.5px] text-[#71717A]">3D Model Kaynağı & Lisans</dt>
                      <dd className="text-[11px] font-mono text-[#3F3F46] leading-snug mt-0.5">
                        {formatSourceLabel(activeAsset)} · {activeAsset.modelSource.license}
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Interactive Room BOM — Every Real Catalog 3D Model Placed in This Curated Room */}
                {activeAsset.composedRoom && composedRoomBom.length > 0 && (
                  <section
                    aria-labelledby="room-bom-heading"
                    data-testid="room-bom-section"
                    className="rounded-md border border-[#E5E7EB] bg-white p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#F1F2F4]">
                      <h2
                        id="room-bom-heading"
                        className="text-[11px] font-semibold uppercase tracking-wider text-[#27272A]"
                      >
                        Bu Odadaki Hazır Modeller
                      </h2>
                      <span className="text-[10.5px] font-mono tabular-nums text-[#52525B]">
                        {activeAsset.composedRoom.placements.length} parça
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {composedRoomBom.map((entry) => (
                        <li key={entry.assetId}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectAsset(entry.asset);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full flex items-center gap-2 p-1.5 rounded-md border border-[#F1F2F4] hover:border-[#A1A1AA] hover:bg-[#FAFAFA] transition-colors text-left cursor-pointer"
                          >
                            <img
                              src={entry.asset.roomRenderUrl || entry.asset.thumbnailUrl}
                              alt={entry.asset.name}
                              loading="lazy"
                              className="w-10 h-8 rounded object-cover bg-[#F4F4F5] shrink-0 border border-[#E5E7EB]"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11.5px] font-medium text-[#09090B] truncate">
                                {entry.roleLabels[0]}
                              </p>
                              <p className="text-[10px] text-[#71717A] truncate">
                                {entry.asset.turkishMarket?.brand || entry.asset.category} ·{' '}
                                {formatDimensionsText(entry.asset)}
                              </p>
                            </div>
                            {entry.quantity > 1 && (
                              <span className="text-[10px] font-mono font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded shrink-0">
                                ×{entry.quantity}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Texture & Shader Specs */}
                <div className="space-y-1.5 pb-3.5 border-b border-[#F1F2F4]">
                  <h2 className="text-[11px] font-semibold text-[#71717A]">
                    Doku & Cycles Shader
                  </h2>
                  <p className="text-xs font-medium text-[#09090B]">
                    {spec.textureAndMaps.surfaceType}
                  </p>
                  <p className="text-[11px] font-mono text-[#52525B]">
                    UV: {spec.textureAndMaps.uvTileCm} · Rough: {spec.textureAndMaps.roughnessRange}
                  </p>
                  <p className="text-[11px] text-[#52525B] leading-relaxed">
                    {spec.textureAndMaps.shaderRecipe}
                  </p>
                </div>

                {/* Geometry & Micro Details (Püskül, Kenar, Derz, Modifiers) */}
                <div className="space-y-1.5 pb-3.5 border-b border-[#F1F2F4]">
                  <h2 className="text-[11px] font-semibold text-[#71717A]">
                    Geometri & Mikro Detaylar
                  </h2>
                  <ul className="space-y-1 text-[11.5px] text-[#3F3F46] leading-relaxed list-disc pl-3.5">
                    {spec.geometryBreakdown.slice(0, 3).map((line, i) => (
                      <li key={`g-${i}`}>{line}</li>
                    ))}
                    {spec.microDetails.slice(0, 2).map((line, i) => (
                      <li key={`m-${i}`}>{line}</li>
                    ))}
                  </ul>
                </div>

                {/* Modifiers */}
                <div className="space-y-1 text-[11px] text-[#52525B]">
                  <h2 className="font-semibold text-[#71717A]">Blender Modifiers</h2>
                  <ul className="space-y-0.5 list-disc pl-3.5">
                    {spec.blenderModifiers.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'prompts' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-[#09090B]">
                      Render / Cycles Prompt (EN)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText('renderPrompt', dynamicRenderPrompt)}
                      className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-[#18181B] bg-[#F4F4F5] hover:bg-[#E4E4E7] rounded cursor-pointer"
                    >
                      {copiedKey === 'renderPrompt' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11.5px] font-mono text-[#3F3F46] leading-relaxed bg-[#FAFAFA] border border-[#E5E7EB] rounded-md p-2.5">
                    {dynamicRenderPrompt}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-[#09090B]">
                      Blender AI / MCP Master Prompt (TR)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText('blenderPrompt', dynamicBlenderPrompt)}
                      className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-[#18181B] bg-[#F4F4F5] hover:bg-[#E4E4E7] rounded cursor-pointer"
                    >
                      {copiedKey === 'blenderPrompt' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11.5px] font-mono text-[#3F3F46] leading-relaxed bg-[#FAFAFA] border border-[#E5E7EB] rounded-md p-2.5">
                    {dynamicBlenderPrompt}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F1F2F4]">
                  <p className="text-[11px] font-semibold text-[#71717A] mb-1">
                    Işık & Kamera İpucu
                  </p>
                  <p className="text-xs text-[#3F3F46] leading-relaxed">
                    {spec.lightingAndCameraTip}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-2.5 h-full flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center p-0.5 bg-[#F4F4F5] rounded-md">
                    <button
                      type="button"
                      onClick={() => setCodeFormat('python')}
                      className={`h-6 px-2 text-[11px] font-medium rounded cursor-pointer ${
                        codeFormat === 'python'
                          ? 'bg-white text-[#09090B] shadow-xs'
                          : 'text-[#71717A]'
                      }`}
                    >
                      Blender .PY
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeFormat('json')}
                      className={`h-6 px-2 text-[11px] font-medium rounded cursor-pointer ${
                        codeFormat === 'json'
                          ? 'bg-white text-[#09090B] shadow-xs'
                          : 'text-[#71717A]'
                      }`}
                    >
                      AI JSON
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          codeFormat,
                          codeFormat === 'python' ? pythonScript : aiJsonPayload,
                        )
                      }
                      className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-[#18181B] bg-[#F4F4F5] hover:bg-[#E4E4E7] rounded cursor-pointer"
                    >
                      {copiedKey === codeFormat ? (
                        <Check className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3 h-3" aria-hidden="true" />
                      )}
                      <span>{copiedKey === codeFormat ? 'Tamam' : 'Kopyala'}</span>
                    </button>
                    {codeFormat === 'python' && (
                      <button
                        type="button"
                        onClick={handleDownloadPython}
                        className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded cursor-pointer"
                      >
                        <Download className="w-3 h-3" aria-hidden="true" />
                        <span>.py</span>
                      </button>
                    )}
                  </div>
                </div>

                <pre className="flex-1 text-[11px] font-mono leading-relaxed bg-[#111318] text-[#E4E4E7] p-3 rounded-md overflow-auto max-h-[540px]">
                  <code>{codeFormat === 'python' ? pythonScript : aiJsonPayload}</code>
                </pre>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Same-Product-Group Similar Recommendations Shelf */}
      {similar.items.length > 0 && (
        <section
          aria-labelledby="similar-assets-heading"
          data-testid="similar-assets-section"
          className="pt-5 border-t border-[#E5E7EB]"
        >
          <div className="flex items-center justify-between gap-4 mb-3.5">
            <div className="flex items-center gap-2">
              <h2
                id="similar-assets-heading"
                className="text-sm font-semibold text-[#09090B] tracking-tight"
              >
                Benzer Modeller · {similar.groupLabel}
              </h2>
              <span className="text-xs font-mono tabular-nums text-[#71717A]">
                ({similar.items.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => onBackToCatalog(activeAsset.category, similar.groupId)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer whitespace-nowrap"
            >
              <span>Tüm {similar.groupLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div
            data-testid="similar-assets-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            {similar.items.map((item) => {
              const itemSelected = selectedIds.has(item.id);
              return (
                <article
                  key={item.id}
                  className="group bg-white border border-[#E5E7EB] hover:border-[#A1A1AA] rounded-lg overflow-hidden flex flex-col transition-colors"
                >
                  <CatalogCardMediaStage
                    asset={item}
                    onInspect={() => {
                      onSelectAsset(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToScene(item, item.defaultFinishId);
                      }}
                      aria-label={`${item.name} sahneye ekle`}
                      title="Sahneye Ekle"
                      className={`absolute top-1.5 right-1.5 z-10 w-6 h-6 inline-flex items-center justify-center rounded border transition-colors cursor-pointer ${
                        itemSelected
                          ? 'bg-[#09090B] text-white border-[#09090B]'
                          : 'bg-white/95 text-[#18181B] border-[#E5E7EB] hover:bg-[#09090B] hover:text-white'
                      }`}
                    >
                      {itemSelected ? (
                        <Check className="w-3 h-3" aria-hidden="true" />
                      ) : (
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      )}
                    </button>
                  </CatalogCardMediaStage>

                  <div className="p-2 flex-1 flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAsset(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left text-xs font-medium text-[#09090B] hover:text-[#1D4ED8] line-clamp-1 cursor-pointer"
                      title={item.name}
                    >
                      {item.name}
                    </button>
                    <div className="flex items-center gap-1 text-[10.5px] text-[#71717A] mt-0.5 min-w-0">
                      {item.turkishMarket?.brand && (
                        <>
                          <span className="font-medium text-[#3F3F46] truncate">
                            {item.turkishMarket.brand}
                          </span>
                          <span aria-hidden="true" className="shrink-0">·</span>
                        </>
                      )}
                      <span className="font-mono tabular-nums shrink-0">
                        {formatDimensionsText(item)}
                      </span>
                    </div>
                    <div className="mt-auto pt-1.5 flex items-center gap-1">
                      {item.finishes.slice(0, 5).map((fin) => (
                        <button
                          key={fin.id}
                          type="button"
                          onClick={() => {
                            onSelectAsset(item, fin.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title={`${fin.label} ile incele`}
                          aria-label={`${item.name} (${fin.label})`}
                          className="w-2.5 h-2.5 rounded-full border border-black/20 hover:scale-125 transition-transform cursor-pointer"
                          style={{ backgroundColor: fin.primaryHex }}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
};
