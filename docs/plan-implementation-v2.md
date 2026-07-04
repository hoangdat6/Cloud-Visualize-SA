# Tính năng mở rộng v2 — Implementation Plan

> **Nguồn spec:** `docs/08-tinh-nang-mo-rong-v2.md` (đã duyệt).
> **Lưu ý thực thi:** Không tự `git commit` trong lúc build — mỗi task chỉ chạy bước Verify.
> Lệnh commit cuối cùng do người dùng tự chạy (theo quy ước dự án).

**Goal:** Tách trang chi tiết/player, thêm bookmark + đã xem (localStorage), lọc theo URL,
landing + thống kê, SEO, và validate manifest tự động trước khi build.

**Architecture:** Vẫn 100% tĩnh (Next.js App Router, SSG). Tính năng cá nhân hoá dùng hook
`useStoredSet` đọc/ghi `localStorage`, không backend. Mỗi tính năng là các component/route nhỏ,
độc lập, ghép lại qua props/route params.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4,
`tsx` (devDependency mới, để chạy script validate ngoài runtime Next.js).

---

## Task 1: Nền tảng dùng chung (site config, hook localStorage, mở rộng type)

**Files:**
- Create: `lib/site.ts`
- Create: `hooks/useStoredSet.ts`
- Modify: `lib/types.ts`
- Modify: `data/simulations.ts`

- [ ] **Step 1: Tạo `lib/site.ts`**

```ts
export const SITE = {
  name: "CloudViz SA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudviz-sa.vercel.app",
  description:
    "Thư viện mô phỏng kiến trúc Cloud cho Solution Architect — AWS · Azure · GCP",
} as const;
```

- [ ] **Step 2: Tạo `hooks/useStoredSet.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Quản lý một tập hợp chuỗi lưu trong localStorage (ví dụ: bookmark, đã xem).
 * State khởi tạo rỗng để khớp với SSR; giá trị thật được nạp trong useEffect
 * và báo qua cờ `hydrated` để tránh hydration mismatch.
 */
export function useStoredSet(storageKey: string) {
  const [values, setValues] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setValues(new Set(parsed.filter((v): v is string => typeof v === "string")));
        }
      }
    } catch {
      // localStorage không khả dụng (private mode...) — giữ Set rỗng.
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: Set<string>) => {
      setValues(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        // Bỏ qua nếu không ghi được (quota đầy, private mode...).
      }
    },
    [storageKey]
  );

  const has = useCallback((id: string) => values.has(id), [values]);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(values);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      persist(next);
    },
    [values, persist]
  );

  const add = useCallback(
    (id: string) => {
      if (values.has(id)) return;
      const next = new Set(values);
      next.add(id);
      persist(next);
    },
    [values, persist]
  );

  return { values, hydrated, has, toggle, add };
}
```

- [ ] **Step 3: Mở rộng `Simulation` trong `lib/types.ts`**

Thêm 3 trường optional vào interface, ngay sau trường `thumbnail?: string;` và trước `createdAt`:

```ts
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
```

- [ ] **Step 4: Bổ sung nội dung chi tiết cho mục `aws-direct-connect` trong `data/simulations.ts`**

Thay toàn bộ nội dung file bằng:

