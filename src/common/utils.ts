import { ConnectionOptions, getConnectionOptions } from 'typeorm';

export const getDbConnectionOptions = async (connectionName = 'default') => {
  const options = await getConnectionOptions(connectionName);
  return {
    ...options,
    name: connectionName,
  } as ConnectionOptions;
};
