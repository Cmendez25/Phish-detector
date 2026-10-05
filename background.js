// background.js - PhishShield Detection Engine

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_PAGE") {
    const telemetry = request.data;
    let riskScore = 0;
    const flags = [];

    // Check 1: Insecure credential harvesting (including localhost HTTP tests)
    if (telemetry.hasPasswordField && (telemetry.isPlainHttp || !telemetry.isHttps)) {
      riskScore += 50;
      flags.push("CRITICAL: Password input found on unencrypted HTTP page.");
    }

    // Check 2: Form target hijacking (external form action)
    if (telemetry.externalFormSubmissions > 0) {
      riskScore += 35;
      flags.push("WARNING: Form points to an external destination domain.");
    }

    // Check 3: Raw IPv4 address used as hostname
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipPattern.test(telemetry.domain)) {
      riskScore += 40;
      flags.push("SUSPICIOUS: Destination URL uses a raw IP address instead of a domain name.");
    }

    // Check 4: Deep subdomain nesting
    const domainParts = telemetry.domain.split(".");
    if (domainParts.length > 4) {
      riskScore += 20;
      flags.push("NOTICE: High number of subdomains detected (potential brand impersonation).");
    }

    const finalScore = Math.min(riskScore, 100);

    // Save scan result in Chrome's local storage for popup.html
    chrome.storage.local.set({
      latestScan: {
        url: telemetry.url,
        domain: telemetry.domain,
        score: finalScore,
        flags: flags,
        timestamp: telemetry.timestamp
      }
    });

    // Update the toolbar badge
    if (finalScore >= 50) {
      chrome.action.setBadgeText({ text: "!" });
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    } else if (finalScore > 0) {
      chrome.action.setBadgeText({ text: "•" });
      chrome.action.setBadgeBackgroundColor({ color: "#eab308" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  }
});