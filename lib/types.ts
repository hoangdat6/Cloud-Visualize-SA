export type Cloud = "aws" | "azure" | "gcp" | "multi";

export type Domain =
  | "networking"
  | "compute"
  | "storage"
  | "data"
  | "security"
  | "serverless"
  | "containers"
  | "observability";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Simulation {
  /** Unique URL identifier. Example: "aws-direct-connect". */
  slug: string;
  /** Display name on cards and player. */
  title: string;
  /** Short description (1–2 sentences) for cards and SEO. */
  description: string;
  /** Cloud provider (filter + badge). */
  cloud: Cloud;
  /** Architecture domain (filter). */
  domain: Domain;
  /** Difficulty level (filter + badge). */
  difficulty: Difficulty;
  /** Free-form tags for search. */
  tags: string[];
  /** Path to the HTML file under public/. Must start with "/". */
  htmlPath: string;
  /** Thumbnail under public/ (optional). */
  thumbnail?: string;
  /** Long description for the detail page (falls back to `description`). */
  longDescription?: string;
  /** Learning objectives for this simulation. */
  objectives?: string[];
  /** Key components shown in the simulation. */
  components?: { name: string; description: string }[];
  /** Created/updated date (ISO date, used for sorting). */
  createdAt: string;
}

export const CLOUD_LABELS: Record<Cloud, string> = {
  aws: "AWS",
  azure: "Azure",
  gcp: "GCP",
  multi: "Multi-cloud",
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  networking: "Networking",
  compute: "Compute",
  storage: "Storage",
  data: "Data",
  security: "Security",
  serverless: "Serverless",
  containers: "Containers",
  observability: "Observability",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
