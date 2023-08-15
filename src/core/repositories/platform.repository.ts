import { Model, model, models } from "mongoose";
import { PlatformInterface, PlatformSchema, PlatformSchemaInterface } from "@core/models/platform.model";

const Platforms: Model<PlatformSchemaInterface> = models.Platforms || model<PlatformSchemaInterface>('Platforms', PlatformSchema);

class PlatformRepository {
    /**
     * Creates a new platform.
     * @param platformData - Data for the new platform.
     * @returns The created platform.
     */
    async create(platformData: Omit<PlatformInterface, 'id'>): Promise<PlatformSchemaInterface> {
        const platform = new Platforms(platformData);
        return platform.save();
    }

    /**
     * Finds a platform by its ID.
     * @param platformId - ID of the platform to find.
     * @returns The found platform or null.
     */
    async findById(platformId: string): Promise<PlatformSchemaInterface | null> {
        return Platforms.findById(platformId).exec();
    }

    /**
     * Updates a platform by its ID.
     * @param platformId - ID of the platform to update.
     * @param platformData - New data for the platform.
     * @returns The updated platform or null.
     */
    async update(platformId: string, platformData: Partial<Omit<PlatformInterface, 'id'>>): Promise<PlatformSchemaInterface | null> {
        return Platforms.findByIdAndUpdate(platformId, platformData, { new: true }).exec();
    }

    /**
     * Deletes a platform by its ID.
     * @param platformId - ID of the platform to delete.
     * @returns The deleted platform or null.
     */
    async delete(platformId: string): Promise<PlatformSchemaInterface | null> {
        return Platforms.findByIdAndDelete(platformId).exec();
    }

    /**
     * Lists all platforms.
     * @returns An array of all platforms.
     */
    async list(): Promise<PlatformSchemaInterface[]> {
        return Platforms.find().exec();
    }
}

export default new PlatformRepository();
