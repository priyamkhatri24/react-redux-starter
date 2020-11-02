import { useEffect, useRef } from 'react';
// Custom hook to implement setInterval

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return console.error('Delay cant be null');
  }, [delay]);
};

// Custom hook to implement setTimeout

export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
    return console.error('Delay cannot be null');
  }, [delay]);
};

export const apiValidation = (res, payload = 'result') => {
  if (res && res.success === 1) {
    return res[payload];
  }
  return console.error('The API has failed');
};

// function to implement global color styles

export const setGlobalColors = (primary, light, lighter, superlight) => {
  document.body.style.setProperty('--primary-blue', primary);
  document.body.style.setProperty('--lighter-blue', light);
  document.body.style.setProperty('--lightest-blue', lighter);
  document.body.style.setProperty('--superlight-blue', superlight);
};

// function to dynamically change document title

export function changeFaviconAndDocumentTitle(favicon, documentTitle = 'Ingenium Education') {
  const link = document.createElement('link');
  const oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = favicon;
  document.title = documentTitle;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

// function to check whether development or environment

export function prodOrDev() {
  if (process.env.NODE_ENV === 'development') return 'development';
  if (process.env.NODE_ENV === 'production') return 'production';
  return 'test';
}
