import { CRITERIA } from '@/data/criteria'
import { OPTIONS } from '@/data/options'
import { CriterionKey, OptionKey, WorkloadType } from '@/types'

/** Funkcje dopasowania (0..1) */
const rising = (r: number) => r / 10
const risingStrong = (r: number) => Math.min(1, Math.pow(r / 10, 0.6))
const falling = (r: number) => 1 - r / 10
const flatLow = (r: number) => 0.4 + 0.2 * (r / 10)
const flatVeryLow = (r: number) => 0.2 + 0.1 * (r / 10)
/** preferuje średnie wartości, domyślnie mu=6, delta=3 */
const midPref = (r: number, mu = 6, delta = 3) => Math.max(0, Math.min(1, 1 - Math.abs(r - mu) / delta))
/** lubi budżet >= 6..10 */
const midHigh = (r: number) => Math.max(0, Math.min(1, (r - 5) / 5))

export type FitFn = (r: number) => number

type FitMap = Record<OptionKey, Partial<Record<CriterionKey, FitFn>>>

export const FIT: FitMap = {
  compose: {
    team_experience: falling,
    ops_budget: falling,             // niski ops budget -> lepiej
    scalability: (r) => midPref(r, 5.5, 3),
    infra_control: flatLow,
    ease_of_use: rising,
    idle_cost_sensitivity: flatLow,
    security: flatLow,
    portability: rising,
    time_to_market: rising
  },
  podman: {
    team_experience: (r) => midPref(r, 6, 3),
    ops_budget: falling,
    scalability: (r) => midPref(r, 6, 3),
    infra_control: flatLow,
    ease_of_use: (r) => midPref(r, 6, 3),
    idle_cost_sensitivity: flatLow,
    security: rising,
    portability: rising,
    time_to_market: rising
  },
  swarm: {
    team_experience: (r) => midPref(r, 6, 3),
    ops_budget: falling,
    scalability: (r) => midPref(r, 6, 3),
    infra_control: flatLow,
    ease_of_use: rising,
    idle_cost_sensitivity: flatLow,
    security: flatLow,
    portability: rising,
    time_to_market: rising
  },
  k3s: {
    team_experience: rising,
    ops_budget: rising,             // wymaga trochę ops
    scalability: rising,
    infra_control: rising,
    ease_of_use: (r) => midPref(r, 6, 3),
    idle_cost_sensitivity: flatLow,
    security: rising,
    portability: rising,
    time_to_market: (r) => midPref(r, 6, 3)
  },
  k8s_managed: {
    team_experience: rising,
    ops_budget: midHigh,            // dobrze przy średnio-dużym budżecie
    scalability: risingStrong,
    infra_control: rising,
    ease_of_use: rising,
    idle_cost_sensitivity: flatLow,
    security: rising,
    portability: rising,
    time_to_market: rising
  },
  k8s_self: {
    team_experience: risingStrong,
    ops_budget: rising,             // duży budżet ops
    scalability: risingStrong,
    infra_control: risingStrong,
    ease_of_use: falling,
    idle_cost_sensitivity: flatVeryLow,
    security: rising,
    portability: rising,
    time_to_market: falling
  },
  cloud_run: {
    team_experience: falling,       // niski skill -> OK
    ops_budget: falling,            // niski budżet ops -> OK
    scalability: rising,
    infra_control: flatVeryLow,
    ease_of_use: risingStrong,
    idle_cost_sensitivity: rising,  // scale-to-zero
    security: rising,
    portability: falling,           // większy lock-in
    time_to_market: risingStrong
  },
  fargate: {
    team_experience: falling,
    ops_budget: falling,
    scalability: rising,
    infra_control: flatLow,
    ease_of_use: rising,
    idle_cost_sensitivity: rising,
    security: rising,
    portability: falling,
    time_to_market: rising
  },
  aci: {
    team_experience: falling,
    ops_budget: falling,
    scalability: (r) => midPref(r, 6, 3),
    infra_control: flatLow,
    ease_of_use: rising,
    idle_cost_sensitivity: rising,
    security: rising,
    portability: falling,
    time_to_market: rising
  },
  nomad: {
    team_experience: rising,
    ops_budget: rising,
    scalability: rising,
    infra_control: rising,
    ease_of_use: (r) => midPref(r, 6, 3),
    idle_cost_sensitivity: flatLow,
    security: rising,
    portability: rising,
    time_to_market: (r) => midPref(r, 6, 3)
  }
}

