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
