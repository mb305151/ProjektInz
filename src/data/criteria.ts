import { Criterion } from '@/types'

export const CRITERIA: Criterion[] = [
  { key: 'team_experience', label: 'Doświadczenie zespołu', description: 'Znajomość kontenerów, K8s, ops', defaultWeight: 1.2 },
  { key: 'ops_budget', label: 'Budżet operacyjny', description: 'Środki na utrzymanie/ops (10=duży)', defaultWeight: 1.0 },
  { key: 'scalability', label: 'Skalowalność', description: 'Wymagana skala pozioma', defaultWeight: 1.5 },
  { key: 'infra_control', label: 'Kontrola nad infrastrukturą', description: 'Polityki sieci, CSI, niestandardy', defaultWeight: 1.3 },
  { key: 'ease_of_use', label: 'Łatwość użycia', description: 'Oczekiwana prostota narzędzi', defaultWeight: 1.0 },
  { key: 'idle_cost_sensitivity', label: 'Czułość na koszty idle', description: 'Preferencja scale-to-zero', defaultWeight: 1.1 },
  { key: 'security', label: 'Bezpieczeństwo/Compliance', description: 'Wymogi formalne, kontrola', defaultWeight: 1.2 },
  { key: 'portability', label: 'Portowalność', description: 'Unikanie lock-inu dostawcy', defaultWeight: 0.9 },
  { key: 'time_to_market', label: 'Time-to-market', description: 'Presja szybkiego wdrożenia', defaultWeight: 1.3 }
]
