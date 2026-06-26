"use client";

import React, { useState, useEffect } from "react";

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<{ variant: string; element: string; comment: string }[]>([]);
  const [overall, setOverall] = useState("");
  const [selectedElement, setSelectedElement] = useState<{ element: HTMLElement; variant: string } | null>(null);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (!isActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("#feedback-ui")) return;
      target.style.outline = "2px solid #3b82f6";
      target.style.cursor = "crosshair";
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("#feedback-ui")) return;
      target.style.outline = "";
      target.style.cursor = "";
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("#feedback-ui")) return;
      
      e.preventDefault();
      e.stopPropagation();

      const variantContainer = target.closest("[data-variant]");
      const variant = variantContainer ? variantContainer.getAttribute("data-variant") || "Unknown" : "Unknown";

      setSelectedElement({ element: target, variant });
      target.style.outline = "2px solid #ef4444";
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, { capture: true });
      if (selectedElement) {
        selectedElement.element.style.outline = "";
      }
    };
  }, [isActive, selectedElement]);

  const handleSaveComment = () => {
    if (!selectedElement || !commentInput) return;
    
    // Basic selector generation
    let selector = selectedElement.element.tagName.toLowerCase();
    if (selectedElement.element.id) selector += `#${selectedElement.element.id}`;
    if (selectedElement.element.className && typeof selectedElement.element.className === 'string') {
      selector += "." + selectedElement.element.className.split(" ")[0];
    }
    
    let text = selectedElement.element.textContent?.slice(0, 20) || "";
    
    setFeedback([
      ...feedback,
      {
        variant: selectedElement.variant,
        element: `\`${selector}\`, ${selectedElement.element.tagName.toLowerCase()} with "${text}"`,
        comment: commentInput
      }
    ]);
    
    selectedElement.element.style.outline = "";
    setSelectedElement(null);
    setCommentInput("");
  };

  const generateMarkdown = () => {
    let md = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${feedback.length}\n\n`;
    
    const variants = Array.from(new Set(feedback.map(f => f.variant))).sort();
    
    variants.forEach(v => {
      md += `### Variant ${v}\n`;
      const vFeedback = feedback.filter(f => f.variant === v);
      vFeedback.forEach((f, i) => {
        md += `${i + 1}. **Element** (${f.element})\n   "${f.comment}"\n`;
      });
      md += "\n";
    });
    
    md += `### Overall Direction\n${overall || "No overall direction provided."}`;
    
    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    alert("Feedback copied to clipboard! Paste it back in the terminal.");
  };

  return (
    <div id="feedback-ui" className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isActive && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Design Feedback</h3>
            <button onClick={() => setIsActive(false)} className="text-gray-500 hover:text-gray-900">×</button>
          </div>
          
          {selectedElement ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Commenting on <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{selectedElement.element.tagName.toLowerCase()}</span> in Variant {selectedElement.variant}
              </p>
              <textarea
                autoFocus
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="What should change?"
                className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveComment} className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded font-medium hover:bg-blue-600">Save</button>
                <button onClick={() => { selectedElement.element.style.outline = ""; setSelectedElement(null); }} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 dark:text-white">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Click any element on the page to leave a comment.</p>
              
              {feedback.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm dark:text-white">Comments ({feedback.length})</h4>
                  <ul className="text-xs space-y-1 max-h-32 overflow-y-auto dark:text-gray-300">
                    {feedback.map((f, i) => (
                      <li key={i} className="truncate bg-gray-50 dark:bg-gray-700 p-1 rounded">
                        <span className="font-bold">{f.variant}:</span> {f.comment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-sm mb-1 dark:text-white">Overall Direction (Required)</h4>
                <textarea
                  value={overall}
                  onChange={e => setOverall(e.target.value)}
                  placeholder="Which variant wins? General thoughts?"
                  className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
                  rows={3}
                />
              </div>
              
              <button 
                onClick={handleCopy}
                disabled={!overall}
                className="w-full bg-green-500 disabled:bg-gray-300 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
              >
                Copy Feedback to Clipboard
              </button>
            </div>
          )}
        </div>
      )}
      
      {!isActive && (
        <button 
          onClick={() => setIsActive(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Add Feedback
        </button>
      )}
    </div>
  );
}
