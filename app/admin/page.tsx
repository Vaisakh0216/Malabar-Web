import { boutiques, getProduct } from "@/lib/catalog";
import { formatINR } from "@/lib/config";
import { listCustomRequests, listOrders } from "@/lib/store";
import { setOrderStatus, setRequestStatus } from "./actions";

export const dynamic = "force-dynamic";

const orderStatuses = ["placed", "confirmed", "out_for_delivery", "delivered", "cancelled", "return_requested", "returned"];
const requestStatuses = ["new", "quoted", "paid", "in_progress", "delivered", "declined"];

export default async function AdminPage() {
  const [orders, requests] = await Promise.all([listOrders(), listCustomRequests()]);

  // Commission is earned on delivered orders that were not returned or cancelled.
  const payouts = boutiques.map((b) => {
    const sales = orders
      .filter((o) => o.status === "delivered")
      .flatMap((o) => o.lines)
      .filter((l) => getProduct(l.productId)?.boutique === b.slug)
      .reduce((sum, l) => sum + l.price * l.qty, 0);
    const commission = Math.round((sales * b.commissionPct) / 100);
    return { boutique: b, sales, commission, payout: sales - commission };
  });

  return (
    <div className="space-y-10 pt-6 text-sm">
      <h1 className="text-2xl font-bold">Admin</h1>

      <section>
        <h2 className="mb-3 text-lg font-bold">Orders ({orders.length})</h2>
        <div className="overflow-x-auto rounded-lg bg-white">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t align-top">
                  <td className="p-3">
                    <p className="font-mono text-xs">{o.id}</p>
                    <p className="text-xs text-neutral-500">{new Date(o.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                  </td>
                  <td className="p-3">
                    <p>{o.customer.name}</p>
                    <p className="text-xs text-neutral-500">
                      {o.customer.phone} · {o.customer.pincode}
                    </p>
                    <p className="text-xs text-neutral-500">{o.customer.address}</p>
                  </td>
                  <td className="p-3">
                    {o.lines.map((l) => (
                      <p key={`${l.productId}-${l.size}`}>
                        {l.qty} × {l.name} ({l.size}) <span className="text-neutral-500">· {l.boutique}</span>
                      </p>
                    ))}
                  </td>
                  <td className="p-3 font-semibold">{formatINR(o.total)}</td>
                  <td className="p-3">
                    {o.payment === "cod" ? "COD" : "Online"}
                    <p className="text-xs text-neutral-500">{o.paymentStatus.replace("_", " ")}</p>
                  </td>
                  <td className="p-3">
                    <form action={setOrderStatus} className="space-y-1">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} className="rounded border px-2 py-1">
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                      {o.paymentStatus !== "paid" && (
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" name="paid" /> mark paid
                        </label>
                      )}
                      <button className="rounded bg-neutral-900 px-2 py-1 text-xs text-white">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-neutral-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Custom design requests ({requests.length})</h2>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="grid gap-3 rounded-lg bg-white p-4 sm:grid-cols-[1fr_200px]">
              <div>
                <p className="font-semibold">
                  {r.productName} <span className="font-normal text-neutral-500">· {r.boutique}</span>
                </p>
                <p className="text-xs text-neutral-500">
                  {r.id} · {r.name} · {r.phone}
                </p>
                {r.measurements && <p className="mt-1">Measurements: {r.measurements}</p>}
                <p className="mt-1">{r.notes}</p>
              </div>
              <form action={setRequestStatus} className="flex items-start gap-2">
                <input type="hidden" name="id" value={r.id} />
                <select name="status" defaultValue={r.status} className="rounded border px-2 py-1">
                  {requestStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button className="rounded bg-neutral-900 px-2 py-1 text-xs text-white">Save</button>
              </form>
            </div>
          ))}
          {!requests.length && <p className="text-neutral-500">No requests yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Boutique payouts (delivered orders)</h2>
        <div className="overflow-x-auto rounded-lg bg-white">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-3">Boutique</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Sales</th>
                <th className="p-3">Our commission</th>
                <th className="p-3">Pay boutique</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.boutique.slug} className="border-t">
                  <td className="p-3">{p.boutique.name}</td>
                  <td className="p-3">{p.boutique.commissionPct}%</td>
                  <td className="p-3">{formatINR(p.sales)}</td>
                  <td className="p-3">{formatINR(p.commission)}</td>
                  <td className="p-3 font-semibold">{formatINR(p.payout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
