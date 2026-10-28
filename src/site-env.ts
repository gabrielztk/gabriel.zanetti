// Build-time release switch. Unset, misspelled and other values stay private.
export const isProduction = process.env.SITE_ENV === "production";
export const siteURL = isProduction
  ? "https://blog.gabrielkawall.net"
  : "https://f5yipw.dev.horai.gabrielkawall.net";
