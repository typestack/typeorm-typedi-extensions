import { ok, deepStrictEqual } from 'assert';
import { Container } from 'typedi';
import { createConnection, } from 'typeorm';
import { UserRepository } from './user.respository';
import { User } from './user.entity';

export async function startApp() {
  const connection = await createConnection({ 
    /** we use in memoty SQL JS to test the lib. */
    type: 'sqljs', 
    logger: 'advanced-console',
    logging: true,
    /** We don't want to mess with the creation of table now, so we auto-create it. */
    synchronize: true,
    /** Entities must be registered in TypeORM before you can use them. */
    entities: [User], 
  });

  const userOne = new User();
  userOne.id = 1;
  userOne.name = 'Umed Khudoiberdiev';

  const userTwo = new User();
  userTwo.id = 2;
  userTwo.name = `Quick John`;

  const repository = Container.get(UserRepository);

  /** Save through the various methods. */
  await repository.saveUsingRepository(userOne);
  await repository.saveUsingManager(userTwo);

  /** Load the saved users so we can assert on them. */
  const userList = await repository.findAll();

  console.log({ userList });

  ok(userList.length === 2);
  ok(userList[0] instanceof User);
  ok(userList[1] instanceof User);

  deepStrictEqual(userList, [userOne, userTwo]);

  /** Close the connection so the app can exit. */
  await connection.close();
}