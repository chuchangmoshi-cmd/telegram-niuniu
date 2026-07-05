import { request } from "./index";

export function login(data: any) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}