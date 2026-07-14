const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000" : "";

let styles = [
  {
    id: "cartoon",
    name: "Cartoon / Chibi",
    description: "Cute features, bold outlines, bright colours.",
    bestFor: "Phone cases, magnets, mugs"
  },
  {
    id: "realistic",
    name: "Original-Based Design",
    description: "Keeps the pet realistic with cleaner colour and background removal.",
    bestFor: "Tote bags, keychains, magnets"
  },
  {
    id: "line",
    name: "Sketch / Line Art",
    description: "Minimal black-and-white illustration for a polished gift feel.",
    bestFor: "Tote bags, mugs, standees"
  },
  {
    id: "oil",
    name: "Oil Painting",
    description: "Premium portrait look with richer texture and dramatic lighting.",
    bestFor: "Framed prints, T-shirts, mugs"
  }
];

let products = [
  {
    id: "mug",
    name: "Mug",
    rationale: "Classic gift item with mature printing process.",
    price: 79,
    cost: "RMB 15-22",
    margin: "~72%"
  },
  {
    id: "tshirt",
    name: "T-shirt",
    rationale: "Strong personal expression and higher order value.",
    price: 99,
    cost: "RMB 22-35",
    margin: "~73%"
  },
  {
    id: "magnet",
    name: "Fridge Magnet",
    rationale: "Low-price entry product for impulse purchase.",
    price: 39,
    cost: "RMB 5-10",
    margin: "~74%"
  },
  {
    id: "tote",
    name: "Canvas Tote Bag",
    rationale: "Practical everyday bag for custom pet artwork.",
    price: 49,
    cost: "RMB 14-22",
    margin: "~65%"
  },
  {
    id: "keychain",
    name: "Keychain / Charm",
    rationale: "Everyday carry add-on with emotional value.",
    price: 49,
    cost: "RMB 10-15",
    margin: "~76%"
  }
];

const appState = {
  styleId: "cartoon",
  productId: "mug",
  monthlyOrders: 184,
  petPhotoUrl: null,
  artworkId: null,
  originalArtworkUrl: null,
  generatedArtworkUrl: null,
  customizationId: null,
  customizationCanvasJson: null,
  productMockupId: null,
  productMockupUrl: null
};

const stylePreviewImages = {
  cartoon: "assets/style-cartoon.png",
  realistic: "assets/style-realistic.png",
  line: "assets/style-line.png",
  oil: "assets/style-oil.png"
};

const productPreviewImages = {
  mug: "assets/product-mug.png",
  tshirt: "assets/product-tshirt.png",
  magnet: "assets/product-magnet.png",
  tote: "assets/product-tote.png",
  keychain: "assets/product-keychain.png"
};

const styleOptions = document.querySelector("#styleOptions");
const productOptions = document.querySelector("#productOptions");
const productPreviewSection = document.querySelector("#productPreviewSection");
const generateProductMockupButton = document.querySelector("#generateProductMockup");
const regenerateArtworkButton = document.querySelector("#regenerateArtwork");
const customizeArtworkButton = document.querySelector("#customizeArtwork");
const workflowContext = document.querySelector("#workflowContext");
const miniStepArtwork = document.querySelector("#miniStepArtwork");
const miniStepMockup = document.querySelector("#miniStepMockup");
const miniStepDownload = document.querySelector("#miniStepDownload");
const artworkCardMeta = document.querySelector("#artworkCardMeta");
const productCardMeta = document.querySelector("#productCardMeta");
const productMockupCard = document.querySelector("#productMockupCard");
const mockupActionTitle = document.querySelector("#mockupActionTitle");
const mockupActionText = document.querySelector("#mockupActionText");
const finalDownloadCard = document.querySelector("#finalDownloadCard");
const finalMockupImage = document.querySelector("#finalMockupImage");
const mockupPlaceholderText = document.querySelector("#mockupPlaceholderText");
const downloadArtworkLink = document.querySelector("#downloadArtwork");
const downloadMockupLink = document.querySelector("#downloadMockup");
const generateArtworkButton = document.querySelector("#generateArtwork");
const aiStatus = document.querySelector("#aiStatus");
const aiStatusTitle = document.querySelector("#aiStatusTitle");
const aiStatusText = document.querySelector("#aiStatusText");
const finalDownloadTitle = document.querySelector("#finalDownloadTitle");
const finalDownloadText = document.querySelector("#finalDownloadText");
const finalSummaryStyle = document.querySelector("#finalSummaryStyle");
const finalSummaryProduct = document.querySelector("#finalSummaryProduct");
const finalSummaryPrice = document.querySelector("#finalSummaryPrice");
const sourcePhotoPreview = document.querySelector("#sourcePhotoPreview");
const uploadCompleteBadge = document.querySelector("#uploadCompleteBadge");
const uploadStatusText = document.querySelector("#uploadStatusText");
const artworkResult = document.querySelector("#artworkResult");
const resultArt = document.querySelector("#resultArt");
const artworkResultTitle = document.querySelector("#artworkResultTitle");
const artworkResultText = document.querySelector("#artworkResultText");
const startNewOrderButton = document.querySelector("#startNewOrder");
const petUploadInput = document.querySelector("#petUpload");
const stickerEditorSection = document.querySelector("#stickerEditorSection");
const stickerCategoryTabs = document.querySelector("#stickerCategoryTabs");
const stickerGrid = document.querySelector("#stickerGrid");
const stickerCanvasElement = document.querySelector("#stickerCanvas");
const stickerEditorStatus = document.querySelector("#stickerEditorStatus");
const duplicateStickerButton = document.querySelector("#duplicateSticker");
const deleteStickerButton = document.querySelector("#deleteSticker");
const bringStickerForwardButton = document.querySelector("#bringStickerForward");
const sendStickerBackwardButton = document.querySelector("#sendStickerBackward");
const undoStickerButton = document.querySelector("#undoSticker");
const redoStickerButton = document.querySelector("#redoSticker");
const resetStickersButton = document.querySelector("#resetStickers");
const saveCustomizationButton = document.querySelector("#saveCustomization");
const cancelCustomizationButton = document.querySelector("#cancelCustomization");

