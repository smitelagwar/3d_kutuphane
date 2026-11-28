import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Grid2x2,
  LayoutGrid,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { PinchZoomPortal } from './PinchZoomPortal';
import type {
  ArchitecturalAsset,
  AssetCategory,
  CatalogFilterState,
  CatalogSortBy,
  PlacementType,
  SourceFilter,
} from '../lib/catalogTypes';
import { PLACEMENT_LABELS } from '../lib/catalogData';
import { formatDimensionsText } from '../lib/catalogLogic';
import {
  clampCardDragOffsetPx,
  isHorizontalSwipeGesture,
  resolveSwipeTargetSlide,
  type CardMediaSlide,
} from '../lib/cardSwipeLogic';
import { buildTaxonomyTree, classifyAssetGroup, getProductGroupMeta } from '../lib/taxonomy';

const SOURCE_OPTIONS: Array<{ value: SourceFilter; label: string }> = [
  { value: 'all', label: 'Tümü' },
  { value: 'hf', label: 'Hazır GLB' },
  { value: 'abo', label: 'İnegöl GLB' },
  { value: 'polyhaven', label: 'Poly Haven' },
  { value: 'khronos', label: 'Khronos' },
  { value: 'procedural', label: 'TR CAD' },
];

const PLACEMENT_SHORT: Array<{ value: PlacementType | 'all'; label: string }> = [
  { value: 'all', label: 'Tümü' },
  { value: 'floor', label: 'Zemin' },
  { value: 'wall-mounted', label: 'Duvar' },
  { value: 'ceiling', label: 'Tavan' },
  { value: 'exterior-ground', label: 'Dış Cephe' },
];

const SORT_LABELS: Record<CatalogSortBy, string> = {
  featured: 'Önerilen',
  'width-asc': 'Genişlik ↑',
  'width-desc': 'Genişlik ↓',
  'poly-desc': 'Detay (Poly) ↓',
};

const PAGE_SIZE = 30;

interface CatalogSectionProps {
  assets: ArchitecturalAsset[];
  allAssets: ArchitecturalAsset[];
  totalCount: number;
  filters: CatalogFilterState;
  selectedIds: Set<string>;
  onFilterChange: (next: Partial<CatalogFilterState>) => void;
  onInspectAsset: (asset: ArchitecturalAsset, finishId?: string) => void;
  onAddToScene: (asset: ArchitecturalAsset) => void;
  onOpenDiscoveryWithQuery: (query: string) => void;
}

interface CatalogCardMediaStageProps {
  asset: ArchitecturalAsset;
  onInspect: () => void;
  children?: React.ReactNode;
}

