import {Document, Schema, Types} from 'mongoose';
import {PlatformInterface} from "@core/models/platform.model";
import {ReviewInterface} from "@core/models/review.model";
import slugify from "slugify";
export interface MovieInterface {
    id: Types.ObjectId;
    title: string;
    overview: string;
    slug: string;
    image: string;
    director: string;
    languages: Array<string>;
    score: number;
    genders: Array<string>;
    platforms: Array<PlatformInterface>;
    reviews: Array<ReviewInterface>;
    releaseDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MovieSchemaInterface extends Omit<MovieInterface, 'id'>, Document {}

export const MovieSchema = new Schema<MovieSchemaInterface>({
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    languages: {
        type: [String],
        required: true,
    },
    genders: [{ type: Schema.Types.ObjectId, ref: 'Genders', optional: true }],
    platforms: [{ type: Schema.Types.ObjectId, ref: 'Platforms', optional: true }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Reviews', opcional: true }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    }
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});

MovieSchema.virtual('id').get(function (this: MovieSchemaInterface) {
    return this._id;
})

MovieSchema.virtual('score').get(function (this: MovieSchemaInterface) {
    let score = 0;
    if (this.reviews.length > 0) {
        score = this.reviews.reduce((acc, review) => acc + review.score, 0) / this.reviews.length;
    }
    return score;
})

MovieSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (_doc, ret) {
        delete ret._id;
    }
});

MovieSchema.pre<MovieSchemaInterface>('save', function (next) {
    this.slug = slugify(this.title, {lower: true, strict: true});
    next();
});

