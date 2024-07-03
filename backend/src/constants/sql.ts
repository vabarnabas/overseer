export const getTablesAndColumnsQueryPostgreSQL = `SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public');
`;

export const getTablesAndColumnsQueryMySQL = `SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = DATABASE();
`;
