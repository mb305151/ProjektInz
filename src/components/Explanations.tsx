import React from 'react'
import { computeScores, explainTop } from '@/engine/scoring'
import { CriterionKey, WorkloadType } from '@/types'

interface Props {
  inputs: Record<CriterionKey, number>
  weights: Record<CriterionKey, number>
  workload: WorkloadType
}

export default function Explanations({ inputs, weights, workload }: Props) {
  const results = computeScores(inputs, weights, workload).slice(0, 3)
  return (
    <div className="card">
      <h3>Top-3 — dlaczego?</h3>
      <ol>
        {results.map(r => (
          <li key={r.option.key} style={{ marginBottom: 6 }}>
            {explainTop(r)}
          </li>
        ))}
      </ol>
    </div>
  )
}
