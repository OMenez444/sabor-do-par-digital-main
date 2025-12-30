-- CRIAÇÃO DAS TABELAS --

-- 1. Produtos (Para cardápio compartilhado)
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Mesas
create table tables (
  id uuid default gen_random_uuid() primary key,
  number text not null unique,
  qr_url text,
  status text default 'available', -- available, occupied, etc
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Pedidos
create table orders (
  id uuid default gen_random_uuid() primary key,
  table_number text, -- Pode ser null se for balcão ou delivery
  customer_name text,
  customer_phone text,
  customer_address text,
  total numeric not null,
  status text default 'pending', -- pending, preparing, ready, delivered, canceled
  items jsonb not null, -- Guardando itens como JSON para simplificar transição
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- POLÍTICAS DE SEGURANÇA (RLS) --
-- Para este MVP, vamos permitir acesso público (ANON).
-- Em produção real, você deve restringir isso.

alter table products enable row level security;
alter table tables enable row level security;
alter table orders enable row level security;

-- Permitir leitura/escrita pública para products
create policy "Public read products" on products for select using (true);
create policy "Public insert products" on products for insert with check (true);
create policy "Public update products" on products for update using (true);
create policy "Public delete products" on products for delete using (true);

-- Permitir leitura/escrita pública para tables
create policy "Public read tables" on tables for select using (true);
create policy "Public insert tables" on tables for insert with check (true);
create policy "Public update tables" on tables for update using (true);
create policy "Public delete tables" on tables for delete using (true);

-- Permitir leitura/escrita pública para orders
create policy "Public read orders" on orders for select using (true);
create policy "Public insert orders" on orders for insert with check (true);
create policy "Public update orders" on orders for update using (true);
create policy "Public delete orders" on orders for delete using (true);

-- HABILITAR REALTIME --
-- Necessário para a cozinha ver pedidos chegando na hora
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table tables;
