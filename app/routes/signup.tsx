import { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { authenticator } from "~/services/auth.server";
import { createUser } from "~/users";

const action: ActionFunction = async ({ request }) => {
  const form = await request.clone().formData();
  const name = form.get("name") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await createUser(name, email, hashedPassword);

    return await authenticator.authenticate("form", request);
    
};

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <Form
        method="post"
        action="/signup"
        className="flex flex-col items-center justify-center gap-4 bg-white p-8 roundedshadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
            <input
              type="text"
              name="name"
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
            <input
              type="password"
              name="password"
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Sign Up
        </button>
      </Form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export { action };
export default SignUpPage;
