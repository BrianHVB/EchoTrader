SELECT a.column_name, b.constraint_name
FROM information_schema.columns AS a
  FULL OUTER JOIN information_schema.key_column_usage b
  ON a.column_name = b.column_name
  WHERE a.table_name = 'gdax_basic'
        AND (b.constraint_name IS NULL OR b.constraint_name NOT LIKE '%pkey%')
ORDER BY column_name ASC;