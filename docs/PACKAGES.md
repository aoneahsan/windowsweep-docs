# Packages — windowsweep Docs

**Last updated:** 2026-10-31. This internal inventory is excluded from the published site.

## Manifest unit

The repository root `package.json` is the only package unit. Yarn 4.17.1 manages `yarn.lock`; Node is at least 22.

## Dependencies and use

| Package | Use |
|---|---|
| `@docusaurus/core`, `@docusaurus/preset-classic`, `@docusaurus/plugin-content-docs`, `@docusaurus/theme-common`, `@docusaurus/theme-mermaid` | Static documentation build, docs routes, classic theme and diagrams |
| `@easyops-cn/docusaurus-search-local` | Local search index and UI |
| `@mdx-js/react` | MDX components |
| `clsx` | Theme class composition |
| `prism-react-renderer` | Code highlighting themes |
| `react`, `react-dom` | Docusaurus rendering |
| `@docusaurus/module-type-aliases`, `@docusaurus/tsconfig`, `@docusaurus/types` | Docusaurus TypeScript types and configuration |
| `@types/react` | React types |
| `github-slugger` | Build-time heading anchors |
| `husky`, `lint-staged`, `prettier` | Local commit and formatting gates |
| `typescript` | Type checks; `~6.0.3` while TS 7 lacks the JavaScript API required by the lint toolchain |

## Security resolutions

On 2026-10-31, the production audit had 42 high or critical advisories. `yarn up -R` moved `dompurify` to 3.4.17 and advanced the compatible transitive versions of `body-parser`, `brace-expansion`, `compression`, `fast-uri`, `follow-redirects`, `image-size`, `joi`, `js-yaml`, `launch-editor`, `nanoid`, `proxy-addr`, `shell-quote`, `source-map-js`, `svgo` and `undici`. A second pass advanced Mermaid, KaTeX, colord and PostCSS selector parsing in the client diagram path.

Three upstream dependency ranges still select vulnerable versions: Docusaurus 3.10.2 requests `tinypool@^1.0.2`, its Webpack plugins request `serialize-javascript@^6.0.x`, and Express 4 requests `qs@~6.15.1`. No patched release exists in those ranges. Root `resolutions` select `tinypool@2.2.0`, `serialize-javascript@7.1.4` and `qs@6.17.1`. A clean TypeScript build and Docusaurus client/server build must pass with these overrides. Recheck at each Docusaurus/Express release; remove each resolution when its upstream dependency range selects a patched version, then rerun the audit and build.

After these changes, `yarn npm audit --recursive --environment production` reports zero high or critical advisories. The remaining moderate/low entries are in legacy build/preview dependencies (`deepmerge`, `minimatch`, `uuid`, `whatwg-encoding`); no audit warning is suppressed. Recheck their parent packages at each Docusaurus release and remove the affected old major when the parent supports it.
