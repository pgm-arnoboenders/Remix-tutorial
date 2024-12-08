import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { User } from "~/users";
import users from "~/data/users.json";

const authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    return await login(email, password);
  }),
  "user-pass"
);

const login = async (email: string, password: string) => {
  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Password doesn't match");
  }

  return user;
};

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = users.find((user) => user.email === email);

  if (!user) {
    console.log("User not found");
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password as string);

  if (!passwordMatch) {
    console.log("Password doesn't match");
    throw new Error("Password doesn't match");
  }

  return user;
});

authenticator.use(formStrategy, "form");
export { authenticator };
