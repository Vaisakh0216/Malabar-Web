import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { CustomRequest, Order } from "./types";

// File-backed storage for the prototype. Swap for the Supabase tables in supabase/schema.sql before launch.
const dataDir = path.join(process.cwd(), "data");

async function readAll<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, file), "utf8")) as T[];
  } catch {
    return [];
  }
}

async function writeAll<T>(file: string, rows: T[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, file), JSON.stringify(rows, null, 2));
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export const listOrders = () => readAll<Order>("orders.json");
export const listCustomRequests = () => readAll<CustomRequest>("custom-requests.json");

export async function getOrder(id: string) {
  return (await listOrders()).find((o) => o.id === id);
}

export async function saveOrder(order: Order) {
  const orders = await listOrders();
  await writeAll("orders.json", [order, ...orders.filter((o) => o.id !== order.id)]);
}

export async function saveCustomRequest(req: CustomRequest) {
  const rows = await listCustomRequests();
  await writeAll("custom-requests.json", [req, ...rows.filter((r) => r.id !== req.id)]);
}
