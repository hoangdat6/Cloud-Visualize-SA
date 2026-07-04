"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Quản lý một tập hợp chuỗi lưu trong localStorage (ví dụ: bookmark, đã xem).
 * State khởi tạo rỗng để khớp với SSR; giá trị thật được nạp trong useEffect
 * và báo qua cờ `hydrated` để tránh hydration mismatch.
 */
interface StoredState {
  values: Set<string>;
  hydrated: boolean;
}

export function useStoredSet(storageKey: string) {
  const [state, setState] = useState<StoredState>({ values: new Set(), hydrated: false });
  const { values, hydrated } = state;

  useEffect(() => {
    // Đọc localStorage là đồng bộ hoá với một hệ thống bên ngoài (browser storage) không có
    // sẵn lúc SSR — bắt buộc phải cập nhật state trong effect này để tránh hydration mismatch,
    // gộp thành một lần setState để không gây render nối tiếp không cần thiết.
    let nextValues = new Set<string>();
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          nextValues = new Set(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    } catch {
      // localStorage không khả dụng (private mode...) — giữ Set rỗng.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nạp trạng thái từ localStorage lúc mount, không có cách nào khác để hydrate an toàn.
    setState({ values: nextValues, hydrated: true });
  }, [storageKey]);

  const persist = useCallback(
    (next: Set<string>) => {
      setState({ values: next, hydrated: true });
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