```ts
import type { Simulation } from "@/lib/types";

/**
 * Manifest — nguồn sự thật duy nhất về danh mục mô phỏng.
 * Xem docs/06-quy-trinh-them-mo-phong.md để biết cách thêm mục mới.
 */
export const simulations: Simulation[] = [
  {
    slug: "aws-direct-connect",
    title: "AWS Direct Connect — Global Topology",
    description:
      "Mổ xẻ topology Direct Connect + Transit Gateway đa VPC: Private/Transit/Public VIF, BGP, cross-connect, chế độ xem Physical/Logical.",
    longDescription:
      "Mô phỏng chi tiết kiến trúc AWS Direct Connect kết nối On-Premise với AWS qua Direct Connect Gateway và Transit Gateway. Chuyển đổi giữa chế độ xem vật lý (cáp quang, cross-connect, PE Router) và logic (VLAN/VIF, định tuyến BGP) để hiểu rõ từng lớp của kết nối. Kích hoạt mô phỏng luồng gói tin cho 3 loại VIF (Private, Transit, Public) và bấm vào từng thiết bị để xem cấu hình chi tiết.",
    objectives: [
      "Phân biệt Private VIF, Transit VIF và Public VIF",
      "Hiểu vai trò của Direct Connect Gateway trong việc kết nối nhiều VPC/tài khoản",
      "Nắm được cách Transit Gateway định tuyến giữa on-premise và các VPC spoke",
      "Nhận diện điểm phân định trách nhiệm vật lý (cross-connect, demarcation) giữa khách hàng và AWS",
    ],
    components: [
      {
        name: "Customer Edge (CE) Router",
        description: "Router BGP phía khách hàng, kết nối MACsec/BFD tới AWS.",
      },
      {
        name: "AWS Direct Connect Endpoint",
        description: "Điểm neo dịch vụ nhận kết nối vật lý và phân phối vào VIFs.",
      },
      {
        name: "Direct Connect Gateway (DXGW)",
        description: "Hub logic toàn cầu, trung chuyển tuyến giữa CE Router và Transit Gateway.",
      },
      {
        name: "Transit Gateway (TGW)",
        description: "Router trung tâm hub-and-spoke kết nối nhiều VPC qua các attachment.",
      },
    ],
    cloud: "aws",
    domain: "networking",
    difficulty: "advanced",
    tags: ["Direct Connect", "Transit Gateway", "BGP", "VIF", "VPC", "DXGW"],
    htmlPath: "/simulations/aws_direct_connect_topology_simulator.html",
    createdAt: "2026-07-04",
  },
];
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: không có lỗi type (các trường mới đều optional nên không phá dữ liệu hiện có).

---

## Task 2: Script validate manifest + npm scripts

**Files:**
- Create: `scripts/validate-manifest.ts`
- Modify: `package.json`

- [ ] **Step 1: Cài `tsx`**

Run: `npm install -D tsx`

- [ ] **Step 2: Tạo `scripts/validate-manifest.ts`**

```ts
import { existsSync } from "node:fs";
import path from "node:path";
import { simulations } from "../data/simulations";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function fail(messages: string[]): never {
  console.error("\n❌ Manifest không hợp lệ:\n");
  for (const message of messages) {
    console.error(`  - ${message}`);
  }
  console.error("");
  process.exit(1);
}

