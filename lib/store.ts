import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CustomRequest, Order } from "./types";

// Orders and custom requests live in Supabase (tables in supabase/schema.sql).
// Without Supabase settings, local development falls back to JSON files in data/.

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;
function db() {
  if (!supabaseUrl || !serviceKey) return null;
  client ??= createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  return client;
}

type OrderRow = {
  id: string;
  created_at: string;
  customer: Order["customer"];
  lines: Order["lines"];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment: Order["payment"];
  payment_status: Order["paymentStatus"];
  status: Order["status"];
  delivery_promise: string;
};

type CustomRequestRow = {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  boutique: string;
  name: string;
  phone: string;
  measurements: string;
  notes: string;
  status: CustomRequest["status"];
};

const toOrder = (r: OrderRow): Order => ({
  id: r.id,
  createdAt: r.created_at,
  customer: r.customer,
  lines: r.lines,
  subtotal: r.subtotal,
  deliveryFee: r.delivery_fee,
  total: r.total,
  payment: r.payment,
  paymentStatus: r.payment_status,
  status: r.status,
  deliveryPromise: r.delivery_promise,
});

const fromOrder = (o: Order): OrderRow => ({
  id: o.id,
  created_at: o.createdAt,
  customer: o.customer,
  lines: o.lines,
  subtotal: o.subtotal,
  delivery_fee: o.deliveryFee,
  total: o.total,
  payment: o.payment,
  payment_status: o.paymentStatus,
  status: o.status,
  delivery_promise: o.deliveryPromise,
});

const toRequest = (r: CustomRequestRow): CustomRequest => ({
  id: r.id,
  createdAt: r.created_at,
  productId: r.product_id,
  productName: r.product_name,
  boutique: r.boutique,
  name: r.name,
  phone: r.phone,
  measurements: r.measurements,
  notes: r.notes,
  status: r.status,
});

const fromRequest = (r: CustomRequest): CustomRequestRow => ({
  id: r.id,
  created_at: r.createdAt,
  product_id: r.productId,
  product_name: r.productName,
  boutique: r.boutique,
  name: r.name,
  phone: r.phone,
  measurements: r.measurements,
  notes: r.notes,
  status: r.status,
});

const dataDir = path.join(process.cwd(), "data");

async function readFile<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, file), "utf8")) as T[];
  } catch {
    return [];
  }
}

async function writeFile<T>(file: string, rows: T[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, file), JSON.stringify(rows, null, 2));
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export async function listOrders(): Promise<Order[]> {
  const supabase = db();
  if (!supabase) return readFile<Order>("orders.json");
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(`Could not load orders: ${error.message}`);
  return (data as OrderRow[]).map(toOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const supabase = db();
  if (!supabase) return (await readFile<Order>("orders.json")).find((o) => o.id === id);
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load order: ${error.message}`);
  return data ? toOrder(data as OrderRow) : undefined;
}

export async function saveOrder(order: Order) {
  const supabase = db();
  if (!supabase) {
    const orders = await readFile<Order>("orders.json");
    return writeFile("orders.json", [order, ...orders.filter((o) => o.id !== order.id)]);
  }
  const { error } = await supabase.from("orders").upsert(fromOrder(order));
  if (error) throw new Error(`Could not save order: ${error.message}`);
}

export async function listCustomRequests(): Promise<CustomRequest[]> {
  const supabase = db();
  if (!supabase) return readFile<CustomRequest>("custom-requests.json");
  const { data, error } = await supabase.from("custom_requests").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(`Could not load custom requests: ${error.message}`);
  return (data as CustomRequestRow[]).map(toRequest);
}

export async function saveCustomRequest(req: CustomRequest) {
  const supabase = db();
  if (!supabase) {
    const rows = await readFile<CustomRequest>("custom-requests.json");
    return writeFile("custom-requests.json", [req, ...rows.filter((r) => r.id !== req.id)]);
  }
  const { error } = await supabase.from("custom_requests").upsert(fromRequest(req));
  if (error) throw new Error(`Could not save custom request: ${error.message}`);
}
