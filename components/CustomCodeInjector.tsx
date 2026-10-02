'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * CustomCodeInjector
 * Injects and manages custom Header (<head>), Body (open), Footer (close),
 * Custom CSS, and Custom JS from the website configuration dynamically.
 */
export default function CustomCodeInjector() {
  const { jekyllConfig } = useAppStore();
  const lastInjectedRef = useRef<{
    head?: string;
    bodyOpen?: string;
    footer?: string;
    css?: string;
    js?: string;
  }>({});

  // 1. Dynamic Custom CSS Injection
  useEffect(() => {
    const css = jekyllConfig?.customCss?.trim() || '';
    if (css === lastInjectedRef.current.css) return;
    lastInjectedRef.current.css = css;

    let styleEl = document.getElementById('dynamic-custom-site-css') as HTMLStyleElement | null;
    if (css) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-custom-site-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;
    } else if (styleEl) {
      styleEl.remove();
    }
  }, [jekyllConfig?.customCss]);

  // 2. Dynamic Custom JS Execution
  useEffect(() => {
    const js = jekyllConfig?.customJs?.trim() || '';
    if (!js || js === lastInjectedRef.current.js) return;
    lastInjectedRef.current.js = js;

    try {
      const scriptFn = new Function(js);
      scriptFn();
    } catch (err) {
      console.warn('[CustomCodeInjector] Error executing custom JS:', err);
    }
  }, [jekyllConfig?.customJs]);

  // 3. Dynamic Custom Head Code Injection
  useEffect(() => {
    const headCode = jekyllConfig?.customHeadCode?.trim() || '';
    if (headCode === lastInjectedRef.current.head) return;

    // Clean up previous dynamically injected head elements
    const prevElements = document.querySelectorAll('[data-injected-head="agb"]');
    prevElements.forEach((el) => el.remove());

    if (headCode) {
      try {
        const range = document.createRange();
        range.selectNode(document.head);
        const fragment = range.createContextualFragment(headCode);

        // Mark elements so we can clean them up later
        Array.from(fragment.children).forEach((child) => {
          (child as HTMLElement).setAttribute?.('data-injected-head', 'agb');
        });

        // Re-create scripts so the browser executes them reliably
        const scripts = fragment.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.setAttribute('data-injected-head', 'agb');
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });

        document.head.appendChild(fragment);
      } catch (err) {
        console.warn('[CustomCodeInjector] Error injecting custom head code:', err);
      }
    }

    lastInjectedRef.current.head = headCode;
  }, [jekyllConfig?.customHeadCode]);

  // 4. Dynamic Body Open Code
  useEffect(() => {
    const bodyOpenCode = jekyllConfig?.customBodyOpenCode?.trim() || '';
    if (bodyOpenCode === lastInjectedRef.current.bodyOpen) return;

    let container = document.getElementById('custom-body-open-container');
    if (bodyOpenCode) {
      if (!container) {
        container = document.createElement('div');
        container.id = 'custom-body-open-container';
        document.body.insertBefore(container, document.body.firstChild);
      }
      try {
        const range = document.createRange();
        range.selectNode(container);
        const fragment = range.createContextualFragment(bodyOpenCode);
        container.innerHTML = '';
        container.appendChild(fragment);
      } catch (err) {
        console.warn('[CustomCodeInjector] Error injecting body open code:', err);
      }
    } else if (container) {
      container.innerHTML = '';
    }

    lastInjectedRef.current.bodyOpen = bodyOpenCode;
  }, [jekyllConfig?.customBodyOpenCode]);

  // 5. Dynamic Footer Code
  useEffect(() => {
    const footerCode = jekyllConfig?.customFooterCode?.trim() || '';
    if (footerCode === lastInjectedRef.current.footer) return;

    let container = document.getElementById('custom-body-footer-container');
    if (footerCode) {
      if (!container) {
        container = document.createElement('div');
        container.id = 'custom-body-footer-container';
        document.body.appendChild(container);
      }
      try {
        const range = document.createRange();
        range.selectNode(container);
        const fragment = range.createContextualFragment(footerCode);
        container.innerHTML = '';

        // Recreate scripts to ensure execution
        const scripts = fragment.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });

        container.appendChild(fragment);
      } catch (err) {
        console.warn('[CustomCodeInjector] Error injecting footer code:', err);
      }
    } else if (container) {
      container.innerHTML = '';
    }

    lastInjectedRef.current.footer = footerCode;
  }, [jekyllConfig?.customFooterCode]);

  return null;
}
