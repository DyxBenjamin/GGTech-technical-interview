import {Schema, Document, Types} from "mongoose";

export interface PlatformInterface {
    id: Types.ObjectId;
    icon: string;
    title: string;
    accessURL?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PlatformSchemaInterface extends Omit<PlatformInterface, 'id'>, Document {}

export const PlatformSchema = new Schema<PlatformSchemaInterface> ({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    accessURL: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    }
});

PlatformSchema.virtual('id').get(function (this: PlatformSchemaInterface) {
    return this._id;
})

PlatformSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
