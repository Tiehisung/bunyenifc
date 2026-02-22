 

import type React from "react";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../buttons/Button";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleAddLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }) => (
    <Button
      onClick={onClick}
      title={title}
      className={`h-9 w-9 p-0 justify-center rounded ${
        isActive ? "bg-blue-500 text-white" : ""
      }`}
      type="button"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-muted/50 p-3">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-border pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={UnderlineIcon}
          title="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          icon={Code}
          title="Code"
        />
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-border pr-2">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          title="Heading 3"
        />
      </div>

      {/* Lists & Quotes */}
      <div className="flex gap-1 border-r border-border pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          title="Ordered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          title="Blockquote"
        />
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-border pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          title="Align Right"
        />
      </div>

      {/* Highlight & Link */}
      <div className="flex gap-1 border-r border-border pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          icon={Highlighter}
          title="Highlight"
        />
        <div className="relative">
          <span
            onClick={() => setShowLinkInput(!showLinkInput)}
            title="Add Link"
            className={`h-9 w-9 p-1 flex items-center justify-center ${
              editor.isActive("link") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <LinkIcon className="h-4 w-4" />
          </span>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-md shadow-lg p-2 z-10 w-48">
              <input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddLink}
                  className="bg-accent hover:opacity-80 _slowTrans flex-1 h-7 text-xs justify-center"
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setShowLinkInput(false);
                    setLinkUrl("");
                  }}
                  className="bg-accent hover:opacity-80 _slowTrans flex-1 h-7 text-xs justify-center"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo2}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo2}
          title="Redo"
        />
      </div>
    </div>
  );
}
