# TypeDI Service container integration with TypeORM

This extension for TypeORM provides handy decorators that can be used with [typedi](https://github.com/pleerock/typedi).

## Installation

* Install module:

`npm install typeorm-typedi-extensions --save`

* Install TypeDI:

`npm install typedi --save`

* Configure in your app TypeORM to use TypeDI Container, before you create a connection:

```typescript
import "reflect-metadata";
import {createConnection, useContainer} from "typeorm";
import {Container} from "typedi";

useContainer(Container);
createConnection({ 
    /// ....
}); 
```

* That's all, start using decorators!


## Usage

All decorators can be used on properties and constructor arguments, e.g. you can use both
property and constructor injection.

### @InjectConnection

Injects `Connection` from where you can access anything in your connection.

Example using property injection:

```typescript
import {Service} from "typedi";
import {Connection} from "typeorm";
import {InjectConnection} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    @InjectConnection()
    private connection: Connection;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {Connection} from "typeorm";
import {InjectConnection} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    constructor(@InjectConnection() private connection: Connection) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

### @InjectManager

Injects `EntityManager` from where you can access any entity in your connection. 

Example using property injection:

```typescript
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {InjectManager} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    @InjectManager()
    private entityManager: EntityManager;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {InjectManager} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    constructor(@InjectManager() private entityManager: EntityManager) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

### @InjectRepository

Injects `Repository`, `MongoRepository`, `TreeRepository` or custom repository of some Entity.
Be aware that the property or param decorated with `@InjectRepository` has to be annotated with repository type!

Example using property injection:

```typescript
import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    @InjectRepository(Post)
    private repository: Repository<Post>;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    constructor(
        @InjectRepository(Post)
        private repository: Repository<Post>
    ) {}
    
}
```
Optionally, you can specify a connection name in the decorator parameters:

```ts
@Service()
export class PostRepository {
    
    @InjectRepository(Post, "custom-con-name")
    private repository: Repository<Post>;
    
}
```

You can also inject custom `Repository` of some Entity. 
Be aware that you have to create the class which extends the generic `Repository<T>` and decorate it with `EntityRepository<T>` decorator.

Example using constructor injection:

```typescript
import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import "../entity/user";

// create custom Repository class
@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    public findByEmail(email: string) {
        return this.findOne({ email });
    }
    
}

@Service()
export class PostService {

    // using constructor injection
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
    ) {}

    public async userExist(user: User): boolean {
        return await this.userRepository.findByEmail(user.email) ? true : false;
    }

}
```

Optionally, you can specify a connection name in the decorator parameters.

```ts
@Service()
export class PostService {
    
    @InjectRepository("custom-con-name")
    private userRepository: UserRepository;
    
}
```

## Samples

Take a look on samples in [./sample](sample) for examples of usages.
