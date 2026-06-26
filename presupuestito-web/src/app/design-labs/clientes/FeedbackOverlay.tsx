"use client";

import { useState, useCallback, useEffect } from "react";
import { MessageCircle, X, Send, Copy, Check } from "lucide-react";

interface FeedbackComment {
  id: string;
  x: number;
  y: number;
  text: string;
  variant: string;
  element: string;
}

interface FeedbackOverlayProps {
  targetName: string;
}

export function FeedbackOverlay({ targetName }: FeedbackOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [pendingComment, setPendingComment] = useState<{ x: number; y: number; variant: string; element: string } | null>(null);
  const [inputText, setInputText] = useState("");
  const [overallDirection, setOverallDirection] = useState("");
  const [copied, setCopied] = useState(false);

  const handleElementClick = useCallback((e: MouseEvent) => {
    if (!isOpen) return;
    const target = e.target as HTMLElement;
    const variantEl = target.closest("[data-variant]");
    if (!variantEl) return;
    const variant = variantEl.getAttribute("data-variant") || "Unknown";
    const rect = target.getBoundingClientRect();
    const elementDescription = `${target.tagName.toLowerCase()} (${target.textContent?.trim().slice(0, 40) || "element"})`;
    setPendingComment({ x: e.clientX, y: e.clientY, variant, element: elementDescription });
    setInputText("");
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("click", handleElementClick);
    return () => document.removeEventListener("click", handleElementClick);
  }, [handleElementClick]);

  const saveComment = () => {
    if (!pendingComment || !inputText.trim()) return;
    setComments([...comments, { id: Date.now().toString(), ...pendingComment, text: inputText.trim() }]);
    setPendingComment(null);
    setInputText("");
  };

  const removeComment = (id: string) => setComments(comments.filter((c) => c.id !== id));

  const generateOutput = (): string => {
    const byVariant = comments.reduce((acc, c) => { if (!acc[c.variant]) acc[c.variant] = []; acc[c.variant].push(c); return acc; }, {} as Record<string, FeedbackComment[]>);
    let output = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${comments.length}\n\n`;
    for (const [variant, vc] of Object.entries(byVariant)) {
      output += `### Variant ${variant}\n`;
      vc.forEach((c, i) => { output += `${i + 1}. **${c.element}**\n   "${c.text}"\n\n`; });
    }
    if (overallDirection.trim()) output += `### Overall Direction\n${overallDirection}\n`;
    return output;
  };

  const copyToClipboard = async () => { await navigator.clipboard.writeText(generateOutput()); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-105 cursor-pointer">
        {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
      </button>

      {comments.map((comment, i) => (
        <div key={comment.id} className="fixed z-40 group" style={{ left: comment.x - 8, top: comment.y - 8 }}>
          <div className="w-4 h-4 rounded-full bg-primary text-white text-[7px] flex items-center justify-center font-bold cursor-pointer shadow-md">{i + 1}</div>
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-44">
            <div className="bg-surface border border-outline-variant/15 rounded-lg shadow-lg p-2 text-[9px]">
              <p className="font-semibold text-on-surface mb-0.5">V{comment.variant}</p>
              <p className="text-on-surface-variant">{comment.text}</p>
              <button onClick={() => removeComment(comment.id)} className="mt-1 text-red-500 hover:text-red-600 text-[8px] cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
      ))}

      {pendingComment && (
        <div className="fixed z-50" style={{ left: pendingComment.x, top: pendingComment.y }}>
          <div className="bg-surface border border-outline-variant/15 rounded-xl shadow-xl p-2.5 w-56 ml-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">V{pendingComment.variant}</span>
              <button onClick={() => setPendingComment(null)} className="text-outline hover:text-on-surface cursor-pointer"><X className="w-2.5 h-2.5" /></button>
            </div>
            <p className="text-[8px] text-on-surface-variant mb-1.5 truncate">{pendingComment.element}</p>
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Tu feedback..." className="w-full h-12 bg-grouped-bg-light border border-outline-variant/10 rounded px-1.5 py-1 text-[9px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none" autoFocus />
            <div className="flex justify-end mt-1.5">
              <button onClick={saveComment} disabled={!inputText.trim()} className="h-5 px-2 rounded bg-primary text-white text-[8px] font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40 cursor-pointer">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-72 bg-surface border border-outline-variant/15 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-3 py-2 border-b border-outline-variant/8">
            <h3 className="text-[11px] font-bold text-on-surface">Feedback — {targetName}</h3>
            <p className="text-[8px] text-on-surface-variant">{comments.length} comentarios</p>
          </div>
          <div className="max-h-48 overflow-y-auto p-2 space-y-1.5">
            {comments.length === 0 ? (
              <p className="text-[9px] text-on-surface-variant text-center py-3">Click el botón verde, luego click un elemento</p>
            ) : (
              comments.map((c, i) => (
                <div key={c.id} className="bg-grouped-bg-light rounded-lg p-1.5 border border-outline-variant/6">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[7px] font-bold text-primary">#{i + 1} · V{c.variant}</span>
                    <button onClick={() => removeComment(c.id)} className="text-outline hover:text-red-500 cursor-pointer"><X className="w-2 h-2" /></button>
                  </div>
                  <p className="text-[9px] text-on-surface">{c.text}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-outline-variant/8 space-y-1.5">
            <textarea value={overallDirection} onChange={(e) => setOverallDirection(e.target.value)} placeholder="Dirección general..." className="w-full h-12 bg-grouped-bg-light border border-outline-variant/10 rounded px-1.5 py-1 text-[9px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none" />
            <button onClick={copyToClipboard} disabled={comments.length === 0} className="w-full h-7 rounded bg-primary text-white text-[9px] font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer">
              {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
              {copied ? "Copiado!" : "Copiar feedback"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
