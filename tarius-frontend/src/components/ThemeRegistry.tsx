// Filename: src/components/ThemeRegistry.tsx

"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/api";

export default function ThemeRegistry() {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    async function fetchTheme() {
      const { data } = await supabase
        .from("SiteSettings")
        .select("value")
        .eq("key", "theme_settings")
        .single();
        
      if (data && data.value) {
        setTheme(data.value);
      }
    }
    fetchTheme();
  }, []);

  if (!theme) return null;

  // Dynamically generate the Google Fonts URL based on admin selection
  const formattedDisplayFont = theme.typography.display.replace(/ /g, "+");
  const formattedBodyFont = theme.typography.body.replace(/ /g, "+");
  const fontUrl = "https://fonts.googleapis.com/css2?family=" + formattedDisplayFont + ":wght@400;500;600;700&family=" + formattedBodyFont + ":wght@400;500;600;700&display=swap";

  // Construct the global CSS override string
  const cssString = 
    "@import url('" + fontUrl + "');\n" +
    ":root {\n" +
    "  --tarius-ivory: " + theme.colors.ivory + ";\n" +
    "  --tarius-ivory-deep: " + theme.colors.ivoryDeep + ";\n" +
    "  --tarius-graphite: " + theme.colors.graphite + ";\n" +
    "  --tarius-graphite-soft: " + theme.colors.graphiteSoft + ";\n" +
    "  --tarius-olive: " + theme.colors.olive + ";\n" +
    "  --tarius-olive-dark: " + theme.colors.oliveDark + ";\n" +
    "  --tarius-champagne: " + theme.colors.champagne + ";\n" +
    "  --tarius-white: " + theme.colors.white + ";\n" +
    "  --tarius-border: " + theme.colors.border + ";\n" +
    "  --font-display: '" + theme.typography.display + "', serif;\n" +
    "  --font-body: '" + theme.typography.body + "', sans-serif;\n" +
    "  --tarius-radius: " + theme.geometry.radius + ";\n" +
    "}\n" +
    "\n" +
    "/* Apply dynamic border radius to structural elements */\n" +
    ".btn-tarius, .image-tarius, select, input, textarea, .border-tarius, .bg-white {\n" +
    "  border-radius: var(--tarius-radius);\n" +
    "}\n";

  return <style dangerouslySetInnerHTML={{ __html: cssString }} />;
}