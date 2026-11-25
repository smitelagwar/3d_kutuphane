import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Edit3, FileText, Loader2, Plus, Save, X } from 'lucide-react';

interface MasterInstructionsViewProps {
  onSavedToast?: (msg: string) => void;
}

/**
 * Clean lightweight Markdown renderer for MASTER.md (headings, lists, bold, inline code, horizontal rules).
 * Avoids raw HTML injection completely by producing pure React elements.
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={keyIdx++} className="font-semibold text-[#09090B]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 text-[12px] font-mono bg-[#F4F4F5] text-[#18181B] rounded"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

const MarkdownDocumentView: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: Array<{ indent: number; text: string }> = [];
  let keyCounter = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${keyCounter++}`} className="space-y-1.5 my-2.5 pl-4 list-disc text-[13.5px] leading-relaxed text-[#3F3F46]">
        {listItems.map((item, idx) => (
          <li key={idx} className={item.indent > 0 ? 'ml-4 list-[circle]' : ''}>
            {renderInlineMarkdown(item.text)}
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed === '---') {
      flushList();
      blocks.push(<hr key={`hr-${keyCounter++}`} className="my-5 border-[#E5E7EB]" />);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push(
        <h2
          key={`h1-${keyCounter++}`}
          className="text-lg font-semibold tracking-tight text-[#09090B] mb-2"
        >
          {trimmed.slice(2)}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push(
        <h3
          key={`h2-${keyCounter++}`}
          className="text-[14px] font-semibold text-[#09090B] mt-6 mb-2 tracking-tight"
        >
          {trimmed.slice(3)}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push(
        <h4
          key={`h3-${keyCounter++}`}
          className="text-[13px] font-semibold text-[#18181B] mt-4 mb-1.5"
        >
          {trimmed.slice(4)}
        </h4>,
      );
      continue;
    }

    const bulletMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (bulletMatch) {
      listItems.push({ indent: bulletMatch[1].length, text: bulletMatch[2] });
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${keyCounter++}`} className="text-[13.5px] leading-relaxed text-[#3F3F46] my-2">
        {renderInlineMarkdown(trimmed)}
      </p>,
    );
  }
  flushList();

  return <div className="max-w-3xl">{blocks}</div>;
};

export const MasterInstructionsView: React.FC<MasterInstructionsViewProps> = ({
  onSavedToast,
}) => {
  const [content, setContent] = useState('');
  const [draft, setDraft] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [quickRule, setQuickRule] = useState('');
  const [copied, setCopied] = useState(false);

  const loadMaster = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/master-instructions');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'MASTER.md yüklenemedi.');
        return;
      }
      setContent(data.content || '');
      setDraft(data.content || '');
      setUpdatedAt(data.updatedAt || '');
    } catch {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaster();
  }, []);

  const persistContent = async (nextText: string, toastText: string) => {
    if (nextText.trim().length < 10) {
      setError('Talimat içeriği en az 10 karakter olmalıdır.');
      return false;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/v1/master-instructions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: nextText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Kaydetme başarısız oldu.');
        return false;
      }
      setContent(data.content);
      setDraft(data.content);
      setUpdatedAt(data.updatedAt || '');
      setEditing(false);
      onSavedToast?.(toastText);
      return true;
    } catch {
      setError('Sunucu bağlantısı kurulamadı.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAppend = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickRule.trim();
    if (!clean) return;
    const stamp = new Date().toLocaleDateString('tr-TR');
    const next = `${content.trimEnd()}\n- **[${stamp}]** ${clean}\n`;
    const ok = await persistContent(next, 'Yeni talimat MASTER.md dosyasına eklendi.');
    if (ok) {
      setQuickRule('');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const handleDownloadMd = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MASTER.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleString('tr-TR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '';

  return (
    <section
      aria-labelledby="master-heading"
      data-testid="master-instructions-view"
      className="py-5 max-w-[1120px] mx-auto"
    >
      {/* Compact Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#09090B]" aria-hidden="true" />
          <h1
            id="master-heading"
            className="text-[16px] font-semibold tracking-tight text-[#09090B]"
          >
            Proje Talimatları (MASTER.md)
          </h1>
          {formattedDate && (
            <span className="text-[11px] font-mono tabular-nums text-[#71717A]">
              · Güncellendi {formattedDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium text-[#18181B] bg-white border border-[#E5E7EB] hover:bg-[#F4F4F5] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? (
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

          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium text-[#18181B] bg-white border border-[#E5E7EB] hover:bg-[#F4F4F5] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>.MD İndir</span>
          </button>

          {!editing ? (
            <button
              type="button"
              onClick={() => {
                setDraft(content);
                setEditing(true);
              }}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-[#09090B] hover:bg-[#1D4ED8] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Düzenle</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraft(content);
                  setEditing(false);
                  setError('');
                }}
                className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium text-[#52525B] bg-white border border-[#E5E7EB] hover:bg-[#F4F4F5] rounded-md cursor-pointer whitespace-nowrap"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>İptal</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => persistContent(draft, 'MASTER.md kaydedildi.')}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 rounded-md cursor-pointer whitespace-nowrap"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>Kaydet</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick 1-Line Append Form */}
      <form
        onSubmit={handleQuickAppend}
        className="mt-4 flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg p-2"
      >
        <label htmlFor="quick-master-rule" className="sr-only">
          Yeni talimat veya kural ekle
        </label>
        <input
          id="quick-master-rule"
          type="text"
          value={quickRule}
          onChange={(e) => setQuickRule(e.target.value)}
          placeholder="Yeni talep veya kural ekle (doğrudan MASTER.md dosyasına kaydedilir)..."
          className="flex-1 h-8 px-2.5 text-xs bg-transparent text-[#09090B] placeholder:text-[#71717A] focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving || !quickRule.trim()}
          className="inline-flex items-center gap-1 h-8 px-3 text-xs font-medium text-white bg-[#09090B] hover:bg-[#1D4ED8] disabled:opacity-40 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kural Ekle</span>
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Main MASTER.md Surface */}
      <div className="mt-4 bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-xs text-[#71717A]">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>MASTER.md yükleniyor...</span>
          </div>
        ) : editing ? (
          <div className="p-4">
            <label htmlFor="master-markdown-editor" className="sr-only">
              MASTER.md Markdown editörü
            </label>
            <textarea
              id="master-markdown-editor"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={26}
              spellCheck={false}
              className="w-full p-3 text-xs font-mono leading-relaxed bg-[#FAFAFA] border border-[#E5E7EB] rounded-md text-[#09090B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <MarkdownDocumentView content={content} />
          </div>
        )}
      </div>
    </section>
  );
};
