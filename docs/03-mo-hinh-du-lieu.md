# 03 — Mô hình dữ liệu (manifest)

Toàn bộ danh mục mô phỏng được khai báo tay trong một manifest TypeScript. Đây là **nguồn sự
thật duy nhất** của hệ thống.

## Kiểu dữ liệu

`lib/types.ts`:

```ts
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
  /** Ngày tạo/cập nhật (ISO date, để sắp xếp). */
  createdAt: string;
}
```

## Manifest

`data/simulations.ts`:

```ts
import type { Simulation } from "@/lib/types";

export const simulations: Simulation[] = [
  {
    slug: "aws-direct-connect",
    title: "AWS Direct Connect — Global Topology",
    description:
      "Mổ xẻ topology Direct Connect + Transit Gateway đa VPC: Private/Transit/Public VIF, BGP, cross-connect.",
    cloud: "aws",
    domain: "networking",
    difficulty: "advanced",
    tags: ["Direct Connect", "Transit Gateway", "BGP", "VIF", "VPC"],
    htmlPath: "/simulations/aws_direct_connect_topology_simulator.html",
    thumbnail: "/thumbs/aws-direct-connect.png",
    createdAt: "2026-07-04",
  },
  // ... các mô phỏng khác thêm vào đây
];
```

## Quy ước

- `slug`: chữ thường, phân tách bằng dấu gạch nối (`kebab-case`), **không trùng lặp**. Đây là
  khoá dùng cho route `/s/[slug]`.
- `htmlPath`: luôn bắt đầu bằng `/` và trỏ tới file trong `public/simulations/`.
- `tags`: viết đúng tên dịch vụ/khái niệm (dùng cho tìm kiếm; nên nhất quán hoa/thường).
- `thumbnail`: nếu bỏ trống, card dùng ảnh placeholder mặc định (badge cloud + tiêu đề).

## Lớp truy vấn

`lib/catalog.ts` — mọi truy cập danh mục đi qua đây (UI không đọc thẳng mảng):

```ts
import { simulations } from "@/data/simulations";
import type { Simulation } from "@/lib/types";

export function getAllSimulations(): Simulation[] {
  return [...simulations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSimulationBySlug(slug: string): Simulation | undefined {
  return simulations.find((s) => s.slug === slug);
}

export function getAllSlugs(): string[] {
  return simulations.map((s) => s.slug);
}

/** Trả về các giá trị filter khả dụng (để dựng dropdown động). */
export function getFilterOptions() {
  return {
    clouds: unique(simulations.map((s) => s.cloud)),
    domains: unique(simulations.map((s) => s.domain)),
    difficulties: unique(simulations.map((s) => s.difficulty)),
  };
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
```

## Validation (tuỳ chọn nhưng khuyến khích)

Có thể thêm một script kiểm tra lúc build (hoặc test đơn giản):

- `slug` là duy nhất.
- File tại `htmlPath` thực sự tồn tại trong `public/`.
- `thumbnail` (nếu có) tồn tại.

Việc này giúp phát hiện sớm lỗi khai báo khi thêm mô phỏng mới.
