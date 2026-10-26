"use client";
import { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
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
  // <Callout type="conseil">text</Callout> → <div data-callout="conseil"><p>text</p></div>
  return mdx.replace(
    /<Callout type="([^"]+)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, content) => `<div data-callout="${type}"><p>${content.trim()}</p></div>`
  );
}

export function htmlToMdx(md: string): string {
  // <div data-callout="conseil"><p>text</p></div> → <Callout type="conseil">\n  text\n</Callout>
  return md.replace(
    /<div data-callout="([^"]+)">([\s\S]*?)<\/div>/g,
    (_, type, inner) => {
      const text = inner.replace(/<\/?p>/g, "").trim();
      return `<Callout type="${type}">\n  ${text}\n</Callout>`;
    }
  );
}

// ── Custom TipTap node for Callout ───────────────────────────────────────────

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
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "12px",
        padding: "10px 14px",
        margin: "12px 0",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      });

      // Left emoji column
      const left = document.createElement("div");
      left.setAttribute("contenteditable", "false");
      Object.assign(left.style, { flexShrink: "0", paddingTop: "1px", userSelect: "none" });
      const emojiEl = document.createElement("span");
      emojiEl.textContent = s.emoji;
      emojiEl.style.fontSize = "1.05rem";
      left.appendChild(emojiEl);

      // Right content column
      const right = document.createElement("div");
      right.style.flex = "1";
      right.style.minWidth = "0";

      const labelEl = document.createElement("div");
      labelEl.textContent = s.label;
      labelEl.setAttribute("contenteditable", "false");
      Object.assign(labelEl.style, {
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        opacity: "0.55",
        marginBottom: "4px",
        userSelect: "none",
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

// ── Public ref API ────────────────────────────────────────────────────────────

export type RichEditorRef = {
  applyFormat(type: string): void;
  insertImage(src: string, alt?: string): void;
  insertCallout(type: string): void;
};

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  defaultValue: string;
  onChange: (v: string) => void;
};

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
      TiptapImage.configure({ HTMLAttributes: { class: "rich-img" } }),
      Markdown.configure({ html: true, tightLists: true, transformPastedText: true }),
      CalloutNode,
    ],
    content: mdxToHtml(defaultValue),
    onUpdate({ editor }) {
      const md = editor.storage.markdown.getMarkdown();
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
      editor?.chain().focus().setImage({ src, alt }).run();
    },
    insertCallout(type: string) {
      editor?.chain().focus().insertContent({
        type: "callout",
        attrs: { calloutType: type },
        content: [{ type: "paragraph", content: [{ type: "text", text: "Votre contenu ici..." }] }],
      }).run();
    },
  }), [editor]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-white">
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
});
