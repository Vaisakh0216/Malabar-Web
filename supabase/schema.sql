-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- The site reads and writes these tables from the server with the service role key,
-- so row level security stays on with no public policies: browsers cannot read them directly.

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer jsonb not null,
  lines jsonb not null,
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  payment text not null check (payment in ('cod', 'online')),
  payment_status text not null check (payment_status in ('cod_pending', 'awaiting_payment', 'paid')),
  status text not null check (status in ('placed', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned')),
  delivery_promise text not null
);

create table if not exists public.custom_requests (
  id text primary key,
  created_at timestamptz not null default now(),
  product_id text not null,
  product_name text not null,
  boutique text not null,
  name text not null,
  phone text not null,
  measurements text not null default '',
  notes text not null,
  status text not null check (status in ('new', 'quoted', 'paid', 'in_progress', 'delivered', 'declined'))
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists custom_requests_created_at_idx on public.custom_requests (created_at desc);

alter table public.orders enable row level security;
alter table public.custom_requests enable row level security;
