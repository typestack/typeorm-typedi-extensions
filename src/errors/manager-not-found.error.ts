/**
 * Raised when the requested connection doesn't exists in TypeORM.
 */
export class ConnectionNotFoundError extends Error {
  public name = 'ManagerNotFoundError';

  public get message() {
    return (
      `Cannot get Connection with name "${this.connectionName}" from the ConnectionManager. ` +
      `Make sure you have created the connection and called "useContainer(Container)" in your application ` +
      `before establishing a connection and importing any entity into TypeORM.`
    );
  }

  /**
   * Creates a new ManagerNotFoundError what is raised when we cannot request a manager from TypeORM.
   * @param type type of the requested manager
   * @param connectionName optional name of the manager
   */
  constructor(private connectionName?: string) {
    super();
  }
}
