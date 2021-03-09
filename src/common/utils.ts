import { ConnectionOptions, getConnectionOptions } from 'typeorm';

export const getDbConnectionOptions = async (connectionName = 'default') => {
  const options = await getConnectionOptions(
    process.env.NODE_ENV || 'development',
  );
  return {
    ...options,
    name: connectionName,
  } as ConnectionOptions;
};
