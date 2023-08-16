import PlatformRepository from "@core/repositories/platform.repository";
import {PlatformInterface, PlatformSchemaInterface} from "@core/models/platform.model";

class PlatformServices {
    async createPlatform(platformData: Omit<PlatformInterface, 'id'>) : Promise<PlatformSchemaInterface> {
        return PlatformRepository.create(platformData);
    }
    async getPlatformById(platformId: string): Promise<PlatformSchemaInterface | null> {
        return PlatformRepository.findById(platformId);
    }
    async updatePlatform(platformId: string, platformData: Partial<PlatformInterface>): Promise<PlatformSchemaInterface | null> {
        return PlatformRepository.update(platformId, platformData);
    }
    async deletePlatform(platformId: string): Promise<PlatformSchemaInterface | null> {
        return PlatformRepository.delete(platformId);
    }
    async listPlatforms(): Promise<Array<PlatformSchemaInterface>> {
        return PlatformRepository.list();
    }
}

export default new PlatformServices();
