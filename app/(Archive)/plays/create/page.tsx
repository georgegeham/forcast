"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import z from "zod";

import { createPlayAction } from "@/drizzle/actions/Plays";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";

import { LoadingSwap } from "@/components/ui/loading-swap";

import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, Plus, Trash2, CalendarIcon } from "lucide-react";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { createPlaySchema } from "@/lib/schemas/Schemas";

type CreatePlayValues = z.input<typeof createPlaySchema>;

const AddPlayPage = () => {
  const router = useRouter();

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const form = useForm<CreatePlayValues>({
    resolver: zodResolver(createPlaySchema),

    defaultValues: {
      name: "",
      bio: "",
      writer: "",
      director: "",
      playDate: "",
      photosBucket: "",
      videoLinks: [],
      trophies: [],
      festivals: [],
      thumbnail: undefined,
      images: [],
    },
  });

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control: form.control,
    name: "videoLinks",
  });

  const {
    fields: trophyFields,
    append: appendTrophy,
    remove: removeTrophy,
  } = useFieldArray({
    control: form.control,
    name: "trophies",
  });

  const {
    fields: festivalFields,
    append: appendFestival,
    remove: removeFestival,
  } = useFieldArray({
    control: form.control,
    name: "festivals",
  });

  const onSubmit = async (data: CreatePlayValues) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("bio", data.bio ?? "");

      formData.append("writer", data.writer ?? "");

      formData.append("director", data.director ?? "");

      formData.append("playDate", data.playDate ?? "");

      formData.append("photosBucket", data.photosBucket ?? "");

      if (data.videoLinks) {
        formData.append(
          "videoLinks",
          JSON.stringify(data.videoLinks.map((video) => video.url)),
        );
      }

      formData.append("trophies", JSON.stringify(data.trophies));

      formData.append("festivals", JSON.stringify(data.festivals));

      if (data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail);
      }

      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      const result = await createPlayAction(null, formData);

      if (result?.error) {
        toast.error(result.message);
        return;
      }

      toast.success("Play created successfully!");

      router.push("/plays");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-10 max-w-4xl mx-auto">
      <Link
        href="/plays"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Plays
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Play</CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-5 md:grid-cols-6">
            {/* Name */}
            <Field className="md:col-span-6">
              <FieldLabel>Play Name</FieldLabel>

              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder="Hamlet" />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Bio */}
            <Field className="md:col-span-6">
              <FieldLabel>Bio</FieldLabel>

              <Controller
                control={form.control}
                name="bio"
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Play description..."
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Writer */}
            <Field className="md:col-span-3">
              <FieldLabel>Writer</FieldLabel>

              <Controller
                control={form.control}
                name="writer"
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder="Writer name" />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Director */}
            <Field className="md:col-span-3">
              <FieldLabel>Director</FieldLabel>

              <Controller
                control={form.control}
                name="director"
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder="Director name" />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Play Date */}
            <Field className="md:col-span-3">
              <FieldLabel>Play Date</FieldLabel>

              <Controller
                control={form.control}
                name="playDate"
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

            {/* Photos Bucket */}
            <Field className="md:col-span-3">
              <FieldLabel>Drive Photos Link</FieldLabel>

              <Controller
                control={form.control}
                name="photosBucket"
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder="Google Drive URL" />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* Thumbnail */}
            <Field className="md:col-span-6">
              <FieldLabel>Thumbnail</FieldLabel>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  form.setValue("thumbnail", file, {
                    shouldValidate: true,
                  });

                  setThumbnailPreview(URL.createObjectURL(file));
                }}
              />

              {form.formState.errors.thumbnail && (
                <FieldError errors={[form.formState.errors.thumbnail]} />
              )}

              {thumbnailPreview && (
                <div className="relative mt-4 overflow-hidden border h-60 rounded-xl group">
                  <Image
                    src={thumbnailPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute z-10 transition-opacity opacity-0 top-3 right-3 group-hover:opacity-100"
                    onClick={() => {
                      form.setValue("thumbnail", undefined, {
                        shouldValidate: true,
                      });

                      setThumbnailPreview("");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Field>

            {/* Gallery */}
            <Field className="md:col-span-6">
              <FieldLabel>Gallery Images</FieldLabel>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files ?? []);

                  if (!newFiles.length) return;

                  const currentImages = form.getValues("images") ?? [];

                  const updatedImages = [...currentImages, ...newFiles];

                  form.setValue("images", updatedImages, {
                    shouldValidate: true,
                  });

                  setGalleryPreview((prev) => [
                    ...prev,
                    ...newFiles.map((file) => URL.createObjectURL(file)),
                  ]);

                  e.target.value = "";
                }}
              />

              {form.formState.errors.images && (
                <FieldError errors={[form.formState.errors.images]} />
              )}

              {!!galleryPreview.length && (
                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                  {galleryPreview.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden border h-36 rounded-xl group"
                    >
                      <Image
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute z-10 transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100"
                        onClick={() => {
                          const currentImages = form.getValues("images") ?? [];

                          const updatedImages = currentImages.filter(
                            (_, i) => i !== index,
                          );

                          const updatedPreviews = galleryPreview.filter(
                            (_, i) => i !== index,
                          );

                          form.setValue("images", updatedImages, {
                            shouldValidate: true,
                          });

                          setGalleryPreview(updatedPreviews);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Field>

            {/* Video Links */}
            <Field className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Video Links</FieldLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendVideo({
                      url: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {videoFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      control={form.control}
                      name={`videoLinks.${index}.url`}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            placeholder="https://youtube.com/..."
                          />

                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeVideo(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </Field>

            {/* Trophies */}
            <Field className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Trophies</FieldLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendTrophy({
                      title: "",
                      description: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {trophyFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3"
                >
                  <div className="md:col-span-4">
                    <Controller
                      control={form.control}
                      name={`trophies.${index}.title`}
                      render={({ field, fieldState }) => (
                        <>
                          <Input {...field} placeholder="Award title" />

                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="md:col-span-7">
                    <Controller
                      control={form.control}
                      name={`trophies.${index}.description`}
                      render={({ field, fieldState }) => (
                        <>
                          <Input {...field} placeholder="Description" />

                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTrophy(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </Field>

            {/* Festivals */}
            <Field className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Festivals</FieldLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendFestival({
                      title: "",
                      location: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {festivalFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3"
                >
                  <div className="md:col-span-5">
                    <Controller
                      control={form.control}
                      name={`festivals.${index}.title`}
                      render={({ field, fieldState }) => (
                        <>
                          <Input {...field} placeholder="Festival name" />

                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="md:col-span-6">
                    <Controller
                      control={form.control}
                      name={`festivals.${index}.location`}
                      render={({ field, fieldState }) => (
                        <>
                          <Input {...field} placeholder="Location (optional)" />

                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFestival(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/plays">Cancel</Link>
        </Button>

        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Create Play
          </LoadingSwap>
        </Button>
      </div>
    </div>
  );
};

export default AddPlayPage;
