import { type FoodItem } from '@/lib/validations/food'

/* ═══════════════════════════════════════════════════════════
   SURPLUS PREDICTOR — Simulated ML Forecasting Engine
   ═══════════════════════════════════════════════════════════
   
   This module implements a lightweight "prediction" engine
   that simulates what a production ML pipeline would do.

   In production, this would be replaced by:
   - A TensorFlow.js or ONNX model running in the browser
   - Or an API call to a hosted ML endpoint (SageMaker, Vertex AI)

   Feature Vector:
     1. Historical surplus frequency (past inventory data)
     2. Day-of-week seasonality
     3. Time-of-day patterns
     4. Weather influence (simulated)
     5. Calendar event disruption (simulated)
═══════════════════════════════════════════════════════════ */

export interface SurplusPrediction {
  id: string
  itemName: string
  predictedQuantity: number
  predictedUnit: string
  confidence: number          // 0.0 – 1.0
  predictedTime: string       // e.g., "4:00 PM"
  reasoning: string           // Human-readable explanation
  featureWeights: {
    historical: number        // 0.0 – 1.0
    dayOfWeek: number
    timeOfDay: number
    weather: number
    events: number
  }
}

/* ─── Day-of-week surplus multipliers ─── */
const DAY_MULTIPLIERS: Record<number, number> = {
  0: 0.6,  // Sunday — lower restaurant traffic
  1: 0.9,  // Monday — post-weekend surplus
  2: 0.7,  // Tuesday
  3: 0.75, // Wednesday
  4: 0.8,  // Thursday
  5: 1.0,  // Friday — peak surplus (over-prepped for weekend)
  6: 0.85, // Saturday
}

/* ─── Time-of-day surplus probability ─── */
function getTimeWeight(hour: number): number {
  if (hour >= 14 && hour <= 16) return 1.0   // Post-lunch = highest waste
  if (hour >= 10 && hour <= 13) return 0.7   // Late morning prep
  if (hour >= 17 && hour <= 20) return 0.85  // Post-dinner
  if (hour >= 21) return 0.95               // End-of-day clearance
  return 0.3                                 // Low probability off-hours
}

/* ─── Simulated weather influence ─── */
function getWeatherWeight(): { weight: number; condition: string } {
  const conditions = [
    { condition: 'Clear skies', weight: 0.6 },
    { condition: 'Overcast', weight: 0.75 },
    { condition: 'Light rain', weight: 0.9 },
    { condition: 'Heavy rain', weight: 1.0 },
    { condition: 'High heat (32°C+)', weight: 0.85 },
  ]
  // Deterministic-ish selection based on hour to avoid flickering
  const idx = new Date().getHours() % conditions.length
  return conditions[idx]
}

/* ─── Historical frequency analysis ─── */
function getHistoricalWeight(inventory: FoodItem[]): { weight: number; avgDaily: number } {
  const delivered = inventory.filter(i => i.status === 'DELIVERED').length
  const available = inventory.filter(i => i.status === 'AVAILABLE').length
  const total = delivered + available

  // Simulate "learning" from past patterns
  if (total >= 10) return { weight: 0.95, avgDaily: Math.ceil(total / 7) }
  if (total >= 5) return { weight: 0.8, avgDaily: Math.ceil(total / 5) }
  if (total >= 1) return { weight: 0.6, avgDaily: total }
  return { weight: 0.3, avgDaily: 1 }
}

/* ═══════════════════════════════════════════════════
   MAIN PREDICTION FUNCTION
═══════════════════════════════════════════════════ */
export function generatePredictions(inventory: FoodItem[]): SurplusPrediction[] {
  const now = new Date()
  const dayMultiplier = DAY_MULTIPLIERS[now.getDay()]
  const timeWeight = getTimeWeight(now.getHours())
  const { weight: weatherWeight, condition: weatherCondition } = getWeatherWeight()
  const { weight: historicalWeight, avgDaily } = getHistoricalWeight(inventory)

  // Composite confidence score (weighted average of all features)
  const weights = {
    historical: 0.35,
    dayOfWeek: 0.15,
    timeOfDay: 0.20,
    weather: 0.15,
    events: 0.15,
  }

  const eventWeight = 0.5 // No special event today (neutral)

  const rawConfidence =
    historicalWeight * weights.historical +
    dayMultiplier * weights.dayOfWeek +
    timeWeight * weights.timeOfDay +
    weatherWeight * weights.weather +
    eventWeight * weights.events

  // Clamp between 0.1 and 0.97
  const confidence = Math.min(0.97, Math.max(0.1, rawConfidence))

  // Generate predicted surplus items based on common restaurant patterns
  const PREDICTED_ITEMS = [
    {
      name: 'Bakery & Bread Products',
      baseQty: 5,
      unit: 'kg',
      timeOffset: 3,
      reasoning: `Based on ${avgDaily} avg daily drops and ${weatherCondition.toLowerCase()}, bakery surplus is highly likely by end of service.`
    },
    {
      name: 'Prepared Hot Meals',
      baseQty: 12,
      unit: 'portions',
      timeOffset: 2,
      reasoning: `Post-lunch buffet data suggests ${Math.round(confidence * 100)}% chance of leftover prepared meals. ${weatherCondition} reduces dine-in traffic.`
    },
    {
      name: 'Fresh Produce & Salads',
      baseQty: 3,
      unit: 'kg',
      timeOffset: 4,
      reasoning: `Seasonal produce shelf-life analysis indicates expiry window. Historical pattern: ${now.toLocaleDateString('en-US', { weekday: 'long' })}s average ${avgDaily} drops.`
    },
  ]

  return PREDICTED_ITEMS.map((item, idx) => {
    // Add variance per item
    const itemConfidence = Math.min(0.97, confidence + (idx === 0 ? 0.05 : idx === 1 ? -0.03 : -0.08))
    const predictedQty = Math.max(1, Math.round(item.baseQty * dayMultiplier * (0.8 + Math.random() * 0.4)))

    const predictedHour = now.getHours() + item.timeOffset
    const predictedTime = new Date(now)
    predictedTime.setHours(predictedHour, 0, 0, 0)

    return {
      id: `pred-${idx}`,
      itemName: item.name,
      predictedQuantity: predictedQty,
      predictedUnit: item.unit,
      confidence: Math.round(itemConfidence * 100) / 100,
      predictedTime: predictedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      reasoning: item.reasoning,
      featureWeights: {
        historical: historicalWeight,
        dayOfWeek: dayMultiplier,
        timeOfDay: timeWeight,
        weather: weatherWeight,
        events: eventWeight,
      }
    }
  }).sort((a, b) => b.confidence - a.confidence)
}
