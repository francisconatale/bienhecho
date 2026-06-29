"use client";

import { useState, useEffect } from "react";

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [targetElement, setTargetElement] = useState<string>("");
  const [variant, setVariant] = useState<string>("Overall Direction");

  const [comments, setComments] = useState<{ variant: string, element: string, text: string }[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const variantContainer = target.closest('[data-variant]');
      const v = variantContainer ? variantContainer.getAttribute('data-variant') : "Overall Direction";
      
      let elementDesc = target.tagName.toLowerCase();
      if (target.className && typeof target.className === 'string') {
        elementDesc += `.${target.className.split(' ')[0]}`;
      }
      
      setTargetElement(elementDesc);
      setVariant(v || "Overall Direction");
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [isOpen]);

  const saveComment = () => {
    if (!feedbackText) return;
    setComments([...comments, { variant, element: targetElement, text: feedbackText }]);
    setFeedbackText("");
    setTargetElement("");
    setVariant("Overall Direction");
  };

  const copyToClipboard = () => {
    let output = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${comments.length}\n\n`;
    
    const variants = ["A", "B", "C", "D", "E", "Overall Direction"];
    variants.forEach(v => {
      const variantComments = comments.filter(c => c.variant === v);
      if (variantComments.length > 0) {
        output += `### ${v === "Overall Direction" ? "Overall Direction" : `Variant ${v}`}\n`;
        variantComments.forEach((c, i) => {
          if (v === "Overall Direction") {
            output += `${c.text}\n`;
          } else {
            output += `${i + 1}. **Element** (\`${c.element}\`)\n   "${c.text}"\n`;
          }
        });
        output += "\n";
      }
    });

    navigator.clipboard.writeText(output);
    alert("Feedback copied to clipboard! Paste it into the terminal.");
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-xl z-50 hover:bg-blue-700 transition-colors"
      >
        Add Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="bg-blue-600 text-white px-4 py-3 font-bold flex justify-between items-center">
        <span>Design Lab Feedback</span>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200">Close</button>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Click any element on the page to target it.
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Target Element</label>
          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded text-xs font-mono">
            {variant !== "Overall Direction" ? `[Variant ${variant}] ` : ""}{targetElement || "None selected"}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1">Feedback</label>
          <textarea 
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full border border-gray-300 dark:border-zinc-700 rounded p-2 text-sm bg-white dark:bg-zinc-900"
            rows={3}
            placeholder="Type your feedback here..."
          />
        </div>

        <button 
          onClick={saveComment}
          className="bg-gray-200 dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded font-bold hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Save Comment
        </button>

        <hr className="border-gray-200 dark:border-zinc-800" />

        <div className="text-sm font-bold">
          Saved comments: {comments.length}
        </div>

        <button 
          onClick={copyToClipboard}
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition-colors"
        >
          Submit All Feedback
        </button>
      </div>
    </div>
  );
}