/** Bonusy/punkty twarde za typ obciążenia */
export function workloadBonuses(workload: WorkloadType): Record<OptionKey, number> {
  const base: Record<OptionKey, number> = {
    compose: 0, podman: 0, swarm: 0, k3s: 0, k8s_managed: 0, k8s_self: 0, cloud_run: 0, fargate: 0, aci: 0, nomad: 0
  }
  if (workload === 'edge') {
    base.k3s += 1.0
    base.k8s_self += 0.3
    base.cloud_run -= 0.5
    base.fargate -= 0.5
    base.aci -= 0.5
  }
  if (workload === 'batch') {
    base.fargate += 0.6
    base.aci += 0.6
  }
  if (workload === 'http_api') {
    base.cloud_run += 0.6
    base.k8s_managed += 0.2
  }
  if (workload === 'stateful') {
    base.k8s_self += 0.6
    base.k8s_managed += 0.4
    base.cloud_run -= 0.6
    base.aci -= 0.6
  }
  if (workload === 'event') {
    base.cloud_run += 0.5
    base.fargate += 0.3
  }
  return base
}

export function defaultWeights(): Record<CriterionKey, number> {
  const m: Record<CriterionKey, number> = {} as any
  for (const c of CRITERIA) m[c.key] = c.defaultWeight
  return m
}

export function emptyInputs(): Record<CriterionKey, number> {
  const m: Record<CriterionKey, number> = {} as any
  for (const c of CRITERIA) m[c.key] = 5
  return m
}

export function computeScores(
  inputs: Record<CriterionKey, number>,
  weights: Record<CriterionKey, number>,
  workload: WorkloadType
) {
  const bonuses = workloadBonuses(workload)
  return OPTIONS.map(o => {
    let score = 0
    const contrib: { key: CriterionKey; value: number; f: number }[] = []
    for (const c of CRITERIA) {
      const fitFn = FIT[o.key][c.key]
      const f = fitFn ? fitFn(inputs[c.key]) : 0.5 // neutral jeśli brak
      const v = weights[c.key] * f
      contrib.push({ key: c.key, value: v, f })
      score += v
    }
    score += bonuses[o.key]
    contrib.sort((a, b) => b.value - a.value)
    return { option: o, score, contrib, bonus: bonuses[o.key] }
  }).sort((a, b) => b.score - a.score)
}

export function explainTop(result: ReturnType<typeof computeScores>[number]) {
  const keys = result.contrib.slice(0, 3).map(c => c.key)
  const nice: Record<CriterionKey, string> = {
    team_experience: 'doświadczenie zespołu',
    ops_budget: 'budżet operacyjny',
    scalability: 'skalowalność',
    infra_control: 'kontrola nad infrastrukturą',
    ease_of_use: 'łatwość użycia',
    idle_cost_sensitivity: 'koszty idle (scale-to-zero)',
    security: 'bezpieczeństwo',
    portability: 'portowalność',
    time_to_market: 'time-to-market'
  }
  const reasons = keys.map(k => nice[k]).join(', ')
  const bonusText = result.bonus ? `; dopasowanie do obciążenia: ${result.bonus > 0 ? '+' : ''}${result.bonus.toFixed(1)}` : ''
  return `${result.option.label}: ${result.score.toFixed(2)} — kluczowe dopasowania: ${reasons}${bonusText}`
}
