import {Document, Schema, Types} from "mongoose";

export interface ReviewInterface {
    id?: Types.ObjectId;
    movie: Types.ObjectId;
    platform: Types.ObjectId;
    author: string;
    body: string;
    score: number
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ReviewSchemaInterface extends Omit<ReviewInterface, 'id'>, Document {}


export const ReviewSchema = new Schema<ReviewSchemaInterface>({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movies',
        required: true,
    },
    platform: {
        type: Schema.Types.ObjectId,
        ref: 'Platforms',
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5],
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

ReviewSchema.virtual('id').get(function (this: ReviewSchemaInterface) {
    return this._id;
})

ReviewSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
