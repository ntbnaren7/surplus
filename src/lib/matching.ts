/* ═══════════════════════════════════════════════════════════
   SMART MATCH ENGINE — Nutritional Profile Matching
   ═══════════════════════════════════════════════════════════
   
   Pairs surplus food items with the receivers who need them most
   based on nutritional alignment, proximity, and historical patterns.

   Match Score Formula:
     MatchScore = (NutritionalFit × 0.50) + (Proximity × 0.30) + (HistoricalAcceptance × 0.20)

   In production, this would use:
   - A trained recommendation model (collaborative filtering)
   - Real receiver dietary profiles from onboarding
   - USDA FoodData Central API for nutritional lookup
═══════════════════════════════════════════════════════════ */

import { type FoodItem } from '@/lib/validations/food'

/* ─── Receiver Facility Profiles ─── */
export interface ReceiverProfile {
  id: string
  name: string
  type: 'shelter' | 'food_bank' | 'school' | 'elderly_care' | 'community_kitchen'
  dietaryNeeds: string[]          // e.g., ['high-protein', 'low-sodium']
  storageCapacity: 'cold' | 'dry' | 'both'
  historicalAcceptRate: number     // 0.0-1.0 (how often they accept items)
}

/* ─── Food Nutritional Profile (inferred from name heuristics) ─── */
export interface NutritionalProfile {
  category: 'protein' | 'carbs' | 'produce' | 'dairy' | 'mixed'
  isPerishable: boolean
  requiresColdStorage: boolean
  tags: string[]                  // e.g., ['high-protein', 'gluten-free']
}

export interface MatchResult {
  itemId: string
  itemName: string
  matchScore: number              // 0-100
  matchGrade: 'A+' | 'A' | 'B' | 'C'
  reasoning: string
  breakdown: {
    nutritionalFit: number        // 0-100
    proximity: number             // 0-100
    historicalAcceptance: number  // 0-100
  }
}

/* ─── Simulated receiver profile (the logged-in facility) ─── */
const CURRENT_RECEIVER: ReceiverProfile = {
  id: 'recv-001',
  name: 'Downtown Family Shelter',
  type: 'shelter',
  dietaryNeeds: ['high-protein', 'balanced', 'kid-friendly'],
  storageCapacity: 'both',
  historicalAcceptRate: 0.88,
}

/* ─── Nutritional inference from item name ─── */
function inferNutritionalProfile(itemName: string): NutritionalProfile {
  const nameLower = itemName.toLowerCase()

  if (/chicken|beef|fish|pork|meat|protein|turkey|lamb/.test(nameLower)) {
    return {
      category: 'protein',
      isPerishable: true,
      requiresColdStorage: true,
      tags: ['high-protein', 'perishable'],
    }
  }
  if (/bread|pastry|cake|muffin|bagel|croissant|loav|sourdough|bakery/.test(nameLower)) {
    return {
      category: 'carbs',
      isPerishable: false,
      requiresColdStorage: false,
      tags: ['carb-rich', 'shelf-stable', 'kid-friendly'],
    }
  }
  if (/salad|fruit|vegetable|produce|greens|apple|banana|berry/.test(nameLower)) {
    return {
      category: 'produce',
      isPerishable: true,
      requiresColdStorage: true,
      tags: ['vitamin-rich', 'fresh', 'balanced'],
    }
  }
  if (/milk|cheese|yogurt|dairy|cream/.test(nameLower)) {
    return {
      category: 'dairy',
      isPerishable: true,
      requiresColdStorage: true,
      tags: ['calcium-rich', 'perishable'],
    }
  }
  // Default: mixed/prepared meals
  return {
    category: 'mixed',
    isPerishable: true,
    requiresColdStorage: false,
    tags: ['balanced', 'ready-to-eat', 'kid-friendly'],
  }
}

/* ─── Nutritional Fit Score ─── */
function calculateNutritionalFit(
  foodProfile: NutritionalProfile,
  receiver: ReceiverProfile
): { score: number; reason: string } {
  let score = 50 // Base score
  let reasons: string[] = []

  // Tag overlap: each matching tag adds 15 points
  const overlap = foodProfile.tags.filter(tag => receiver.dietaryNeeds.includes(tag))
  score += overlap.length * 15
  if (overlap.length > 0) {
    reasons.push(`Matches ${overlap.join(', ')} needs`)
  }

  // Storage compatibility
  if (foodProfile.requiresColdStorage && (receiver.storageCapacity === 'cold' || receiver.storageCapacity === 'both')) {
    score += 10
  } else if (foodProfile.requiresColdStorage && receiver.storageCapacity === 'dry') {
    score -= 20
    reasons.push('Requires cold storage (limited)')
  }

  // Facility type bonuses
  if (receiver.type === 'shelter' && foodProfile.category === 'protein') {
    score += 15
    reasons.push('Protein prioritized for shelter')
  }
  if (receiver.type === 'school' && foodProfile.tags.includes('kid-friendly')) {
    score += 15
    reasons.push('Kid-friendly for school program')
  }
  if (receiver.type === 'elderly_care' && foodProfile.tags.includes('balanced')) {
    score += 10
    reasons.push('Balanced nutrition for elderly care')
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    reason: reasons.length > 0 ? reasons.join('. ') + '.' : 'General nutritional match.'
  }
}

/* ─── Proximity Score (inverse distance) ─── */
function calculateProximityScore(distanceKm: number): number {
  if (distanceKm <= 1) return 100
  if (distanceKm <= 3) return 85
  if (distanceKm <= 5) return 70
  if (distanceKm <= 10) return 50
  return Math.max(10, 100 - distanceKm * 8)
}

/* ─── Match Grade from score ─── */
function gradeFromScore(score: number): MatchResult['matchGrade'] {
  if (score >= 90) return 'A+'
  if (score >= 75) return 'A'
  if (score >= 55) return 'B'
  return 'C'
}

/* ═══════════════════════════════════════════════════
   MAIN MATCHING FUNCTION
═══════════════════════════════════════════════════ */
export function calculateMatchScores(
  items: (FoodItem & { distance: number; priorityScore: number })[],
  receiver?: ReceiverProfile
): MatchResult[] {
  const profile = receiver ?? CURRENT_RECEIVER

  return items.map(item => {
    const nutritionalProfile = inferNutritionalProfile(item.name)
    const { score: nutritionalFit, reason } = calculateNutritionalFit(nutritionalProfile, profile)
    const proximityScore = calculateProximityScore(item.distance)
    const historicalScore = Math.round(profile.historicalAcceptRate * 100)

    // Weighted composite score
    const matchScore = Math.round(
      nutritionalFit * 0.50 +
      proximityScore * 0.30 +
      historicalScore * 0.20
    )

    return {
      itemId: item.id,
      itemName: item.name,
      matchScore: Math.min(99, matchScore),
      matchGrade: gradeFromScore(matchScore),
      reasoning: reason,
      breakdown: {
        nutritionalFit,
        proximity: proximityScore,
        historicalAcceptance: historicalScore,
      }
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}
