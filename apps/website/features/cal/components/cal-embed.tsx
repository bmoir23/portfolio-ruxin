'use client';

import Cal from '@calcom/embed-react';

export default function CalEmbed() {
  return (
    <div className="cal-embed">
      <Cal namespace="30min" calLink="bmoir/30min" />
    </div>
  );
}
