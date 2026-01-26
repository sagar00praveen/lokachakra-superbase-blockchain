-- 1. Add summary column to candidates for quick reference
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS assigned_assets_summary JSONB DEFAULT '[]'::jsonb;

-- 2. Drop the dangerous foreign key that deletes assets
ALTER TABLE assets 
DROP CONSTRAINT IF EXISTS assets_assigned_to_fkey;

-- 3. Add the safe foreign key (Set Null on delete)
ALTER TABLE assets
ADD CONSTRAINT assets_assigned_to_fkey
FOREIGN KEY (assigned_to)
REFERENCES candidates(id)
ON DELETE SET NULL;

-- 4. Re-seed Assets (Wipe and Restore)
TRUNCATE TABLE assets;

INSERT INTO assets (name, type, serial_number, status, specs) VALUES 
('MacBook Pro M3', 'Laptop', 'MBP-2024-001', 'Available', '{"ram": "16GB", "storage": "512GB", "processor": "M3 Pro"}'),
('MacBook Pro M3', 'Laptop', 'MBP-2024-002', 'Available', '{"ram": "16GB", "storage": "512GB", "processor": "M3 Pro"}'),
('Dell XPS 15', 'Laptop', 'DELL-2024-X01', 'Available', '{"ram": "32GB", "storage": "1TB", "processor": "i9"}'),
('Dell XPS 13', 'Laptop', 'DELL-2024-X02', 'Available', '{"ram": "16GB", "storage": "512GB", "processor": "i7"}'),
('ThinkPad X1 Carbon', 'Laptop', 'LEN-2024-T01', 'Available', '{"ram": "16GB", "storage": "512GB", "processor": "i7"}'),

('Dell UltraSharp 27', 'Monitor', 'MON-U27-001', 'Available', '{"resolution": "4K", "size": "27 inch"}'),
('Dell UltraSharp 27', 'Monitor', 'MON-U27-002', 'Available', '{"resolution": "4K", "size": "27 inch"}'),
('LG UltraFine 5K', 'Monitor', 'MON-LG5-001', 'Available', '{"resolution": "5K", "size": "27 inch"}'),
('BenQ Designer', 'Monitor', 'MON-BQ-001', 'Available', '{"resolution": "2K", "size": "32 inch"}'),

('iPhone 15', 'Mobile', 'MOB-IP15-001', 'Available', '{"color": "Black", "storage": "128GB"}'),
('iPhone 15', 'Mobile', 'MOB-IP15-002', 'Available', '{"color": "Blue", "storage": "128GB"}'),
('Samsung S24', 'Mobile', 'MOB-S24-001', 'Available', '{"color": "Titanium", "storage": "256GB"}'),
('Google Pixel 8', 'Mobile', 'MOB-PX8-001', 'Available', '{"color": "Hazel", "storage": "128GB"}'),

('Logitech MX Master 3S', 'Peripheral', 'PER-MSE-001', 'Available', '{"type": "Mouse", "color": "Graphite"}'),
('Apple Magic Keyboard', 'Peripheral', 'PER-KBD-001', 'Available', '{"type": "Keyboard", "layout": "US"}'),
('Sony WH-1000XM5', 'Peripheral', 'PER-AUD-001', 'Available', '{"type": "Headphones", "color": "Black"}');
