export * from './decorators/InjectConnection';
export * from './decorators/InjectManager';
export * from './decorators/InjectRepository';

// deprecated aliases
export { InjectConnection as OrmConnection } from './decorators/InjectConnection';
export { InjectManager as OrmManager } from './decorators/InjectManager';
export { InjectRepository as OrmRepository } from './decorators/InjectRepository';
