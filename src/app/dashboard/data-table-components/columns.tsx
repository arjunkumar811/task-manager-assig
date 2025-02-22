"use client";

import { ColumnDef } from "@tanstack/react-table"; // Ensure this package is installed
import { TrendingUp, TrendingDown, FilePenLine, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Expense } from "./schema";
import { Task } from "@/db/schema";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toggleTask } from "@/actions/taskActions";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { DeleteTaskDialog } from "@/components/delete-tasks-dialog";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("title")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const rawDescription = row.getValue("description");

      // Check if Description is coming from data
      const isDescriptionTrue =
        typeof rawDescription === "string" && rawDescription.trim();

      return (
        <div className="flex space-x-2">
          <span
            className={cn("max-w-[400px] truncate font-medium capitalize", {
              "font-normal text-muted-foreground": !isDescriptionTrue,
            })}
          >
            {isDescriptionTrue ? rawDescription : "no description"}
          </span>
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const [isToggleTaskPending, setToggleTaskTransition] = useTransition();

      async function handleToggleTask() {
        setToggleTaskTransition(async () => {
          try {
            const currentCompletedStatus = row.getValue("completed");
            await toggleTask(row.original.id);

            if (currentCompletedStatus) {
              toast.success("Task marked as not completed.");
            } else {
              toast.success("Task marked as completed.");
            }
          } catch (error) {
            toast.error("Failed to toggle task status.");
          }
        });
      }

      return (
        <Switch
          checked={row.getValue("completed")}
          onCheckedChange={handleToggleTask}
          aria-label="Toggle task completion"
        />
      );
    },
    enableHiding: true,
  },
];
