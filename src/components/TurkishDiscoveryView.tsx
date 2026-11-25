import React, { useEffect, useState } from 'react';
import { Box, Check, Database, ExternalLink, Globe, Loader2, Plus, Search } from 'lucide-react';
import type {
  ArchitecturalAsset,
  AssetCategory,
  DiscoveryResponse,
  PlacementType,
  PolyHavenSearchItem,
} from '../lib/catalogTypes';
import {
  buildDefaultModelingSpec,
  EXTERNAL_PBR_PATTERNS,
  QUICK_POLYHAVEN_SEARCHES,
  QUICK_TURKISH_DISCOVERY_QUERIES,
} from '../lib/catalogData';
import { formatDimensionsText, normalizeTurkish } from '../lib/catalogLogic';

interface TurkishDiscoveryViewProps {
  initialQuery?: string;
  existingAssetIds: Set<string>;
  onAddDiscoveredToCatalog: (asset: ArchitecturalAsset) => Promise<void>;
  onInspectAsset: (asset: ArchitecturalAsset) => void;
}

type DiscoveryMode = 'polyhaven' | 'web';

function polyHavenItemToAsset(item: PolyHavenSearchItem): ArchitecturalAsset {
  const catBlob = `${item.categories.join(' ')} ${item.name}`.toLowerCase();
  let category: AssetCategory = 'Salon';
  let placement: PlacementType = 'floor';

  if (/lamp|chandelier|light|lantern|sconce/.test(catBlob)) {
    category = 'Aydınlatma';
    placement = /wall|sconce/.test(catBlob)
      ? 'wall-mounted'
      : /ceiling|chandelier|hanging/.test(catBlob)
        ? 'ceiling'
        : 'floor';
  } else if (/plant|vase|pot|flower|succulent/.test(catBlob)) {
    category = 'Dekor & Bitki';
  } else if (/outdoor|bench|picnic|fire_pit|street|garden|tree/.test(catBlob)) {
    category = 'Dış Cephe';
    placement = 'exterior-ground';
  } else if (/dining|kitchen|bar_chair|stove|fridge/.test(catBlob)) {
    category = 'Yemek & Mutfak';
  } else if (/mirror|bath|sink|toilet/.test(catBlob)) {
    category = 'Banyo';
    if (/mirror/.test(catBlob)) placement = 'wall-mounted';
  }

  const slug = normalizeTurkish(item.id).replace(/[^a-z0-9]+/g, '-');
  const id = `ph-${slug}`;

  return {
    id,
    slug,
    name: item.name,
    brandStyle: 'Poly Haven CC0 · Hazır 3D Model',
    category,
    archetype: 'external_gltf',
    placement,
    dimensionsCm: item.dimensionsCm,
    polyEstimate: item.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: item.thumbnailUrl,
    searchKeywords: [...item.tags, ...item.categories, 'poly haven', 'cc0', 'blender'],
    roomTags: [category.toLowerCase(), 'mimari sahne'],
    aiSummary: `${item.name} — Poly Haven CC0 havuzundan içe aktarılmış, gerçek PBR Diffuse/Normal/ARM haritalı hazır 3D Blender varlığı (${item.dimensionsCm.width}×${item.dimensionsCm.depth}×${item.dimensionsCm.height} cm).`,
    defaultFinishId: 'orijinal-pbr',
    finishes: [
      {
        id: 'orijinal-pbr',
        label: 'Orijinal PBR',
        materialKind: 'wood',
        primaryHex: '#C5B8A5',
        secondaryHex: '#6E5A47',
        accentHex: '#B89A67',
        roughness: 0.6,
        metalness: 0.05,
        preserveOriginalTextures: true,
      },
      {
        id: 'sicak-krem-ton',
        label: 'Sıcak Krem Ton',
        materialKind: 'fabric',
        primaryHex: '#EBE4D8',
        secondaryHex: '#C5B8A5',
        accentHex: '#B89A67',
        roughness: 0.72,
        metalness: 0.02,
      },
      {
        id: 'mat-antrasit-ton',
        label: 'Antrasit / Koyu',
        materialKind: 'metal',
        primaryHex: '#434750',
        secondaryHex: '#252830',
        accentHex: '#C29E60',
        roughness: 0.48,
        metalness: 0.12,
      },
    ],
    defaultPatternId: 'original_pbr',
    patterns: EXTERNAL_PBR_PATTERNS,
    modelingSpec: buildDefaultModelingSpec({
      name: item.name,
      brandStyle: 'Poly Haven CC0',
      category,
      dimensionsCm: item.dimensionsCm,
      primaryHex: '#C5B8A5',
      surfaceType: 'Poly Haven Stüdyo Taranmış PBR (Diffuse + Normal + ARM)',
      providerLabel: `Poly Haven CC0 (${item.id})`,
    }),
    modelSource: {
      provider: 'polyhaven',
      polyhavenId: item.id,
      gltfUrl: item.gltfUrl,
      blendUrl: item.blendUrl,
      license: 'CC0 1.0 Public Domain',
    },
    sourceOrigin: 'polyhaven-cc0',
  };
}

