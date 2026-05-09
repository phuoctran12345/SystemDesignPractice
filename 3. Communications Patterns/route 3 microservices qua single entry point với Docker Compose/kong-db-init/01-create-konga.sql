SELECT 'CREATE DATABASE konga'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'konga')\gexec

