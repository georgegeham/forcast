"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useRef } from "react";

import { CurrentUser } from "@/lib/auth/hooks/getCurrentUserInfo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LoadingSwap } from "@/components/ui/loading-swap";

import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { uploadAvatar } from "@/lib/supabase/actions/upload-avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const ProfileSchema = z.object({
  profileImage: z.string().min(1, "Profile image is required"),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  plays: z.array(z.string()).optional(),
  gender: z.enum(["male", "female"]),
  birthday: z.string().min(1, "Birthday is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.email().min(1, "Email is required"),
  interviewer: z.string().optional(),
});

type ProfileSchema = z.infer<typeof ProfileSchema>;

const ProfileForm = ({ user }: { user: CurrentUser }) => {


  const form = useForm<ProfileSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      profileImage: user?.image || "",
      name: user?.name || "",
      bio: user?.profile?.bio || "",
      plays: user?.profile?.plays.map((play) => play.playId) || [],
      gender: user?.profile?.gender || "male",
      birthday: user?.profile?.birthday || "",
      phone: user?.profile?.phone || "",
      email: user?.email || "",
      interviewer: user?.profile?.interviewer || "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try{

    const file = e.target.files?.[0];
    if (!file) return;

    // upload
    const formData = new FormData();
    formData.append("file", file);
    const url = await uploadAvatar(formData, "/profile");
    if (url.error) {
      toast.error(url.message || "Failed to upload avatar");
      return;
    }

   }catch(e){
    toast.error(e instanceof Error ? e.message : "An error occurred while uploading the avatar");
   }
  };

  const onSubmit = async (data: ProfileSchema) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Profile Photo
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-xl border border-dashed p-5 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={user?.image || ""} alt={user?.name ?? "Avatar"} />

              <AvatarFallback className="text-2xl">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Upload a profile picture</p>

                <p className="text-sm text-muted-foreground">
                  JPG, PNG or WEBP · Max 10MB
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Photo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {form.formState.errors.profileImage && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.profileImage.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Personal Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-5 md:grid-cols-6">
            {/* Name */}
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="name">Full Name</FieldLabel>

              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="name"
                      placeholder="John Doe"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Email */}
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Phone */}
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="phone">Phone</FieldLabel>

              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder="0 100 000 0000"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Gender */}
            <Field className="md:col-span-2">
              <FieldLabel>Gender</FieldLabel>

              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>

                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Birthday */}
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="birthday">Birthday</FieldLabel>

              <Controller
                control={form.control}
                name="birthday"
                render={({ field, fieldState }) => (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          captionLayout="dropdown"
                          defaultMonth={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (!date) return;

                            field.onChange(format(date, "yyyy-MM-dd"));
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>
            {/* Interviewer */}
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="interviewer">Interviewer ID</FieldLabel>

              <Controller
                control={form.control}
                name="interviewer"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="interviewer"
                      placeholder="Assigned interviewer"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Bio */}
            <Field className="md:col-span-6">
              <FieldLabel htmlFor="bio">Bio</FieldLabel>

              <Controller
                control={form.control}
                name="bio"
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      {...field}
                      id="bio"
                      placeholder="Tell us a little about yourself..."
                      className="min-h-[120px] resize-none"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save Changes
          </LoadingSwap>
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
