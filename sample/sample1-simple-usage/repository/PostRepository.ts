import {EntityManager, Repository} from "typeorm";
import {Service} from "typedi";
import {Post} from "../entity/Post";
import {OrmRepository} from "../../../src/decorators/OrmRepository";
import {OrmManager} from "../../../src/decorators/OrmManager";

@Service()
export class PostRepository {

    @OrmManager()
    private entityManager: EntityManager;

    constructor(@OrmRepository(Post) private ormRepository: Repository<Post>) {
    }

    saveUsingRepository(post: Post) {
        return this.ormRepository.save(post);
    }

    saveUsingManager(post: Post) {
        return this.entityManager.save(post);
    }

    findAll() {
        return this.ormRepository.find();
    }

}