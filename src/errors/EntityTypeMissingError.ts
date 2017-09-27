export class EntityTypeMissingError extends Error {
    constructor(object: Object, propertyName: string, index?: number) {
        super(
            `Missing "entityType" parameter of "@OrmRepository" decorator ` +
            index !== undefined
                ? `for a "${propertyName}" method's ${index! + 1}. parameter of ${object.constructor.name} class. `
                : `for a property "${propertyName}" of ${object.constructor.name} class. `
            +
            `For injecting Repository, MongoRepository or TreeRepository, ` +
            `you have to specify the entity type due to TS reflection limitation - ` +
            `"entityType" parameter can be ommited only for custom repositories.`
        );

        Object.setPrototypeOf(this, EntityTypeMissingError.prototype);
    }
}
