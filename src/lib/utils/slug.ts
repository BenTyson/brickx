/** Kebab-case slugify — lowercase, strip non-alphanumerics, collapse dashes. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
