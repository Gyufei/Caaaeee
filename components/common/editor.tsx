'use client';

import {
  BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import type { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import * as React from 'react';
import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { BlockquoteElement } from '@/components/ui/blockquote-node';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/ui/toolbar';

export default function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (_v: string) => void;
}) {
  const t = useTranslations('ArticleForm');
  const textEditorValue = useMemo(() => {
    try {
      return JSON.parse(value || '[]');
    } catch (e: unknown) {
      console.error(e);
      return value;
    }
  }, [value]);

  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
    ],
    value: textEditorValue,
  });

  function handleChange(v: Value) {
    onChange(v ? JSON.stringify(v) : '[]');
  }

  return (
    <Plate editor={editor} onChange={({ value }) => handleChange(value)}>
      <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
        <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
          B
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
          I
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
          U
        </MarkToolbarButton>
        <div className="flex-1" />
      </FixedToolbar>
      <EditorContainer variant="demo">
        <Editor placeholder={t('placeholders.contentBody')} />
      </EditorContainer>
    </Plate>
  );
}
