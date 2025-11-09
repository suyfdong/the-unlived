'use client';

import { useEffect } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

/**
 * Google AdSense Ad Component
 *
 * Usage:
 * <AdSenseAd
 *   adSlot="YOUR_AD_SLOT_ID"
 *   adFormat="auto"
 *   fullWidthResponsive={true}
 * />
 *
 * IMPORTANT: Replace YOUR_ADSENSE_CLIENT_ID in layout.tsx with your actual client ID (ca-pub-XXXXXXXXXXXXXXXX)
 */
export default function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' }
}: AdSenseAdProps) {
  // 判断是否是生产环境（检查域名而不是NODE_ENV）
  const isProduction = typeof window !== 'undefined' &&
    (window.location.hostname === 'www.theunlived.art' ||
     window.location.hostname === 'theunlived.art');

  useEffect(() => {
    if (isProduction) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [isProduction]);

  // Don't show ads in development (localhost)
  if (!isProduction) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400 text-sm">
          [AdSense Ad Placeholder - Slot: {adSlot}]
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Ads only display in production
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-9041836440635279"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
