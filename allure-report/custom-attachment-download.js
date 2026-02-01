/// Very hacky way to download files as they are named in allure report via hijacking
/// file download event
/// But hey, it works

(function () {
  const nativeCreateObjectURL = URL.createObjectURL;
  const nativeOpen = window.open;
  const nativeAnchorClick = HTMLAnchorElement.prototype.click;

  let lastClickedBtn = null;
  const urlToName = new Map();

  function getFilename(el) {
    const scope = el.closest('[data-testid^="test-result-attachment"], [class*="modal-overlay"]') || el.parentElement;
    const nameEl = scope?.querySelector('.paragraphs-text-m, .headings-head-s, [class*="test-result-attachment-text"], [data-testid$="-text"]');
    return nameEl?.textContent.trim();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, a, [role='button']");
    if (btn) {
      const filename = getFilename(btn);
      if (filename) {
        btn._allure_filename = filename;
        lastClickedBtn = btn;
        console.log("Marked button with filename:", filename);
      }
    }
  }, { capture: true, passive: true });

  URL.createObjectURL = function (obj) {
    const url = nativeCreateObjectURL.call(URL, obj);
    
    // Try to find the button that triggered this
    const btn = [document.activeElement, lastClickedBtn].find(el => el?._allure_filename);
    
    if (btn) {
      urlToName.set(url, btn._allure_filename);
      console.log("Mapped URL to filename:", url, "->", btn._allure_filename);
    }
    return url;
  };

  window.open = function (url, target, features) {
    if (typeof url === 'string' && urlToName.has(url)) {
      const a = document.createElement('a');
      a.href = url;
      a.download = urlToName.get(url);
      a.click();
      return null;
    }
    return nativeOpen.apply(this, arguments);
  };

  HTMLAnchorElement.prototype.click = function () {
    const name = urlToName.get(this.href);
    if (name) {
      console.log("Hijacking download name to:", name);
      this.download = name;
    }
    return nativeAnchorClick.apply(this, arguments);
  };

  console.log("Allure Download Hijacker Loaded");
})();