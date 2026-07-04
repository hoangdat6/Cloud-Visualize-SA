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
  /** Định danh dùng cho URL, duy nhất. Ví dụ: "aws-direct-connect". */
  slug: string;
  /** Tên hiển thị trên card & player. */
  title: string;
  /** Mô tả ngắn (1–2 câu) cho card và SEO. */
  description: string;
  /** Nhà cung cấp cloud (dùng để lọc + badge). */
  cloud: Cloud;
  /** Lĩnh vực kiến trúc (dùng để lọc). */
  domain: Domain;
  /** Mức độ khó (dùng để lọc + badge). */
  difficulty: Difficulty;
  /** Từ khoá tự do để tìm kiếm & gợi ý. */
  tags: string[];
  /** Đường dẫn tới file HTML trong public/. Bắt đầu bằng "/". */
  htmlPath: string;
  /** Ảnh thumbnail trong public/ (tuỳ chọn). */
  thumbnail?: string;
  /** Mô tả dài cho trang chi tiết (nếu bỏ trống, dùng `description`). */
  longDescription?: string;
  /** Mục tiêu học được khi xem mô phỏng này. */
  objectives?: string[];
  /** Các thành phần chính xuất hiện trong mô phỏng. */
  components?: { name: string; description: string }[];
  /** Ngày tạo/cập nhật (ISO date, dùng để sắp xếp). */
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
