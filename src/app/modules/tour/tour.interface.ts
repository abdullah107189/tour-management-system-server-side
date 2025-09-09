import { Types } from "mongoose";
export interface ITourType {
  name: string;
}
export interface ITour {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  images: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: [string];
  maxGuests?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
  deleteImages?: string[];
}
