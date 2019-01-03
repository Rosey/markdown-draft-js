import * as Remarkable from 'remarkable';
import * as DraftJS from 'draft-js';

interface IItems {
  open: (x: DraftJS.RawDraftEntity | DraftJS.RawDraftContentBlock, y?: number) => string;
  close: (x: any) => string;
}

export interface DraftMarkdownOptions {
  styleItems?: {
    [key: string]: IItems
  };
  preserveNewlines?: boolean;
  escapeMarkdownCharacters?: boolean;
  entityItems?: any;
  remarkablePreset?: Remarkable.Presets;
  remarkableOptions?: Remarkable.Options;
  remarkablePlugins?: Remarkable.Plugin[];
  blockEntity?: DraftJS.ContentBlock;
  blockEntities?: {
    [key: string]: DraftJS.DraftBlockRenderMap;
  };
  blockStyles?: any;
  blockTypes?: DraftJS.DraftBlockType;
}

export interface ToMarkdownOptions {
  preserveNewlines?: boolean;
  escapeMarkdownCharacters?: boolean;
  entityItems?: any;
  remarkablePreset?:  "commonmark" | "full" | "remarkable";
  remarkableOptions?: Remarkable.Options;
  remarkablePlugins?: Remarkable.Plugin[];
  blockEntity?: DraftJS.ContentBlock
}

