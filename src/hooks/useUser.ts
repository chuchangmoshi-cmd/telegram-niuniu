import { useEffect, useState } from "react";
import { login } from "@/user";

export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const currentUser = await login();

    setUser(currentUser);
  }

  return {
    user,
    reloadUser: loadUser,
  };
}