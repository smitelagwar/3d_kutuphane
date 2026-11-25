import React, { useEffect, useState } from 'react';
import { Check, Copy, Loader2, Sparkles, Terminal } from 'lucide-react';
import type { ArchitecturalAsset, SceneSelectionItem } from '../lib/catalogTypes';

interface AiBlenderApiViewProps {
  assets: ArchitecturalAsset[];
  selection: SceneSelectionItem[];
  onAiSelectionApplied: (items: SceneSelectionItem[]) => void;
  onOpenSceneDrawer: () => void;
}

const EXAMPLE_BRIEFS = [
  'Bodrum modern taş villa 35 m² salon için bukle koltuk, traverten sehpa, salon halısı ve pirinç LED avize seç.',
  'Lüks apartman ebeveyn banyosu için kanalsız asma klozet ve mat siyah havlupan seç.',
  'Çeşme dubleks villa geniş oturma odası ve havuz başı teras için L köşe koltuk ve bioklimatik pergola seç.',
];

export const AiBlenderApiView: React.FC<AiBlenderApiViewProps> = ({
  assets,
  selection,
  onAiSelectionApplied,
  onOpenSceneDrawer,
}) => {
  const [brief, setBrief] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [aiRationale, setAiRationale] = useState('');
  const [manifestJson, setManifestJson] = useState<string>('');
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  useEffect(() => {
    fetch('/api/v1/manifest.json')
      .then((r) => r.json())
      .then((data) => setManifestJson(JSON.stringify(data, null, 2)))
      .catch(() => setManifestJson(''));
  }, [assets.length, selection.length]);

  const blenderBridgePython = `import urllib.request

# MimarKatalog — Blender 4.x / MCP Sahne Çekici
# Seçili Türkiye 3D varlıklarını sahneye kurar.
SCRIPT_URL = "${origin}/api/v1/selection/blender-script"
code = urllib.request.urlopen(SCRIPT_URL).read().decode("utf-8")
exec(code, {"__name__": "__main__"})
`;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(id);
      setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const handleAiSelect = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = brief.trim();
    if (clean.length < 4) {
      setValidationError('Lütfen en az 4 karakterli bir mimari mekan veya proje açıklaması girin.');
      return;
    }

    setValidationError('');
    setApiError('');
    setAiRationale('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: clean, applyToSelection: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || 'Yapay zeka sahne seçimi tamamlanamadı.');
        return;
      }
      setAiRationale(data.rationale || 'Seçimler Blender sahne listesine eklendi.');
      if (Array.isArray(data.sceneSelection)) {
        onAiSelectionApplied(data.sceneSelection);
      }
    } catch {
      setApiError('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const endpoints = [
    {
      method: 'GET',
      path: `${origin}/api/v1/catalog`,
      desc: 'Tüm Türkiye 3D varlıklarını JSON olarak listeler (?q=, ?category=, ?placement= destekler).',
    },
    {
      method: 'GET',
      path: `${origin}/llms.txt`,
      desc: 'Yapay zeka ajanları (Claude, Gemini, Cursor, Blender MCP) için düz metin keşif indeksi.',
    },
    {
      method: 'POST',
      path: `${origin}/api/v1/selection`,
      desc: 'Harici yapay zekanın sahneye varlık eklemesi/çıkarması için canlı seçim uç noktası.',
    },
    {
      method: 'GET',
      path: `${origin}/api/v1/selection/blender-script`,
      desc: 'Seçili tüm mobilya ve vitrifiyeleri Blender 4.x içine 1:1 metrik kuran Python (bpy) betiği.',
    },
  ];

  return (
    <section aria-labelledby="api-heading" className="py-10 space-y-10">
      <div className="max-w-3xl">
        <h1
          id="api-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111318]"
        >
          Yapay Zeka & Blender MCP Entegrasyonu
        </h1>
        <p className="text-sm text-[#525866] mt-2 leading-relaxed">
          Bu katalog hem sizin manuel seçiminiz hem de Blender&apos;a bağlı yapay zeka ajanlarının (MCP, Python veya LLM) programatik olarak varlık arayıp sahneye çekebilmesi için yapılandırılmıştır.
        </p>
      </div>

      {/* Section 1: Natural Language Turkish AI Scene Selector */}
      <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[#111318]">
            Doğal Dil ile AI Sahne Seçici
          </h2>
        </div>
        <p className="text-xs text-[#525866] mb-4">
          Projenizi Türkçe tarif edin; yapay zeka katalogdan uygun mobilya, vitrifiye, kaplama ve adetleri seçerek canlı Blender Sahne Listesine eklesin.
        </p>

        <form onSubmit={handleAiSelect} noValidate className="space-y-3">
          <label htmlFor="ai-brief-input" className="sr-only">
            Mimari sahne brifi
          </label>
          <textarea
            id="ai-brief-input"
            rows={3}
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Örn: Bodrum'da modern taş villa 35 m² salon ve ebeveyn banyosu için bukle koltuk, traverten sehpa, salon halısı, asma klozet ve siyah havlupan seç..."
            className="w-full p-3.5 text-sm bg-[#F8F9FA] border border-[#D8DCE3] rounded-lg text-[#111318] placeholder:text-[#7B8190] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
          />

          {validationError && (
            <p role="alert" className="text-xs font-medium text-red-700">
              {validationError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_BRIEFS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBrief(sample)}
                  className="px-2.5 py-1.5 text-xs text-[#525866] bg-[#F1F3F6] hover:bg-[#E4E7EC] hover:text-[#111318] rounded-md transition-colors cursor-pointer text-left"
                >
                  Örnek {i + 1}: {sample.slice(0, 42)}...
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>AI Varlıkları Seçiyor...</span>
                </>
              ) : (
                <span>AI ile Sahneye Seç</span>
              )}
            </button>
          </div>
        </form>

        {apiError && (
          <div role="alert" className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {apiError}
          </div>
        )}

        {aiRationale && (
          <div className="mt-4 p-4 bg-[#EFF4FF] border border-[#BFDBFE] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#1E40AF]">AI Seçim Gerekçesi</p>
              <p className="text-sm text-[#111318] mt-1">{aiRationale}</p>
            </div>
            <button
              type="button"
              onClick={onOpenSceneDrawer}
              className="px-3.5 py-2 text-xs font-medium text-white bg-[#111318] hover:bg-[#1E40AF] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sahne Listesini Aç ({selection.reduce((s, i) => s + i.quantity, 0)})
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Blender Python Direct Loader & Live API Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#111318]" aria-hidden="true" />
              <h2 className="text-base font-semibold text-[#111318]">
                Blender 4.x Tek Satır Sahne Çekici
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('bridge', blenderBridgePython)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-lg cursor-pointer"
            >
              {copiedTarget === 'bridge' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#525866] mb-4">
            Bu Python kodunu Blender Scripting sekmesinde veya Blender MCP <code className="font-mono">execute_blender_code</code> aracında çalıştırarak seçtiğiniz tüm varlıkları anında 3D sahneye kurun.
          </p>
          <pre className="text-xs font-mono leading-relaxed bg-[#111318] text-[#E5E9F0] p-4 rounded-lg overflow-x-auto flex-1">
            <code>{blenderBridgePython}</code>
          </pre>
        </div>

        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#111318] mb-4">
            Canlı AI & MCP API Uç Noktaları
          </h2>
          <div className="divide-y divide-[#F0F2F5]">
            {endpoints.map((ep) => (
              <div key={ep.path} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-mono font-semibold text-[#1E40AF] shrink-0">
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono text-[#111318] truncate">{ep.path}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(ep.path, ep.path)}
                    aria-label={`${ep.path} adresini kopyala`}
                    className="p-1.5 text-[#525866] hover:text-[#111318] cursor-pointer shrink-0"
                  >
                    {copiedTarget === ep.path ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#525866] mt-1">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Live MCP Manifest JSON Preview */}
      <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E4E7EC] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#111318]">
              Canlı AI / MCP Manifest Şeması (/api/v1/manifest.json)
            </h2>
            <p className="text-xs text-[#525866] mt-0.5 tabular-nums">
              Toplam {assets.length} mimari varlık · {selection.reduce((s, i) => s + i.quantity, 0)} aktif sahne öğesi
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('manifest', manifestJson)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-lg cursor-pointer"
          >
            {copiedTarget === 'manifest' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Manifest Kopyala</span>
              </>
            )}
          </button>
        </div>
        <pre className="text-xs font-mono leading-relaxed bg-[#111318] text-[#E5E9F0] p-5 overflow-x-auto max-h-[340px]">
          <code>{manifestJson || 'Manifest yükleniyor...'}</code>
        </pre>
      </div>
    </section>
  );
};
