"use client";
import { useImperativeHandle, forwardRef, useRef } from "react";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Markdown } from "tiptap-markdown";
import { Node, mergeAttributes } from "@tiptap/core";

// ── Callout colours ──────────────────────────────────────────────────────────

const CALLOUT = {
  conseil:      { emoji: "💡", bg: "#FFFBEB", border: "#FDE68A", label: "Conseil" },
  attention:    { emoji: "⚠️", bg: "#FFF7ED", border: "#FDBA74", label: "Attention" },
  interdiction: { emoji: "🚫", bg: "#FEF2F2", border: "#FCA5A5", label: "À éviter" },
  info:         { emoji: "ℹ️", bg: "#EFF6FF", border: "#93C5FD", label: "Info" },
  astuce:       { emoji: "✨", bg: "#F0FDF4", border: "#86EFAC", label: "Astuce" },
  important:    { emoji: "📌", bg: "#FAF5FF", border: "#C4B5FD", label: "Important" },
} as const;

type CType = keyof typeof CALLOUT;

// ── MDX ↔ HTML converters ─────────────────────────────────────────────────────

export function mdxToHtml(mdx: string): string {
  // 1. Callout JSX → HTML div
  let html = mdx.replace(
    /<Callout type="([^"]+)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, content) => `<div data-callout="${type}"><p>${content.trim()}</p></div>`
  );
  // 2. <img style="width:X;..."> → add data-width / data-align for TipTap attr parsing
  html = html.replace(/<img([^>]*?)\s*\/?>/g, (match, attrs) => {
    if (attrs.includes("data-width") || attrs.includes("data-align")) return match;
    const styleMatch = attrs.match(/style="([^"]+)"/);
    if (!styleMatch) return match;
    const style = styleMatch[1];
    const widthMatch = style.match(/width:\s*([^;]+)/);
    const width = widthMatch ? widthMatch[1].trim() : null;
    const align = style.includes("float:left") ? "left"
                : style.includes("float:right") ? "right"
                : "center";
    let result = `<img${attrs}`;
    if (width) result += ` data-width="${width}"`;
    result += ` data-align="${align}"`;
    result += "/>";
    return result;
  });
  return html;
}

export function htmlToMdx(md: string): string {
  // 1. Callout HTML div → MDX JSX
  return md.replace(
    /<div data-callout="([^"]+)">([\s\S]*?)<\/div>/g,
    (_, type, inner) => {
      const text = inner.replace(/<\/?p>/g, "").trim();
      return `<Callout type="${type}">\n  ${text}\n</Callout>`;
    }
  );
  // HTML img tags pass through unchanged (no data-* in stored MDX, only style)
}

// ── Image NodeView (resize + align controls) ─────────────────────────────────