export const CatalogCardMediaStage: React.FC<CatalogCardMediaStageProps> = ({
  asset,
  onInspect,
  children,
}) => {
  const [failed, setFailed] = useState(false);
  const [roomFailed, setRoomFailed] = useState(false);
  const [activeSlide, setActiveSlide] = useState<CardMediaSlide>(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPinchZooming, setIsPinchZooming] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const suppressClickRef = useRef(false);
  const pinchActiveRef = useRef(false);
  const gestureRef = useRef<{
    active: boolean;
    mode: 'touch' | 'pointer' | null;
    startX: number;
    startY: number;
    lastDx: number;
    horizontalLocked: boolean;
  }>({
    active: false,
    mode: null,
    startX: 0,
    startY: 0,
    lastDx: 0,
    horizontalLocked: false,
  });

  const handlePinchStateChange = (active: boolean) => {
    pinchActiveRef.current = active;
    setIsPinchZooming(active);
    if (active) {
      // Cancel any in-progress 1-finger horizontal swipe cleanly
      gestureRef.current.active = false;
      gestureRef.current.horizontalLocked = false;
      setIsDragging(false);
      setDragOffsetPx(0);
      suppressClickRef.current = true;
    } else {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 220);
    }
  };

  const bareUrl = asset.hoverCutoutUrl || asset.thumbnailUrl;
  const hasRoomRender = Boolean(asset.roomRenderUrl) && !roomFailed;

  const provider = asset.modelSource?.provider;
  const bareImgClass =
    asset.hoverCutoutUrl || provider === 'abo' || provider === 'hf'
      ? 'w-full h-full object-contain p-3 bg-white'
      : provider === 'polyhaven' || provider === 'khronos'
        ? 'w-full h-full object-contain p-3 bg-[#F6F7F9]'
        : 'w-full h-full object-cover';

  const startGesture = (clientX: number, clientY: number, mode: 'touch' | 'pointer') => {
    if (!hasRoomRender) return;
    gestureRef.current = {
      active: true,
      mode,
      startX: clientX,
      startY: clientY,
      lastDx: 0,
      horizontalLocked: false,
    };
  };

  const moveGesture = (clientX: number, clientY: number, mode: 'touch' | 'pointer') => {
    const g = gestureRef.current;
    if (!g.active || g.mode !== mode) return;
    const dx = clientX - g.startX;
    const dy = clientY - g.startY;

    if (!g.horizontalLocked) {
      if (isHorizontalSwipeGesture({ dx, dy })) {
        g.horizontalLocked = true;
        suppressClickRef.current = true;
        setIsDragging(true);
      } else if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        // User is vertically scrolling the catalog; release gesture cleanly
        g.active = false;
        return;
      } else {
        return;
      }
    }

    g.lastDx = dx;
    const width = stageRef.current?.clientWidth || 300;
    setDragOffsetPx(clampCardDragOffsetPx(activeSlide, dx, width));
  };

  const endGesture = (mode: 'touch' | 'pointer') => {
    const g = gestureRef.current;
    if (!g.active || g.mode !== mode) return;
    const wasLocked = g.horizontalLocked;
    const dx = g.lastDx;
    g.active = false;
    g.mode = null;
    g.horizontalLocked = false;

    if (wasLocked) {
      const width = stageRef.current?.clientWidth || 300;
      const nextSlide = resolveSwipeTargetSlide({
        currentSlide: activeSlide,
        dx,
        containerWidth: width,
      });
      setActiveSlide(nextSlide);
      setIsDragging(false);
      setDragOffsetPx(0);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }
  };

  const handleStageClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onInspect();
  };

  const trackTransform = `translate3d(calc(${activeSlide === 0 ? '0%' : '-50%'} + ${dragOffsetPx}px), 0, 0)`;
  const activeZoomSrc = hasRoomRender && activeSlide === 0 ? asset.roomRenderUrl : bareUrl;
  const activeZoomImgClass =
    hasRoomRender && activeSlide === 0 ? 'w-full h-full object-cover' : bareImgClass;

  return (
    <div
      ref={stageRef}
      data-has-room-render={hasRoomRender ? 'true' : undefined}
      data-active-slide={hasRoomRender ? String(activeSlide) : undefined}
      data-pinch-zooming={isPinchZooming ? 'true' : undefined}
      onTouchStart={(e) => {
        if (e.touches.length >= 2) {
          gestureRef.current.active = false;
          gestureRef.current.horizontalLocked = false;
          setIsDragging(false);
          setDragOffsetPx(0);
          return;
        }
        if (e.touches.length === 1 && !pinchActiveRef.current) {
          startGesture(e.touches[0].clientX, e.touches[0].clientY, 'touch');
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length >= 2 || pinchActiveRef.current) {
          gestureRef.current.active = false;
          gestureRef.current.horizontalLocked = false;
          return;
        }
        if (e.touches.length === 1) {
          moveGesture(e.touches[0].clientX, e.touches[0].clientY, 'touch');
        }
      }}
      onTouchEnd={() => endGesture('touch')}
      onTouchCancel={() => endGesture('touch')}
      onPointerDown={(e) => {
        if (e.pointerType !== 'touch' && e.button === 0) {
          startGesture(e.clientX, e.clientY, 'pointer');
        }
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'touch') {
          moveGesture(e.clientX, e.clientY, 'pointer');
        }
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== 'touch') {
          endGesture('pointer');
        }
      }}
      onPointerCancel={(e) => {
        if (e.pointerType !== 'touch') {
          endGesture('pointer');
        }
      }}
      className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#F1F2F4] bg-white touch-pan-y select-none"
    >
      <button
        type="button"
        onClick={handleStageClick}
        aria-label={`${asset.name} 3D modelini incele`}
        className={`w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#2563EB] transition-opacity duration-75 ${
          isPinchZooming ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {failed || !bareUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F4F5] text-[#71717A] p-4 text-center">
            <Box className="w-6 h-6 mb-1.5 text-[#52525B]" aria-hidden="true" />
            <span className="text-[11px] font-medium line-clamp-2">{asset.name}</span>
          </div>
        ) : hasRoomRender ? (
          <div
            className={`flex h-full w-[200%] will-change-transform ${
              isDragging ? '' : 'transition-transform duration-200 ease-out'
            }`}
            style={{ transform: trackTransform }}
          >
            {/* Slide 0: Photorealistic in-room architectural render (desktop mouse hover still crossfades smoothly) */}
            <div className="relative w-1/2 h-full shrink-0 bg-white overflow-hidden">
              <img
                src={bareUrl}
                alt={`${asset.name} yalın model görünümü`}
                loading="lazy"
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
                onError={() => setFailed(true)}
                className={`absolute inset-0 ${bareImgClass} opacity-0 transition-opacity duration-200 ease-out ${
                  activeSlide === 0 && !isDragging
                    ? '[@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-100'
                    : ''
                }`}
              />
              <img
                src={asset.roomRenderUrl}
                alt={asset.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                onError={() => setRoomFailed(true)}
                className={`absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-200 ease-out ${
                  activeSlide === 0 && !isDragging
                    ? '[@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-0'
                    : ''
                }`}
              />
            </div>

            {/* Slide 1: Bare white-background 3D model cutout revealed by swiping sideways */}
            <div className="relative w-1/2 h-full shrink-0 bg-white overflow-hidden">
              <img
                src={bareUrl}
                alt={`${asset.name} yalın 3D model görünümü`}
                loading="lazy"
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
                onError={() => setFailed(true)}
                className={bareImgClass}
              />
            </div>
          </div>
        ) : (
          <img
            src={bareUrl}
            alt={asset.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={`${bareImgClass} transition-transform duration-200 group-hover:scale-[1.04]`}
          />
        )}
      </button>

      {/* Subtle 2-dot swipe pagination indicator for mobile/touch discovery & direct tap switching */}
      {hasRoomRender && !failed && !isPinchZooming && (
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSlide((prev) => (prev === 0 ? 1 : 0));
          }}
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-10 items-center gap-1.5 px-2 py-1.5 rounded-full backdrop-blur-[2px] transition-colors cursor-pointer ${
            activeSlide === 1
              ? 'flex bg-black/10'
              : 'flex lg:hidden [@media(hover:none)]:flex bg-black/30'
          }`}
          role="group"
          aria-label={`${asset.name} görünüm seçici`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide(0);
            }}
            aria-label={`${asset.name} oda içi görünüm`}
            aria-pressed={activeSlide === 0}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeSlide === 0
                ? 'w-3.5 bg-white shadow-xs'
                : 'w-1.5 bg-[#09090B]/35 hover:bg-[#09090B]/60'
            }`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide(1);
            }}
            aria-label={`${asset.name} yalın 3D model görünümü`}
            aria-pressed={activeSlide === 1}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeSlide === 1
                ? 'w-3.5 bg-[#09090B]'
                : 'w-1.5 bg-white/65 hover:bg-white'
            }`}
          />
        </div>
      )}

      {!isPinchZooming && children}

      <PinchZoomPortal
        targetRef={stageRef}
        imageSrc={activeZoomSrc}
        imageAlt={asset.name}
        imageClassName={activeZoomImgClass}
        frameBgClassName="bg-white"
        disabled={failed || !activeZoomSrc}
        onPinchStateChange={handlePinchStateChange}
      />
    </div>
  );
};

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  assets,
  allAssets,
  totalCount,
  filters,
  selectedIds,
  onFilterChange,
  onInspectAsset,
  onAddToScene,
  onOpenDiscoveryWithQuery,
}) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [denseGrid, setDenseGrid] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'Oda Tasarımları': true,
    Banyo: true,
    'Çamaşır Odası': true,
  });
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 640);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    filters.query,
    filters.category,
    filters.subCategory,
    filters.productGroup,
    filters.placement,
    filters.source,
    filters.sortBy,
  ]);

  // Expand active category automatically when selected
  useEffect(() => {
    if (filters.category !== 'Tümü') {
      setExpandedCats((prev) => ({ ...prev, [filters.category]: true }));
    }
  }, [filters.category]);

  // Keyboard "/" shortcut to jump straight to search like GitHub / Linear
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const taxonomyTree = useMemo(() => buildTaxonomyTree(allAssets), [allAssets]);

  // Balanced round-robin showcase for default unfiltered overview & Banyo overview
  const orderedAssets = useMemo(() => {
    if (filters.sortBy && filters.sortBy !== 'featured') return assets;
    if (filters.query.trim()) return assets;

    const isBanyoOverview =
      filters.category === 'Banyo' &&
      (!filters.productGroup || filters.productGroup === 'all') &&
      (!filters.subCategory || filters.subCategory === 'Tümü');

    const isAllOverview =
      filters.category === 'Tümü' &&
      (!filters.productGroup || filters.productGroup === 'all') &&
      (!filters.source || filters.source === 'all') &&
      filters.placement === 'all';

    if (!isBanyoOverview && !isAllOverview) return assets;

    // Interleave across product groups so the architect sees diverse ready-made models immediately
    const buckets = new Map<string, ArchitecturalAsset[]>();
    const groupKeys: string[] = [];
    const prioritized = [...assets].sort((a, b) => {
      const rank = (x: ArchitecturalAsset) =>
        x.sourceOrigin === 'room-scene'
          ? 0
          : x.sourceOrigin === 'interior-ready' || x.sourceOrigin === 'bath-ready'
            ? 1
            : x.sourceOrigin === 'abo-modern'
              ? 2
              : x.sourceOrigin === 'polyhaven-cc0'
                ? 3
                : 4;
      return rank(a) - rank(b);
    });

    for (const item of prioritized) {
      const key = classifyAssetGroup(item).id;
      let list = buckets.get(key);
      if (!list) {
        list = [];
        buckets.set(key, list);
        groupKeys.push(key);
      }
      list.push(item);
    }

    const interleaved: ArchitecturalAsset[] = [];
    let round = 0;
    let added = true;
    while (added) {
      added = false;
      for (const k of groupKeys) {
        const list = buckets.get(k)!;
        if (round < list.length) {
          interleaved.push(list[round]);
          added = true;
        }
      }
      round += 1;
    }
    return interleaved;
  }, [assets, filters]);

  const visibleAssets = useMemo(
    () => orderedAssets.slice(0, visibleCount),
    [orderedAssets, visibleCount],
  );
  const remainingCount = Math.max(0, orderedAssets.length - visibleAssets.length);

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    filters.category !== 'Tümü' ||
    Boolean(filters.productGroup && filters.productGroup !== 'all') ||
    filters.placement !== 'all' ||
    Boolean(filters.source && filters.source !== 'all');

  const activeGroupMeta =
    filters.productGroup && filters.productGroup !== 'all'
      ? getProductGroupMeta(filters.productGroup)
      : undefined;

  const resetAllFilters = () => {
    onFilterChange({
      query: '',
      category: 'Tümü',
      subCategory: 'Tümü',
      productGroup: 'all',
      placement: 'all',
      source: 'all',
      sortBy: 'featured',
    });
  };

  const toggleExpandCategory = (cat: AssetCategory) => {
    setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const sidebarContent = (
    <div className="space-y-5">
      {/* Hierarchical Category & Product Group Tree */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-semibold text-[#71717A] tracking-tight">
            Kategoriler
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2563EB] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        <nav aria-label="Kategori ağacı" className="space-y-0.5">
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                category: 'Tümü',
                subCategory: 'Tümü',
                productGroup: 'all',
              })
            }
            aria-pressed={filters.category === 'Tümü' && (!filters.productGroup || filters.productGroup === 'all')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filters.category === 'Tümü' && (!filters.productGroup || filters.productGroup === 'all')
                ? 'bg-[#09090B] text-white'
                : 'text-[#27272A] hover:bg-[#F4F4F5]'
            }`}
          >
            <span>Tümü</span>
            <span
              className={`text-[11px] font-mono tabular-nums ${
                filters.category === 'Tümü' && (!filters.productGroup || filters.productGroup === 'all')
                  ? 'text-white/75'
                  : 'text-[#71717A]'
              }`}
            >
              {allAssets.length}
            </span>
          </button>

          {taxonomyTree.map((node) => {
            const isCatSelected =
              filters.category === node.category &&
              (!filters.productGroup || filters.productGroup === 'all');
            const isExpanded = Boolean(expandedCats[node.category]);
            const hasActiveChild =
              filters.productGroup &&
              filters.productGroup !== 'all' &&
              node.groups.some((g) => g.id === filters.productGroup);

            return (
              <div key={node.category}>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => toggleExpandCategory(node.category)}
                    aria-expanded={isExpanded}
                    aria-label={`${node.category} alt gruplarını ${isExpanded ? 'daralt' : 'genişlet'}`}
                    className="w-5 h-7 inline-flex items-center justify-center text-[#71717A] hover:text-[#09090B] rounded cursor-pointer shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        category: node.category,
                        subCategory: 'Tümü',
                        productGroup: 'all',
                      });
                      setExpandedCats((prev) => ({ ...prev, [node.category]: true }));
                    }}
                    aria-pressed={isCatSelected}
                    className={`flex-1 flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer min-w-0 ${
                      isCatSelected
                        ? 'bg-[#09090B] text-white'
                        : hasActiveChild
                          ? 'text-[#09090B] font-semibold hover:bg-[#F4F4F5]'
                          : 'text-[#27272A] hover:bg-[#F4F4F5]'
                    }`}
                  >
                    <span className="truncate">{node.category}</span>
                    <span
                      className={`text-[11px] font-mono tabular-nums ml-2 shrink-0 ${
                        isCatSelected ? 'text-white/75' : 'text-[#71717A]'
                      }`}
                    >
                      {node.count}
                    </span>
                  </button>
                </div>

                {isExpanded && node.groups.length > 0 && (
                  <div className="ml-5 pl-2 border-l border-[#E5E7EB] my-0.5 space-y-0.5">
                    {node.groups.map((grp) => {
                      const active = filters.productGroup === grp.id;
                      return (
                        <button
                          key={grp.id}
                          type="button"
                          onClick={() => {
                            onFilterChange({
                              category: node.category,
                              subCategory: 'Tümü',
                              productGroup: grp.id,
                            });
                            setMobileFiltersOpen(false);
                          }}
                          aria-pressed={active}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded text-[12px] transition-colors cursor-pointer min-w-0 ${
                            active
                              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-medium'
                              : 'text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]'
                          }`}
                        >
                          <span className="truncate">{grp.label}</span>
                          <span
                            className={`text-[10px] font-mono tabular-nums ml-2 shrink-0 ${
                              active ? 'text-[#1D4ED8]' : 'text-[#A1A1AA]'
                            }`}
                          >
                            {grp.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Placement Facet */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <p className="text-[11px] font-semibold text-[#71717A] mb-2 px-1">Yerleşim</p>
        <div className="grid grid-cols-2 gap-1" role="group" aria-label="Yerleşim filtresi">
          {PLACEMENT_SHORT.map((opt) => {
            const active = filters.placement === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange({ placement: opt.value })}
                aria-pressed={active}
                className={`h-7 px-2 text-[11px] font-medium rounded border transition-colors cursor-pointer truncate ${
                  active
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-white text-[#3F3F46] border-[#E5E7EB] hover:border-[#A1A1AA]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Source Facet */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <p className="text-[11px] font-semibold text-[#71717A] mb-2 px-1">Kaynak</p>
        <div className="grid grid-cols-2 gap-1" role="group" aria-label="Kaynak filtresi">
          {SOURCE_OPTIONS.map((opt) => {
            const active = (filters.source || 'all') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange({ source: opt.value })}
                aria-pressed={active}
                className={`h-7 px-2 text-[11px] font-medium rounded border transition-colors cursor-pointer truncate ${
                  active
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-white text-[#3F3F46] border-[#E5E7EB] hover:border-[#A1A1AA]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section id="katalog" aria-label="3D Varlık Kataloğu" className="py-4">
      <div className="flex items-start gap-5">
        {/* Left Sticky Taxonomy Sidebar (Desktop) */}
        <aside className="hidden lg:block w-[244px] shrink-0 sticky top-16 max-h-[calc(100vh-80px)] overflow-y-auto pr-1">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-3">
            {sidebarContent}
          </div>
        </aside>

        {/* Main Asset Browser Workspace */}
        <div className="flex-1 min-w-0">
          {/* Compact Single-Row Utility & Search Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-[#09090B] bg-white border border-[#E5E7EB] rounded-md cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kategoriler</span>
            </button>

            <div className="relative flex-1 min-w-[220px]">
              <label htmlFor="catalog-search-input" className="sr-only">
                Türkçe model ara
              </label>
              <Search
                className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                id="catalog-search-input"
                type="search"
                value={filters.query}
                onChange={(e) => onFilterChange({ query: e.target.value })}
                placeholder="Ara: Merinos halı, Enza koltuk, Artema kağıtlık, E.C.A. kombi, VitrA, Bosch...  (/)"
                className="w-full h-9 pl-8 pr-8 text-[13px] bg-white border border-[#E5E7EB] rounded-md text-[#09090B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ query: '' })}
                  aria-label="Aramayı temizle"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#71717A] hover:text-[#09090B] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <label htmlFor="catalog-sort-select" className="sr-only">
              Sıralama
            </label>
            <select
              id="catalog-sort-select"
              value={filters.sortBy || 'featured'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as CatalogSortBy })}
              className="h-9 pl-2.5 pr-7 text-xs font-medium bg-white border border-[#E5E7EB] rounded-md text-[#18181B] focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              {(Object.keys(SORT_LABELS) as CatalogSortBy[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>

            {/* Grid Density Toggle (4-col vs 5-col) */}
            <div
              className="hidden xl:inline-flex items-center bg-white border border-[#E5E7EB] rounded-md p-0.5 h-9"
              role="group"
              aria-label="Izgara yoğunluğu"
            >
              <button
                type="button"
                onClick={() => setDenseGrid(false)}
                aria-pressed={!denseGrid}
                aria-label="Standart 4 sütun"
                title="4 Sütun"
                className={`h-7 w-7 inline-flex items-center justify-center rounded cursor-pointer ${
                  !denseGrid ? 'bg-[#F4F4F5] text-[#09090B]' : 'text-[#71717A] hover:text-[#09090B]'
                }`}
              >
                <Grid2x2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setDenseGrid(true)}
                aria-pressed={denseGrid}
                aria-label="Sıkı 5 sütun"
                title="5 Sütun"
                className={`h-7 w-7 inline-flex items-center justify-center rounded cursor-pointer ${
                  denseGrid ? 'bg-[#F4F4F5] text-[#09090B]' : 'text-[#71717A] hover:text-[#09090B]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <span className="text-xs font-mono tabular-nums text-[#71717A] whitespace-nowrap ml-auto sm:ml-1">
              {assets.length} / {totalCount}
            </span>
          </div>

          {/* Mobile Collapsible Sidebar Panel */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mb-4 bg-white border border-[#E5E7EB] rounded-lg p-3.5">
              {sidebarContent}
            </div>
          )}

          {/* Active Removable Filter Summary Strip (only when filtered) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {filters.category !== 'Tümü' && (
                <button
                  type="button"
                  onClick={() =>
                    onFilterChange({ category: 'Tümü', subCategory: 'Tümü', productGroup: 'all' })
                  }
                  className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium bg-white border border-[#D4D4D8] text-[#18181B] rounded hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <span>{filters.category}</span>
                  <X className="w-3 h-3 text-[#71717A]" aria-hidden="true" />
                </button>
              )}
              {activeGroupMeta && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ productGroup: 'all' })}
                  className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] rounded hover:bg-[#DBEAFE] cursor-pointer"
                >
                  <span>{activeGroupMeta.label}</span>
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
              {filters.placement !== 'all' && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ placement: 'all' })}
                  className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium bg-white border border-[#D4D4D8] text-[#18181B] rounded hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <span>{PLACEMENT_LABELS[filters.placement]}</span>
                  <X className="w-3 h-3 text-[#71717A]" aria-hidden="true" />
                </button>
              )}
              {filters.source && filters.source !== 'all' && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ source: 'all' })}
                  className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium bg-white border border-[#D4D4D8] text-[#18181B] rounded hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <span>{SOURCE_OPTIONS.find((s) => s.value === filters.source)?.label}</span>
                  <X className="w-3 h-3 text-[#71717A]" aria-hidden="true" />
                </button>
              )}
              {filters.query.trim() && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ query: '' })}
                  className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium bg-white border border-[#D4D4D8] text-[#18181B] rounded hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <span>&ldquo;{filters.query.trim()}&rdquo;</span>
                  <X className="w-3 h-3 text-[#71717A]" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-medium text-[#71717A] hover:text-[#09090B] px-1.5 cursor-pointer"
              >
                Temizle
              </button>
            </div>
          )}

          {/* Asset Grid or Empty State */}
          {assets.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-10 text-center">
              <p className="text-sm font-semibold text-[#09090B]">
                Eşleşen 3D varlık bulunamadı.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                {filters.query.trim().length >= 2 && (
                  <button
                    type="button"
                    onClick={() => onOpenDiscoveryWithQuery(filters.query.trim())}
                    className="h-8 px-3.5 text-xs font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md cursor-pointer"
                  >
                    &ldquo;{filters.query.trim()}&rdquo; Havuzda Ara
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="h-8 px-3.5 text-xs font-medium text-[#18181B] bg-[#F4F4F5] hover:bg-[#E4E4E7] rounded-md cursor-pointer"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                data-testid="catalog-grid"
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 ${
                  denseGrid ? 'xl:grid-cols-5' : 'xl:grid-cols-4'
                }`}
              >
                {visibleAssets.map((asset) => {
                  const isSelected = selectedIds.has(asset.id);
                  const group = classifyAssetGroup(asset);
                  return (
                    <article
                      key={asset.id}
                      className="group bg-white border border-[#E5E7EB] hover:border-[#A1A1AA] rounded-lg overflow-hidden flex flex-col transition-colors duration-150"
                    >
                      {/* Clickable & Swipeable Studio Thumbnail Stage */}
                      <CatalogCardMediaStage
                        asset={asset}
                        onInspect={() => onInspectAsset(asset)}
                      >
                        {/* Compact Top-Right Quick Scene Add Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToScene(asset);
                          }}
                          onTouchStart={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          aria-label={
                            isSelected
                              ? `${asset.name} sahnede (+1 ekle)`
                              : `${asset.name} varlığını sahneye ekle`
                          }
                          title={isSelected ? 'Sahnede (+1 Ekle)' : 'Sahneye Ekle'}
                          className={`absolute top-2 right-2 z-10 w-7 h-7 inline-flex items-center justify-center rounded-md border transition-all active:scale-90 cursor-pointer ${
                            isSelected
                              ? 'bg-[#09090B] text-white border-[#09090B]'
                              : 'bg-white/95 text-[#18181B] border-[#E5E7EB] hover:bg-[#09090B] hover:text-white hover:border-[#09090B]'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </CatalogCardMediaStage>

                      {/* Crisp Minimalist Card Footer */}
                      <div className="p-2.5 flex-1 flex flex-col">
                        <button
                          type="button"
                          onClick={() => onInspectAsset(asset)}
                          className="text-left text-[13px] font-medium text-[#09090B] hover:text-[#1D4ED8] leading-snug line-clamp-1 cursor-pointer transition-colors"
                          title={asset.name}
                        >
                          {asset.name}
                        </button>

                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#71717A] mt-0.5 min-w-0">
                          <div className="flex items-center gap-1 min-w-0">
                            {asset.turkishMarket?.brand && (
                              <>
                                <span
                                  className="font-medium text-[#27272A] shrink-0 max-w-[52%] truncate"
                                  title={asset.turkishMarket.brand}
                                >
                                  {asset.turkishMarket.brand}
                                </span>
                                <span aria-hidden="true" className="shrink-0 text-[#A1A1AA]">·</span>
                              </>
                            )}
                            <span className="min-w-0 truncate">{group.label}</span>
                          </div>
                          <span className="font-mono tabular-nums shrink-0 text-[#52525B]">
                            {formatDimensionsText(asset)}
                          </span>
                        </div>

                        {/* Bottom Micro Row: Swatches + Compact 3D Trigger */}
                        <div className="mt-auto pt-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1" aria-label="Renk seçenekleri">
                            {asset.finishes.slice(0, 7).map((fin) => (
                              <button
                                key={fin.id}
                                type="button"
                                onClick={() => onInspectAsset(asset, fin.id)}
                                title={
                                  fin.comboSummary
                                    ? `${fin.label} — ${fin.comboSummary}`
                                    : `${fin.label} ile 3D incele`
                                }
                                aria-label={`${asset.name} modelini ${fin.label} kombinasyonu ile 3D incele`}
                                className="w-3.5 h-3.5 rounded-full border border-black/25 hover:scale-125 hover:border-[#1D4ED8] transition-transform cursor-pointer"
                                style={
                                  fin.preserveOriginalTextures
                                    ? {
                                        background: `conic-gradient(from 45deg, ${fin.primaryHex} 0% 40%, ${fin.secondaryHex} 40% 75%, ${fin.accentHex} 75% 100%)`,
                                      }
                                    : fin.paletteRecolorMode === 'tri-tone-rug' ||
                                        fin.paletteRecolorMode === 'multi-part-retail'
                                      ? {
                                          background: `linear-gradient(135deg, ${fin.primaryHex} 0% 46%, ${fin.secondaryHex} 46% 78%, ${fin.accentHex} 78% 100%)`,
                                        }
                                      : fin.metalness >= 0.65
                                        ? {
                                            background: `linear-gradient(135deg, ${fin.accentHex || '#FFFFFF'} 0%, ${fin.primaryHex} 50%, ${fin.secondaryHex || fin.primaryHex} 100%)`,
                                          }
                                        : { backgroundColor: fin.primaryHex }
                                }
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => onInspectAsset(asset)}
                            aria-label={`${asset.name} 3D önizle`}
                            className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-[#18181B] bg-[#F4F4F5] hover:bg-[#09090B] hover:text-white rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Box className="w-3 h-3" aria-hidden="true" />
                            <span>3D</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {remainingCount > 0 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="h-8 px-4 text-xs font-medium text-white bg-[#09090B] hover:bg-[#1D4ED8] rounded-md transition-colors cursor-pointer"
                  >
                    Daha Fazla (+{Math.min(PAGE_SIZE, remainingCount)} / {remainingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(orderedAssets.length)}
                    className="h-8 px-3.5 text-xs font-medium text-[#18181B] bg-white border border-[#E5E7EB] hover:bg-[#F4F4F5] rounded-md transition-colors cursor-pointer"
                  >
                    Tümü ({orderedAssets.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Scroll-to-Top button for effortless mobile browsing across 896+ models */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Sayfanın en üstüne dön"
          title="Yukarı Çık"
          className="fixed bottom-5 right-4 z-30 w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#09090B]/90 hover:bg-[#1D4ED8] text-white border border-white/15 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </section>
  );
};
