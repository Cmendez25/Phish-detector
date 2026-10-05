# PhishShield

A lightweight, real-time Chromium security extension (Manifest V3) designed to detect credential harvesting and phishing attacks before submission. 

### Key Capabilities
* **DOM Telemetry Extraction:** Identifies insecure password inputs and off-domain form exfiltration attempts in real time.
* **Risk Scoring Engine:** Evaluates threats using a weighted heuristic algorithm running inside an asynchronous background service worker.
* **SOC Popup Dashboard:** Visualizes active threat levels (Safe, Warning, Danger) with granular indicator breakdowns and dynamic badge alerts.
