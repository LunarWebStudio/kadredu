import EditorText from "~/components/Editor";
import { ProfileSection, ProfileSectionHeader } from "~/components/ui/profile";

export default function AboutSection({
  text,
}: {
  text: string;
}) {
  return (
    <ProfileSection className="overflow-hidden">
      <ProfileSectionHeader>Обо мне</ProfileSectionHeader>
      <EditorText
        className="rounded-none border-none"
        text={text}
        disabled={true}
      />
    </ProfileSection>
  );
}
