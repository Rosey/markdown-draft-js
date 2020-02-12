import { RawDraftContentState } from 'draft-js';

export const markdownToDraft: (markdown: string) => RawDraftContentState;

export const draftToMarkdown: (RawDraft: RawDraftContentState) => string;