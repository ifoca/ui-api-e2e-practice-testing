-- Fails (returns rows) if any calculation produced a negative emission value.
-- A negative co2e is physically impossible and signals a formula error.
SELECT
  calculation_id,
  co2e_value,
  fuel_type
FROM emissions_calculations
WHERE co2e_value < 0;