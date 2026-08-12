import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  placeholder?: string;
  multiline?: boolean;
};

export function EditableText({
  value,
  onChange,
  className,
  as: Tag = "span",
  placeholder,
  multiline,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      if (inputRef.current instanceof HTMLInputElement) inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false);
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
        }}
        rows={2}
        className={cn(
          "w-full rounded-lg border border-primary/40 bg-background/60 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
          className,
        )}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false);
          if (e.key === "Enter") commit();
        }}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-primary/40 bg-background/60 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "group inline-flex items-start gap-2 rounded-lg px-1 py-0.5 text-left transition hover:bg-primary/10",
        className,
      )}
    >
      <Tag className={cn("m-0", className)}>{value || placeholder}</Tag>
      <Pencil className="mt-1 h-3.5 w-3.5 opacity-0 transition group-hover:opacity-70" />
    </button>
  );
}