export const TurkishDiscoveryView: React.FC<TurkishDiscoveryViewProps> = ({
  initialQuery = '',
  existingAssetIds,
  onAddDiscoveredToCatalog,
  onInspectAsset,
}) => {
  const [mode, setMode] = useState<DiscoveryMode>('polyhaven');

  // Poly Haven 522+ live pool state
  const [phQuery, setPhQuery] = useState(initialQuery);
  const [phLoading, setPhLoading] = useState(false);
  const [phError, setPhError] = useState('');
  const [phItems, setPhItems] = useState<PolyHavenSearchItem[]>([]);
  const [phMeta, setPhMeta] = useState<{ totalPool: number; matchedCount: number } | null>(null);

  // Turkish Web AI Discovery state
  const [webQuery, setWebQuery] = useState(initialQuery);
  const [validationError, setValidationError] = useState('');
  const [webLoading, setWebLoading] = useState(false);
  const [webError, setWebError] = useState('');
  const [webResult, setWebResult] = useState<DiscoveryResponse | null>(null);

  const [addingId, setAddingId] = useState<string | null>(null);

  const runPolyHavenSearch = async (searchTerm: string) => {
    setPhLoading(true);
    setPhError('');
    try {
      const res = await fetch(
        `/api/v1/polyhaven/search?q=${encodeURIComponent(searchTerm.trim())}&limit=24`,
      );
      const data = await res.json();
      if (!res.ok) {
        setPhError(data.error || 'Poly Haven 3D havuzu sorgulanamadı.');
        return;
      }
      setPhItems(Array.isArray(data.items) ? data.items : []);
      setPhMeta({ totalPool: data.totalPool || 522, matchedCount: data.matchedCount || 0 });
    } catch {
      setPhError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setPhLoading(false);
    }
  };

  useEffect(() => {
    runPolyHavenSearch(initialQuery || '');
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setPhQuery(initialQuery);
      setWebQuery(initialQuery);
      runPolyHavenSearch(initialQuery);
    }
  }, [initialQuery]);

  const runWebDiscovery = async (searchTerm: string) => {
    const clean = searchTerm.trim();
    if (clean.length < 2) {
      setValidationError('Lütfen en az 2 karakterli bir Türkçe mobilya veya mimari arama terimi girin.');
      return;
    }
    setValidationError('');
    setWebError('');
    setWebLoading(true);
    try {
      const res = await fetch('/api/v1/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWebError(data.error || 'Web keşfi sırasında bir hata oluştu.');
        return;
      }
      setWebResult(data as DiscoveryResponse);
    } catch {
      setWebError('Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setWebLoading(false);
    }
  };

  const handleAdd = async (asset: ArchitecturalAsset) => {
    setAddingId(asset.id);
    try {
      await onAddDiscoveredToCatalog(asset);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section aria-labelledby="discovery-heading" className="py-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div className="max-w-3xl">
          <h1
            id="discovery-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111318]"
          >
            Hazır 3D Model Havuzu & Türkiye Web Keşfi
          </h1>
          <p className="text-sm text-[#525866] mt-1.5 leading-relaxed">
            Sıfırdan modellemek yerine Poly Haven&rsquo;ın 522+ ücretsiz CC0 Blender 3D kütüphanesinde Türkçe veya İngilizce arayın; görseliyle %100 birebir hazır PBR .GLTF ve .BLEND modellerini tek tıkla kataloğa ve 3D Stüdyo&rsquo;ya alın.
          </p>
        </div>

        {/* Mode Switcher */}
        <div
          role="tablist"
          aria-label="Keşif kaynağı"
          className="inline-flex items-center p-1 bg-[#EEF1F5] rounded-lg shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'polyhaven'}
            onClick={() => setMode('polyhaven')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'polyhaven'
                ? 'bg-white text-[#111318] shadow-xs'
                : 'text-[#525866] hover:text-[#111318]'
            }`}
          >
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Poly Haven CC0 Havuzu (522+ Model)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'web'}
            onClick={() => setMode('web')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'web'
                ? 'bg-white text-[#111318] shadow-xs'
                : 'text-[#525866] hover:text-[#111318]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <span>TR Web & Pinterest AI Tarama</span>
          </button>
        </div>
      </div>

      {mode === 'polyhaven' ? (
        <div>
          {/* Poly Haven Live Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runPolyHavenSearch(phQuery);
            }}
            className="bg-white border border-[#E4E7EC] rounded-xl p-5 mb-6"
          >
            <label htmlFor="polyhaven-search-input" className="block text-sm font-medium text-[#111318] mb-2">
              Hazır CC0 Blender 3D Model Ara (Türkçe veya İngilizce)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="polyhaven-search-input"
                  type="text"
                  value={phQuery}
                  onChange={(e) => setPhQuery(e.target.value)}
                  placeholder="Örn: koltuk, sandalye, masa, avize, bitki, dolap, vazo, sofa, lamp..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8F9FA] border border-[#D8DCE3] rounded-lg text-[#111318] placeholder:text-[#7B8190] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={phLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {phLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Havuz Taranıyor...</span>
                  </>
                ) : (
                  <span>Hazır Modelleri Getir</span>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F0F2F5] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#525866]">Hızlı Filtre:</span>
                {QUICK_POLYHAVEN_SEARCHES.map((q) => (
                  <button
                    key={q.query}
                    type="button"
                    onClick={() => {
                      setPhQuery(q.query);
                      runPolyHavenSearch(q.query);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              {phMeta && (
                <p className="text-xs font-mono tabular-nums text-[#525866]">
                  {phMeta.matchedCount} eşleşme / {phMeta.totalPool} CC0 model
                </p>
              )}
            </div>
          </form>

          {phError && (
            <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              {phError}
            </div>
          )}

          {phLoading ? (
            <div className="py-16 flex items-center justify-center gap-2.5 text-sm text-[#525866]">
              <Loader2 className="w-5 h-5 animate-spin text-[#1E40AF]" aria-hidden="true" />
              <span>Poly Haven CC0 3D model havuzu yükleniyor...</span>
            </div>
          ) : phItems.length === 0 ? (
            <div className="bg-white border border-[#E4E7EC] rounded-xl p-10 text-center">
              <p className="text-sm font-semibold text-[#111318]">
                Bu arama terimiyle eşleşen Poly Haven modeli bulunamadı.
              </p>
              <p className="text-xs text-[#525866] mt-1">
                Farklı bir Türkçe veya İngilizce kelime deneyin (örn. koltuk, masa, chair, lamp, cabinet, plant).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {phItems.map((item) => {
                const candidateAsset = polyHavenItemToAsset(item);
                const alreadyAdded = existingAssetIds.has(candidateAsset.id);
                return (
                  <article
                    key={item.id}
                    className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full bg-[#EEF1F5] overflow-hidden">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-[11px] font-mono tabular-nums text-[#525866]">
                        {item.dimensionsCm.width}×{item.dimensionsCm.depth}×{item.dimensionsCm.height} cm · ~
                        {(item.polyEstimate / 1000).toFixed(1)}k poly · CC0
                      </p>
                      <h3 className="text-sm font-semibold text-[#111318] mt-1">{item.name}</h3>
                      <p className="text-[11px] text-[#6B7280] mt-0.5 truncate">
                        {item.categories.join(', ')}
                      </p>

                      <div className="mt-auto pt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectAsset(candidateAsset)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-lg cursor-pointer whitespace-nowrap"
                        >
                          <Box className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>3D İncele</span>
                        </button>
                        <button
                          type="button"
                          disabled={alreadyAdded || addingId === candidateAsset.id}
                          onClick={() => handleAdd(candidateAsset)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap ${
                            alreadyAdded
                              ? 'bg-[#EFF4FF] text-[#1E40AF] border border-[#BFDBFE]'
                              : 'bg-[#111318] text-white hover:bg-[#1E40AF]'
                          }`}
                        >
                          {alreadyAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Katalogda</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{addingId === candidateAsset.id ? 'Ekleniyor...' : 'Kataloğa Al'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Turkish Web & Pinterest AI Grounding Discovery */
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runWebDiscovery(webQuery);
            }}
            noValidate
            className="bg-white border border-[#E4E7EC] rounded-xl p-5 mb-8"
          >
            <label htmlFor="turkish-discovery-input" className="block text-sm font-medium text-[#111318] mb-2">
              Türkçe Mobilya, Vitrifiye veya Dış Cephe Arama Terimi
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="turkish-discovery-input"
                  type="text"
                  value={webQuery}
                  onChange={(e) => {
                    setWebQuery(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="Örn: İnegöl modern bukle berjer, çanak lavabolu banyo dolabı..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8F9FA] border border-[#D8DCE3] rounded-lg text-[#111318] placeholder:text-[#7B8190] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={webLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {webLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Türkiye Pazarı Taranıyor...</span>
                  </>
                ) : (
                  <span>TR Web&rsquo;de Ara</span>
                )}
              </button>
            </div>

            {validationError && (
              <p role="alert" className="text-xs font-medium text-red-700 mt-2.5">
                {validationError}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-[#F0F2F5] flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#525866] mr-1">Sık Aranan Türkçe Terimler:</span>
              {QUICK_TURKISH_DISCOVERY_QUERIES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setWebQuery(term);
                    runWebDiscovery(term);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          {webError && (
            <div role="alert" className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              <p className="font-semibold">Arama Tamamlanamadı</p>
              <p className="mt-1">{webError}</p>
            </div>
          )}

          {webResult && (
            <div className="space-y-6">
              <div className="bg-white border border-[#E4E7EC] rounded-xl p-5">
                <h2 className="text-base font-semibold text-[#111318]">
                  &ldquo;{webResult.query}&rdquo; Keşif Özeti
                </h2>
                <p className="text-sm text-[#525866] mt-1">{webResult.summary}</p>
                {webResult.groundingSources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#F0F2F5]">
                    <p className="text-xs font-medium text-[#525866] mb-2">Referans Türkiye Web Kaynakları</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {webResult.groundingSources.map((src, idx) => (
                        <li key={`${src.uri}-${idx}`}>
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#1E40AF] hover:underline"
                          >
                            <span className="truncate max-w-[260px]">{src.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {webResult.discoveredAssets.map((asset) => {
                  const alreadyAdded = existingAssetIds.has(asset.id);
                  return (
                    <article
                      key={asset.id}
                      className="bg-white border border-[#E4E7EC] rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#525866]">
                          <span>{asset.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDimensionsText(asset)}</span>
                        </div>
                        <h3 className="text-base font-semibold text-[#111318] mt-2">{asset.name}</h3>
                        <p className="text-xs text-[#525866] mt-0.5">{asset.brandStyle}</p>
                        <p className="text-xs text-[#525866] mt-3 leading-relaxed">{asset.aiSummary}</p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectAsset(asset)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-lg cursor-pointer whitespace-nowrap"
                        >
                          <Box className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>3D Önizle</span>
                        </button>
                        <button
                          type="button"
                          disabled={alreadyAdded || addingId === asset.id}
                          onClick={() => handleAdd(asset)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap ${
                            alreadyAdded
                              ? 'bg-[#EFF4FF] text-[#1E40AF] border border-[#BFDBFE]'
                              : 'bg-[#111318] text-white hover:bg-[#1E40AF]'
                          }`}
                        >
                          {alreadyAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Katalogda</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{addingId === asset.id ? 'Ekleniyor...' : 'Kataloğa Ekle'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
