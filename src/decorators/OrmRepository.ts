import { ConnectionManager, Repository, TreeRepository, MongoRepository } from "typeorm";
import { Container } from "typedi";

/**
 * Helper to avoid V8 compilation of anonymous function on each call of decorator.
 */
function getRepository(connectionName: string, repositoryType: Function, entityType: Function) {
    const connectionManager = Container.get(ConnectionManager);
    if (!connectionManager.has(connectionName)) {
        throw new Error(
            `Cannot get connection "${connectionName}" from the connection manager. ` +
            `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
            `in your application before you established a connection and importing any entity.`
        );
    }
    const connection = connectionManager.get(connectionName);

    switch (repositoryType) {
        case Repository:
            return connection.getRepository(entityType);
        case MongoRepository:
            return connection.getMongoRepository(entityType);
        case TreeRepository:
            return connection.getTreeRepository(entityType);
        // if not the TypeORM's ones, there must be custom repository classes
        default:
            return connection.getCustomRepository(repositoryType);
    }
}

/**
 * Allows to inject a Repository, MongoRepository, TreeRepository
 * or custom repository using TypeDI's Container.
 * Be aware that you have to annotate the property with correct type!
 * ```ts
 * class Sample {
 *   // constructor injection
 *   constructor(
 *     \@OrmRepository(User)
 *      private userRepository: Repository<User>,
 *   ) {}
 * 
 *   // property injection
 *  \@OrmRepository(User)
 *   userRepository: Repository<User>;
 * }
 * ```
 */
export function OrmRepository(entityType: Function, connectionName = "default") {
    return (object: object, propertyName: string, index?: number) => {
        let repositoryType: Function;

        // if the decorator has been aplied to parameter (constructor injection)
        if (index) {
            const paramTypes: Function[] | undefined = Reflect.getOwnMetadata("design:paramtypes", object, propertyName);
            if (!paramTypes || !paramTypes[index]) {
                throw new Error(
                    `Cannot get reflected type for a "${propertyName}" method's parameter of ${object.constructor.name} class. ` +
                    `Make sure you have turned on an "emitDecoratorMetadata": true, option in tsconfig.json. ` +
                    `and that you have imported "reflect-metadata" on top of the main entry file in your application.` +
                    `And make sure that you have annotated the property type correctly with: ` +
                    `Repository, MongoRepository, TreeRepository or custom repository class type.`
                );
            }
            repositoryType = paramTypes[index];
        }
        // if the parameter has been aplied to class property
        else {
            const propertyType: Function | undefined = Reflect.getOwnMetadata("design:type", object, propertyName);
            if (!propertyType) {
                throw new Error(
                    `Cannot get reflected type for a property "${propertyName}" of ${object.constructor.name} class. ` +
                    `Make sure you have turned on an "emitDecoratorMetadata": true, option in tsconfig.json ` +
                    `and that you have imported "reflect-metadata" on top of the main entry file in your application.` +
                    `And make sure that you have annotated the property type correctly with: ` +
                    `Repository, MongoRepository, TreeRepository or custom repository class type.`
                );
            }
            repositoryType = propertyType;
        }
        
        Container.registerHandler({
            index,
            object,
            propertyName,
            value: () => getRepository(connectionName, repositoryType, entityType),
        });
    };
}

class Test {

    constructor(
        @OrmRepository(Test)
        private repo: MongoRepository<any>,
    ) {}

    @OrmRepository(Test)
    property: Repository<any>;
}