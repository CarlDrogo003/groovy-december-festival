-- Enable required extensions
DO $$
BEGIN
    -- Create extensions schema if it doesn't exist
    CREATE SCHEMA IF NOT EXISTS extensions;
    
    -- Set search path to include extensions schema
    SET search_path TO extensions, public;
    
    -- Enable pgcrypto extension
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
        CREATE EXTENSION pgcrypto SCHEMA extensions;
    END IF;
    
    -- Enable uuid-ossp extension
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        CREATE EXTENSION "uuid-ossp" SCHEMA extensions;
    END IF;
    
    -- Reset search path to default
    SET search_path TO public;
END $$;