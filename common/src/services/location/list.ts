import { LocationListSchema } from "@/schemas/location";
import type { KyInstance } from "ky";

export interface ListLocationProps {
  long: number;
  lat: number;
  page?: number;
  name?: string;
}

export default (instance: KyInstance) => async (props: ListLocationProps) => {
  const { long, lat, page = 1, name = "" } = props;
  const response = await instance
    .get(`location/?long=${long}&lat=${lat}&page=${page}&name=${name}`)
    .json();
  return LocationListSchema.parse(response);
};
