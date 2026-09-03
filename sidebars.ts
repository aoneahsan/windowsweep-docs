import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Order mirrors how a destructive tool should be approached: understand what it removes and what the
 * developer question changes, learn to preview it, only then install and run it. Reference material,
 * recovery and history come after.
 *
 * A page that is not in this sidebar is effectively unreachable, so categories are updated in the SAME
 * change that adds a page.
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Before you delete anything',
      collapsed: false,
      items: ['safety-model', 'developer-mode'],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['installation', 'quick-start'],
    },
    'sections',
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'cli-reference',
        'profiles',
        'admin-and-elevation',
        'reports-and-logs',
        'ai-integration-guide',
      ],
    },
    'troubleshooting',
    'faq',
    'changelog',
    'about',
  ],
};

export default sidebars;
