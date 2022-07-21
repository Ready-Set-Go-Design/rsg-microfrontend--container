import React, { useEffect } from "react";
function MF({ name, host, history, document, window }) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const scriptId = `micro-frontend-script-${name}`;

  const renderMicroFrontend = () => {
    if (window[`render${name}`]) {
      window[`render${name}`](`${name}-container`, history);
    }
  };

  useEffect(() => {
    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement("script");
        script.id = scriptId;
        script.crossOrigin = "";
        script.src = `${host}${manifest.files["main.js"]}`;
        script.onload = renderMicroFrontend;
        document.head.appendChild(script);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      if (window[`unmount${name}`]) {
        window[`unmount${name}`](`${name}-container`);
      }
    };
  }, []);

  if (document.getElementById(scriptId)) {
    renderMicroFrontend();
    return;
  }

  return <main id={`${name}-container`} />;
}

export const MicroFrontend = React.memo(MF);