function main() {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const sim of simulations) {
    if (seenSlugs.has(sim.slug)) {
      errors.push(`Slug bị trùng: "${sim.slug}"`);
    }
    seenSlugs.add(sim.slug);

    const htmlFile = path.join(PUBLIC_DIR, sim.htmlPath.replace(/^\//, ""));
    if (!existsSync(htmlFile)) {
      errors.push(`[${sim.slug}] htmlPath không tồn tại: ${sim.htmlPath}`);
    }

    if (sim.thumbnail) {
      const thumbFile = path.join(PUBLIC_DIR, sim.thumbnail.replace(/^\//, ""));
      if (!existsSync(thumbFile)) {
        errors.push(`[${sim.slug}] thumbnail không tồn tại: ${sim.thumbnail}`);
      }
    }
  }

  if (errors.length > 0) {
    fail(errors);
  }

  console.log(`✅ Manifest hợp lệ: ${simulations.length} mô phỏng.`);
}

main();
```

- [ ] **Step 3: Thêm scripts vào `package.json`**

Sửa khối `"scripts"`:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "validate": "tsx scripts/validate-manifest.ts",
    "prebuild": "npm run validate"
  },
```

- [ ] **Step 4: Verify**

Run: `npm run validate`
Expected: in ra `✅ Manifest hợp lệ: 1 mô phỏng.`, exit code 0.

Kiểm tra script thực sự bắt lỗi: tạm sửa `htmlPath` trong `data/simulations.ts` thành một đường dẫn
sai (ví dụ thêm `-broken` vào cuối), chạy lại `npm run validate`, xác nhận thấy dòng lỗi
`htmlPath không tồn tại` và exit code khác 0. Sau đó **sửa lại `htmlPath` về đúng như cũ**.

---

## Task 3: Component `BookmarkButton` + `ViewedBadge`

**Files:**
- Create: `components/BookmarkButton.tsx`
- Create: `components/ViewedBadge.tsx`

- [ ] **Step 1: Tạo `components/BookmarkButton.tsx`**

```tsx
"use client";

import type { MouseEvent } from "react";
import { useStoredSet } from "@/hooks/useStoredSet";

interface BookmarkButtonProps {
  slug: string;
  size?: "sm" | "lg";
}

export function BookmarkButton({ slug, size = "sm" }: BookmarkButtonProps) {
  const { hydrated, has, toggle } = useStoredSet("cloudviz:bookmarks");
  const bookmarked = hydrated && has(slug);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle(slug);
  }

  const icon = (
    <svg
      className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"}
      fill={bookmarked ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
      />
    </svg>
  );

  if (size === "lg") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={bookmarked}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
          bookmarked
            ? "border-amber-400/60 bg-amber-400/20 text-amber-300"
            : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white"
        }`}
      >
        {icon}
        {bookmarked ? "Đã lưu" : "Lưu mô phỏng"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Bỏ đánh dấu mô phỏng" : "Đánh dấu mô phỏng"}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition ${
        bookmarked
          ? "border-amber-400/60 bg-amber-400/20 text-amber-300"
          : "border-slate-700 bg-slate-950/70 text-slate-400 hover:border-slate-500 hover:text-slate-200"
      }`}
    >
      {icon}
    </button>
  );
}
```

- [ ] **Step 2: Tạo `components/ViewedBadge.tsx`**

```tsx
"use client";

import { useStoredSet } from "@/hooks/useStoredSet";

interface ViewedBadgeProps {
  slug: string;
  size?: "sm" | "lg";
  className?: string;
}

export function ViewedBadge({ slug, size = "sm", className = "" }: ViewedBadgeProps) {
  const { hydrated, has } = useStoredSet("cloudviz:viewed");

  if (!hydrated || !has(slug)) return null;

  const sizeClasses =
    size === "lg"
      ? "px-3 py-1.5 text-xs border border-emerald-500/30"
      : "px-2 py-0.5 text-[9px]";

  return (
    <span
      className={`flex w-fit items-center gap-1 rounded-full bg-slate-950/80 font-bold text-emerald-300 ${sizeClasses} ${className}`}
    >
      <svg
        className={size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Đã xem
    </span>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: không lỗi type (chưa có nơi nào import 2 component này nên chỉ cần compile sạch).

---

## Task 4: `SimulationPlayer` (fullscreen + đánh dấu đã xem), xoá `SimulationFrame`

**Files:**
- Create: `components/SimulationPlayer.tsx`
- Delete: `components/SimulationFrame.tsx`

- [ ] **Step 1: Tạo `components/SimulationPlayer.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useStoredSet } from "@/hooks/useStoredSet";

interface SimulationPlayerProps {
  slug: string;
  htmlPath: string;
  title: string;
}

export function SimulationPlayer({ slug, htmlPath, title }: SimulationPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { add } = useStoredSet("cloudviz:viewed");

  useEffect(() => {
    add(slug);
    // Chỉ cần chạy khi slug đổi; `add` là hàm ổn định theo storageKey cố định.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  async function toggleFullscreen() {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await wrapperRef.current.requestFullscreen();
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex flex-1 flex-col bg-slate-950">
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 backdrop-blur-sm transition hover:border-sky-500 hover:text-sky-300"
      >
        {isFullscreen ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9L4 4m0 0v4m0-4h4m7 5l5-5m0 0v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m7-5l5 5m0 0v-4m0 4h-4"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        )}
      </button>
      <iframe
        src={htmlPath}
        title={title}
        className="h-full w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
      />
    </div>
  );
}
```

- [ ] **Step 2: Xoá `components/SimulationFrame.tsx`**

File này bị thay thế hoàn toàn bởi `SimulationPlayer` (đã gồm cả iframe + fullscreen). Xoá để
tránh code chết.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: có thể báo lỗi tạm thời ở `app/s/[slug]/page.tsx` vì nó vẫn import `SimulationFrame` đã
xoá — đây là kỳ vọng, sẽ được sửa ở Task 5 và 6. Chỉ cần xác nhận `SimulationPlayer.tsx` và
`ViewedBadge.tsx`/`BookmarkButton.tsx` tự thân không có lỗi cú pháp (đọc lại file, không cần build
đầy đủ ở bước này).

---

## Task 5: Trang chi tiết — viết lại `app/s/[slug]/page.tsx` + `DetailActions`

**Files:**
- Create: `components/DetailActions.tsx`
- Modify (viết lại toàn bộ): `app/s/[slug]/page.tsx`

- [ ] **Step 1: Tạo `components/DetailActions.tsx`**

```tsx
"use client";

import { BookmarkButton } from "@/components/BookmarkButton";
import { ViewedBadge } from "@/components/ViewedBadge";

export function DetailActions({ slug }: { slug: string }) {
  return (
    <div className="flex items-center gap-3">
      <BookmarkButton slug={slug} size="lg" />
      <ViewedBadge slug={slug} size="lg" />
    </div>
  );
}
```

- [ ] **Step 2: Viết lại toàn bộ `app/s/[slug]/page.tsx` thành trang chi tiết**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DetailActions } from "@/components/DetailActions";
import { getAllSlugs, getSimulationBySlug } from "@/lib/catalog";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { CLOUD_BADGE_CLASSES, DIFFICULTY_BADGE_CLASSES } from "@/lib/badges";
import { SITE } from "@/lib/site";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);
  if (!simulation) return {};

  const url = `${SITE.url}/s/${simulation.slug}`;
  return {
    title: `${simulation.title} — CloudViz SA`,
    description: simulation.description,
    alternates: { canonical: url },
    openGraph: {
      title: simulation.title,
      description: simulation.description,
      url,
      siteName: SITE.name,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: simulation.title,
      description: simulation.description,
    },
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);

  if (!simulation) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-950 bg-grid">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="flex w-fit items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại thư viện
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
          >
            {CLOUD_LABELS[simulation.cloud]}
          </span>
          <span
            className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
          >
            {DIFFICULTY_LABELS[simulation.difficulty]}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white">{simulation.title}</h1>
        <p className="text-sm leading-relaxed text-slate-300">
          {simulation.longDescription ?? simulation.description}
        </p>

        <DetailActions slug={simulation.slug} />

        {simulation.objectives && simulation.objectives.length > 0 && (
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Mục tiêu học
            </h2>
            <ul className="flex flex-col gap-2">
              {simulation.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>
        )}

        {simulation.components && simulation.components.length > 0 && (
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Thành phần chính
            </h2>
            <dl className="flex flex-col gap-3">
              {simulation.components.map((component) => (
                <div key={component.name}>
                  <dt className="text-sm font-bold text-white">{component.name}</dt>
                  <dd className="text-xs leading-relaxed text-slate-400">{component.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="flex flex-wrap gap-1.5">
          {simulation.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-[10px] font-mono text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/s/${simulation.slug}/play`}
          className="flex w-fit items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Mở mô phỏng
        </Link>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: không lỗi ở `app/s/[slug]/page.tsx` và `components/DetailActions.tsx`. (Lỗi ở
`app/s/[slug]/play` — nếu route đó vẫn tồn tại từ trước — được xử lý ở Task 6.)

---

## Task 6: Trang chạy mới — `app/s/[slug]/play/page.tsx`

**Files:**
- Create: `app/s/[slug]/play/page.tsx`

- [ ] **Step 1: Tạo `app/s/[slug]/play/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SimulationPlayer } from "@/components/SimulationPlayer";
import { getAllSlugs, getSimulationBySlug } from "@/lib/catalog";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { CLOUD_BADGE_CLASSES, DIFFICULTY_BADGE_CLASSES } from "@/lib/badges";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);
  if (!simulation) return {};
  return {
    title: `${simulation.title} — Đang chạy — CloudViz SA`,
    description: simulation.description,
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);

  if (!simulation) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/s/${simulation.slug}`}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Chi tiết
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-white">{simulation.title}</h1>
            <div className="mt-0.5 flex gap-1.5">
              <span
                className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
              >
                {CLOUD_LABELS[simulation.cloud]}
              </span>
              <span
                className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
              >
                {DIFFICULTY_LABELS[simulation.difficulty]}
              </span>
            </div>
          </div>
        </div>

        <a
          href={simulation.htmlPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
        >
          Mở tab mới
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </header>

      <SimulationPlayer slug={simulation.slug} htmlPath={simulation.htmlPath} title={simulation.title} />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: không còn lỗi nào liên quan tới `SimulationFrame` hay route `/s/[slug]/play` nữa.

---

## Task 7: Gắn `BookmarkButton` + `ViewedBadge` vào `SimulationCard`

**Files:**
- Modify: `components/SimulationCard.tsx`

- [ ] **Step 1: Thêm import**

Trong `components/SimulationCard.tsx`, thêm sau các import hiện có:

```tsx
import { BookmarkButton } from "@/components/BookmarkButton";
import { ViewedBadge } from "@/components/ViewedBadge";
```

- [ ] **Step 2: Chèn 2 component vào trong khối thumbnail**

Thay khối thumbnail hiện tại:

```tsx
      <div
        className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${CLOUD_CARD_ACCENT[simulation.cloud]}`}
      >
        {simulation.thumbnail ? (
          <Image
            src={simulation.thumbnail}
            alt={simulation.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300/70">
            {CLOUD_LABELS[simulation.cloud]}
          </span>
        )}
      </div>
```

bằng:

```tsx
      <div
        className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${CLOUD_CARD_ACCENT[simulation.cloud]}`}
      >
        {simulation.thumbnail ? (
          <Image
            src={simulation.thumbnail}
            alt={simulation.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300/70">
            {CLOUD_LABELS[simulation.cloud]}
          </span>
        )}

        <div className="absolute right-2 top-2">
          <BookmarkButton slug={simulation.slug} />
        </div>

        <ViewedBadge slug={simulation.slug} className="absolute bottom-2 left-2" />
      </div>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: không lỗi type. (Component `SimulationCard` giờ chứa 2 client component con trong khi
bản thân nó vẫn có thể được render từ server component cha — hợp lệ trong App Router vì
`BookmarkButton`/`ViewedBadge` tự khai báo `"use client"`.)

---

## Task 8: Lọc gallery đồng bộ với URL query param

**Files:**
- Modify (viết lại toàn bộ): `components/GalleryClient.tsx`

- [ ] **Step 1: Viết lại toàn bộ `components/GalleryClient.tsx`**

```tsx
"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { SimulationCard } from "@/components/SimulationCard";
import type { FilterOptions } from "@/lib/catalog";
import type { Cloud, Difficulty, Domain, Simulation } from "@/lib/types";

interface GalleryClientProps {
  simulations: Simulation[];
  filterOptions: FilterOptions;
}

function readParam<T extends string>(value: string | null, allowed: readonly T[]): T | "all" {
  if (value && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return "all";
}

export function GalleryClient({ simulations, filterOptions }: GalleryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const cloud = readParam<Cloud>(searchParams.get("cloud"), filterOptions.clouds);
  const domain = readParam<Domain>(searchParams.get("domain"), filterOptions.domains);
  const difficulty = readParam<Difficulty>(searchParams.get("difficulty"), filterOptions.difficulties);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === "" || value === "all") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const queryString = next.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulations.filter((s) => {
      const matchQuery =
        q === "" ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      const matchCloud = cloud === "all" || s.cloud === cloud;
      const matchDomain = domain === "all" || s.domain === domain;
      const matchDifficulty = difficulty === "all" || s.difficulty === difficulty;
      return matchQuery && matchCloud && matchDomain && matchDifficulty;
    });
  }, [simulations, query, cloud, domain, difficulty]);

  return (
    <div id="gallery" className="flex flex-col gap-6">
      <FilterBar
        query={query}
        onQueryChange={(value) => updateParams({ q: value })}
        cloud={cloud}
        onCloudChange={(value) => updateParams({ cloud: value })}
        domain={domain}
        onDomainChange={(value) => updateParams({ domain: value })}
        difficulty={difficulty}
        onDifficultyChange={(value) => updateParams({ difficulty: value })}
        options={filterOptions}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 py-20 text-center text-slate-500">
          <p className="text-sm">Không tìm thấy mô phỏng phù hợp.</p>
          <p className="text-xs">Thử điều chỉnh từ khoá hoặc bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <SimulationCard key={s.slug} simulation={s} />
          ))}
        </div>
      )}
    </div>
  );
}
```

Lưu ý: `FilterBar.tsx` **không cần sửa** — chữ ký props không đổi (`Cloud | "all"` v.v.), chỉ khác
nguồn state (URL thay vì `useState` cục bộ).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: không lỗi type. (Route `/` sẽ cần bọc `<Suspense>` ở Task 9 trước khi build thành công,
vì `useSearchParams` bắt buộc có Suspense boundary phía trên trong App Router.)

---

## Task 9: Landing (hero + thống kê) — viết lại `app/page.tsx`

**Files:**
- Modify (viết lại toàn bộ): `app/page.tsx`

- [ ] **Step 1: Viết lại toàn bộ `app/page.tsx`**

```tsx
import { Suspense } from "react";
import { GalleryClient } from "@/components/GalleryClient";
import { getAllSimulations, getFilterOptions } from "@/lib/catalog";
import { CLOUD_LABELS } from "@/lib/types";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const simulations = getAllSimulations();
  const filterOptions = getFilterOptions();

  const stats = filterOptions.clouds.map((cloud) => ({
    cloud,
    count: simulations.filter((s) => s.cloud === cloud).length,
  }));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-950 bg-grid">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider text-white">{SITE.name}</h1>
            <p className="mt-0.5 text-xs text-slate-400">{SITE.description}</p>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-800 bg-slate-900/40 px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
          <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Tìm, xem và học hiểu kiến trúc Cloud qua mô phỏng tương tác
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400">
            Thư viện các mô phỏng trực quan giúp Solution Architect nắm rõ từng thành phần, luồng
            dữ liệu và cấu hình bên trong các kiến trúc AWS, Azure, GCP.
          </p>
          <a
            href="#gallery"
            className="flex w-fit items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
          >
            Khám phá thư viện ↓
          </a>

          {stats.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {stats.map(({ cloud, count }) => (
                <div key={cloud} className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs">
                  <span className="font-bold text-white">{CLOUD_LABELS[cloud]}</span>
                  <span className="ml-1.5 text-slate-500">· {count} mô phỏng</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>}>
          <GalleryClient simulations={simulations} filterOptions={filterOptions} />
        </Suspense>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build thành công (đây là lần đầu build lại toàn bộ kể từ đầu v2 — nếu có lỗi type/JSX
còn sót ở các task trước, sẽ lộ ra ở đây; sửa cho tới khi build sạch).

---

## Task 10: SEO — `layout.tsx`, `sitemap.ts`, `robots.ts`

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Cập nhật `app/layout.tsx`**

Thay khối `metadata` hiện tại:

```tsx
export const metadata: Metadata = {
  title: "CloudViz SA — Thư viện mô phỏng kiến trúc Cloud",
  description:
    "Thư viện mô phỏng tương tác các kiến trúc Solution Architect trên AWS, Azure, GCP — tìm, xem và học hiểu từng thành phần.",
};
```

bằng:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — Thư viện mô phỏng kiến trúc Cloud`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
  },
};
```

Và thêm import ở đầu file (cùng nhóm với `import "./globals.css";`):

```tsx
import { SITE } from "@/lib/site";
```

- [ ] **Step 2: Tạo `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { getAllSimulations } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const simulations = getAllSimulations();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const simulationEntries: MetadataRoute.Sitemap = simulations.flatMap((s) => [
    {
      url: `${SITE.url}/s/${s.slug}`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/s/${s.slug}/play`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]);

  return [...staticEntries, ...simulationEntries];
}
```

- [ ] **Step 3: Tạo `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build thành công, log liệt kê thêm route tĩnh `/sitemap.xml` và `/robots.txt`.

