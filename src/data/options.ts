import { OptionDef } from '@/types'

export const OPTIONS: OptionDef[] = [
  { key: 'compose', label: 'Docker Compose', description: 'Prosty dev/małe wdrożenia' },
  { key: 'podman', label: 'Podman', description: 'Rootless, bez demona; alternatywa Dockera' },
  { key: 'swarm', label: 'Docker Swarm', description: 'Lekki orkiestrator dla mniejszych projektów' },
  { key: 'k3s', label: 'K3s', description: 'Lekki Kubernetes (edge/lab/on-prem)' },
  { key: 'k8s_managed', label: 'Kubernetes (Managed: GKE/EKS/AKS)', description: 'Standard produkcyjny, mniejszy ops' },
  { key: 'k8s_self', label: 'Kubernetes (Self-managed)', description: 'Maksymalna kontrola, największa złożoność' },
  { key: 'cloud_run', label: 'Google Cloud Run', description: 'Serverless kontenery (HTTP/event), scale-to-zero' },
  { key: 'fargate', label: 'AWS Fargate', description: 'Serverless compute dla ECS/EKS' },
  { key: 'aci', label: 'Azure Container Instances', description: 'Szybkie single-container / proste scenariusze' },
  { key: 'nomad', label: 'HashiCorp Nomad', description: 'Uniwersalny orkiestrator obciążeń' }
]
