// popup.js - Matches background.js storage structure

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["latestScan", "latestAnalysis"], (result) => {
    // Check both potential key names
    const scan = result.latestScan || result.latestAnalysis;

    if (!scan) {
      document.getElementById("domain").innerText = "No scan data available for this tab.";
      return;
    }

    // Populate Domain / URL
    document.getElementById("domain").innerText = scan.domain || scan.url || "Active Page";

    // Grab score (handling both score and riskScore names)
    const score = scan.score !== undefined ? scan.score : (scan.riskScore !== undefined ? scan.riskScore : 0);
    const scoreVal = document.getElementById("scoreValue");
    const scoreCard = document.getElementById("scoreCard");
    const flagsList = document.getElementById("flagsList");

    scoreVal.innerText = `${score} / 100`;

    // Dynamic color coding
    if (score >= 50) {
      scoreCard.className = "score-card danger";
    } else if (score > 0) {
      scoreCard.className = "score-card warning";
    } else {
      scoreCard.className = "score-card safe";
    }

    // Populate Indicators (handling both flags and alerts arrays)
    const indicators = scan.flags || scan.alerts || [];
    flagsList.innerHTML = "";

    if (indicators.length > 0) {
      indicators.forEach((indicatorText) => {
        const item = document.createElement("li");
        item.innerText = indicatorText;
        flagsList.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.innerText = "No suspicious forms or URL anomalies detected.";
      flagsList.appendChild(item);
    }
  });
});