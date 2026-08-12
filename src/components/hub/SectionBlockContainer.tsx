import { useState } from "react";
import { Trash2, Plus, GripVertical, Image as ImageIcon, Paperclip, Check } from "lucide-react";
import { SectionBlock, ContentElement, ContentElementType, uid } from "@/lib/templates";
import { NotionBlockPicker } from "./NotionBlockPicker";
import { EditableText } from "./EditableText";
import { cn } from "@/lib/utils";

interface Props {
  block: SectionBlock;
  onChange: (updated: SectionBlock) => void;
  onDelete: () => void;
}

const blockHeaderStyles: Record<SectionBlock["type"], { border: string; bg: string; badge: string }> = {
  theory: { border: "border-cyan/40", bg: "bg-cyan/5", badge: "📘 Theory Block" },
  exercise_description: { border: "border-gold/40", bg: "bg-gold/5", badge: "📝 Exercise Description" },
  exercise_solution: { border: "border-xp/40", bg: "bg-xp/5", badge: "💡 Exercise Solution" },
  custom: { border: "border-primary/40", bg: "bg-primary/5", badge: "⚙ Custom Block" },
};

export function SectionBlockContainer({ block, onChange, onDelete }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const style = blockHeaderStyles[block.type] || blockHeaderStyles.custom;

  const addElement = (type: ContentElementType) => {
    const newEl: ContentElement = {
      id: uid(),
      type,
      content:
        type === "h1"
          ? "Nuevo Encabezado 1"
          : type === "h2"
            ? "Nuevo Encabezado 2"
            : type === "h3"
              ? "Nuevo Encabezado 3"
              : type === "h4"
                ? "Nuevo Encabezado 4"
                : type === "todolist"
                  ? "Nueva tarea por completar"
                  : type === "image"
                    ? "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop"
                    : type === "file"
                      ? "Guia_de_Estudio_Final.pdf"
                      : "Escribe tu contenido aquí...",
      checked: type === "todolist" ? false : undefined,
    };
    onChange({ ...block, elements: [...block.elements, newEl] });
  };

  const updateElement = (id: string, partial: Partial<ContentElement>) => {
    onChange({
      ...block,
      elements: block.elements.map((el) => (el.id === id ? { ...el, ...partial } : el)),
    });
  };

  const deleteElement = (id: string) => {
    onChange({
      ...block,
      elements: block.elements.filter((el) => el.id !== id),
    });
  };

  return (
    <div className={cn("rounded-xl border p-4 transition-all relative", style.border, style.bg)}>
      {/* Header of Section Block */}
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-border/40 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-background/60 text-foreground border border-border/50">
            {style.badge}
          </span>
          <EditableText
            value={block.title}
            onChange={(v) => onChange({ ...block, title: v })}
            className="font-display text-base font-semibold text-foreground"
          />
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition px-2 py-1 rounded hover:bg-destructive/10"
          title="Eliminar bloque"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px]">Borrar</span>
        </button>
      </div>

      {/* Elements list inside block */}
      <div className="flex flex-col gap-2.5">
        {block.elements.map((el, i) => (
          <div key={el.id} className="group relative flex items-start gap-2 rounded-lg p-1.5 transition hover:bg-background/40">
            <span className="mt-1 cursor-grab opacity-0 transition group-hover:opacity-60">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </span>

            <div className="min-w-0 flex-1">
              {el.type === "h1" && (
                <EditableText
                  value={el.content}
                  onChange={(v) => updateElement(el.id, { content: v })}
                  className="font-display text-xl font-bold text-primary"
                />
              )}
              {el.type === "h2" && (
                <EditableText
                  value={el.content}
                  onChange={(v) => updateElement(el.id, { content: v })}
                  className="font-display text-lg font-semibold text-foreground"
                />
              )}
              {el.type === "h3" && (
                <EditableText
                  value={el.content}
                  onChange={(v) => updateElement(el.id, { content: v })}
                  className="font-display text-base font-medium text-foreground"
                />
              )}
              {el.type === "h4" && (
                <EditableText
                  value={el.content}
                  onChange={(v) => updateElement(el.id, { content: v })}
                  className="font-display text-sm font-medium text-muted-foreground"
                />
              )}
              {el.type === "text" && (
                <EditableText
                  value={el.content}
                  onChange={(v) => updateElement(el.id, { content: v })}
                  className="text-sm text-foreground/90 leading-relaxed"
                />
              )}
              {el.type === "bullet_list" && (
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <EditableText
                    value={el.content}
                    onChange={(v) => updateElement(el.id, { content: v })}
                    className="text-sm text-foreground/90"
                  />
                </div>
              )}
              {el.type === "numbered_list" && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{i + 1}.</span>
                  <EditableText
                    value={el.content}
                    onChange={(v) => updateElement(el.id, { content: v })}
                    className="text-sm text-foreground/90"
                  />
                </div>
              )}
              {el.type === "todolist" && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => updateElement(el.id, { checked: !el.checked })}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                      el.checked ? "border-xp bg-xp text-background" : "border-border hover:border-primary",
                    )}
                  >
                    {el.checked && <Check className="h-3 w-3" />}
                  </button>
                  <EditableText
                    value={el.content}
                    onChange={(v) => updateElement(el.id, { content: v })}
                    className={cn("text-sm text-foreground/90", el.checked && "line-through text-muted-foreground")}
                  />
                </div>
              )}
              {el.type === "image" && (
                <div className="rounded-lg border border-border/50 bg-background/50 p-2">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-mono">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    <span>Imagen adjunta</span>
                  </div>
                  {el.content.startsWith("http") ? (
                    <img src={el.content} alt="" className="max-h-48 rounded object-cover border border-border/40" />
                  ) : null}
                  <input
                    value={el.content}
                    onChange={(e) => updateElement(el.id, { content: e.target.value })}
                    placeholder="URL de la imagen..."
                    className="mt-2 w-full rounded border border-border/40 bg-background/60 px-2 py-1 font-mono text-xs text-foreground"
                  />
                </div>
              )}
              {el.type === "file" && (
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 p-3">
                  <div className="flex items-center gap-3">
                    <Paperclip className="h-4 w-4 text-primary" />
                    <EditableText
                      value={el.content}
                      onChange={(v) => updateElement(el.id, { content: v })}
                      className="font-mono text-xs font-medium text-foreground"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">PDF Document</span>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteElement(el.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition"
              title="Borrar elemento"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Element trigger */}
      <div className="mt-4 relative">
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 font-mono text-xs text-primary transition hover:border-primary hover:bg-primary/10"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Añadir elemento (o escribe /)</span>
        </button>

        {showPicker && (
          <div className="absolute left-0 top-9 z-50">
            <NotionBlockPicker
              onSelect={(type) => addElement(type)}
              onClose={() => setShowPicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
