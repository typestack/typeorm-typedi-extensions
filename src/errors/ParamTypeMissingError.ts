export class ParamTypeMissingError extends Error {
  constructor(object: Object, propertyName: string, index: number) {
    super(
      `Cannot get reflected type for a "${propertyName}" method's ${index + 1}. parameter of ${
        object.constructor.name
      } class. ` +
        `Make sure you have turned on an "emitDecoratorMetadata": true, option in tsconfig.json. ` +
        `and that you have imported "reflect-metadata" on top of the main entry file in your application.` +
        `And make sure that you have annotated the property type correctly with: ` +
        `Repository, MongoRepository, TreeRepository or custom repository class type.`
    );

    Object.setPrototypeOf(this, ParamTypeMissingError.prototype);
  }
}
