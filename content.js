// content.js - DOM Telemetry Extractor

function inspectPage() {
  const currentHost = window.location.hostname;
  const isPlainHttp = window.location.protocol === "http:";
  
  // Check password inputs
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  const hasPasswordField = passwordInputs.length > 0;

  // Check form destinations
  const forms = Array.from(document.querySelectorAll("form"));
  let externalForms = 0;

  forms.forEach((form) => {
    const rawAction = form.getAttribute("action");
    if (rawAction) {
      try {
        const targetUrl = new URL(rawAction, window.location.href);
        // Form submits to an outside domain
        if (targetUrl.hostname && targetUrl.hostname !== currentHost) {
          externalForms++;
        }
      } catch (err) {
        // malformed URL
      }
    }
  });

  return {
    url: window.location.href,
    domain: currentHost,
    isHttps: window.location.protocol === "https:",
    isPlainHttp: isPlainHttp,
    hasPasswordField: hasPasswordField,
    externalFormSubmissions: externalForms,
    timestamp: new Date().toISOString()
  };
}

// Run scan immediately
const telemetry = inspectPage();

// Send telemetry to background service worker
chrome.runtime.sendMessage({
  action: "ANALYZE_PAGE",
  data: telemetry
});