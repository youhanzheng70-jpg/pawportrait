const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const fs = require("fs/promises");
const multer = require("multer");
const OpenAI = require("openai");
const { toFile } = require("openai/uploads");
const path = require("path");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const ORIGINAL_UPLOAD_DIR = path.join(UPLOAD_DIR, "original");
const GENERATED_UPLOAD_DIR = path.join(UPLOAD_DIR, "generated");
const IMAGE_PROVIDER = process.env.IMAGE_PROVIDER || "mock";
const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const OPENAI_IMAGE_SIZE = process.env.OPENAI_IMAGE_SIZE || "1024x1024";
const OPENAI_IMAGE_QUALITY = process.env.OPENAI_IMAGE_QUALITY || "low";
const OPENAI_MOCKUP_MODEL = process.env.OPENAI_MOCKUP_MODEL || OPENAI_IMAGE_MODEL;
const OPENAI_MOCKUP_QUALITY = process.env.OPENAI_MOCKUP_QUALITY || "medium";
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const PRODUCT_MOCKUP_ASSETS = {
  mug: "assets/product-mug.png",
  tshirt: "assets/product-tshirt.png",
  magnet: "assets/product-magnet.png",
  tote: "assets/product-tote.png",
  keychain: "assets/product-keychain.png"
};

const CARTOON_ARTWORK_PROMPT =
  [
    "Turn the pet into a polished premium kawaii character illustration.",
    "Keep the pet's recognizable features, fur color, ear shape, and pose.",
    "Cute chibi proportion: slightly oversized head, small rounded body, short paws, soft fluffy silhouette.",
    "Clean smooth vector-style line art with thin dark-brown outlines, not thick black outlines.",
    "Warm pastel color palette, soft caramel brown fur, subtle blush shading, gentle cream highlights.",
    "Large glossy dark eyes with tiny light reflections, small simple nose and mouth, sweet gentle expression.",
    "High-end stationery / Japanese character goods illustration style.",
    "Centered composition, full body, clean transparent or cream background.",
    "Smooth edges, balanced anatomy, clear silhouette, cute but not childish.",
    "Avoid: thick black outlines, uneven coloring, distorted limbs, awkward paws, aggressive expression, cheap clip-art look, messy sketch lines, overly realistic fur, text, shadows, accessories."
  ].join(" ");

app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOAD_DIR));
app.use(express.static(ROOT_DIR));

const upload = multer({
  dest: ORIGINAL_UPLOAD_DIR,
  limits: {
    fileSize: 8 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }
    cb(null, true);
  }
});

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(ORIGINAL_UPLOAD_DIR, { recursive: true });
  await fs.mkdir(GENERATED_UPLOAD_DIR, { recursive: true });
  await ensureJsonFile("artworks.json", []);
  await ensureJsonFile("customizations.json", []);
}

async function ensureJsonFile(filename, fallback) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.access(filePath);
  } catch {
    await writeJson(filename, fallback);
  }
}

