/**
 * LUMIXA Site & Advertising Configuration
 *
 * All core tools are free with zero mandatory login or subscriptions.
 * Future advertising scripts (such as Google AdSense or ethical ad networks)
 * should only be added in index.html and rendered inside AdSlot once an
 * advertising provider is chosen and approved.
 */
export const SITE_CONFIG = {
  brandName: 'LUMIXA',
  /**
   * Reserves non-intrusive, CLS-safe layout slots for future advertisements
   * without showing fake ads or loading external ad scripts prematurely.
   */
  reserveAdSpaces: true,
  adSlots: {
    homeLeaderboard: {
      slotId: 'lumixa-home-horizontal-01',
      dimensionsLabel: '728 × 90',
    },
    toolWorkspaceBottom: {
      slotId: 'lumixa-tool-horizontal-02',
      dimensionsLabel: '728 × 90',
    },
  },
} as const;
