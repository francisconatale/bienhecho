"use client";
import React, { useState } from "react";

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [comments, setComments] = useState<{ variant: string; text: string; element: string }[]>([]);
  const [overall, setOverall] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("A");
  const [currentText, setCurrentText] = useState("");

  const generateMarkdown = () => {
    let md = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${comments.length}\n\n`;
    ['A', 'B', 'C', 'D', 'E'].forEach(v => {
      const vComments = comments.filter(c => c.variant === v);
      if (vComments.length > 0) {
        md += `### Variant ${v}\n`;
        vComments.forEach((c, i) => {
          md += `${i + 1}. **Element** (${c.element})\n   "${c.text}"\n`;
        });
        md += '\n';
      }
    });
    md += `### Overall Direction\n${overall}\n`;
    return md;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    alert("Copied to clipboard! Paste it in the chat.");
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        Add Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-surface border border-outline-variant/20 p-4 rounded-xl shadow-2xl z-50 w-96 flex flex-col gap-4 text-on-surface">
      <h3 className="font-bold">Design Lab Feedback</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm">Select Variant to comment on:</label>
        <select 
          value={selectedVariant} 
          onChange={e => setSelectedVariant(e.target.value)}
          className="p-2 rounded border border-outline-variant/20 bg-surface"
        >
          <option value="A">Variant A</option>
          <option value="B">Variant B</option>
          <option value="C">Variant C</option>
          <option value="D">Variant D</option>
          <option value="E">Variant E</option>
        </select>
        
        <textarea 
          placeholder="Your feedback..." 
          value={currentText}
          onChange={e => setCurrentText(e.target.value)}
          className="p-2 rounded border border-outline-variant/20 h-20 bg-surface"
        />
        <button 
          onClick={() => {
            if (currentText) {
              setComments([...comments, { variant: selectedVariant, text: currentText, element: 'general' }]);
              setCurrentText("");
            }
          }}
          className="bg-outline-variant/10 px-3 py-1 rounded hover:bg-outline-variant/20"
        >
          Add Comment
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-outline-variant/20 pt-2">
        <label className="text-sm">Overall Direction:</label>
        <textarea 
          value={overall}
          onChange={e => setOverall(e.target.value)}
          className="p-2 rounded border border-outline-variant/20 h-20 bg-surface"
        />
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <button onClick={() => setIsOpen(false)} className="px-3 py-1 rounded hover:bg-outline-variant/10">Close</button>
        <button onClick={copyToClipboard} className="bg-primary text-white px-3 py-1 rounded hover:brightness-110">Copy Markdown</button>
      </div>
    </div>
  );
}
