-- WendHart Demo RV — Phase 1 seed data
-- Run this AFTER schema.sql, also via Supabase Dashboard > SQL Editor.
-- Creates 6 fictional units with placeholder photos so the site looks alive.
-- Safe to re-run: clears existing seed rows first (matched by vin).

delete from unit_photos where unit_id in (
  select id from units where vin in (
    '1FD8W3HT5JEA00001','4YDF3CH28GJ400002','1F65F5DY0CFA00003',
    '4X4TWDB29KA000004','1UJBJ02R0X1400005','1FDFE4FS8ME000006'
  )
);
delete from units where vin in (
  '1FD8W3HT5JEA00001','4YDF3CH28GJ400002','1F65F5DY0CFA00003',
  '4X4TWDB29KA000004','1UJBJ02R0X1400005','1FDFE4FS8ME000006'
);

insert into units (vin, category, rv_type, year, make, model, price_cents, status, condition_notes, specs)
values
  (
    '1FD8W3HT5JEA00001', 'rv', 'travel_trailer', 2018, 'Forest River', 'Wildwood 27RE',
    1850000, 'available',
    'Clean, one-owner trailer. Minor scuff on rear bumper, roof inspected and resealed this spring. Awning in good shape, no soft spots on the floor.',
    '{"length_ft": 32, "weight_lbs": 6200, "sleeps": 6, "slides": 1, "generator": false, "fresh_tank_gal": 50, "gray_tank_gal": 39, "black_tank_gal": 39}'
  ),
  (
    '4YDF3CH28GJ400002', 'rv', 'fifth_wheel', 2016, 'Keystone', 'Montana 3791RD',
    3490000, 'available',
    'Traded in with low hours. Interior shows light wear consistent with age. New tires installed before listing. Slide seals recently replaced.',
    '{"length_ft": 40, "weight_lbs": 12900, "sleeps": 4, "slides": 3, "generator": false, "fresh_tank_gal": 78, "gray_tank_gal": 76, "black_tank_gal": 40}'
  ),
  (
    '1F65F5DY0CFA00003', 'rv', 'motorhome', 2012, 'Fleetwood', 'Bounder 36H',
    4200000, 'available',
    'Class A motorhome, Ford V10 chassis. Runs and drives great, generator serviced last month. Some fading on exterior decals, interior upholstery shows normal wear.',
    '{"length_ft": 36, "weight_lbs": 22000, "sleeps": 8, "slides": 2, "generator": true, "fresh_tank_gal": 80, "gray_tank_gal": 60, "black_tank_gal": 40}'
  ),
  (
    '4X4TWDB29KA000004', 'rv', 'toy_hauler', 2019, 'Forest River', 'Cherokee Wolf Pack 25',
    2775000, 'available',
    'Toy hauler with 8ft garage, ramp door in solid working order. Fuel station intact and unused. Light scratches on garage walls from prior gear.',
    '{"length_ft": 30, "weight_lbs": 8400, "sleeps": 6, "slides": 1, "generator": false, "fresh_tank_gal": 45, "gray_tank_gal": 30, "black_tank_gal": 30}'
  ),
  (
    '1UJBJ02R0X1400005', 'rv', 'travel_trailer', 2009, 'Jayco', 'Jay Flight 26BH',
    890000, 'available',
    'Budget-friendly unit priced to move. Evidence of a past minor roof leak near the front cap, since repaired, buyer should still inspect before long trips. Bunkhouse layout in good usable condition.',
    '{"length_ft": 29, "weight_lbs": 5600, "sleeps": 8, "slides": 1, "generator": false, "fresh_tank_gal": 40, "gray_tank_gal": 30, "black_tank_gal": 30}'
  ),
  (
    '1FDFE4FS8ME000006', 'rv', 'motorhome', 2021, 'Thor Motor Coach', 'Four Winds 31E',
    5400000, 'available',
    'Newest unit on the lot, still under factory structural warranty. Barely used — garage kept, less than 9,000 miles. Like-new condition throughout.',
    '{"length_ft": 33, "weight_lbs": 14500, "sleeps": 7, "slides": 1, "generator": true, "fresh_tank_gal": 43, "gray_tank_gal": 39, "black_tank_gal": 39}'
  );

insert into unit_photos (unit_id, url, sort_order, is_primary)
select u.id, p.url, p.sort_order, p.is_primary
from units u
join (values
  ('1FD8W3HT5JEA00001', 'https://images.pexels.com/photos/3927311/pexels-photo-3927311.jpeg?auto=compress&cs=tinysrgb&w=1200', 0, true),
  ('1FD8W3HT5JEA00001', 'https://images.pexels.com/photos/36444011/pexels-photo-36444011.jpeg?auto=compress&cs=tinysrgb&w=1200', 1, false),
  ('4YDF3CH28GJ400002', 'https://images.pexels.com/photos/16763286/pexels-photo-16763286.jpeg?auto=compress&cs=tinysrgb&w=1200', 0, true),
  ('4YDF3CH28GJ400002', 'https://images.pexels.com/photos/16763335/pexels-photo-16763335.jpeg?auto=compress&cs=tinysrgb&w=1200', 1, false),
  ('1F65F5DY0CFA00003', 'https://images.pexels.com/photos/2962089/pexels-photo-2962089.jpeg?auto=compress&cs=tinysrgb&w=1200', 0, true),
  ('1F65F5DY0CFA00003', 'https://images.pexels.com/photos/3560366/pexels-photo-3560366.jpeg?auto=compress&cs=tinysrgb&w=1200', 1, false),
  ('4X4TWDB29KA000004', 'https://images.pexels.com/photos/38021445/pexels-photo-38021445.jpeg?auto=compress&cs=tinysrgb&w=1200', 0, true),
  ('4X4TWDB29KA000004', 'https://images.pexels.com/photos/7967365/pexels-photo-7967365.jpeg?auto=compress&cs=tinysrgb&w=1200', 1, false),
  ('1UJBJ02R0X1400005', 'https://images.pexels.com/photos/34613381/pexels-photo-34613381.jpeg?auto=compress&cs=tinysrgb&w=1200', 0, true),
  ('1FDFE4FS8ME000006', 'https://images.pexels.com/photos/15422191/pexels-photo-15422191.jpeg?auto=compress&cs=tinysrgb&w=1200', 0, true),
  ('1FDFE4FS8ME000006', 'https://images.pexels.com/photos/15422157/pexels-photo-15422157.jpeg?auto=compress&cs=tinysrgb&w=1200', 1, false)
) as p(vin, url, sort_order, is_primary) on u.vin = p.vin;
