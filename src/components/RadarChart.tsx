import React, { useMemo } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { CRITERIA } from '@/data/criteria'
import { computeScores, FIT } from '@/engine/scoring'
import { CriterionKey, WorkloadType } from '@/types'

// Rejestrujemy komponenty Chart.js (radar potrzebuje ich jawnie)
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface Props {
  inputs: Record<CriterionKey, number>
  weights: Record<CriterionKey, number>
  workload: WorkloadType
  selectedOptionKey?: string
}

export default function RadarChart({ inputs, weights, workload, selectedOptionKey }: Props) {
  // Obliczamy wyniki i wybieramy narzędzie do porównania
  const results = computeScores(inputs, weights, workload)
  const selected = selectedOptionKey
    ? results.find(r => r.option.key === selectedOptionKey)
    : results[0]

  // Dane użytkownika (profil wymagań)
  const userData = CRITERIA.map(c => inputs[c.key] / 10)

  // Dopasowanie narzędzia (profil narzędzia)
  const toolFit = useMemo(() => {
    if (!selected) return CRITERIA.map(() => 0.5)
    return CRITERIA.map(c => {
      const fn = FIT[selected.option.key as keyof typeof FIT][c.key as CriterionKey]
      return fn ? fn(inputs[c.key]) : 0.5
    })
  }, [selected, inputs])

  // Etykiety (nazwy kryteriów)
  const labels = CRITERIA.map(c => c.label)

  // Dane dla Chart.js
  const data = {
    labels,
    datasets: [
      {
        label: 'Twój profil wymagań',
        data: userData,
        borderWidth: 2,
        borderColor: '#66e0a3',
        backgroundColor: 'rgba(102, 224, 163, 0.2)',
        fill: true
      },
      {
        label: `Profil narzędzia: ${selected?.option.label ?? ''}`,
        data: toolFit,
        borderWidth: 2,
        borderColor: '#7cb7ff',
        backgroundColor: 'rgba(124, 183, 255, 0.2)',
        fill: true
      }
    ]
  }

  // Opcje wykresu
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: { color: '#a5abc5', stepSize: 0.2, showLabelBackdrop: false },
        grid: { color: 'rgba(255,255,255,0.1)' },
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#e7e9f6', font: { size: 11 } }
      }
    },
    plugins: {
      legend: { labels: { color: '#e7e9f6' } }
    }
  } as const

  return (
    <div className="card">
      <h3>Radar dopasowania</h3>
      <div style={{ height: 420 }}>
        <Radar data={data} options={options} />
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
        Porównanie: Twój profil (1–10) vs. dopasowanie narzędzia (0–1).
      </div>
    </div>
  )
}
