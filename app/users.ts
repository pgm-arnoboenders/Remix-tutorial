import users from "./data/users.json";
import fs from "fs";
import path from "path";
export type User = {
  id: number;
  name: string | null;
  email: string;
  password: string;
};

export function createUser(
  name: string,
  email: string,
  password: string
): User {
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
    password,
  };
  users.push(newUser);

  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.join(__dirname, "./data/users.json");
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return newUser;
}
