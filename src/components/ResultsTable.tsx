import React from 'react'
import { computeScores, explainTop } from '@/engine/scoring'
import { CriterionKey, WorkloadType } from '@/types'

interface Props {
  inputs: Record<CriterionKey, number>
  weights: Record<CriterionKey, number>
  workload: WorkloadType
  onSelect: (optionKey: string) => void
}

export default function ResultsTable({ inputs, weights, workload, onSelect }: Props) {
  const results = computeScores(inputs, weights, workload)

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>Ranking rekomendacji</h3>
        <div className="muted">Typ obciążenia: <span className="badge">{workload}</span></div>
      </div>
      <table className="table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Narzędzie</th>
            <th>Wynik</th>
            <th>Uzasadnienie (skrót)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={r.option.key} style={{ cursor: 'pointer' }} onClick={() => onSelect(r.option.key)}>
              <td>{idx + 1}</td>
              <td><strong>{r.option.label}</strong></td>
              <td>{r.score.toFixed(2)}</td>
              <td className="muted">{explainTop(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
        Kliknij w wiersz, aby zobaczyć radar dopasowania dla wybranej opcji.
      </div>
    </div>
  )
}
