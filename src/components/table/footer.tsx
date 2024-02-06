import { Button } from "@/components/ui/button";
import { useFooterText } from "@/lib/table";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TableFooter<T>({
  data,
  table,
}: Readonly<{
  data: T[];
  table: Table<T>;
}>) {
  const footerRowMessage = useFooterText(data, table);
  return (
    <div className="flex justify-end items-center gap-2 mt-2">
      <p className="inline-block text-sm">{footerRowMessage}</p>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
