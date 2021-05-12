import { classifier } from "./classifier";
import { meanIntensity } from "./meanIntensity";
import { random } from "./random";
import { Metric } from "../types/Metric";

export const METRICS: Array<Metric> = [
  {
    id: "21274555-28fa-4bb3-9be3-443e2e5dbb8d",
    f: random,
  },
  {
    id: "34c6c9a5-747d-420d-9700-ce61a22b030a",
    f: meanIntensity,
  },
  {
    id: "03114c27-bf26-44ff-879c-ef4be677d09e",
    f: classifier,
  }
]