const STICKER_EXPORT_SIZE = 2048;
const STICKER_CANVAS_SIZE = 768;

const stickerCategories = [
  {
    id: "bows",
    name: "Bows",
    stickers: [
      { id: "bow-pink", label: "Pink bow", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><path d="M78 50C52 14 18 14 12 42c-5 28 29 38 66 8Z" fill="#f4a7b9" stroke="#6b3d39" stroke-width="6"/><path d="M82 50c26-36 60-36 66-8 5 28-29 38-66 8Z" fill="#f4a7b9" stroke="#6b3d39" stroke-width="6"/><rect x="64" y="34" width="32" height="32" rx="10" fill="#d96d8a" stroke="#6b3d39" stroke-width="6"/></svg>' },
      { id: "bow-sage", label: "Sage bow", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><path d="M78 50C52 15 21 12 13 40c-8 29 29 42 65 10Z" fill="#9fb99d" stroke="#3f5d45" stroke-width="6"/><path d="M82 50c26-35 57-38 65-10 8 29-29 42-65 10Z" fill="#9fb99d" stroke="#3f5d45" stroke-width="6"/><circle cx="80" cy="50" r="18" fill="#f6ead9" stroke="#3f5d45" stroke-width="6"/></svg>' }
    ]
  },
  {
    id: "hearts",
    name: "Hearts",
    stickers: [
      { id: "heart-coral", label: "Coral heart", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110"><path d="M60 98S12 70 12 38c0-18 12-28 27-28 10 0 17 6 21 14 4-8 11-14 21-14 15 0 27 10 27 28 0 32-48 60-48 60Z" fill="#df7d68" stroke="#7a3c32" stroke-width="6"/></svg>' },
      { id: "heart-cream", label: "Cream heart", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110"><path d="M60 98S12 70 12 38c0-18 12-28 27-28 10 0 17 6 21 14 4-8 11-14 21-14 15 0 27 10 27 28 0 32-48 60-48 60Z" fill="#fff1d8" stroke="#c98572" stroke-width="6"/></svg>' }
    ]
  },
  {
    id: "stars",
    name: "Stars",
    stickers: [
      { id: "star-gold", label: "Gold star", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="m60 10 14 32 35 3-27 23 8 34-30-18-30 18 8-34-27-23 35-3Z" fill="#f2c766" stroke="#82632a" stroke-width="6"/></svg>' },
      { id: "sparkle", label: "Sparkle", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="M60 8c8 29 17 43 52 52-35 9-44 23-52 52-8-29-17-43-52-52 35-9 44-23 52-52Z" fill="#fff2ac" stroke="#a47b2f" stroke-width="6"/></svg>' }
    ]
  },
  {
    id: "flowers",
    name: "Flowers",
    stickers: [
      { id: "daisy", label: "Daisy", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140"><g fill="#fff8dc" stroke="#6f8f77" stroke-width="5"><ellipse cx="70" cy="28" rx="18" ry="28"/><ellipse cx="70" cy="112" rx="18" ry="28"/><ellipse cx="28" cy="70" rx="28" ry="18"/><ellipse cx="112" cy="70" rx="28" ry="18"/><ellipse cx="40" cy="40" rx="18" ry="28" transform="rotate(-45 40 40)"/><ellipse cx="100" cy="100" rx="18" ry="28" transform="rotate(-45 100 100)"/><ellipse cx="100" cy="40" rx="28" ry="18" transform="rotate(-45 100 40)"/><ellipse cx="40" cy="100" rx="28" ry="18" transform="rotate(-45 40 100)"/></g><circle cx="70" cy="70" r="22" fill="#d8b46a" stroke="#82632a" stroke-width="6"/></svg>' }
    ]
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    stickers: [
      { id: "round-sunglasses", label: "Round sunglasses", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80"><circle cx="52" cy="40" r="30" fill="#262322" stroke="#5a4a3d" stroke-width="6"/><circle cx="128" cy="40" r="30" fill="#262322" stroke="#5a4a3d" stroke-width="6"/><path d="M82 38c12-8 24-8 36 0" fill="none" stroke="#5a4a3d" stroke-width="7" stroke-linecap="round"/><path d="M24 30 4 22M156 30l20-8" stroke="#5a4a3d" stroke-width="7" stroke-linecap="round"/></svg>' }
    ]
  },
  {
    id: "hats",
    name: "Hats",
    stickers: [
      { id: "party-hat", label: "Party hat", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140"><path d="M60 12 100 118H20Z" fill="#87b7c7" stroke="#365b64" stroke-width="6"/><path d="M39 66h42M30 96h60" stroke="#fff3c4" stroke-width="8" stroke-linecap="round"/><circle cx="60" cy="16" r="12" fill="#f4a7b9" stroke="#6b3d39" stroke-width="5"/></svg>' }
    ]
  },
  {
    id: "speech",
    name: "Speech bubbles",
    stickers: [
      { id: "bubble-heart", label: "Love bubble", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><path d="M22 20h136c10 0 18 8 18 18v38c0 10-8 18-18 18H80l-34 20 8-20H22C12 94 4 86 4 76V38c0-10 8-18 18-18Z" fill="#fffdf8" stroke="#6f8f77" stroke-width="6"/><path d="M90 76S64 60 64 43c0-9 7-15 15-15 5 0 9 3 11 8 2-5 6-8 11-8 8 0 15 6 15 15 0 17-26 33-26 33Z" fill="#df7d68"/></svg>' }
    ]
  },
  {
    id: "seasonal",
    name: "Seasonal stickers",
    stickers: [
      { id: "snowflake", label: "Snowflake", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><g stroke="#87b7c7" stroke-width="8" stroke-linecap="round"><path d="M60 12v96M18 36l84 48M102 36 18 84"/><path d="m45 24 15 15 15-15M45 96l15-15 15 15M28 48l20 6-6-20M92 72l-20-6 6 20M92 48l-20 6 6-20M28 72l20-6-6 20"/></g></svg>' }
    ]
  },
  {
    id: "frames",
    name: "Decorative frames",
    stickers: [
      { id: "leaf-frame", label: "Leaf frame", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect x="16" y="16" width="148" height="148" rx="28" fill="none" stroke="#9fb99d" stroke-width="8"/><g fill="#9fb99d"><ellipse cx="36" cy="36" rx="9" ry="20" transform="rotate(-45 36 36)"/><ellipse cx="144" cy="36" rx="9" ry="20" transform="rotate(45 144 36)"/><ellipse cx="36" cy="144" rx="9" ry="20" transform="rotate(45 36 144)"/><ellipse cx="144" cy="144" rx="9" ry="20" transform="rotate(-45 144 144)"/></g></svg>' }
    ]
  }
];

let activeStickerCategory = stickerCategories[0].id;
let stickerCanvas = null;
let stickerHistory = [];
let stickerHistoryIndex = -1;
let isRestoringStickerHistory = false;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload;
}

function getSelectedStyle() {
  return styles.find((style) => style.id === appState.styleId) || styles[0];
}

function getSelectedProduct() {
  return products.find((product) => product.id === appState.productId) || products[0];
}

function setOrderMessage(message, type = "info") {
  const messageNode = document.querySelector("#orderMessage");
  messageNode.textContent = message;
  messageNode.dataset.type = type;
}

function setMiniStepper(stage) {
  miniStepArtwork.className = "mini-step";
  miniStepMockup.className = "mini-step";
  miniStepDownload.className = "mini-step";

  if (stage === "artwork") {
    miniStepArtwork.classList.add("is-active");
    return;
  }

  miniStepArtwork.classList.add("is-complete");
  miniStepArtwork.textContent = "✓ AI Artwork";

  if (stage === "mockup") {
    miniStepMockup.classList.add("is-active");
    miniStepMockup.textContent = "2 Product Mockup";
    return;
  }

  miniStepMockup.classList.add("is-complete");
  miniStepMockup.textContent = "✓ Product Mockup";
  miniStepDownload.classList.add("is-active");
  miniStepDownload.textContent = "3 Download & Order";
}

function resetProductMockup() {
  appState.productMockupId = null;
  appState.productMockupUrl = null;
  finalDownloadCard.hidden = true;
  finalDownloadCard.dataset.state = "pending";
  productMockupCard.dataset.state = appState.generatedArtworkUrl ? "active" : "pending";
  finalMockupImage.removeAttribute("src");
  finalMockupImage.hidden = true;
  mockupPlaceholderText.hidden = false;
  downloadMockupLink.href = "#";
  downloadMockupLink.classList.add("is-disabled");
  downloadMockupLink.setAttribute("aria-disabled", "true");
  generateProductMockupButton.disabled = !appState.generatedArtworkUrl;
  generateProductMockupButton.textContent = "Generate product mockup";
  mockupActionTitle.textContent = appState.generatedArtworkUrl ? "Ready for product mockup" : "Waiting for artwork";
  mockupActionText.textContent = appState.generatedArtworkUrl
    ? `Preview how your artwork looks on the selected ${getSelectedProduct().name}.`
    : "Generate AI artwork first, then create the product mockup for download.";
  if (appState.generatedArtworkUrl) {
    setMiniStepper("mockup");
    workflowContext.textContent = `Your ${getSelectedProduct().name.toLowerCase()} design is ready for product preview.`;
  }
}

function resetUploadFlow() {
  appState.petPhotoUrl = null;
  petUploadInput.value = "";
  uploadCompleteBadge.classList.remove("is-visible");
  uploadStatusText.textContent = "JPG or PNG, clear face recommended";
  sourcePhotoPreview.style.backgroundImage = "";
  sourcePhotoPreview.style.backgroundSize = "";
  sourcePhotoPreview.style.backgroundPosition = "";
  sourcePhotoPreview.classList.remove("has-upload");
  sourcePhotoPreview.classList.add("has-sample");
  document.querySelector("#qualityMessage").textContent =
    "A sample photo is shown until you upload your own.";
}

function startNewOrder() {
  resetGeneratedArtwork();
  resetUploadFlow();
  setOrderMessage("Ready for a new custom design.", "success");
  setActiveStep("upload");
  document.querySelector("#create").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resolveAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_BASE}${url}`;
}

function encodeSvgData(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getAllStickers() {
  return stickerCategories.flatMap((category) =>
    category.stickers.map((sticker) => ({ ...sticker, categoryId: category.id }))
  );
}

function getStickerById(stickerId) {
  return getAllStickers().find((sticker) => sticker.id === stickerId);
}

function renderStickerLibrary() {
  stickerCategoryTabs.innerHTML = stickerCategories
    .map((category) => {
      const active = category.id === activeStickerCategory ? " is-active" : "";
      return `<button class="sticker-category${active}" type="button" data-sticker-category="${category.id}">${category.name}</button>`;
    })
    .join("");

  const category = stickerCategories.find((item) => item.id === activeStickerCategory) || stickerCategories[0];
  stickerGrid.innerHTML = category.stickers
    .map((sticker) => `
      <button class="sticker-thumb-button" type="button" data-sticker-id="${sticker.id}" title="${sticker.label}">
        <img src="${encodeSvgData(sticker.svg)}" alt="${sticker.label}" />
      </button>
    `)
    .join("");
}

function updateStickerControlState() {
  const hasSelection = Boolean(stickerCanvas?.getActiveObject());
  duplicateStickerButton.disabled = !hasSelection;
  deleteStickerButton.disabled = !hasSelection;
  bringStickerForwardButton.disabled = !hasSelection;
  sendStickerBackwardButton.disabled = !hasSelection;
  undoStickerButton.disabled = stickerHistoryIndex <= 0;
  redoStickerButton.disabled = stickerHistoryIndex >= stickerHistory.length - 1;
}

function setStickerObjectDefaults(object, sticker) {
  object.set({
    left: STICKER_CANVAS_SIZE / 2,
    top: STICKER_CANVAS_SIZE / 2,
    originX: "center",
    originY: "center",
    scaleX: 0.65,
    scaleY: 0.65,
    cornerColor: "#6f8f77",
    cornerStrokeColor: "#496b53",
    borderColor: "#6f8f77",
    rotatingPointOffset: 32,
    transparentCorners: false,
    stickerId: sticker.id,
    stickerCategory: sticker.categoryId
  });
}

function captureStickerHistory() {
  if (!stickerCanvas || isRestoringStickerHistory) return;
  const snapshot = JSON.stringify(stickerCanvas.toJSON(["stickerId", "stickerCategory"]));
  if (stickerHistory[stickerHistoryIndex] === snapshot) return;
  stickerHistory = stickerHistory.slice(0, stickerHistoryIndex + 1);
  stickerHistory.push(snapshot);
  stickerHistoryIndex = stickerHistory.length - 1;
  updateStickerControlState();
}

function restoreStickerHistory(index) {
  if (!stickerCanvas || index < 0 || index >= stickerHistory.length) return;
  isRestoringStickerHistory = true;
  stickerCanvas.loadFromJSON(stickerHistory[index], () => {
    stickerCanvas.renderAll();
    stickerHistoryIndex = index;
    isRestoringStickerHistory = false;
    updateStickerControlState();
  });
}

function initializeStickerCanvas() {
  if (!window.fabric) {
    stickerEditorStatus.textContent = "Fabric.js did not load. Check your network connection and refresh.";
    stickerEditorStatus.dataset.type = "error";
    return null;
  }

  if (stickerCanvas) return stickerCanvas;

  stickerCanvas = new fabric.Canvas(stickerCanvasElement, {
    width: STICKER_CANVAS_SIZE,
    height: STICKER_CANVAS_SIZE,
    preserveObjectStacking: true,
    backgroundColor: "#fffdf8"
  });

  stickerCanvas.on("object:added", captureStickerHistory);
  stickerCanvas.on("object:modified", captureStickerHistory);
  stickerCanvas.on("object:removed", captureStickerHistory);
  stickerCanvas.on("selection:created", updateStickerControlState);
  stickerCanvas.on("selection:updated", updateStickerControlState);
  stickerCanvas.on("selection:cleared", updateStickerControlState);

  return stickerCanvas;
}

function loadArtworkIntoStickerEditor() {
  const canvas = initializeStickerCanvas();
  if (!canvas || !appState.generatedArtworkUrl) return;

  canvas.clear();
  canvas.setBackgroundColor("#fffdf8", canvas.renderAll.bind(canvas));
  stickerHistory = [];
  stickerHistoryIndex = -1;
  isRestoringStickerHistory = true;
  stickerEditorStatus.dataset.type = "info";
  stickerEditorStatus.textContent = "Your AI artwork is locked as the background layer.";

  fabric.Image.fromURL(
    resolveAssetUrl(appState.generatedArtworkUrl),
    (image) => {
      const scale = Math.min(STICKER_CANVAS_SIZE / image.width, STICKER_CANVAS_SIZE / image.height);
      image.set({
        originX: "center",
        originY: "center",
        left: STICKER_CANVAS_SIZE / 2,
        top: STICKER_CANVAS_SIZE / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false
      });
      canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas));
      isRestoringStickerHistory = false;
      captureStickerHistory();
    },
    { crossOrigin: "anonymous" }
  );
}

function openStickerEditor() {
  if (!appState.generatedArtworkUrl) {
    setOrderMessage("Generate the AI artwork before adding stickers.", "error");
    return;
  }
  productPreviewSection.hidden = true;
  stickerEditorSection.hidden = false;
  renderStickerLibrary();
  loadArtworkIntoStickerEditor();
  workflowContext.textContent = "Add optional stickers, then save before creating the product mockup.";
  setOrderMessage("", "info");
  stickerEditorSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeStickerEditor({ keepMessage = false } = {}) {
  stickerEditorSection.hidden = true;
  if (appState.generatedArtworkUrl) {
    productPreviewSection.hidden = false;
  }
  if (!keepMessage) {
    stickerEditorStatus.textContent = "Your AI artwork is locked as the background layer.";
    stickerEditorStatus.dataset.type = "info";
  }
}

function addStickerToCanvas(stickerId) {
  const canvas = initializeStickerCanvas();
  const sticker = getStickerById(stickerId);
  if (!canvas || !sticker) return;

  fabric.loadSVGFromString(sticker.svg, (objects, options) => {
    const object = fabric.util.groupSVGElements(objects, options);
    setStickerObjectDefaults(object, sticker);
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.renderAll();
    stickerEditorStatus.textContent = `${sticker.label} added. Drag, resize, or rotate it on the canvas.`;
  });
}

function deleteSelectedSticker() {
  const activeObject = stickerCanvas?.getActiveObject();
  if (!activeObject) return;
  stickerCanvas.remove(activeObject);
  stickerCanvas.discardActiveObject();
  stickerCanvas.renderAll();
}

function duplicateSelectedSticker() {
  const activeObject = stickerCanvas?.getActiveObject();
  if (!activeObject) return;
  activeObject.clone((clone) => {
    clone.set({
      left: activeObject.left + 28,
      top: activeObject.top + 28,
      evented: true
    });
    stickerCanvas.add(clone);
    stickerCanvas.setActiveObject(clone);
    stickerCanvas.renderAll();
  }, ["stickerId", "stickerCategory"]);
}

function resetStickerObjects() {
  if (!stickerCanvas) return;
  stickerCanvas.getObjects().forEach((object) => stickerCanvas.remove(object));
  stickerCanvas.discardActiveObject();
  stickerCanvas.renderAll();
}

function bringSelectedStickerForward() {
  const activeObject = stickerCanvas?.getActiveObject();
  if (!activeObject) return;
  activeObject.bringForward();
  stickerCanvas.renderAll();
  captureStickerHistory();
}

function sendSelectedStickerBackward() {
  const activeObject = stickerCanvas?.getActiveObject();
  if (!activeObject) return;
  activeObject.sendBackwards();
  stickerCanvas.renderAll();
  captureStickerHistory();
}

function getStickerObjectsForSave() {
  if (!stickerCanvas) return [];
  return stickerCanvas.getObjects().map((object, index) => ({
    index,
    stickerId: object.stickerId || null,
    category: object.stickerCategory || null,
    type: object.type,
    left: object.left,
    top: object.top,
    scaleX: object.scaleX,
    scaleY: object.scaleY,
    angle: object.angle
  }));
}

async function saveStickerCustomization() {
  if (!stickerCanvas || !appState.generatedArtworkUrl || !appState.artworkId) {
    setOrderMessage("Generate AI artwork before saving a customization.", "error");
    return;
  }

  saveCustomizationButton.disabled = true;
  saveCustomizationButton.textContent = "Saving...";
  stickerEditorStatus.textContent = "Exporting a 2048 x 2048 PNG for product preview.";

  try {
    const flattenedPngDataUrl = stickerCanvas.toDataURL({
      format: "png",
      multiplier: STICKER_EXPORT_SIZE / STICKER_CANVAS_SIZE
    });
    const canvasJson = stickerCanvas.toJSON(["stickerId", "stickerCategory"]);
    const stickerObjects = getStickerObjectsForSave();

    const customization = await apiRequest("/api/artworks/customize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        artworkId: appState.artworkId,
        originalArtworkUrl: appState.originalArtworkUrl || appState.generatedArtworkUrl,
        flattenedPngDataUrl,
        canvasJson,
        stickerObjects,
        exportWidth: STICKER_EXPORT_SIZE,
        exportHeight: STICKER_EXPORT_SIZE
      })
    });

    appState.customizationId = customization.customizationId;
    appState.customizationCanvasJson = customization.canvasJson;
    appState.originalArtworkUrl = customization.originalArtworkUrl;
    appState.generatedArtworkUrl = customization.editedArtworkUrl;
    const editedUrl = resolveAssetUrl(customization.editedArtworkUrl);
    resultArt.style.backgroundImage = `url("${editedUrl}")`;
    resultArt.style.backgroundSize = "cover";
    resultArt.style.backgroundPosition = "center";
    downloadArtworkLink.href = editedUrl;
    artworkResultTitle.textContent = "Your customized artwork is ready";
    artworkResultText.textContent = "Your customized artwork is ready for product preview.";
    aiStatusTitle.textContent = "Customization saved";
    aiStatusText.textContent = "The sticker-edited PNG is now the source image for product mockup generation.";
    resetProductMockup();
    closeStickerEditor({ keepMessage: true });
    productPreviewSection.hidden = false;
    workflowContext.textContent = "Your customized artwork is ready for product preview.";
    setOrderMessage("Your customized artwork is ready for product preview.", "success");
  } catch (error) {
    stickerEditorStatus.textContent = `Customization save failed: ${error.message}`;
    stickerEditorStatus.dataset.type = "error";
    setOrderMessage(`Customization save failed: ${error.message}`, "error");
  } finally {
    saveCustomizationButton.disabled = false;
    saveCustomizationButton.textContent = "Save customization";
  }
}

function renderStyleOptions() {
  styleOptions.innerHTML = styles
    .map((style) => {
      const selected = style.id === appState.styleId ? " is-selected" : "";
      return `
        <button class="option-card${selected}" type="button" data-style-id="${style.id}">
          <span class="style-swatch" data-style-preview="${style.id}" aria-hidden="true">
            <img src="${stylePreviewImages[style.id] || stylePreviewImages.cartoon}" alt="" />
          </span>
          <span class="option-copy">
            <strong>${style.name}</strong>
            <p>${style.description}</p>
            <span>Best for: ${style.bestFor}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderProductOptions() {
  productOptions.innerHTML = products
    .map((product) => {
      const selected = product.id === appState.productId ? " is-selected" : "";
      return `
        <button class="option-card${selected}" type="button" data-product-id="${product.id}">
          <span class="product-thumb" data-product-preview="${product.id}" aria-hidden="true">
            <img src="${productPreviewImages[product.id] || productPreviewImages.mug}" alt="" />
          </span>
          <span class="option-copy">
            <strong>${product.name}</strong>
            <p>${product.rationale}</p>
            <span>RMB ${product.price}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function updatePreview() {
  const selectedStyle = getSelectedStyle();
  const selectedProduct = getSelectedProduct();
  if (!selectedStyle || !selectedProduct) return;

  artworkCardMeta.textContent = selectedStyle.name;
  productCardMeta.textContent = selectedProduct.name;
  finalSummaryStyle.textContent = selectedStyle.name;
  finalSummaryProduct.textContent = selectedProduct.name;
  finalSummaryPrice.textContent = `RMB ${selectedProduct.price}`;
  document.querySelector("#styleStatus").textContent = `${selectedStyle.name} selected`;
  document.querySelector("#productStatus").textContent = `${selectedProduct.name} selected`;
}

function resetGeneratedArtwork() {
  const selectedStyle = getSelectedStyle();
  productPreviewSection.hidden = true;
  stickerEditorSection.hidden = true;
  generateArtworkButton.hidden = false;
  regenerateArtworkButton.hidden = true;
  customizeArtworkButton.hidden = true;
  setMiniStepper("artwork");
  miniStepArtwork.textContent = "1 AI Artwork";
  miniStepMockup.textContent = "2 Product Mockup";
  miniStepDownload.textContent = "3 Download & Order";
  workflowContext.textContent = "Choose a style and product, then generate your artwork.";
  resultArt.className = "result-art";
  resultArt.style.backgroundImage = "";
  resultArt.dataset.style = "pending";
  downloadArtworkLink.href = "#";
  downloadArtworkLink.classList.add("is-disabled");
  downloadArtworkLink.setAttribute("aria-disabled", "true");
  artworkResult.dataset.state = "idle";
  artworkResultTitle.textContent = "Waiting for generation";
  artworkResultText.textContent = "This artwork will be applied to your selected product.";
  aiStatus.dataset.state = "idle";
  aiStatusTitle.textContent = "Ready to generate";
  aiStatusText.textContent = `Selected style: ${selectedStyle.name}. Generate your pet artwork when ready.`;
  generateArtworkButton.disabled = false;
  generateArtworkButton.textContent = "Generate AI Artwork";
  appState.artworkId = null;
  appState.originalArtworkUrl = null;
  appState.generatedArtworkUrl = null;
  appState.customizationId = null;
  appState.customizationCanvasJson = null;
  resetProductMockup();
}

function finishGeneratedArtwork(artwork) {
  const selectedStyle = getSelectedStyle();
  const selectedProduct = getSelectedProduct();
  productPreviewSection.hidden = false;
  stickerEditorSection.hidden = true;
  generateArtworkButton.hidden = true;
  regenerateArtworkButton.hidden = false;
  customizeArtworkButton.hidden = false;
  resultArt.classList.remove("is-generating");
  resultArt.classList.add("has-upload", "is-generated");
  resultArt.dataset.style = selectedStyle.id;
  artworkResult.dataset.state = "complete";
  artworkResultTitle.textContent = selectedStyle.id === "cartoon" ? "Your cartoon artwork is ready" : "Your artwork is ready";
  artworkResultText.textContent = "This artwork will be applied to your selected product.";
  aiStatus.dataset.state = "complete";
  aiStatusTitle.textContent = "Artwork generated";
  aiStatusText.textContent = "Your artwork is ready for product preview.";
  appState.artworkId = artwork.artworkId;
  appState.originalArtworkUrl = artwork.generatedArtworkUrl;
  appState.generatedArtworkUrl = artwork.generatedArtworkUrl;
  appState.customizationId = null;
  appState.customizationCanvasJson = null;
  const generatedUrl = resolveAssetUrl(artwork.generatedArtworkUrl);
  if (generatedUrl) {
    resultArt.style.backgroundImage = `url("${generatedUrl}")`;
    resultArt.style.backgroundSize = "cover";
    resultArt.style.backgroundPosition = "center";
    downloadArtworkLink.href = generatedUrl;
    downloadArtworkLink.classList.remove("is-disabled");
    downloadArtworkLink.removeAttribute("aria-disabled");
  }
  generateArtworkButton.disabled = false;
  generateArtworkButton.textContent = "Generate AI Artwork";
  regenerateArtworkButton.disabled = false;
  regenerateArtworkButton.textContent = "Regenerate artwork";
  resetProductMockup();
  workflowContext.textContent = `Your ${selectedProduct.name.toLowerCase()} design is ready for product preview.`;
  setActiveStep("product");
}

async function generateMockArtwork() {
  const selectedStyle = getSelectedStyle();
  if (!appState.petPhotoUrl) {
    setOrderMessage("Please upload a pet photo before generating artwork.", "error");
    return;
  }
  productPreviewSection.hidden = true;
  resultArt.classList.remove("is-generated");
  resultArt.classList.add("is-generating");
  resultArt.dataset.style = "pending";
  artworkResult.dataset.state = "loading";
  artworkResultTitle.textContent = "Generating artwork...";
  artworkResultText.textContent = "Creating your selected pet illustration style.";
  aiStatus.dataset.state = "loading";
  aiStatusTitle.textContent = "Calling AI image generation service...";
  aiStatusText.textContent = `Sending uploaded pet photo + ${selectedStyle.name} prompt to backend /api/artworks/generate.`;
  generateArtworkButton.disabled = true;
  generateArtworkButton.textContent = "Generating...";
  regenerateArtworkButton.disabled = true;
  regenerateArtworkButton.textContent = "Generating...";
  workflowContext.textContent = "Generating your AI artwork.";
  setOrderMessage("", "info");
  setActiveStep("style");

  try {
    const artwork = await apiRequest("/api/artworks/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        photoUrl: appState.petPhotoUrl,
        styleId: selectedStyle.id
      })
    });
    window.setTimeout(() => finishGeneratedArtwork(artwork), 800);
  } catch (error) {
    resultArt.classList.remove("is-generating");
    artworkResult.dataset.state = "idle";
    artworkResultTitle.textContent = "Artwork generation failed";
    artworkResultText.textContent = "Please check the photo and try generating the artwork again.";
    aiStatus.dataset.state = "idle";
    aiStatusTitle.textContent = "Generation failed";
    aiStatusText.textContent = "The image service could not process this request. You can try again.";
    generateArtworkButton.disabled = false;
    generateArtworkButton.textContent = "Generate AI Artwork";
    regenerateArtworkButton.disabled = false;
    regenerateArtworkButton.textContent = "Regenerate artwork";
    workflowContext.textContent = "Artwork generation failed. Review the photo and try again.";
    setOrderMessage(`Artwork generation failed: ${error.message}`, "error");
  }
}

async function generateProductMockup() {
  const selectedProduct = getSelectedProduct();
  if (!appState.generatedArtworkUrl) {
    setOrderMessage("Please generate AI artwork before creating the product mockup.", "error");
    return;
  }

  resetProductMockup();
  productMockupCard.dataset.state = "loading";
  generateProductMockupButton.disabled = true;
  generateProductMockupButton.textContent = "Generating product image...";
  mockupActionTitle.textContent = "Creating product mockup...";
  mockupActionText.textContent = `Preview how your artwork looks on the selected ${selectedProduct.name}.`;
  workflowContext.textContent = `Generating your ${selectedProduct.name.toLowerCase()} product mockup.`;
  setOrderMessage("", "info");
  setActiveStep("checkout");

  try {
    const mockup = await apiRequest("/api/product-mockups/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        artworkUrl: appState.generatedArtworkUrl,
        productId: selectedProduct.id
      })
    });

    const finalUrl = resolveAssetUrl(mockup.productMockupUrl);
    appState.productMockupId = mockup.mockupId;
    appState.productMockupUrl = mockup.productMockupUrl;
    finalMockupImage.src = finalUrl;
    finalMockupImage.hidden = false;
    mockupPlaceholderText.hidden = true;
    downloadMockupLink.href = finalUrl;
    downloadMockupLink.classList.remove("is-disabled");
    downloadMockupLink.removeAttribute("aria-disabled");
    finalDownloadCard.hidden = false;
    finalDownloadCard.dataset.state = "complete";
    productMockupCard.dataset.state = "complete";
    mockupActionTitle.textContent = "Your product mockup is ready";
    mockupActionText.textContent = `Preview how your artwork looks on the selected ${selectedProduct.name}.`;
    finalDownloadTitle.textContent = "Ready to order";
    finalDownloadText.textContent = "Your high-resolution product preview is ready to download.";
    generateProductMockupButton.disabled = false;
    generateProductMockupButton.textContent = "Regenerate mockup";
    setMiniStepper("download");
    workflowContext.textContent = `Your custom ${selectedProduct.name.toLowerCase()} design is ready.`;
    setOrderMessage("", "success");
  } catch (error) {
    generateProductMockupButton.disabled = false;
    generateProductMockupButton.textContent = "Generate product mockup";
    productMockupCard.dataset.state = "active";
    mockupActionTitle.textContent = "Product mockup failed";
    mockupActionText.textContent = "Check the backend API, OpenAI key, and selected product image, then try again.";
    setOrderMessage(`Product mockup failed: ${error.message}`, "error");
  }
}

function setActiveStep(stepName) {
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.toggle("is-active", step.dataset.step === stepName);
  });
}

styleOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-style-id]");
  if (!button) return;
  appState.styleId = button.dataset.styleId;
  renderStyleOptions();
  updatePreview();
  resetGeneratedArtwork();
  setActiveStep("style");
});

productOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  appState.productId = button.dataset.productId;
  renderProductOptions();
  updatePreview();
  resetProductMockup();
  setActiveStep("product");
});

petUploadInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    resultArt.style.backgroundImage = `url("${reader.result}")`;
    resultArt.style.backgroundSize = "cover";
    resultArt.style.backgroundPosition = "center";
    sourcePhotoPreview.style.backgroundImage = `url("${reader.result}")`;
    sourcePhotoPreview.style.backgroundSize = "cover";
    sourcePhotoPreview.style.backgroundPosition = "center";
    sourcePhotoPreview.classList.add("has-upload");
    sourcePhotoPreview.classList.remove("has-sample");
    resultArt.classList.add("has-upload");
    resetGeneratedArtwork();
    document.querySelector("#qualityMessage").textContent =
      "Photo preview ready. Uploading to backend storage...";
    setActiveStep("upload");
  });
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append("petPhoto", file);

  try {
    const result = await apiRequest("/api/uploads/pet-photo", {
      method: "POST",
      body: formData
    });
    appState.petPhotoUrl = result.photoUrl;
    appState.generatedArtworkUrl = null;
    resetProductMockup();
    uploadCompleteBadge.classList.add("is-visible");
    uploadStatusText.textContent = "Uploaded - quality check completed";
    document.querySelector("#qualityMessage").textContent =
      "Photo saved to backend. Next, click Generate AI Artwork.";
  } catch (error) {
    document.querySelector("#qualityMessage").textContent =
      `Upload failed: ${error.message}. Make sure the backend is running at ${API_BASE || window.location.origin}.`;
  }
});

generateArtworkButton.addEventListener("click", generateMockArtwork);
regenerateArtworkButton.addEventListener("click", generateMockArtwork);
customizeArtworkButton.addEventListener("click", openStickerEditor);
generateProductMockupButton.addEventListener("click", generateProductMockup);
startNewOrderButton.addEventListener("click", startNewOrder);

stickerCategoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sticker-category]");
  if (!button) return;
  activeStickerCategory = button.dataset.stickerCategory;
  renderStickerLibrary();
});

stickerGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sticker-id]");
  if (!button) return;
  addStickerToCanvas(button.dataset.stickerId);
});

duplicateStickerButton.addEventListener("click", duplicateSelectedSticker);
deleteStickerButton.addEventListener("click", deleteSelectedSticker);
bringStickerForwardButton.addEventListener("click", bringSelectedStickerForward);
sendStickerBackwardButton.addEventListener("click", sendSelectedStickerBackward);
resetStickersButton.addEventListener("click", resetStickerObjects);
saveCustomizationButton.addEventListener("click", saveStickerCustomization);
cancelCustomizationButton.addEventListener("click", () => {
  closeStickerEditor();
  workflowContext.textContent = "Your AI artwork is ready. Customize it or create a product mockup.";
});
undoStickerButton.addEventListener("click", () => restoreStickerHistory(stickerHistoryIndex - 1));
redoStickerButton.addEventListener("click", () => restoreStickerHistory(stickerHistoryIndex + 1));

downloadArtworkLink.addEventListener("click", (event) => {
  if (!appState.generatedArtworkUrl) {
    event.preventDefault();
    setOrderMessage("Generate the AI artwork before downloading.", "error");
  }
});

document.querySelectorAll(".step").forEach((step) => {
  step.addEventListener("click", () => setActiveStep(step.dataset.step));
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

async function initializeApp() {
  try {
    const [serverProducts, serverStyles] = await Promise.all([
      apiRequest("/api/products"),
      apiRequest("/api/styles")
    ]);

    products = serverProducts;
    styles = serverStyles;
    appState.productId = products[0]?.id || appState.productId;
    appState.styleId = styles[0]?.id || appState.styleId;
  } catch (error) {
    setOrderMessage(`Product and style options loaded locally. Image services are temporarily unavailable: ${error.message}`, "error");
  }

  renderStyleOptions();
  renderProductOptions();
  renderStickerLibrary();
  updateStickerControlState();
  updatePreview();
  resetGeneratedArtwork();
}

initializeApp();