async function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function createId(prefix) {
  const time = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${time}-${random}`;
}

function publicUploadUrl(filePath) {
  const relativePath = path.relative(UPLOAD_DIR, filePath).split(path.sep).join("/");
  return `/uploads/${relativePath}`;
}

function resolveUploadedFilePath(publicUrl) {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) {
    throw new Error("Only locally uploaded images can be sent to image generation.");
  }

  const relativePath = publicUrl.replace(/^\/uploads\//, "");
  const filePath = path.resolve(UPLOAD_DIR, relativePath);
  if (!filePath.startsWith(UPLOAD_DIR)) {
    throw new Error("Invalid upload path.");
  }
  return filePath;
}

function resolveProjectAssetPath(relativeAssetPath) {
  const filePath = path.resolve(ROOT_DIR, relativeAssetPath);
  if (!filePath.startsWith(ROOT_DIR)) {
    throw new Error("Invalid asset path.");
  }
  return filePath;
}

function getImageMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  throw new Error("Unsupported image format. Please upload a JPG, PNG, or WEBP file.");
}

function parseImageDataUrl(dataUrl) {
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || "");
  if (!match) {
    throw new Error("flattenedPngDataUrl must be a PNG, JPEG, or WEBP data URL.");
  }

  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  return {
    extension,
    buffer: Buffer.from(match[2], "base64")
  };
}

async function generateArtworkWithOpenAI({ photoUrl, style, artworkId }) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env or switch IMAGE_PROVIDER=mock.");
  }

  const sourcePath = resolveUploadedFilePath(photoUrl);
  const sourceBuffer = await fs.readFile(sourcePath);
  const sourceFile = await toFile(sourceBuffer, path.basename(sourcePath), {
    type: getImageMimeType(sourcePath)
  });
  const basePrompt = style.id === "cartoon" ? CARTOON_ARTWORK_PROMPT : style.prompt;
  const prompt = [
    basePrompt,
    "Create one polished pet portrait artwork for custom merchandise.",
    "Keep the pet recognizable from the uploaded image.",
    "Use a clean centered composition suitable for mugs, T-shirts, tote bags, magnets, and keychains.",
    "Do not add text, logos, watermarks, or extra animals."
  ].join(" ");

  const result = await openai.images.edit({
    model: OPENAI_IMAGE_MODEL,
    image: sourceFile,
    prompt,
    size: OPENAI_IMAGE_SIZE,
    quality: OPENAI_IMAGE_QUALITY
  });

  const b64Image = result.data?.[0]?.b64_json;
  if (!b64Image) {
    throw new Error("OpenAI did not return a base64 image.");
  }

  const generatedName = `${artworkId}.png`;
  const generatedPath = path.join(GENERATED_UPLOAD_DIR, generatedName);
  await fs.writeFile(generatedPath, Buffer.from(b64Image, "base64"));

  return {
    generatedArtworkUrl: publicUploadUrl(generatedPath),
    prompt,
    provider: "openai",
    model: OPENAI_IMAGE_MODEL
  };
}

async function generateProductMockupWithOpenAI({ artworkUrl, product, mockupId }) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env or switch IMAGE_PROVIDER=mock.");
  }

  const artworkPath = resolveUploadedFilePath(artworkUrl);
  const productAsset = PRODUCT_MOCKUP_ASSETS[product.id];
  if (!productAsset) {
    throw new Error("Selected product does not have a mockup image.");
  }

  const productPath = resolveProjectAssetPath(productAsset);
  const artworkFile = await toFile(await fs.readFile(artworkPath), path.basename(artworkPath), {
    type: getImageMimeType(artworkPath)
  });
  const productFile = await toFile(await fs.readFile(productPath), path.basename(productPath), {
    type: getImageMimeType(productPath)
  });
  const prompt = [
    `Create one realistic ecommerce product mockup for a ${product.name}.`,
    "Use the blank product photo as the base product, keeping its perspective, material texture, lighting, shadows, and background style.",
    "Place the supplied pet artwork naturally onto the printable surface of the product.",
    "The artwork should look printed on the object, not floating above it.",
    "Do not add new text, logos, watermarks, price tags, hands, packaging, or extra objects.",
    "Return a clean finished image suitable for the user to download before ordering through a Xiaohongshu shop."
  ].join(" ");

  const result = await openai.images.edit({
    model: OPENAI_MOCKUP_MODEL,
    image: [productFile, artworkFile],
    prompt,
    size: OPENAI_IMAGE_SIZE,
    quality: OPENAI_MOCKUP_QUALITY
  });

  const b64Image = result.data?.[0]?.b64_json;
  if (!b64Image) {
    throw new Error("OpenAI did not return a base64 product mockup.");
  }

  const generatedName = `${mockupId}.png`;
  const generatedPath = path.join(GENERATED_UPLOAD_DIR, generatedName);
  await fs.writeFile(generatedPath, Buffer.from(b64Image, "base64"));

  return {
    productMockupUrl: publicUploadUrl(generatedPath),
    prompt,
    provider: "openai",
    model: OPENAI_MOCKUP_MODEL
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "PawPortrait API",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/products", async (req, res, next) => {
  try {
    const products = await readJson("products.json");
    res.json(products.filter((product) => product.active));
  } catch (error) {
    next(error);
  }
});

app.get("/api/styles", async (req, res, next) => {
  try {
    const styles = await readJson("styles.json");
    res.json(styles);
  } catch (error) {
    next(error);
  }
});

app.post("/api/uploads/pet-photo", upload.single("petPhoto"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "petPhoto file is required." });
      return;
    }

    const extension = path.extname(req.file.originalname) || ".jpg";
    const finalName = `${createId("pet")}${extension.toLowerCase()}`;
    const finalPath = path.join(ORIGINAL_UPLOAD_DIR, finalName);
    await fs.rename(req.file.path, finalPath);

    res.status(201).json({
      photoUrl: publicUploadUrl(finalPath),
      originalName: req.file.originalname
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/artworks/generate", async (req, res, next) => {
  try {
    const { photoUrl, styleId } = req.body;
    if (!photoUrl || !styleId) {
      res.status(400).json({ error: "photoUrl and styleId are required." });
      return;
    }

    const styles = await readJson("styles.json");
    const style = styles.find((item) => item.id === styleId);
    if (!style) {
      res.status(400).json({ error: "Unknown styleId." });
      return;
    }

    const artworks = await readJson("artworks.json");
    const artworkId = createId("art");
    const createdAt = new Date().toISOString();
    let generationResult = {
      generatedArtworkUrl: photoUrl,
      prompt: style.prompt,
      provider: "mock",
      model: "mock",
      status: "mock_generated"
    };

    if (IMAGE_PROVIDER === "openai") {
      generationResult = {
        ...(await generateArtworkWithOpenAI({ photoUrl, style, artworkId })),
        status: "generated"
      };
    }

    const artwork = {
      artworkId,
      sourcePhotoUrl: photoUrl,
      styleId,
      styleName: style.name,
      prompt: generationResult.prompt,
      status: generationResult.status,
      generatedArtworkUrl: generationResult.generatedArtworkUrl,
      provider: generationResult.provider,
      model: generationResult.model,
      createdAt
    };

    artworks.unshift(artwork);
    await writeJson("artworks.json", artworks);

    res.status(201).json(artwork);
  } catch (error) {
    next(error);
  }
});

app.post("/api/artworks/customize", async (req, res, next) => {
  try {
    const {
      artworkId,
      originalArtworkUrl,
      flattenedPngDataUrl,
      canvasJson,
      stickerObjects = [],
      exportWidth = 2048,
      exportHeight = 2048
    } = req.body;

    if (!artworkId || !originalArtworkUrl || !flattenedPngDataUrl || !canvasJson) {
      res.status(400).json({
        error: "artworkId, originalArtworkUrl, flattenedPngDataUrl, and canvasJson are required."
      });
      return;
    }

    resolveUploadedFilePath(originalArtworkUrl);

    const { extension, buffer } = parseImageDataUrl(flattenedPngDataUrl);
    const customizations = await readJson("customizations.json");
    const customizationId = createId("custom");
    const now = new Date().toISOString();
    const generatedPath = path.join(GENERATED_UPLOAD_DIR, `${customizationId}.${extension}`);
    await fs.writeFile(generatedPath, buffer);

    const customization = {
      customizationId,
      artworkId,
      originalArtworkUrl,
      editedArtworkUrl: publicUploadUrl(generatedPath),
      canvasJson,
      stickerObjects,
      exportWidth,
      exportHeight,
      updatedAt: now
    };

    customizations.unshift(customization);
    await writeJson("customizations.json", customizations);
    res.status(201).json(customization);
  } catch (error) {
    next(error);
  }
});

app.post("/api/product-mockups/generate", async (req, res, next) => {
  try {
    const { artworkUrl, productId } = req.body;
    if (!artworkUrl || !productId) {
      res.status(400).json({ error: "artworkUrl and productId are required." });
      return;
    }

    const products = await readJson("products.json");
    const product = products.find((item) => item.id === productId && item.active);
    if (!product) {
      res.status(400).json({ error: "Unknown productId." });
      return;
    }

    const mockupId = createId("mockup");
    let generationResult = {
      productMockupUrl: artworkUrl,
      prompt: `Mock product preview for ${product.name}.`,
      provider: "mock",
      model: "mock",
      status: "mock_generated"
    };

    if (IMAGE_PROVIDER === "openai") {
      generationResult = {
        ...(await generateProductMockupWithOpenAI({ artworkUrl, product, mockupId })),
        status: "generated"
      };
    }

    res.status(201).json({
      mockupId,
      productId: product.id,
      productName: product.name,
      productMockupUrl: generationResult.productMockupUrl,
      prompt: generationResult.prompt,
      provider: generationResult.provider,
      model: generationResult.model,
      status: generationResult.status,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "index.html"));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    error: error.message || "Internal server error."
  });
});

ensureStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PawPortrait server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
