import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useState } from "react";
import { EditorToolbar } from "./TipTapToolbar";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  wrapperStyles?: string;
  allowPreview?: boolean;
}

export function RichTextEditor({
  onChange,
  value,
  className,
  placeholder = "Start typing ...",
}: RichTextEditorProps) {
  const [content, setContent] = useState(value || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {},
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content || "<p></p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        placeholder: placeholder || "",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
      <EditorToolbar editor={editor} />
      <div className="border-t border-border">
        <EditorContent
          editor={editor}
          className={`grow max-w-none focus:outline-none indent-4 min-h-20 p-1 ${className}`}
        />
      </div>
      <div className="border-t border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          Word count:{" "}
          {
            editor
              .getText()
              .split(/\s+/)
              .filter((w) => w.length > 0).length
          }
        </p>
      </div>
    </div>
  );
}
