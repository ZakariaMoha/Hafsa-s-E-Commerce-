export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  orderId: string;
  name: string;
  phone: string;
  location: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status?: string;
  notes?: string;
  createdAt: string;
};

const SHEET_WEBHOOK = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK;

export async function appendOrderToSheet(order: Order) {
  if (!SHEET_WEBHOOK) {
    console.warn('VITE_GOOGLE_SHEET_WEBHOOK not configured, skipping sheet append');
    return null;
  }

  try {
    const res = await fetch(SHEET_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'appendOrder', order }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error appending order to sheet', err);
    return null;
  }
}

export async function fetchOrdersFromSheet(): Promise<Order[]> {
  if (!SHEET_WEBHOOK) {
    console.warn('VITE_GOOGLE_SHEET_WEBHOOK not configured, cannot fetch orders');
    return [];
  }

  try {
    const url = new URL(SHEET_WEBHOOK);
    url.searchParams.set('action', 'getOrders');
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders ?? [];
  } catch (err) {
    console.error('Error fetching orders from sheet', err);
    return [];
  }
}
