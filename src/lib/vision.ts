/* ═══════════════════════════════════════════════════════════
   COMPUTER VISION ENGINE — Simulated Food Audit Pipeline
   ═══════════════════════════════════════════════════════════
   
   In production, this would call:
   - Google Cloud Vision API
   - OpenAI GPT-4o Vision
   - A custom YOLOv8 model hosted on Vertex AI / SageMaker

   The simulation returns deterministic results from a
   curated food knowledge base, with processing delays
   that mimic real inference latency.
═══════════════════════════════════════════════════════════ */

export interface VisionScanResult {
  itemName: string
  category: 'Protein' | 'Bakery' | 'Produce' | 'Dairy' | 'Prepared Meals' | 'Grains'
  estimatedQuantity: number
  estimatedUnit: 'kg' | 'portions' | 'pieces'
  freshnessScore: number       // 0-100
  qualityFlags: string[]       // e.g., ['Fresh', 'Well-packaged']
  confidence: number           // 0.0-1.0
  processingSteps: string[]    // Steps shown during scanning animation
  nutritionEstimate: {
    calories: number
    protein: number            // grams
    servings: number
  }
}

/* ─── Food Knowledge Base ─── */
const FOOD_DATABASE: VisionScanResult[] = [
  {
    itemName: 'Roasted Chicken Thighs',
    category: 'Protein',
    estimatedQuantity: 3.2,
    estimatedUnit: 'kg',
    freshnessScore: 92,
    qualityFlags: ['Fresh', 'Well-sealed', 'Uniform temp'],
    confidence: 0.94,
    processingSteps: [
      'Detecting food boundaries...',
      'Classifying: Protein (Poultry)',
      'Estimating volume: 3.2kg',
      'Quality check: No discoloration',
      'Freshness audit: PASS (92%)',
    ],
    nutritionEstimate: { calories: 2400, protein: 180, servings: 12 },
  },
  {
    itemName: 'Artisan Sourdough Loaves',
    category: 'Bakery',
    estimatedQuantity: 8,
    estimatedUnit: 'pieces',
    freshnessScore: 88,
    qualityFlags: ['Intact crust', 'No mold detected', 'Wrapped'],
    confidence: 0.91,
    processingSteps: [
      'Detecting food boundaries...',
      'Classifying: Bakery (Bread)',
      'Counting units: 8 pieces',
      'Quality check: Crust integrity OK',
      'Freshness audit: PASS (88%)',
    ],
    nutritionEstimate: { calories: 1800, protein: 56, servings: 16 },
  },
  {
    itemName: 'Mixed Greens & Grain Bowls',
    category: 'Prepared Meals',
    estimatedQuantity: 6,
    estimatedUnit: 'portions',
    freshnessScore: 95,
    qualityFlags: ['Vibrant color', 'Sealed containers', 'Labeled'],
    confidence: 0.96,
    processingSteps: [
      'Detecting food boundaries...',
      'Classifying: Prepared Meals (Salad)',
      'Counting containers: 6 portions',
      'Quality check: Color saturation OK',
      'Freshness audit: PASS (95%)',
    ],
    nutritionEstimate: { calories: 1500, protein: 72, servings: 6 },
  },
  {
    itemName: 'Seasonal Fruit Crate',
    category: 'Produce',
    estimatedQuantity: 4.5,
    estimatedUnit: 'kg',
    freshnessScore: 78,
    qualityFlags: ['Minor bruising (2 items)', 'Ripe', 'Mixed variety'],
    confidence: 0.87,
    processingSteps: [
      'Detecting food boundaries...',
      'Classifying: Produce (Fruit)',
      'Estimating volume: 4.5kg',
      'Quality check: Minor bruising flagged',
      'Freshness audit: PASS (78%)',
    ],
    nutritionEstimate: { calories: 900, protein: 12, servings: 10 },
  },
  {
    itemName: 'Pasta Carbonara Trays',
    category: 'Prepared Meals',
    estimatedQuantity: 10,
    estimatedUnit: 'portions',
    freshnessScore: 90,
    qualityFlags: ['Hot-held', 'Covered', 'Uniform portions'],
    confidence: 0.93,
    processingSteps: [
      'Detecting food boundaries...',
      'Classifying: Prepared Meals (Pasta)',
      'Counting trays: 10 portions',
      'Quality check: Temperature OK',
      'Freshness audit: PASS (90%)',
    ],
    nutritionEstimate: { calories: 4200, protein: 140, servings: 10 },
  },
]

/* ═══════════════════════════════════════════════════
   MAIN SCAN FUNCTION
   Simulates a ~3s inference pipeline with step-by-step callbacks
═══════════════════════════════════════════════════ */
export async function scanFoodItem(
  onStep?: (step: string, progress: number) => void
): Promise<VisionScanResult> {
  // Pick a random item from the knowledge base
  const result = FOOD_DATABASE[Math.floor(Math.random() * FOOD_DATABASE.length)]

  // Simulate step-by-step processing with delays
  for (let i = 0; i < result.processingSteps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
    const progress = ((i + 1) / result.processingSteps.length) * 100
    onStep?.(result.processingSteps[i], progress)
  }

  // Final processing delay
  await new Promise(resolve => setTimeout(resolve, 400))

  return result
}
