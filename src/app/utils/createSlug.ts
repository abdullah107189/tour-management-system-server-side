import { Division } from "../modules/division/division.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSlug = async (payload: any, name: string) => {
  const subSlug = name?.toLocaleLowerCase().split(" ").join("-");
  let slug = `${subSlug}-division`;
  let counter = 0;
  while (await Division.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  payload.slug = slug;
  return payload;
};
