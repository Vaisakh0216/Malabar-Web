// Brand name and contact details are placeholders until the open decisions in the plan are made.
export const SITE_NAME = "Malabar Closet";
export const SITE_TAGLINE = "Calicut's boutiques, delivered today";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

// Orders placed before this hour (IST, 24h) are delivered the same day.
export const SAME_DAY_CUTOFF_HOUR = 16;
export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_ABOVE = 999;
export const RETURN_WINDOW_HOURS = 24;

// Kozhikode city pincodes served for same-day delivery. Verify with the delivery partner before launch.
export const SERVICEABLE_PINCODES = [
  "673001", "673002", "673003", "673004", "673005", "673006", "673007", "673008", "673009", "673010",
  "673011", "673012", "673014", "673016", "673017", "673018", "673019", "673020", "673032",
];

// Required on Indian e-commerce sites (Consumer Protection (E-Commerce) Rules, 2020). Fill in before launch.
export const GRIEVANCE_OFFICER = {
  name: "To be appointed",
  email: "grievance@example.com",
  phone: "+91 00000 00000",
};

export function isServiceable(pincode: string) {
  return SERVICEABLE_PINCODES.includes(pincode.trim());
}

export function deliveryPromise(now = new Date()) {
  const istHour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(now),
  );
  return istHour < SAME_DAY_CUTOFF_HOUR ? "Delivered today by 9 pm" : "Delivered tomorrow by 1 pm";
}

export function deliveryFee(subtotal: number) {
  return subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
