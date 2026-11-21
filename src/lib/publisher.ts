/**
 * The brand as publisher/provider in every JSON-LD block: ONE object (qa 21/11/2026).
 * Square logo; the 1200×630 og-image is a share image, not a logo.
 */
import { SITE_URL } from "./routeMeta";

export const LOGO_URL = `${SITE_URL}/icon-512x512.png`;

export const PUBLISHER = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Olha que Duas",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 },
};
