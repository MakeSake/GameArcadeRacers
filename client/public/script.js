/**
 * Main application logic, project data loading, and event handling.
 * This file contains the large base64-encoded project data and the core functions
 * for initializing the application using the Scaffolding library.
 */

// --- GLOBAL VARIABLES AND CONSTANTS ---

// The base64-encoded, compressed project buffer.
// DO NOT MODIFY THIS STRING unless updating the project data.
let projectDecodeBuffer = Scaffolding.base64ToArrayBuffer("H4sICCC8K2BkAAALAGFwcGVsL3NlcnZlci90aW1lX3ZhbHVlX2Jhc2ljX3Byb3RvLmRhdgCSv2lFzswvLVJIT8sEAL/6968KAAA=\n");
const projectDataFormat = 'zip';

// Elements
const app = document.getElementById('app');
const loadingScreen = document.getElementById('loading');
const errorScreen = document.getElementById('error');
const launchScreen = document.getElementById('launch');
const errorText = document.getElementById('error-text');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

let zip;
let assetPromiseMap = new Map();
let currentProgress = 0;

// --- UTILITY FUNCTIONS ---

/**
 * Finds a file inside the loaded JSZip object.
 * @param {string} path The file path to search for.
 * @returns {Scaffolding.JSZip.JSZipObject | undefined} The file object or undefined.
 */
const findFileInZip = (path) => {
  if (!zip) return undefined;
  return zip.file(path);
};

/**
 * Sets the loading progress for the UI.
 * @param {number} progress A value between 0 and 1.
 */
const setProgress = (progress) => {
  currentProgress = progress;
  const percent = Math.round(progress * 100);
  progressText.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
};

/**
 * Handles errors by displaying the error screen.
 * @param {string | Error} message The error message or object.
 */
const errorHandler = (message) => {
  console.error(message);
  loadingScreen.hidden = true;
  launchScreen.hidden = true;
  errorScreen.hidden = false;
  errorText.textContent = message instanceof Error ? message.stack || message.message : String(message);
};

// --- PROJECT DATA AND ASSET LOADING ---

/**
 * Retrieves a project asset from the zip or fetches it dynamically.
 * Note: Dynamic fetching is disabled in this bundled app, only zip lookup is used.
 * @param {string} assetType The type of asset (e.g., 'sound', 'image').
 * @param {string} dataFormat The format of the data (e.g., 'svg', 'png', 'wav').
 * @param {string} assetId The unique ID of the asset.
 * @returns {Promise<Uint8Array | null>} The asset data.
 */
const getProjectAsset = (assetType, dataFormat, assetId) => {
  // Use a promise map to prevent duplicate requests for the same asset.
  const mapKey = `${assetType}-${assetId}`;
  if (assetPromiseMap.has(mapKey)) {
    return assetPromiseMap.get(mapKey);
  }

  const promise = Promise.resolve().then(() => {
    // Check if the zip file is available
    if (!zip) {
      console.error('getProjectAsset called before project data was loaded or has been closed');
      return null;
    }
    
    // The path is typically 'assetId.dataFormat'
    const path = assetId + '.' + dataFormat;
    const file = findFileInZip(path);
    
    if (!file) {
      console.error('Asset is not in zip: ' + path);
      return null; // Return null if asset is not found
    }
    
    // Async load the file data as a Uint8Array
    return file
      .async('uint8array')
      // Create the asset in the Scaffolding storage after loading
      .then((data) => Scaffolding.storage.createAsset(assetType, dataFormat, data, assetId));
  });

  assetPromiseMap.set(mapKey, promise);
  return promise;
};

/**
 * Core function to load the main project data (project.json).
 * This function decrypts/decompresses the base64 buffer and extracts project.json.
 * @returns {Promise<ArrayBuffer>} The project.json data as an ArrayBuffer.
 */
const getProjectData = () => {
  // This immediately-invoked function returns a promise chain
  // to process the project buffer data.
  return (async () => {
    // Capture the buffer locally, then clear the global reference for Garbage Collection (GC)
    const buffer = projectDecodeBuffer;
    projectDecodeBuffer = null;
    
    // Convert the data back into a usable Uint8Array
    return new Uint8Array(buffer); 
  })().then(async (data) => {
    // Load the data as a zip file
    zip = await Scaffolding.JSZip.loadAsync(data);
    
    // Find the main project.json file
    const file = findFileInZip('project.json');
    if (!file) {
      throw new Error('project.json is not in zip');
    }
    
    // Return the project.json contents as an ArrayBuffer
    return file.async('arraybuffer');
  });
};

// --- MAIN APPLICATION RUNNER ---

/**
 * Main function to start the application after resources are loaded.
 */
const run = async () => {
  try {
    // 1. Configure Scaffolding environment
    Scaffolding.storage.setGetProjectAsset(getProjectAsset);
    Scaffolding.runtime.setGetProjectData(getProjectData);
    
    // Configure runtime and stage size (as per original code)
    Scaffolding.vm.setTurboMode(true);
    Scaffolding.vm.setStageSize(480, 360);
    
    // Set the main DOM element
    Scaffolding.renderer.setDOMElement(app);

    // 2. Load the project data
    const projectData = await getProjectData();
    
    // 3. Load the project into the VM
    await Scaffolding.loadProject(projectData);
    
    // 4. Update progress and show application
    setProgress(1);
    loadingScreen.hidden = true;
    
    // The original app used 'if (true)' for auto-starting, which means it always starts immediately
    const autoStart = true;
    
    if (autoStart) {
      Scaffolding.start();
    } else {
      // If auto-start was false, show the launch screen
      launchScreen.hidden = false;
      launchScreen.addEventListener('click', () => {
        launchScreen.hidden = true;
        Scaffolding.start();
      });
      launchScreen.focus();
    }
  } catch (err) {
    errorHandler(err);
  }
};

// --- FALLBACKS AND INITIALIZATION ---

// Polyfill for requestAnimationFrame for better compatibility
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    return window.setTimeout(() => callback(Date.now()), 1000 / 60);
  };
}

// Start the application once the DOM is fully loaded.
window.addEventListener('load', run);

// Add global error handler (as per original code)
window.addEventListener('error', (e) => {
  errorHandler(e.error || e.message);
});
