export default function AuthError({
  searchParams,
}: {
  searchParams: {
    error:
      | "Configuration"
      | "AccessDenied"
      | "Verification"
      | "Default"
      | (string & Record<never, never>);
  };
}) {
  return <div className="">{searchParams.error}</div>;
}
