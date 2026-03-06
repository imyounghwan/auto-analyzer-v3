# 🎯 Auto Analyzer v3.0 Complete User Guide

## 📋 Table of Contents
1. [Installation](#1-installation)
2. [Running Web Server](#2-running-web-server)
3. [Running Analysis](#3-running-analysis)
4. [Viewing Results](#4-viewing-results)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Installation

### ✅ Prerequisites
- **Node.js** v18 or higher
- **Google Chrome** browser
- **2GB+** RAM
- **500MB+** disk space

### 📥 Step 1: Download
```
https://www.genspark.ai/api/files/s/3koTwgjB
```
Click the link above to download `auto-analyzer-v3-complete.tar.gz`

### 📂 Step 2: Extract
```bash
# Navigate to download folder
cd ~/Downloads

# Extract archive
tar -xzf auto-analyzer-v3-complete.tar.gz

# Navigate to extracted folder
cd home/user/auto-analyzer-v3
```

### 📦 Step 3: Install Dependencies
```bash
# Install Node.js packages (takes 2-3 minutes)
npm install
```

**Expected output:**
```
added 299 packages, and audited 353 packages in 2m
68 packages are looking for funding
found 0 vulnerabilities
```

### 🌐 Step 4: Install Chrome

#### **Ubuntu/Debian**
```bash
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

#### **Or use provided script**
```bash
chmod +x install-chrome.sh
./install-chrome.sh
```

#### **Verify installation**
```bash
google-chrome --version
```
**Expected:** `Google Chrome 145.0.7632.159`

---

## 2. Running Web Server

### 🚀 Start Server
```bash
# Run from auto-analyzer-v3 folder
npm run web
```

**Success output:**
```
✅ Auto Analyzer v3.0 Web Interface Running
📍 http://localhost:3000

Usage:
1. Open the URL above in your browser
2. Enter website URL to analyze
3. Click "Start Analysis" button
4. Run generated command in new terminal

Exit: Ctrl+C
```

### 🌐 Open in Browser
1. Launch web browser (Chrome, Firefox, Safari, etc.)
2. Enter in address bar: `http://localhost:3000`
3. Press Enter!

**Screen preview:**
```
┌──────────────────────────────────────────┐
│    🚀 Auto Analyzer v3.0                │
│    Nielsen Heuristic UIUX Analysis       │
├──────────────────────────────────────────┤
│                                          │
│  🌐 Website URL to Analyze              │
│  ┌────────────────────────────────────┐ │
│  │ https://www.naver.com              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  📊 Analysis Options                    │
│  ☑ Generate PDF Report (Chart + Detail)│
│  ☐ No Cache (Always Fresh Analysis)    │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │      🎬 Start Analysis              │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 3. Running Analysis

### 📝 Step 1: Enter URL
Enter website URL in the input field

**Examples:**
- `https://www.naver.com`
- `https://www.google.com`
- `https://www.amazon.com`
- `https://www.netflix.com`

### ⚙️ Step 2: Select Options

#### **Generate PDF Report** (Recommended ✅)
- Checked: JSON + **PDF file** with radar chart
- Unchecked: JSON file only

#### **No Cache**
- Checked: Always fresh analysis (slower)
- Unchecked: Use cache if available within 1 hour (faster)

### 🎬 Step 3: Click Start Analysis
Click the "🚀 Start Analysis" button!

**Command automatically generated:**
```
💻 Command to Execute
┌──────────────────────────────────────────────┐
│ cd /home/user/auto-analyzer-v3 &&            │
│ npm start -- analyze                         │
│ --url https://www.naver.com --pdf            │
│                              [📋 Copy]       │
└──────────────────────────────────────────────┘

💡 Copy and run this command in your terminal
```

### 💻 Step 4: Run Command in Terminal

#### **Mac / Linux**
1. Open Terminal app (new window or tab)
2. Copy command from web page (click 📋 Copy button)
3. Paste in terminal (`Cmd+V` or `Ctrl+Shift+V`)
4. Press Enter!

#### **Windows (WSL)**
1. Open Ubuntu terminal
2. Copy command from web page
3. Right-click in terminal → Paste
4. Press Enter!

### ⏳ Step 5: Monitor Progress

**Terminal output example:**
```
======================================================================
🚀 Auto Analyzer v3.0 - Analysis Started
======================================================================
📍 URL: https://www.naver.com
💾 Cache: Disabled

📄 Analyzing HTML...
✅ HTML Analysis Complete (Title: NAVER...)

🚀 Launching Browser...
📄 Loading https://www.naver.com...
✅ Page Loaded Successfully

🖱️  Puppeteer Interaction Analysis Started...
  🖱️  N1_3 Action Feedback (Full Survey)...
  📊 Testing 140 elements...
  ⏳ Progress: 14/140 (10%)
  ⏳ Progress: 28/140 (20%)
  ...
  ✅ Hover: 89/140 (63.6%)
  ✅ Click: 17/20 (85.0%)
  ✅ Final Score: 4.0/5.0

  ⚡ Measuring Performance (Lighthouse)...
  ✅ LCP:2.4s FID:120ms CLS:0.05 TTI:3.1s
✅ Lighthouse Analysis Complete

✅ Puppeteer Analysis Complete
📊 Calculating Nielsen Scores...
✅ Nielsen Score: 3.58/5.0 (B+) | Measured: 30.2% (13/43)

======================================================================
📊 Analysis Complete
======================================================================
Overall Score: 3.58/5.0
Grade: B+

📈 Item Distribution:
  Excellent (4.5+): 6 items
  Good (4.0+): 12 items
  Fair (3.0+): 20 items
  Poor (3.0-): 5 items

📊 Measurement Method:
  Measured Items: 13 (Puppeteer + Lighthouse)
  Estimated Items: 30 (HTML Analysis)

🏆 Top 5 Items:
  1. N17_3_cls_stability: 5.0/5.0
  2. N5_1_input_validation: 4.5/5.0
  3. N1_3_action_feedback: 4.0/5.0
  4. N3_3_flexible_navigation: 4.5/5.0
  5. N4_3_standard_compliance: 4.0/5.0

⚠️  Items Needing Improvement:
  1. N11_1_search_autocomplete: 2.0/5.0
  2. N11_2_search_quality: 2.0/5.0
  3. N7_1_accelerators: 2.5/5.0
  4. N19_notification: 2.5/5.0
  5. N7_2_personalization: 3.0/5.0

📁 Results Saved: output/analysis-2026-03-06T03-15-23.json
📄 PDF Report: output/report-2026-03-06T03-15-23.pdf
```

**⏱️ Analysis Time:**
- Simple site (example.com): ~35 seconds
- Medium complexity (google.com): ~45 seconds
- Complex site (naver.com): ~90 seconds

---

## 4. Viewing Results

### 📊 Method 1: Web Browser (Recommended!)

#### **Step 1: Get Result Filename**
Copy filename from terminal output:
```
📁 Results Saved: output/analysis-2026-03-06T03-15-23.json
```
→ Copy `analysis-2026-03-06T03-15-23.json`

#### **Step 2: Open in Browser**
Enter in address bar:
```
http://localhost:3000/result.html?file=analysis-2026-03-06T03-15-23.json
```

**Result Screen:**
```
┌──────────────────────────────────────────┐
│  Auto Analyzer v3.0 - Results            │
├──────────────────────────────────────────┤
│           Overall Score: 3.58            │
│           Grade: B+                      │
│           Measured Rate: 30.2%           │
│           Items Analyzed: 43             │
├──────────────────────────────────────────┤
│  [Radar Chart]                           │
│  Nielsen 10 Heuristics Analysis          │
│  - N1: Visibility: 3.5                  │
│  - N2: Match Real World: 3.5            │
│  - N3: User Control: 3.8                │
│  ...                                     │
├──────────────────────────────────────────┤
│  🏆 6  👍 12  ✋ 20  ⚠️ 5               │
│  Excel Good  Fair   Poor                 │
├──────────────────────────────────────────┤
│  ⭐ Top 5 Items                          │
│  1. N17_3_cls_stability: 5.0/5.0        │
│  2. N5_1_input_validation: 4.5/5.0      │
│  ...                                     │
├──────────────────────────────────────────┤
│  ⚠️  Needs Improvement                   │
│  1. N11_1_search_autocomplete: 2.0/5.0  │
│  2. N11_2_search_quality: 2.0/5.0       │
│  ...                                     │
├──────────────────────────────────────────┤
│  🔬 Measurement Methods                  │
│  🤖 Puppeteer: 9 items (95%+ accuracy)  │
│  ⚡ Lighthouse: 4 items (98% accuracy)  │
│  📄 HTML Analysis: 30 items (75-80%)    │
└──────────────────────────────────────────┘
```

### 📄 Method 2: PDF File

```bash
# Navigate to output folder
cd output

# Open PDF (Mac)
open report-2026-03-06T03-15-23.pdf

# Open PDF (Linux)
xdg-open report-2026-03-06T03-15-23.pdf

# Open PDF (Windows WSL)
explorer.exe report-2026-03-06T03-15-23.pdf
```

**PDF Contents:**
- ✅ Overall score dashboard
- ✅ Nielsen 10 heuristics radar chart
- ✅ 43 items detailed scorecard
- ✅ Top/bottom 5 items
- ✅ Lighthouse performance metrics
- ✅ Measurement methodology

---

## 5. Troubleshooting

### ❌ Problem 1: `npm install` fails
**Symptom:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution:**
```bash
# Permission issue - change folder ownership
sudo chown -R $USER:$USER .

# Retry installation
npm install
```

### ❌ Problem 2: Chrome not found
**Symptom:**
```
Error: Could not find Chrome
```

**Solution:**
```bash
# Check Chrome installation
google-chrome --version

# If not installed
sudo apt-get install -y google-chrome-stable

# Or use script
./install-chrome.sh
```

### ❌ Problem 3: Port 3000 already in use
**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill process using port 3000
fuser -k 3000/tcp

# Or
lsof -ti:3000 | xargs kill -9

# Restart
npm run web
```

### ❌ Problem 4: Analysis stuck
**Symptom:**
Progress not advancing in terminal

**Solution:**
```bash
# Stop with Ctrl+C

# Kill all Chrome processes
pkill -9 chrome

# Retry
npm start -- analyze --url <URL> --pdf --no-cache
```

---

## ✅ Checklist

Installation Complete:
- [ ] Node.js v18+ installed (`node --version`)
- [ ] Chrome installed (`google-chrome --version`)
- [ ] Files extracted
- [ ] `npm install` successful
- [ ] `npm run web` working
- [ ] `http://localhost:3000` accessible

Analysis Complete:
- [ ] URL entered
- [ ] Command generated
- [ ] Command executed in terminal
- [ ] Progress displayed
- [ ] JSON file in `output/`
- [ ] PDF file in `output/` (if selected)

Results Viewed:
- [ ] Result page opened in browser
- [ ] Radar chart displayed
- [ ] Scores and grades visible
- [ ] Top/bottom items shown

---

**Now you can use it perfectly!** 🎉

**For issues, visit GitHub:**
https://github.com/imyounghwan/auto-analyzer-v3/issues
