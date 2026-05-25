-- Dev seed data (run after migrations)
-- Note: in production use Supabase dashboard to create auth users;
-- this seed assumes UUIDs are pre-created for testing.

-- Sample asset cache rows for dev
insert into asset_cache (asset_type, symbol, time_range, data_points, source) values
('crypto', 'BTC', '5y', '[
  {"date":"2020-01-01","value":7195,"pct_change":0},
  {"date":"2021-01-01","value":29374,"pct_change":308},
  {"date":"2022-01-01","value":47733,"pct_change":563},
  {"date":"2023-01-01","value":16548,"pct_change":130},
  {"date":"2024-01-01","value":42283,"pct_change":487},
  {"date":"2025-01-01","value":94000,"pct_change":1206},
  {"date":"2026-01-01","value":105000,"pct_change":1359}
]', 'seed'),
('stock', '^GSPC', '5y', '[
  {"date":"2020-01-01","value":3257,"pct_change":0},
  {"date":"2021-01-01","value":3756,"pct_change":15},
  {"date":"2022-01-01","value":4797,"pct_change":47},
  {"date":"2023-01-01","value":3840,"pct_change":18},
  {"date":"2024-01-01","value":4770,"pct_change":46},
  {"date":"2025-01-01","value":5882,"pct_change":80},
  {"date":"2026-01-01","value":6100,"pct_change":87}
]', 'seed'),
('real_estate', 'RE_UK', '5y', '[
  {"date":"2020-01-01","value":230000,"pct_change":0},
  {"date":"2021-01-01","value":252000,"pct_change":10},
  {"date":"2022-01-01","value":276000,"pct_change":20},
  {"date":"2023-01-01","value":290000,"pct_change":26},
  {"date":"2024-01-01","value":285000,"pct_change":24},
  {"date":"2025-01-01","value":295000,"pct_change":28},
  {"date":"2026-01-01","value":310000,"pct_change":35}
]', 'seed')
on conflict (symbol, time_range) do nothing;
