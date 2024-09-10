import { redirect } from "next/navigation";
import LoginComplete from "~/app/(auth_verification)/auth/complete";
import LoginForm from "~/app/(auth_verification)/auth/login";
import { getServerAuthSession } from "~/server/auth";

export default async function Login({
  searchParams,
}: {
  searchParams: {
    complete: string | undefined;
  };
}) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  if (searchParams.complete === "true") {
    return <LoginComplete />;
  }
  return <LoginForm />;
}