---

## Task 11: Cập nhật docs + verify tổng thể cuối cùng

**Files:**
- Modify: `docs/06-quy-trinh-them-mo-phong.md`
- Modify: `docs/README.md` (đã có mục 08 từ bước brainstorming, kiểm tra lại)

- [ ] **Step 1: Thêm ghi chú 3 trường optional mới vào `docs/06-quy-trinh-them-mo-phong.md`**

Trong phần "Các bước" → bước 3 (khai báo manifest), thêm đoạn sau ngay sau khối ví dụ code hiện có:

```markdown
> Có thể bổ sung thêm (tuỳ chọn, cho trang chi tiết phong phú hơn): `longDescription` (mô tả dài),
> `objectives` (mảng mục tiêu học), `components` (mảng `{ name, description }` các thành phần
> chính). Nếu bỏ trống, trang chi tiết tự ẩn các mục tương ứng.
```

- [ ] **Step 2: Build & lint toàn bộ**

Run: `npm run build`
Expected: `prebuild` chạy `npm run validate` trước, in `✅ Manifest hợp lệ...`, sau đó build
thành công, liệt kê các route: `/`, `/_not-found`, `/s/[slug]` (2 route: detail + play cho
`aws-direct-connect`), `/sitemap.xml`, `/robots.txt`.

