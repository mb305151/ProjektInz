export type CriterionKey =
  | 'team_experience'
  | 'ops_budget'
  | 'scalability'
  | 'infra_control'
  | 'ease_of_use'
  | 'idle_cost_sensitivity'
  | 'security'
  | 'portability'
  | 'time_to_market';

export type WorkloadType = 'http_api' | 'batch' | 'edge' | 'stateful' | 'event';

export interface Criterion {
  key: CriterionKey;
  label: string;
  description: string;
  defaultWeight: number;
}

export type OptionKey =
  | 'compose'
  | 'podman'
  | 'swarm'
  | 'k3s'
  | 'k8s_managed'
  | 'k8s_self'
  | 'cloud_run'
  | 'fargate'
  | 'aci'
  | 'nomad';

export interface OptionDef {
  key: OptionKey;
  label: string;
  description: string;
}
