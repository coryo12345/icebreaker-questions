import { Table } from "@tanstack/react-table";
import { useMemo } from "react";

export function useFooterText<T>(data: T[], table: Table<T>): string {
  return useMemo<string>(() => {
    let { minRow, maxRow } = table.getPaginationRowModel().flatRows.reduce(
      (prev, curr) => {
        return {
          minRow: Math.min(curr.index + 1, prev.minRow),
          maxRow: Math.max(curr.index + 1, prev.maxRow),
        };
      },
      { minRow: Number.MAX_SAFE_INTEGER, maxRow: 0 }
    );
    if (data.length === 0) {
      minRow = 0;
      maxRow = 0;
    }
    return `Showing rows ${minRow}-${maxRow} of ${data.length}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, table.getPaginationRowModel(), data.length]);
}
