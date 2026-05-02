/* ═══════════════════════════════════════════════════════════
   OCR ENGINE — Client-Side Label Reader (Tesseract.js)
   ═══════════════════════════════════════════════════════════
   
   Uses WebAssembly-powered OCR to read food labels, receipts,
   and handwritten notes directly in the browser. No server
   needed — works offline in low-connectivity environments
   like basement kitchens.
   
   After extracting raw text, uses RegEx pattern matching to
   identify:
     - Expiry dates (EXP, Best Before, Use By, etc.)
     - Weights & quantities (kg, g, L, ml, pieces, etc.)
     - Food keywords for auto-categorization
═══════════════════════════════════════════════════════════ */

import Tesseract from 'tesseract.js'

/* ─── Types ─── */
export interface OCRResult {
  /** Full raw text extracted from the image */
  rawText: string
  /** Detected expiry date string (if found) */
  expiryDate: string | null
  /** Whether the expiry date appears to be in the past */
  isExpired: boolean
  /** Detected weight/quantity (if found) */
  detectedQuantity: number | null
  /** Detected unit (kg, g, L, pieces, etc.) */
  detectedUnit: string | null
  /** Food category guess based on keywords */
  detectedCategory: string | null
  /** OCR confidence 0–100 */
  confidence: number
  /** Individual words detected with their own confidence scores */
  words: Array<{ text: string; confidence: number }>
}

/* ─── Date Pattern Library ─── */
const DATE_PATTERNS = [
  // EXP: 25/05/26, EXP 25-05-2026, Exp. 05/2026
  /(?:exp(?:iry)?\.?|best\s*before|use\s*by|bb)\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
  // MFG: 01/2026, EXP: 05/2026 (month/year only)
  /(?:exp(?:iry)?\.?|best\s*before|use\s*by|bb)\s*:?\s*(\d{1,2}[\/-]\d{2,4})/i,
  // "25 May 2026", "May 2026", "25 May 26"
  /(?:exp(?:iry)?\.?|best\s*before|use\s*by|bb)\s*:?\s*(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/i,
  // Standalone dates like 25/05/26 near food context
  /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
]

/* ─── Weight/Quantity Pattern Library ─── */
const QUANTITY_PATTERNS = [
  // "15 kg", "3.5kg", "500g", "2.5 L", "200ml"
  /(\d+\.?\d*)\s*(kg|g|grams?|kilograms?|liter[s]?|litre[s]?|l|ml|milliliter[s]?)\b/i,
  // "15 pieces", "8 pcs", "20 units", "12 packets", "6 boxes"
  /(\d+\.?\d*)\s*(pieces?|pcs|units?|packets?|boxes?|trays?|containers?|portions?|servings?|packs?)\b/i,
  // Net Wt: 500g, Net Weight: 2kg
  /(?:net\s*w(?:eig)?h?t\.?|n\.?w\.?)\s*:?\s*(\d+\.?\d*)\s*(kg|g|l|ml)\b/i,
]

/* ─── Food Keyword → Category Mapping ─── */
const FOOD_KEYWORDS: Record<string, string[]> = {
  'Protein': ['chicken', 'meat', 'fish', 'egg', 'mutton', 'paneer', 'tofu', 'lamb', 'pork', 'prawn', 'shrimp'],
  'Bakery': ['bread', 'cake', 'pastry', 'cookie', 'biscuit', 'muffin', 'croissant', 'naan', 'roti', 'bun'],
  'Dairy': ['milk', 'cheese', 'yogurt', 'curd', 'butter', 'cream', 'ghee', 'dahi', 'paneer'],
  'Produce': ['fruit', 'vegetable', 'apple', 'banana', 'mango', 'tomato', 'potato', 'onion', 'carrot', 'spinach'],
  'Prepared Meals': ['biryani', 'rice', 'curry', 'dal', 'pasta', 'pizza', 'sandwich', 'soup', 'salad', 'meal', 'cooked', 'sambar', 'rasam'],
  'Grains': ['rice', 'wheat', 'flour', 'atta', 'maida', 'oats', 'cereal', 'lentil', 'dal'],
}

/* ═══════════════════════════════════════════════════
   PARSE EXTRACTED TEXT
   Runs RegEx patterns against OCR output
═══════════════════════════════════════════════════ */
function parseExtractedText(text: string): {
  expiryDate: string | null
  isExpired: boolean
  quantity: number | null
  unit: string | null
  category: string | null
} {
  const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ')

  /* ─── Find Expiry Date ─── */
  let expiryDate: string | null = null
  let isExpired = false
  for (const pattern of DATE_PATTERNS) {
    const match = cleanText.match(pattern)
    if (match) {
      expiryDate = match[1].trim()
      // Attempt to parse the date to check if expired
      try {
        const parsed = new Date(expiryDate)
        if (!isNaN(parsed.getTime()) && parsed < new Date()) {
          isExpired = true
        }
      } catch {
        // If parsing fails, we still report the date string
      }
      break
    }
  }

  /* ─── Find Quantity ─── */
  let quantity: number | null = null
  let unit: string | null = null
  for (const pattern of QUANTITY_PATTERNS) {
    const match = cleanText.match(pattern)
    if (match) {
      quantity = parseFloat(match[1])
      unit = match[2].toLowerCase()
      // Normalize units
      if (['grams', 'gram'].includes(unit)) unit = 'g'
      if (['kilograms', 'kilogram'].includes(unit)) unit = 'kg'
      if (['liters', 'litres', 'liter', 'litre'].includes(unit)) unit = 'L'
      if (['milliliters', 'millilitres'].includes(unit)) unit = 'ml'
      if (['pieces', 'piece', 'pcs'].includes(unit)) unit = 'pieces'
      break
    }
  }

  /* ─── Detect Food Category ─── */
  let category: string | null = null
  const lowerText = cleanText.toLowerCase()
  let maxHits = 0
  for (const [cat, keywords] of Object.entries(FOOD_KEYWORDS)) {
    const hits = keywords.filter(kw => lowerText.includes(kw)).length
    if (hits > maxHits) {
      maxHits = hits
      category = cat
    }
  }

  return { expiryDate, isExpired, quantity, unit, category }
}

/* ═══════════════════════════════════════════════════
   MAIN OCR FUNCTION
   Accepts an image source (base64/URL/File) and returns
   structured food label data
═══════════════════════════════════════════════════ */
export async function processLabelImage(
  imageSource: string | File,
  onProgress?: (step: string, progress: number) => void
): Promise<OCRResult> {
  onProgress?.('Initializing OCR engine...', 5)

  const result = await Tesseract.recognize(imageSource, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const prog = Math.round((m.progress ?? 0) * 100)
        onProgress?.('Reading label text...', Math.min(10 + prog * 0.7, 80))
      } else if (m.status === 'loading language traineddata') {
        onProgress?.('Loading language model...', 8)
      }
    },
  })

  onProgress?.('Analyzing detected text...', 85)

  const rawText = result.data.text
  const confidence = Math.round(result.data.confidence)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataAny = result.data as any
  const words = (dataAny.words ?? []).map((w: any) => ({
    text: w.text as string,
    confidence: Math.round(w.confidence as number),
  }))

  // Parse for structured data
  onProgress?.('Extracting dates & quantities...', 92)
  const parsed = parseExtractedText(rawText)

  onProgress?.('Scan complete', 100)

  return {
    rawText,
    expiryDate: parsed.expiryDate,
    isExpired: parsed.isExpired,
    detectedQuantity: parsed.quantity,
    detectedUnit: parsed.unit,
    detectedCategory: parsed.category,
    confidence,
    words,
  }
}
