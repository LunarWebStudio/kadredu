import Logo from "~/components/logo";
import { navbarItems } from "~/components/navbar";
import NavbarItem from "~/components/navbar_item";

export default function Footer() {
  return (
    <div className="py-10 bg-secondary border-t border-primary">
      <div className="container flex flex-row gap-8 items-center justify-center">
        <div className="flex flex-row items-center gap-4 select-none">
          <Logo size="icon" />
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} KadrEdu
          </p>
        </div>
        {navbarItems.map((item) => (
          <NavbarItem key={item.title} href={item.href}>
            {item.title}
          </NavbarItem>
        ))}
      </div>
    </div>
  );
}
