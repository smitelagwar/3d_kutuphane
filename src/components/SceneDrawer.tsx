import React, { useState } from 'react';
import { Check, Copy, Download, Trash2, X } from 'lucide-react';
import type { SceneSelectionItem } from '../lib/catalogTypes';
import {
  computeSceneLayout,
  generateBatchSceneScript,
  resolveFinish,
} from '../lib/catalogLogic';

interface SceneDrawerProps {
  open: boolean;
  items: SceneSelectionItem[];
  onClose: () => void;
  onRemoveItem: (assetId: string, finishId: string) => void;
  onUpdateQuantity: (assetId: string, finishId: string, quantity: number) => void;
  onClearAll: () => void;
}

export const SceneDrawer: React.FC<SceneDrawerProps> = ({
  open,
  items,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onClearAll,
}) => {
  const [copiedPy, setCopiedPy] = useState(false);

  if (!open) return null;

  const placed = computeSceneLayout(items);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const batchPython = generateBatchSceneScript(items);

  const handleDownloadBatchPy = () => {
    const blob = new Blob([batchPython], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mimarkatalog_blender_sahne.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadJson = () => {
    const payload = {
      generator: 'MimarKatalog',
      blenderUnits: 'meters-z-up',
      totalInstances: placed.length,
      layout: placed.map((p) => ({
        assetId: p.asset.id,
        name: p.asset.name,
        category: p.asset.category,
        finishId: p.finish.id,
        finishLabel: p.finish.label,
        dimensionsCm: p.asset.dimensionsCm,
        placement: p.asset.placement,
        blenderPositionMeters: p.positionMeters,
        rotationZDeg: p.rotationZDeg,
        addedBy: p.addedBy,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mimarkatalog_sahne_manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopyPy = async () => {
    try {
      await navigator.clipboard.writeText(batchPython);
      setCopiedPy(true);
      setTimeout(() => setCopiedPy(false), 2000);
    } catch {
      // Clipboard blocked in restricted iframe
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scene-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
    >
      <div className="w-full max-w-lg bg-white h-full flex flex-col border-l border-[#E4E7EC] shadow-xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E4E7EC] flex items-center justify-between gap-4">
          <div>
            <h2
              id="scene-drawer-title"
              className="text-lg font-semibold text-[#111318] tabular-nums"
            >
              Blender Sahne Listesi ({totalCount})
            </h2>
            <p className="text-xs text-[#525866] mt-0.5">
              Manuel ve yapay zeka seçimleri Blender metrik koordinatlarıyla eşleştirilir.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sahne listesini kapat"
            className="p-2 rounded-lg text-[#525866] hover:text-[#111318] hover:bg-[#F1F3F6] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-[#111318]">Sahne listeniz şu an boş.</p>
              <p className="text-xs text-[#525866] mt-1.5 max-w-xs mx-auto">
                Katalogdan mobilya, asma klozet, havlupan veya halı ekleyin ya da AI Sahne Seçici ile otomatik seçtirin.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const finish = resolveFinish(item.asset, item.finishId, item.customFinish);
              const placedEntry = placed.find(
                (p) => p.asset.id === item.asset.id && p.finish.id === finish.id,
              );
              return (
                <div
                  key={`${item.asset.id}-${item.finishId}`}
                  className="p-4 border border-[#E4E7EC] rounded-xl flex gap-4 items-start bg-[#F8F9FA]"
                >
                  <img
                    src={item.asset.thumbnailUrl}
                    alt={item.asset.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 object-contain p-1 rounded-lg bg-white border border-[#E4E7EC] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#111318] truncate">
                        {item.asset.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.asset.id, item.finishId)}
                        aria-label={`${item.asset.name} varlığını sahneden kaldır`}
                        className="p-1 text-[#6B7280] hover:text-red-600 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-[#525866] mt-0.5 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block shrink-0"
                        style={{ backgroundColor: finish.primaryHex }}
                        aria-hidden="true"
                      />
                      <span>
                        {finish.label} · {item.addedBy === 'ai' ? 'AI Seçimi' : 'Manuel Seçim'}
                      </span>
                    </p>
                    {placedEntry && (
                      <p className="text-[11px] font-mono tabular-nums text-[#525866] mt-1">
                        Blender XYZ: ({placedEntry.positionMeters.x}m, {placedEntry.positionMeters.y}m,{' '}
                        {placedEntry.positionMeters.z}m)
                      </p>
                    )}
                    {item.note && (
                      <p className="text-[11px] text-[#1E40AF] mt-1">{item.note}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.asset.id, item.finishId, item.quantity - 1)
                        }
                        aria-label={`${item.asset.name} adedini azalt`}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-[#D8DCE3] bg-white text-sm font-medium text-[#111318] hover:bg-[#F1F3F6] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono tabular-nums w-6 text-center text-[#111318]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.asset.id, item.finishId, item.quantity + 1)
                        }
                        aria-label={`${item.asset.name} adedini artır`}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-[#D8DCE3] bg-white text-sm font-medium text-[#111318] hover:bg-[#F1F3F6] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E4E7EC] bg-[#F8F9FA] space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadBatchPy}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1E40AF] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Toplu Blender Sahne Betiği İndir (.py)</span>
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyPy}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#111318] bg-white border border-[#D8DCE3] hover:bg-[#F1F3F6] rounded-lg transition-colors cursor-pointer"
              >
                {copiedPy ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Python Kopyala</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#111318] bg-white border border-[#D8DCE3] hover:bg-[#F1F3F6] rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>AI JSON Manifest</span>
              </button>
            </div>
            <button
              type="button"
              onClick={onClearAll}
              className="w-full py-1.5 text-xs font-medium text-[#6B7280] hover:text-red-600 transition-colors cursor-pointer"
            >
              Sahne Listesini Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
