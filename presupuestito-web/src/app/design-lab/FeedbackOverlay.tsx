"use client";

import { useState, useCallback, useRef } from "react";
import { MessageCircle, X, Send, Copy, Check } from "lucide-react";

interface FeedbackComment {
  id: string;
  variant: string;
  selector: string;
  elementDesc: string;
  comment: string;
}

interface FeedbackOverlayProps {
  targetName: string;
}

export function FeedbackOverlay({ targetName }: FeedbackOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedElement, setSelectedElement] = useState<{ selector: string; desc: string } | null>(null);
  const [overallDirection, setOverallDirection] = useState("");
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const getElementDescription = useCallback((el: HTMLElement): string => {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim().slice(0, 50) || "";
    const classes = el.className?.toString().slice(0, 30) || "";
    return `<${tag}> "${text}" (${classes}...)`;
  }, []);

  const getSelector = useCallback((el: HTMLElement): string => {
    if (el.id) return `#${el.id}`;
    const dataVariant = el.closest("[data-variant]");
    const variant = dataVariant?.getAttribute("data-variant") || "";
    const tag = el.tagName.toLowerCase();
    const classes = el.className?.toString().split(" ").filter(c => c && !c.startsWith("transition") && !c.startsWith("hover")).slice(0, 3).join(".") || "";
    return variant ? `[data-variant="${variant}"] ${tag}.${classes}` : `${tag}.${classes}`;
  }, []);

  const handleElementClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest("[data-feedback-overlay]")) return;
    setSelectedElement({
      selector: getSelector(target),
      desc: getElementDescription(target),
    });
  }, [getSelector, getElementDescription]);

  const startSelectionMode = useCallback(() => {
    setIsOpen(true);
    document.addEventListener("click", handleElementClick, { capture: true, once: true });
    return () => document.removeEventListener("click", handleElementClick, { capture: true } as any);
  }, [handleElementClick]);

  const saveComment = useCallback(() => {
    if (!selectedElement || !currentComment.trim()) return;
    const variantEl = document.querySelector(`[data-variant]`);
    const variant = variantEl?.getAttribute("data-variant") || "unknown";
    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        variant,
        selector: selectedElement.selector,
        elementDesc: selectedElement.desc,
        comment: currentComment.trim(),
      },
    ]);
    setCurrentComment("");
    setSelectedElement(null);
  }, [selectedElement, currentComment]);

  const removeComment = useCallback((id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  const generateFeedbackText = useCallback((): string => {
    const grouped = comments.reduce((acc, c) => {
      if (!acc[c.variant]) acc[c.variant] = [];
      acc[c.variant].push(c);
      return acc;
    }, {} as Record<string, FeedbackComment[]>);

    let text = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${comments.length}\n\n`;
    for (const [variant, variantComments] of Object.entries(grouped)) {
      text += `### Variant ${variant}\n`;
      variantComments.forEach((c, i) => {
        text += `${i + 1}. **Element** (\`${c.selector}\`, ${c.elementDesc})\n   "${c.comment}"\n\n`;
      });
    }
    text += `### Overall Direction\n${overallDirection}\n`;
    return text;
  }, [comments, targetName, overallDirection]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generateFeedbackText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateFeedbackText]);

  return (
    <div data-feedback-overlay className="fixed bottom-24 right-4 z-50 md:bottom-8">
      {!isOpen && (
        <button
          onClick={startSelectionMode}
          className="w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Add Feedback"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div
          ref={overlayRef}
          className="w-80 bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
            <span className="text-sm font-bold text-on-surface">Feedback</span>
            <button onClick={() => { setIsOpen(false); setSelectedElement(null); }} className="text-on-surface-variant hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
            {/* Selected element */}
            {selectedElement && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Selected</p>
                <p className="text-xs text-on-surface font-mono break-all">{selectedElement.selector}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{selectedElement.desc}</p>
              </div>
            )}

            {/* Comment input */}
            {selectedElement && (
              <div>
                <textarea
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                  placeholder="Your feedback..."
                  className="w-full h-20 p-3 text-xs rounded-xl bg-on-surface/5 border border-outline-variant/10 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={saveComment}
                  disabled={!currentComment.trim()}
                  className="mt-2 w-full h-8 rounded-lg bg-primary text-white text-xs font-semibold disabled:opacity-40 hover:bg-primary-dark transition-colors"
                >
                  Save Comment
                </button>
              </div>
            )}

            {!selectedElement && (
              <p className="text-xs text-on-surface-variant text-center py-2">
                Click &ldquo;Add Feedback&rdquo; then click any element to comment on it.
              </p>
            )}

            {/* Saved comments */}
            {comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                {comments.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-on-surface/5 relative group">
                    <button
                      onClick={() => removeComment(c.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Variant {c.variant}</p>
                    <p className="text-[10px] font-mono text-primary mt-0.5 break-all">{c.selector}</p>
                    <p className="text-xs text-on-surface mt-1">{c.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Overall direction */}
            {comments.length > 0 && (
              <div className="pt-2 border-t border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">
                  Overall Direction (required)
                </label>
                <textarea
                  value={overallDirection}
                  onChange={(e) => setOverallDirection(e.target.value)}
                  placeholder="Which variant wins and why..."
                  className="w-full h-16 p-3 text-xs rounded-xl bg-on-surface/5 border border-outline-variant/10 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          {comments.length > 0 && (
            <div className="px-4 py-3 border-t border-outline-variant/10">
              <button
                onClick={copyToClipboard}
                disabled={!overallDirection.trim()}
                className="w-full h-9 rounded-lg bg-on-surface text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-on-surface/90 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Feedback"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
