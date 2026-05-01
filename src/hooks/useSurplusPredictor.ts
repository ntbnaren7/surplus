import { useMemo } from 'react'
import { useSurplusStore } from '@/store/useSurplusStore'
import { generatePredictions, type SurplusPrediction } from '@/lib/analytics'

/**
 * Hook that runs the Surplus Predictor ML engine against
 * the current inventory data and returns forecast results.
 * 
 * Re-computes when inventory changes.
 */
export function useSurplusPredictor() {
  const { inventory } = useSurplusStore()

  const predictions = useMemo<SurplusPrediction[]>(() => {
    return generatePredictions(inventory)
  }, [inventory])

  const topPrediction = predictions[0] ?? null
  const avgConfidence = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
    : 0

  return {
    predictions,
    topPrediction,
    avgConfidence,
    modelVersion: '0.3.1-beta',
    lastUpdated: new Date().toISOString(),
  }
}