function ImageView({ node, updateAttributes, selected }: any) {
  const { src, alt, width, align } = node.attrs;
  const curAlign = align || "center";
  const curWidth = width || "100%";
  const justify = curAlign === "left" ? "flex-start"
                : curAlign === "right" ? "flex-end"
                : "center";

  return (
    <NodeViewWrapper>
      <div style={{ display: "flex", justifyContent: justify, margin: "0.75rem 0" }}>
        <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <img
            src={src}
            alt={alt || ""}
            draggable={false}
            style={{
              width: curWidth,
              maxWidth: "100%",
              borderRadius: "10px",
              display: "block",
              outline: selected ? "2px solid #d97706" : "none",
              outlineOffset: "3px",
            }}
          />
          {selected && (
            <div style={{
              position: "absolute",
              bottom: "-44px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              background: "white",
              border: "1px solid #e7e5e4",
              borderRadius: "10px",
              padding: "4px 8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
              zIndex: 20,
              whiteSpace: "nowrap",
            }}>
              {(["25%", "50%", "75%", "100%"] as const).map((w) => (
                <button
                  key={w}
                  onMouseDown={(e) => { e.preventDefault(); updateAttributes({ width: w }); }}
                  style={{
                    padding: "2px 7px",
                    fontSize: "11px",
                    borderRadius: "5px",
                    border: "none",
                    background: curWidth === w ? "#1c1917" : "transparent",
                    color: curWidth === w ? "white" : "#78716c",
                    cursor: "pointer",
                    fontWeight: curWidth === w ? 700 : 400,
                  }}
                >
                  {w}
                </button>
              ))}
              <div style={{ width: "1px", height: "16px", background: "#e7e5e4", margin: "0 3px" }} />
              {([{ v: "left", icon: "⇤" }, { v: "center", icon: "↔" }, { v: "right", icon: "⇥" }] as const).map(({ v, icon }) => (
                <button
                  key={v}
                  onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: v }); }}
                  style={{
                    padding: "2px 8px",
                    fontSize: "13px",
                    borderRadius: "5px",
                    border: "none",
                    background: curAlign === v ? "#1c1917" : "transparent",
                    color: curAlign === v ? "white" : "#78716c",
                    cursor: "pointer",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// ── Custom Image extension with resize / align ───────────────────────────────

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-width") ?? null,
        renderHTML: (attrs) => attrs.width ? { "data-width": attrs.width } : {},
      },
      align: {
        default: "center",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-align") ?? "center",
        renderHTML: (attrs) => ({ "data-align": attrs.align ?? "center" }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

// ── Callout TipTap node ──────────────────────────────────────────────────────

const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "paragraph+",
  defining: true,

  addAttributes() {
    return {
      calloutType: {
        default: "conseil",
        parseHTML: (el) => el.getAttribute("data-callout") ?? "conseil",
        renderHTML: (attrs) => ({ "data-callout": attrs.calloutType }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },
  addNodeView() {
    return ({ node }) => {
      const type = (node.attrs.calloutType as CType) ?? "conseil";
      const s = CALLOUT[type] ?? CALLOUT.conseil;

      const dom = document.createElement("div");
      dom.setAttribute("data-callout", type);
      Object.assign(dom.style, {
        background: s.bg, border: `1px solid ${s.border}`, borderRadius: "12px",
        padding: "10px 14px", margin: "12px 0", display: "flex", gap: "10px", alignItems: "flex-start",
      });
      const left = document.createElement("div");
      left.setAttribute("contenteditable", "false");
      Object.assign(left.style, { flexShrink: "0", paddingTop: "1px", userSelect: "none" });
      const emojiEl = document.createElement("span");
      emojiEl.textContent = s.emoji;
      emojiEl.style.fontSize = "1.05rem";
      left.appendChild(emojiEl);
      const right = document.createElement("div");
      right.style.flex = "1";
      right.style.minWidth = "0";
      const labelEl = document.createElement("div");
      labelEl.textContent = s.label;
      labelEl.setAttribute("contenteditable", "false");
      Object.assign(labelEl.style, {
        fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em",
        textTransform: "uppercase", opacity: "0.55", marginBottom: "4px", userSelect: "none",
      });
      const contentDOM = document.createElement("div");
      right.appendChild(labelEl);
      right.appendChild(contentDOM);
      dom.appendChild(left);
      dom.appendChild(right);
      return { dom, contentDOM };
    };
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSizedImages(node: any): Map<string, { width?: string; align?: string }> {
  const map = new Map<string, { width?: string; align?: string }>();
  const walk = (n: any) => {
    if (!n) return;
    if (n.type === "image" && n.attrs) {
      const { width, align } = n.attrs;
      if (width || (align && align !== "center")) {
        map.set(n.attrs.src, { width: width || undefined, align: align || undefined });
      }
    }
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };
  walk(node);
  return map;
}

// ── Public ref API ────────────────────────────────────────────────────────────

export type RichEditorRef = {
  applyFormat(type: string): void;
  insertImage(src: string, alt?: string): void;
  insertCallout(type: string): void;
  insertTable(): void;
};

// ── Component ─────────────────────────────────────────────────────────────────

type Props = { defaultValue: string; onChange: (v: string) => void };

export const RichEditor = forwardRef<RichEditorRef, Props>(function RichEditor(
  { defaultValue, onChange },
  ref
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, code: false, codeBlock: false }),
      TiptapLink.configure({ openOnClick: false }),
      CustomImage,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ html: true, tightLists: true, transformPastedText: true }),
      CalloutNode,
    ],
    content: mdxToHtml(defaultValue),
    onUpdate({ editor }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let md = (editor.storage as any).markdown.getMarkdown() as string;

      // Post-process: replace markdown img syntax with HTML for sized/aligned images
      const sized = extractSizedImages(editor.getJSON());
      if (sized.size > 0) {
        md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match: string, alt: string, src: string) => {
          const attrs = sized.get(src.trim());
          if (!attrs) return _match;
          const styles: string[] = [];
          if (attrs.width) styles.push(`width:${attrs.width}`);
          if (attrs.align === "left") styles.push("float:left;margin:0 1rem 1rem 0");
          else if (attrs.align === "right") styles.push("float:right;margin:0 0 1rem 1rem");
          else styles.push("display:block;margin:0 auto");
          return `<img src="${src.trim()}" alt="${alt}" style="${styles.join(";")}" />`;
        });
      }

      onChangeRef.current(htmlToMdx(md));
    },
    editorProps: {
      attributes: { class: "rich-editor-prose", spellcheck: "true" },
    },
    immediatelyRender: false,
  });

  useImperativeHandle(ref, () => ({
    applyFormat(type: string) {
      if (!editor) return;
      const c = editor.chain().focus();
      switch (type) {
        case "bold":      c.toggleBold().run(); break;
        case "italic":    c.toggleItalic().run(); break;
        case "h2":        c.toggleHeading({ level: 2 }).run(); break;
        case "h3":        c.toggleHeading({ level: 3 }).run(); break;
        case "h4":        c.toggleHeading({ level: 4 }).run(); break;
        case "ul":        c.toggleBulletList().run(); break;
        case "ol":        c.toggleOrderedList().run(); break;
        case "quote":     c.toggleBlockquote().run(); break;
        case "separator": c.setHorizontalRule().run(); break;
        case "link": {
          const url = prompt("URL du lien :");
          if (url) c.setLink({ href: url }).run();
          else editor.chain().focus().run();
          break;
        }
      }
    },
    insertImage(src: string, alt = "Image") {
      editor?.chain().focus().setImage({ src, alt } as any).run();
    },
    insertCallout(type: string) {
      editor?.chain().focus().insertContent({
        type: "callout",
        attrs: { calloutType: type },
        content: [{ type: "paragraph", content: [{ type: "text", text: "Votre contenu ici..." }] }],
      }).run();
    },
    insertTable() {
      editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  }), [editor]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-white">
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
});
