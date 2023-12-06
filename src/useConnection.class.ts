import Container from "typedi";
import { DataSource } from "typeorm";

class UseConnection {
    constructor(){
    }
    setDatasource(datasource:DataSource){
      Container.set({ id: DataSource, value: datasource});
   }
}

export const useConnection = new UseConnection()