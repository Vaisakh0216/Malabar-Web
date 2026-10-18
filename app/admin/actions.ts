"use server";

import { revalidatePath } from "next/cache";
import { listCustomRequests, listOrders, saveCustomRequest, saveOrder } from "@/lib/store";
import type { CustomRequest, Order } from "@/lib/types";

const orderStatuses: Order["status"][] = ["placed", "confirmed", "out_for_delivery", "delivered", "cancelled", "return_requested", "returned"];
const requestStatuses: CustomRequest["status"][] = ["new", "quoted", "paid", "in_progress", "delivered", "declined"];

export async function setOrderStatus(form: FormData) {
  const id = String(form.get("id"));
  const status = String(form.get("status")) as Order["status"];
  if (!orderStatuses.includes(status)) return;
  const order = (await listOrders()).find((o) => o.id === id);
  if (!order) return;
  const paid = form.get("paid") === "on";
  await saveOrder({ ...order, status, paymentStatus: paid ? "paid" : order.paymentStatus });
  revalidatePath("/admin");
}

export async function setRequestStatus(form: FormData) {
  const id = String(form.get("id"));
  const status = String(form.get("status")) as CustomRequest["status"];
  if (!requestStatuses.includes(status)) return;
  const request = (await listCustomRequests()).find((r) => r.id === id);
  if (!request) return;
  await saveCustomRequest({ ...request, status });
  revalidatePath("/admin");
}
