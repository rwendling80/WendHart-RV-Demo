import { siteConfig } from "@/lib/siteConfig";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-cream/80 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm space-y-2">
        <p>
          {siteConfig.address} &nbsp;·&nbsp;{" "}
          <a href={siteConfig.phoneHref} className="underline">
            {siteConfig.phone}
          </a>
        </p>
        <p className="font-semibold text-cream">{siteConfig.disclaimer}</p>
      </div>
    </footer>
  );
}
