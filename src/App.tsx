import React, { useEffect, useMemo, useState } from 'react';
import { INITIAL_TURKISH_ASSETS } from './lib/catalogData';
import { filterAssets } from './lib/catalogLogic';
import type {
  ArchitecturalAsset,
  AssetCategory,
  CatalogFilterState,
  MaterialFinish,
  SceneSelectionItem,
} from './lib/catalogTypes';
import { Header, type AppView } from './components/Header';
import { CatalogSection } from './components/CatalogSection';
import { StudioInspectorView } from './components/StudioInspectorView';
import { TurkishDiscoveryView } from './components/TurkishDiscoveryView';
import { AiBlenderApiView } from './components/AiBlenderApiView';
import { MasterInstructionsView } from './components/MasterInstructionsView';
import { SceneDrawer } from './components/SceneDrawer';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('catalog');
  const [assets, setAssets] = useState<ArchitecturalAsset[]>(INITIAL_TURKISH_ASSETS);
  const [selection, setSelection] = useState<SceneSelectionItem[]>([]);
  const [activeStudioAssetId, setActiveStudioAssetId] = useState<string>(
    INITIAL_TURKISH_ASSETS[0].id,
  );
  const [studioInitialFinishId, setStudioInitialFinishId] = useState<string | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discoveryPrefill, setDiscoveryPrefill] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [filters, setFilters] = useState<CatalogFilterState>({
    query: '',
    category: 'Tümü',
    subCategory: 'Tümü',
    productGroup: 'all',
    placement: 'all',
    source: 'all',
    sortBy: 'featured',
  });

  // Sync live catalog & AI/Blender selection from Express API
  useEffect(() => {
    fetch('/api/v1/catalog')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setAssets(data.items);
        }
      })
      .catch(() => {});

    fetch('/api/v1/selection')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setSelection(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? '' : prev));
    }, 2400);
  };

  const filteredAssets = useMemo(() => filterAssets(assets, filters), [assets, filters]);

  const activeStudioAsset = useMemo(
    () => assets.find((a) => a.id === activeStudioAssetId) ?? assets[0],
    [assets, activeStudioAssetId],
  );

  const selectedIds = useMemo(
    () => new Set(selection.map((item) => item.asset.id)),
    [selection],
  );

  const existingAssetIds = useMemo(() => new Set(assets.map((a) => a.id)), [assets]);

  const totalSelectionCount = useMemo(
    () => selection.reduce((sum, item) => sum + item.quantity, 0),
    [selection],
  );

  const handleAddToScene = async (
    asset: ArchitecturalAsset,
    finishId?: string,
    customFinish?: MaterialFinish,
  ) => {
    const resolvedFinishId = customFinish?.id || finishId || asset.defaultFinishId;

    setSelection((prev) => {
      const idx = prev.findIndex(
        (item) => item.asset.id === asset.id && item.finishId === resolvedFinishId,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          customFinish: customFinish ?? next[idx].customFinish,
          quantity: Math.min(10, next[idx].quantity + 1),
        };
        return next;
      }
      return [
        ...prev,
        {
          asset,
          finishId: resolvedFinishId,
          customFinish,
          quantity: 1,
          addedBy: 'user',
        },
      ];
    });
    showToast(`"${asset.name}" sahneye eklendi.`);

    try {
      const res = await fetch('/api/v1/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          assetId: asset.id,
          finishId: resolvedFinishId,
          customFinish,
          addedBy: 'user',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setSelection(data.items);
        }
      }
    } catch {}
  };

  const handleRemoveFromScene = async (assetId: string, finishId: string) => {
    setSelection((prev) =>
      prev.filter((item) => !(item.asset.id === assetId && item.finishId === finishId)),
    );
    try {
      await fetch('/api/v1/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', assetId, finishId }),
      });
    } catch {}
  };

  const handleUpdateQuantity = async (
    assetId: string,
    finishId: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      handleRemoveFromScene(assetId, finishId);
      return;
    }
    const clamped = Math.min(10, quantity);
    setSelection((prev) =>
      prev.map((item) =>
        item.asset.id === assetId && item.finishId === finishId
          ? { ...item, quantity: clamped }
          : item,
      ),
    );
    try {
      await fetch('/api/v1/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setQuantity',
          assetId,
          finishId,
          quantity: clamped,
        }),
      });
    } catch {}
  };

  const handleClearScene = async () => {
    setSelection([]);
    try {
      await fetch('/api/v1/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
    } catch {}
  };

  const handleInspectAsset = (asset: ArchitecturalAsset, finishId?: string) => {
    if (!existingAssetIds.has(asset.id)) {
      setAssets((prev) => [asset, ...prev]);
      fetch('/api/v1/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset }),
      }).catch(() => {});
    }
    setActiveStudioAssetId(asset.id);
    setStudioInitialFinishId(finishId);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddDiscoveredToCatalog = async (asset: ArchitecturalAsset) => {
    setAssets((prev) => (prev.some((a) => a.id === asset.id) ? prev : [asset, ...prev]));
    try {
      await fetch('/api/v1/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset }),
      });
    } catch {}
    showToast(`"${asset.name}" kataloğa eklendi.`);
  };

  const handleBackToCatalog = (category?: AssetCategory | 'Tümü', productGroup?: string) => {
    if (category !== undefined || productGroup !== undefined) {
      setFilters((prev) => ({
        ...prev,
        query: '',
        category: category ?? prev.category,
        subCategory: 'Tümü',
        productGroup: productGroup ?? 'all',
      }));
    }
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#09090B]">
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectionCount={totalSelectionCount}
        onOpenSceneDrawer={() => setDrawerOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-5">
        {activeView === 'catalog' && (
          <CatalogSection
            assets={filteredAssets}
            allAssets={assets}
            totalCount={assets.length}
            filters={filters}
            selectedIds={selectedIds}
            onFilterChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            onInspectAsset={handleInspectAsset}
            onAddToScene={(asset) => handleAddToScene(asset)}
            onOpenDiscoveryWithQuery={(q) => {
              setDiscoveryPrefill(q);
              setActiveView('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'studio' && (
          <StudioInspectorView
            assets={assets}
            activeAsset={activeStudioAsset}
            initialFinishId={studioInitialFinishId}
            onSelectAsset={(asset, finishId) => {
              setActiveStudioAssetId(asset.id);
              setStudioInitialFinishId(finishId);
            }}
            onAddToScene={(asset, finishId, customFinish) =>
              handleAddToScene(asset, finishId, customFinish)
            }
            onBackToCatalog={handleBackToCatalog}
            selectedIds={selectedIds}
          />
        )}

        {activeView === 'discover' && (
          <TurkishDiscoveryView
            initialQuery={discoveryPrefill}
            existingAssetIds={existingAssetIds}
            onAddDiscoveredToCatalog={handleAddDiscoveredToCatalog}
            onInspectAsset={handleInspectAsset}
          />
        )}

        {activeView === 'api' && (
          <AiBlenderApiView
            assets={assets}
            selection={selection}
            onAiSelectionApplied={(items) => {
              setSelection(items);
              showToast('AI seçimleri sahneye aktarıldı.');
            }}
            onOpenSceneDrawer={() => setDrawerOpen(true)}
          />
        )}

        {activeView === 'instructions' && (
          <MasterInstructionsView onSavedToast={(msg) => showToast(msg)} />
        )}
      </main>

      {/* Ultra-slim Minimal Footer */}
      <footer className="mt-8 border-t border-[#E5E7EB] bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#71717A]">
          <span className="font-mono tabular-nums">
            MimarKatalog · {assets.length} 3D Varlık · 1:1 Metrik Blender
          </span>
          <div className="flex items-center gap-4">
            <a href="/api/v1/catalog" target="_blank" rel="noopener noreferrer" className="hover:text-[#09090B]">
              Catalog JSON
            </a>
            <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[#09090B]">
              llms.txt
            </a>
            <a href="/api/v1/manifest.json" target="_blank" rel="noopener noreferrer" className="hover:text-[#09090B]">
              MCP Manifest
            </a>
            <a href="/api/v1/master-instructions" target="_blank" rel="noopener noreferrer" className="hover:text-[#09090B]">
              MASTER.md API
            </a>
          </div>
        </div>
      </footer>

      <SceneDrawer
        open={drawerOpen}
        items={selection}
        onClose={() => setDrawerOpen(false)}
        onRemoveItem={handleRemoveFromScene}
        onUpdateQuantity={handleUpdateQuantity}
        onClearAll={handleClearScene}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-40 bg-[#09090B] text-white text-xs font-medium px-3.5 py-2.5 rounded-md shadow-lg border border-white/10"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
