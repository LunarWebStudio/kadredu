"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Popover } from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { OnError } from "~/lib/shared/onError";
import {
  type Resume,
  ResumeSchema,
  resumeStatusData,
} from "~/lib/shared/types/resume";
import { resumeStatusEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

export default function Resume({
  resume,
}: {
  resume: Resume | undefined;
}) {
  const [statusOpen, setStatusOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ResumeSchema),
    defaultValues: resume as z.infer<typeof ResumeSchema>,
  });

  const { data: roles, isLoading: isRolesLoading } =
    api.teamRoles.getAll.useQuery();

  const selectedRole = useMemo(
    () => roles?.find((r) => r.id === form.watch("roleId")),
    [roles, form.watch("roleId")],
  );

  const updateSelfResumeMutation = api.resume.updateSelf.useMutation({
    onSuccess() {
      toast.success("Резюме обновлено");
      router.refresh();
    },
    onError(err) {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof ResumeSchema>) => {
    updateSelfResumeMutation.mutate(data);
  };

  return (
    <div className="w-full rounded-xl bg-secondary">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold text-muted-foreground">
        Резюме
      </div>
      <div className="w-full p-6">
        <Form {...form}>
          <form
            className=" space-y-4"
            onSubmit={form.handleSubmit(onSubmit, OnError)}
          >
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Combobox
                    values={roles ?? []}
                    value={selectedRole ?? null}
                    onChange={(v) => field.onChange(v?.id)}
                    placeholder={{
                      default: "Выберите роль",
                      empty: "Роли не найдены",
                    }}
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      chevron
                      loading={isRolesLoading}
                    >
                      {selectedRole?.name ?? "Выберите роль"}
                    </Button>
                  </Combobox>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Popover
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                  >
                    <Combobox
                      values={resumeStatusEnum.enumValues.map((v) => ({
                        id: v,
                        name: resumeStatusData[v],
                      }))}
                      value={null}
                      onChange={(v) => field.onChange(v?.id)}
                      placeholder={{
                        default: "Выберите статус",
                        empty: "Статусы не найдены",
                      }}
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        chevron
                      >
                        {field.value
                          ? resumeStatusData[field.value]
                          : "Выберите статус"}
                      </Button>
                    </Combobox>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опыт работы</FormLabel>
                  <Textarea
                    className="w-full h-20 bg-secondary"
                    placeholder="Несколько компаний"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={updateSelfResumeMutation.isPending}
            >
              Сохранить
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
