"use client";
import { Module } from "@/@types/module.types";
import { Role } from "@/@types/role.types";
import DynamicIcon from "@/components/common/DynamicIcon";
import FormInput from "@/components/common/FormInput";
import CustomSelect from "@/components/common/CustomSelect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRoleSchema, UpdateRoleSchemaType } from "@/schemas/role.schema";
import { updateRole } from "@/actions/RoleAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Permission } from "@/@types/permission.types";

const UpdateRoleForm = ({
  role,
  modules,
}: {
  role: Role;
  modules: Module[];
}) => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  /**
   * React hook form
   */
  const { control, handleSubmit, getValues, setValue } =
    useForm<UpdateRoleSchemaType>({
      defaultValues: {
        roleName: role?.roleName ?? "",
        deletable: role?.deletable ?? false,
        moduleIds:
          role?.moduleRole?.map(
            (module: { module: Module }) => module?.module?.id,
          ) ?? [],
        permissionIds:
          role?.permissionRole?.map(
            (p: { permission: Permission }) => p?.permission?.id,
          ) ?? [],
      },
      resolver: zodResolver(updateRoleSchema),
    });

  /**
   * Update handler
   * @param formData
   * @returns
   */
  const onSubmit = (formData: UpdateRoleSchemaType) =>
    startTransition(async () => {
      try {
        const data = await updateRole(Number(role?.id), formData);
        if (!data.success) throw new Error(data.message);
        toast.success(data.message);
        router.push("/admin/roles");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertAction>
            <Button size="xs" variant="default" onClick={() => setError("")}>
              Close
            </Button>
          </AlertAction>
        </Alert>
      )}

      <FieldGroup>
        <FormInput
          control={control}
          name="roleName"
          label="Role Name"
          placeholder="Enter a valid role name!"
          disabled={isPending}
        />

        <CustomSelect
          control={control}
          name="deletable"
          label="Deletable"
          disabled={isPending}
          data={[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ]}
        />

        <Accordion type="multiple" defaultValue={[modules[0]?.id?.toString()]}>
          {modules.map((module) => (
            <AccordionItem key={module.id} value={module.id.toString()}>
              <div className="w-full flex flex-row items-center space-x-4">
                <Controller
                  name="moduleIds"
                  control={control}
                  render={({ field: moduleField }) => {
                    const moduleChecked = moduleField.value.includes(module.id);

                    const handleModuleChange = (val: boolean) => {
                      const moduleIds = [...moduleField.value];
                      const permissionIds = [...getValues("permissionIds")];

                      const modulePermissionIds = module.permissions.map(
                        (p) => p.id,
                      );

                      if (val) {
                        if (!moduleIds.includes(module.id))
                          moduleIds.push(module.id);
                        modulePermissionIds.forEach((pid) => {
                          if (!permissionIds.includes(pid))
                            permissionIds.push(pid);
                        });
                      } else {
                        moduleIds.splice(moduleIds.indexOf(module.id), 1);
                        modulePermissionIds.forEach((pid) => {
                          const idx = permissionIds.indexOf(pid);
                          if (idx > -1) permissionIds.splice(idx, 1);
                        });
                      }

                      moduleField.onChange(moduleIds);
                      setValue("permissionIds", permissionIds);
                    };

                    return (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={moduleChecked}
                          onCheckedChange={handleModuleChange}
                        />
                      </div>
                    );
                  }}
                />
                <div className="w-full">
                  <AccordionTrigger>
                    <div className="flex flex-row items-center space-x-2">
                      {module.iconClass && (
                        <DynamicIcon name={module.iconClass} />
                      )}
                      <span>{module.moduleName}</span>
                    </div>
                  </AccordionTrigger>
                </div>
              </div>

              <AccordionContent>
                <FieldGroup>
                  {module.permissions.map((permission) => (
                    <FieldLabel key={permission.id}>
                      <Field orientation="horizontal">
                        <Controller
                          name="permissionIds"
                          control={control}
                          render={({ field: permField }) => {
                            const checked = permField.value.includes(
                              permission.id,
                            );

                            const handlePermissionChange = (val: boolean) => {
                              const permissionIds = [...permField.value];
                              const moduleIds = [...getValues("moduleIds")];

                              if (val) {
                                if (!permissionIds.includes(permission.id))
                                  permissionIds.push(permission.id);
                              } else {
                                const idx = permissionIds.indexOf(
                                  permission.id,
                                );
                                if (idx > -1) permissionIds.splice(idx, 1);
                              }

                              const modulePermissionIds =
                                module.permissions.map((p) => p.id);
                              const anyChecked = modulePermissionIds.some(
                                (pid) => permissionIds.includes(pid),
                              );

                              if (anyChecked) {
                                if (!moduleIds.includes(module.id))
                                  moduleIds.push(module.id);
                              } else {
                                const idx = moduleIds.indexOf(module.id);
                                if (idx > -1) moduleIds.splice(idx, 1);
                              }

                              permField.onChange(permissionIds);
                              setValue("moduleIds", moduleIds);
                            };

                            return (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={handlePermissionChange}
                                />
                              </div>
                            );
                          }}
                        />

                        <FieldContent>
                          <FieldTitle>{permission.name}</FieldTitle>
                          <FieldDescription>
                            {permission.slug}{" "}
                            {permission.deletable ? (
                              <Badge variant="default">Deletable: Yes</Badge>
                            ) : (
                              <Badge variant="destructive">Deletable: No</Badge>
                            )}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : ""}
            Update
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default UpdateRoleForm;