Run: `npm run lint`
Expected: không có lỗi.

- [ ] **Step 3: Verify thủ công bằng production server**

```bash
npm run start -- -p 3412
```

Trong một shell khác:

```bash
curl -s -o /dev/null -w "home: %{http_code}\n" http://localhost:3412/
curl -s -o /dev/null -w "detail: %{http_code}\n" http://localhost:3412/s/aws-direct-connect
curl -s -o /dev/null -w "play: %{http_code}\n" http://localhost:3412/s/aws-direct-connect/play
curl -s -o /dev/null -w "sitemap: %{http_code}\n" http://localhost:3412/sitemap.xml
curl -s -o /dev/null -w "robots: %{http_code}\n" http://localhost:3412/robots.txt
curl -s -o /dev/null -w "filtered: %{http_code}\n" "http://localhost:3412/?cloud=aws&q=bgp"
curl -s -o /dev/null -w "notfound: %{http_code}\n" http://localhost:3412/s/khong-ton-tai
```

Expected: tất cả trả `200` trừ `notfound` trả `404`. Dừng server sau khi xong.

- [ ] **Step 4: Kiểm tra thủ công bằng trình duyệt (khuyến nghị, không bắt buộc để hoàn thành task)**

Mở `http://localhost:3412/`, xác nhận: hero + thống kê hiển thị, gallery lọc được và URL cập nhật
query param, bấm card → trang chi tiết → "Mở mô phỏng" → trang player chạy iframe đúng, nút
fullscreen hoạt động, quay lại gallery thấy card có dấu "Đã xem", bấm icon bookmark trên card giữ
trạng thái sau khi reload trang.

---

## Tổng kết file thay đổi

**Tạo mới:** `lib/site.ts`, `hooks/useStoredSet.ts`, `scripts/validate-manifest.ts`,
`components/BookmarkButton.tsx`, `components/ViewedBadge.tsx`, `components/SimulationPlayer.tsx`,
`components/DetailActions.tsx`, `app/s/[slug]/play/page.tsx`, `app/sitemap.ts`, `app/robots.ts`.

**Sửa:** `lib/types.ts`, `data/simulations.ts`, `package.json`, `app/s/[slug]/page.tsx`,
`components/SimulationCard.tsx`, `components/GalleryClient.tsx`, `app/page.tsx`, `app/layout.tsx`,
`docs/06-quy-trinh-them-mo-phong.md`.

**Xoá:** `components/SimulationFrame.tsx`.

**Không đổi:** `components/FilterBar.tsx`, `lib/catalog.ts`, `lib/badges.ts`.
