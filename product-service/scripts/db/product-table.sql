create extension "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	summary text,
	author text,
	pages integer,
	published text,
	price real,
	image text
);

create table stock (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);