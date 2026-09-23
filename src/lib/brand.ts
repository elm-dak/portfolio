import * as simpleIcons from 'simple-icons';

type SimpleIcon = { hex: string };

/** Brand colour of a simple-icons slug, used to tint project tiles. */
export function brandHex(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icon = (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[key];
  return icon ? `#${icon.hex}` : undefined;
}
