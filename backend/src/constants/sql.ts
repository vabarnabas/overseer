export const getTablesAndColumnsQuery = `SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public');
`;
