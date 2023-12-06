import Container from 'typedi';
import { DataSource } from 'typeorm';

export default class ConnectionManager {
  static getDatasource() {
    return Container.get(DataSource);
  }

  static getManager() {
    const datasource = Container.get(DataSource);
    return datasource.manager;
  }
  static getConnection() {
    const datasource = Container.get(DataSource);
    return datasource.manager.connection;
  }
}
