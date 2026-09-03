# windowsweep-docs

The public documentation site for **[windowsweep](https://github.com/aoneahsan/windowsweep)** - a safe,
developer-aware Windows cleanup CLI.

**Live site:** https://windowsweep-docs.aoneahsan.com

Built with [Docusaurus](https://docusaurus.io) and deployed to GitHub Pages by
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on every push to `main`.

## Local development

```bash
yarn install
yarn start      # http://localhost:5972
yarn build      # production build; also the link checker
yarn serve      # serve the build on http://localhost:5973
```

## Contributing

The pages here mirror `docs/` in the [windowsweep repository](https://github.com/aoneahsan/windowsweep).
A wording fix belongs in that repository first; this site is then re-mirrored. Corrections to the site's own
structure, navigation or styling are welcome here - see [CONTRIBUTING.md](CONTRIBUTING.md).

Issues about the tool itself go to
[aoneahsan/windowsweep/issues](https://github.com/aoneahsan/windowsweep/issues).

## License

MIT - see [LICENSE](LICENSE). The documented tool deletes files and is provided without warranty.
