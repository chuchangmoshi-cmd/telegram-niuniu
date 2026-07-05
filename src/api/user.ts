import { request } from "./index";

export function getUser(id: string) {
  return request(`/user/${id}`);
}

export function updateUser(data: any) {
  return request("/user/update", {
    method: "POST",
    body: JSON.stringify(data),
  });
}