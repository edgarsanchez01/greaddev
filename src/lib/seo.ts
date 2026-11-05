/** Only an explicitly configured HTTP(S) origin may become the public site URL. */
export function resolveSiteUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('SITE_URL must be an absolute HTTP(S) origin, without a path or credentials.');
  }
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    // URL.search/hash are empty for bare ?/#, but href still retains the delimiters.
    url.href !== `${url.origin}/`
  ) {
    throw new Error('SITE_URL must be an absolute HTTP(S) origin, without a path or credentials.');
  }
  return url.href;
}

export function pageSeo(site: URL | undefined, pathname: string, noindex = false) {
  return {
    canonical: site && !noindex ? new URL(pathname, site).href : undefined,
    robots: site && !noindex ? 'index, follow' : 'noindex, nofollow',
  };
}

/** Single public content URL. The 404 and source documents are not sitemap entries. */
export function seoFiles(site: string | undefined) {
  if (!site) return { robots: 'User-agent: *\nDisallow: /\n' };
  const origin = resolveSiteUrl(site)!;
  const xmlOrigin = origin.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return {
    robots: `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', origin).href}\n`,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${xmlOrigin}</loc></url></urlset>\n`,
  };
}
