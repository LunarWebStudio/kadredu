import { redirect } from "next/navigation";
import VerificationForm from "~/app/(auth_verification)/verification/form";
import { getServerAuthSession } from "~/server/auth";

export default async function Verification() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth");
  }

  if (session.user.verified) {
    redirect("/");
  }

  if (!session.user.name) {
    return <VerificationForm />;
  }

  return (
    <div className="flex w-[350px] flex-col gap-6">
      <p className="emoji">🕐</p>
      <h3>Ожидайте ответа от модерации</h3>
      <p className="text-muted-foreground">
        На ваш почтовый ящик будет отправлено письмо после проверки вашей
        заявки.
      </p>
    </div>
  );
}
