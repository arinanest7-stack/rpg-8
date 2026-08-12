import React, { useState, useEffect, useRef } from "react";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  CheckSquare,
  Image as ImageIcon,
  Paperclip,
  X,
  Search,
} from "lucide-react";
import { ContentElementType } from "@/lib/templates";

interface Option {
  id: ContentElementType;
  label: string;
  category: "basic" | "media";
  badge: string;
  icon: React.ReactNode;
}

const OPTIONS: Option[] = [
  { id: "text", label: "Text Paragraph", category: "basic", badge: "P", icon: <Type className="h-4 w-4" /> },
  { id: "h1", label: "Heading 1", category: "basic", badge: "#", icon: <Heading1 className="h-4 w-4" /> },
  { id: "h2", label: "Heading 2", category: "basic", badge: "##", icon: <Heading2 className="h-4 w-4" /> },
  { id: "h3", label: "Heading 3", category: "basic", badge: "###", icon: <Heading3 className="h-4 w-4" /> },
  { id: "h4", label: "Heading 4", category: "basic", badge: "####", icon: <Heading4 className="h-4 w-4" /> },
  { id: "bullet_list", label: "Bulleted List", category: "basic", badge: "-", icon: <List className="h-4 w-4" /> },
  { id: "numbered_list", label: "Numbered List", category: "basic", badge: "1.", icon: <ListOrdered className="h-4 w-4" /> },
  { id: "todolist", label: "Task Checklist", category: "basic", badge: "[]", icon: <CheckSquare className="h-4 w-4" /> },
  { id: "image", label: "Image", category: "media", badge: "Img", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "file", label: "File Attachment", category: "media", badge: "File", icon: <Paperclip className="h-4 w-4" /> },
];

interface Props {
  onSelect: (type: ContentElementType) => void;
  onClose: () => void;
}

export function NotionBlockPicker({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  const basicOptions = filtered.filter((o) => o.category === "basic");
  const mediaOptions = filtered.filter((o) => o.category === "media");

  return (
    <div className="z-50 w-72 rounded-xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-md">
      {/* Header & Search */}
      <div className="relative mb-2 flex items-center gap-2 border-b border-border/50 pb-2 px-1">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search block type..."
          className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto pr-1">
        {basicOptions.length > 0 && (
          <div className="mb-2">
            <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Basic Blocks
            </div>
            {basicOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-primary/20 hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-primary/80">{opt.icon}</span>
                  <span className="font-medium text-foreground">{opt.label}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{opt.badge}</span>
              </button>
            ))}
          </div>
        )}

        {mediaOptions.length > 0 && (
          <div>
            <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-t border-border/40 pt-2">
              Media Content
            </div>
            {mediaOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-primary/20 hover:text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-primary/80">{opt.icon}</span>
                  <span className="font-medium text-foreground">{opt.label}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{opt.badge}</span>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="p-3 text-center text-xs text-muted-foreground">
            No matching blocks found
          </div>
        )}
      </div>

      <div className="mt-2 border-t border-border/40 pt-1.5 px-2 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
        <span>Close menu</span>
        <kbd className="rounded border border-border px-1 text-[9px]">esc</kbd>
      </div>
    </div>
  );
}
