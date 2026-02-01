# Allure 3 Download by Name Hijack

This project provides a workaround for downloading attachments from Allure 3 reports using their actual attachment names instead of the default random UUID-like filenames.

## How it works

The solution consists of two parts:
1. `allure-report/custom-attachment-download.js`: A JavaScript file that is injected into the Allure report. It intercepts download events and attempts to find the associated attachment name from the UI, setting it as the `download` attribute for the file.
2. `allure-report/patch-report.sh`: A helper bash script that automatically injects the script tag into the `index.html` of your generated Allure report.

## Usage

1. Generate your Allure report as usual (e.g., `allure generate allure-results`).
2. Copy the files from this repository into your `allure-report` folder:
   - `custom-attachment-download.js` -> `allure-report/custom-attachment-download.js`
   - `patch-report.sh` -> `allure-report/patch-report.sh`
3. Run the patch script:
   ```bash
   ./allure-report/patch-report.sh
   ```
4. `allure open` or publish your report as usual.

## Note

This is a "hacky" solution that relies on hijacking browser APIs and inspecting the DOM structure of the Allure 3 report. 
It may break if the Allure report UI structure changes significantly in future versions.
