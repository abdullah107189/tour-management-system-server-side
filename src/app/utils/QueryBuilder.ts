import { Query } from "mongoose";
import { excludeField } from "../constant";
import { tourSearchableFields } from "../modules/tour/tour.constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery; // Tour.find()
    this.query = query; // { location: "Cox's Bazar", sort: "-price" }
  }

  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter); //Tour.find().find(filter)
    return this;
  }
  search(): this {
    const searchTerm = this.query.searchTerm || "";
    // searchQuery
    const searchQuery = {
      $or: tourSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  paginate(): this {
    const page = Number(this.query.page);
    const limit = Number(this.query.limit);
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  async getMeta() {
    const totalTourTypes = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalTourTypes / limit);
    return { page, limit, total: totalTourTypes, totalPage };
  }
}
