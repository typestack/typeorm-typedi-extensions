import {EntityManager, Repository} from "typeorm";
import {Service} from "typedi";

import {Post} from "../entity/Post";
import {InjectRepository} from "../../../src/decorators/InjectRepository";
import {InjectManager} from "../../../src/decorators/InjectManager";

@Service()
export class PostRepository {

    @InjectManager()
    private entityManager: EntityManager;

    constructor(@InjectRepository(Post) private InjectRepository: Repository<Post>) {
    }

    saveUsingRepository(post: Post) {
        return this.InjectRepository.save(post);
    }

    saveUsingManager(post: Post) {
        return this.entityManager.save(post);
    }

    findAll() {
        return this.InjectRepository.find();
    }

}