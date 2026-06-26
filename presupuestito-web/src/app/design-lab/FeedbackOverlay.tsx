"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface FeedbackItem {
  variant: string;
  element: string;
  comment: string;
}

interface FeedbackState {
  comments: FeedbackItem[];
  overallDirection: string;
}

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [isActive, setIsActive] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    comments: [],
    overallDirection: "",
  });
  const [pendingComment, setPendingComment] = useState<{
    variant: string;
    element: string;
    selector: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePickElement = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const variantContainer = target.closest("[data-variant]");
    if (!variantContainer) return;

    const variant = variantContainer.getAttribute("data-variant") || "?";
    const tag = target.tagName.toLowerCase();
    const text = target.textContent?.trim().slice(0, 50) || "";
    const testId = target.getAttribute("data-testid");
    const className = Array.from(target.classList).slice(0, 2).join(".");
    const selector = testId
      ? `[data-testid='${testId}']`
      : className
      ? `.${className}`
      : tag;
    const element = `${tag}${text ? ` with "${text}"` : ""}`;

    setPendingComment({ variant, element, selector });
    setIsPicking(false);
  }, []);

  useEffect(() => {
    if (isPicking) {
      document.addEventListener("click", handlePickElement, true);
      return () => document.removeEventListener("click", handlePickElement, true);
    }
  }, [isPicking, handlePickElement]);

  const addComment = (comment: string) => {
    if (!pendingComment || !comment.trim()) return;
    setFeedback((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          variant: pendingComment.variant,
          element: `${pendingComment.element} (\`${pendingComment.selector}\`)`,
          comment: comment.trim(),
        },
      ],
    }));
    setPendingComment(null);
  };

  const submitFeedback = () => {
    const lines = [
      "## Design Lab Feedback",
      "",
      `**Target:** ${targetName}`,
      `**Comments:** ${feedback.comments.length}`,
      "",
    ];

    const byVariant = feedback.comments.reduce((acc, c) => {
      (acc[c.variant] = acc[c.variant] || []).push(c);
      return acc;
    }, {} as Record<string, FeedbackItem[]>);

    Object.entries(byVariant).forEach(([variant, comments]) => {
      lines.push(`### Variant ${variant}`);
      comments.forEach((c, i) => {
        lines.push(`${i + 1}. **${c.element}**`);
        lines.push(`   "${c.comment}"`);
      });
      lines.push("");
    });

    lines.push("### Overall Direction");
    lines.push(feedback.overallDirection || "(not provided)");

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsActive(!isActive)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/30 flex items-center justify-center hover:bg-primary-dark transition-all active:scale-95"
        aria-label={isActive ? "Cerrar feedback" : "Abrir feedback"}
      >
        {isActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {isActive &&
        createPortal(
          <div className="fixed inset-0 z-40 flex flex-col">
            {isPicking && (
              <div className="absolute inset-0 bg-primary/5 cursor-crosshair z-10" />
            )}

            <div className="absolute bottom-24 right-6 w-80 bg-surface rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden z-20">
              <div className="px-5 pt-5 pb-3 border-b border-outline-variant/10">
                <h3 className="font-bold text-sm text-on-surface">
                  Feedback — {targetName}
                </h3>
                <p className="text-xs text-on-surface-variant/50 font-medium mt-0.5">
                  {feedback.comments.length} comentarios
                </p>
              </div>

              <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                {!pendingComment ? (
                  <>
                    <button
                      onClick={() => setIsPicking(true)}
                      className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all"
                    >
                      Agregar comentario
                    </button>

                    {feedback.comments.length > 0 && (
                      <div className="space-y-2">
                        {feedback.comments.map((c, i) => (
                          <div key={i} className="bg-on-surface/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {c.variant}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant/70 font-medium leading-relaxed">
                              {c.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                        Dirección general
                      </label>
                      <textarea
                        value={feedback.overallDirection}
                        onChange={(e) =>
                          setFeedback((prev) => ({
                            ...prev,
                            overallDirection: e.target.value,
                          }))
                        }
                        placeholder="¿Qué variante ganó? ¿Qué combinación te gusta?"
                        rows={2}
                        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {feedback.comments.length > 0 && (
                      <button
                        onClick={submitFeedback}
                        className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all"
                      >
                        {copied ? "✓ Copiado" : "Copiar y enviar feedback"}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-on-surface/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {pendingComment.variant}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-on-surface">{pendingComment.element}</p>
                    </div>
                    <textarea
                      placeholder="Escribí tu comentario..."
                      rows={2}
                      className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const textarea = e.currentTarget;
                          addComment(textarea.value);
                          textarea.value = "";
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            addComment(textarea.value);
                            textarea.value = "";
                          }
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setPendingComment(null)}
                        className="py-2.5 px-4 rounded-xl bg-on-surface/10 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-on-surface/20 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
