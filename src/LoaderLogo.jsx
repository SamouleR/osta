import React, { useEffect, useState } from 'react';
import './LoaderLogo.css';

export default function LoaderLogo() {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetch('/logo/osta-logo.svg')
      .then(res => res.text())
      .then(text => {
        // Inject custom class for animation
        const animatedSvg = text.replace('<svg ', '<svg class="animated-logo" ');
        setSvgContent(animatedSvg);
      });
  }, []);

  if (!svgContent) return null;

  return <div className="loader-logo-wrapper" dangerouslySetInnerHTML={{ __html: svgContent }} />;
}
