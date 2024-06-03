import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function UsernameTag({
  username
}: {
  username: string
}) {
  return (
    <Link href={`/@${username}`}>
      <Button variant="link" size="link">
      </Button>
    </Link>
  );
}
