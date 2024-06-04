"use client";

import { type User } from "~/lib/shared/types";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "~/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { useEffect, useState } from "react"
import { type Role, rolesEnum } from "~/server/db/schema";
import UserRoleBadge from "~/components/user-role";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";

function RolesDisplay({ roles }: { roles: Role[] }) {
  return (
    <>
      {roles.length <= 1 ? (
        <UserRoleBadge role={roles[0]} size="regular" />
      ) : (
        <div className="flex flex-row gap-4">
          {roles.map(role => (
            <UserRoleBadge role={role} size="small" key={role} />
          ))}
        </div>
      )}
    </>
  )
}


export default function RoleSelect({
  user,
  session
}: {
  user: User;
  session: Session;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newRoles, setNewRoles] = useState<Role[]>(user.role);

  const router = useRouter();
  const { toast } = useToast();
  const updateRolesMutation = api.user.updateRoles.useMutation({
    onSuccess: () => {
      toast({
        title: "Роли успешно обновлены",
      })
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Ошибка обновления ролей",
        variant: "destructive"
      })
      setNewRoles(user.role);
    }
  })

  useEffect(() => {
    if (user.role.length === newRoles.length && user.role.every((role, index) => role === newRoles[index])) return;

    const timeout = setTimeout(() => {
      updateRolesMutation.mutate({
        id: user.id,
        roles: newRoles
      })
    }, 1000)
    return () => clearTimeout(timeout);
  }, [newRoles, user.id, user.role, updateRolesMutation])

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="hidden lg:flex">
          <RolesDisplay roles={newRoles} />
        </PopoverTrigger>
        <PopoverContent>
          <RoleList roles={newRoles} setRoles={setNewRoles} session={session} />
        </PopoverContent>
      </Popover>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger className="flex lg:hidden">
          <RolesDisplay roles={newRoles} />
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <RoleList roles={newRoles} setRoles={setNewRoles} session={session} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function RoleList({
  roles,
  setRoles,
  session,
}: {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  session: Session;
}) {
  return (
    <Command>
      <CommandInput placeholder="Роль..." />
      <CommandList>
        <CommandEmpty>Ролей не найдено.</CommandEmpty>
        <CommandGroup>
          {(session.user.role.includes("ADMIN") ? rolesEnum.enumValues : ["STUDENT"])
            .map((role) => role as Role)
            .map((role) => (
              <CommandItem
                key={role}
                value={role}
                onSelect={() => {
                  if (roles.includes(role)) {
                    setRoles(roles.filter((r) => r !== role))
                    return;
                  }
                  setRoles([...roles, role])
                }}
              >
                <Check className={
                  cn(
                    "size-4 mr-2",
                    roles.includes(role) ? "opacity-100" : "opacity-0"
                  )
                } />
                <UserRoleBadge role={role} size="regular" />
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
