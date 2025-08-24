import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const TourType = model<ITourType>("TourType", tourTypeSchema);
const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { types: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuests: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const subSlug = this.title?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${subSlug}-division`;
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
    return this;
  }
  next();
});
tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    const subSlug = tour.title?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${subSlug}-division`;
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    tour.slug = slug;
  }
  this.setUpdate(tour);
  next();
});
export const Tour = model<ITour>("Tour", tourSchema);
