import React from 'react';

// Lightweight PDF viewer using an iframe
export default function PdfViewer({ url, title, height = '60vh' }) {
  // Ensure a sane URL
  const src = url;
  return (
    <div style={{ width: '100%', height: height }}>
      <iframe
        src={src}
        title={title ?? 'PDF Viewer'}
        width="100%"
        height="100%"
        frameBorder={0}
        style={{ border: '1px solid #e5e7eb', borderRadius: 8, width: '100%', height: '100%' }}
        allow="fullscreen"
      />
    </div>
  );
}
