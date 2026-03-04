import { CLOSE_TAGS } from 'somedom';

export const VOID_TAGS = new Set((CLOSE_TAGS || []).map(name => String(name).toLowerCase()));

export function isVoidTag(name) {
  return VOID_TAGS.has(String(name || '').toLowerCase());
}
