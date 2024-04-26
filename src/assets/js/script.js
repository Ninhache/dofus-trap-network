window.onload = function() {
  const sourceEl = document.getElementsByClassName("relative-height-source");
  if (sourceEl.length > 0) {
    new ResizeObserver((entries) => {
      const elements = document.getElementsByClassName("relative-height");
      for (const entry of entries) {
        for (const element of elements) {
          element.style.maxHeight = `${entry.contentRect.height}px`;
        }
      }
    }).observe(sourceEl[0]);
  }
};
