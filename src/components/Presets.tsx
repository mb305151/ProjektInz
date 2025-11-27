import React from 'react'
import { CriterionKey, WorkloadType } from '@/types'

type Preset = {
  label: string
  inputs: Record<CriterionKey, number>
  workload: WorkloadType
}

const P1: Preset = {
  label: 'MVP serverless (HTTP API)',
  workload: 'http_api',
  inputs: {
    team_experience: 3,
    ops_budget: 4,
    scalability: 7,
    infra_control: 3,
    ease_of_use: 9,
    idle_cost_sensitivity: 9,
    security: 6,
    portability: 4,
    time_to_market: 9
  }
}
const P2: Preset = {
  label: 'Enterprise (stateful + kontrola)',
  workload: 'stateful',
  inputs: {
    team_experience: 8,
    ops_budget: 8,
    scalability: 9,
    infra_control: 9,
    ease_of_use: 4,
    idle_cost_sensitivity: 3,
    security: 9,
    portability: 8,
    time_to_market: 5
  }
}
const P3: Preset = {
  label: 'Edge / IoT (lekki klaster)',
  workload: 'edge',
  inputs: {
    team_experience: 6,
    ops_budget: 6,
    scalability: 7,
    infra_control: 7,
    ease_of_use: 6,
    idle_cost_sensitivity: 5,
    security: 7,
    portability: 7,
    time_to_market: 6
  }
}

const PRESETS = [P1, P2, P3]

interface Props {
  onApply: (p: Preset) => void
}

export default function Presets({ onApply }: Props) {
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>Presety scenariuszy</h3>
        <span className="muted">Wybierz, aby zapełnić suwaki przykładowymi danymi</span>
      </div>
      <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {PRESETS.map((p) => (
          <button className="button secondary" key={p.label} onClick={() => onApply(p)}>{p.label}</button>
        ))}
      </div>
    </div>
  )
}
