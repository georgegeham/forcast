import z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(8),
});

export const ProfileSchema = z.object({
  profileImage: z.string().min(1, "Profile image is required"),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  plays: z.array(z.string()).optional(),
  gender: z.enum(["male", "female"]),
  birthday: z.string().min(1, "Birthday is required"),
  phone: z.string().min(1, "Phone number is required"),
  joinedSince: z.string().optional(),
  email: z.email().min(1, "Email is required"),
  interviewer: z.string().optional(),
});

export const createPlaySchema = z.object({
  name: z.string().min(1, "Play name is required").max(100),

  bio: z.string().optional(),

  writer: z.string().min(1, "Writer is required"),

  director: z.string().min(1, "Director is required"),

  playDate: z.string().min(1, "Play date is required"),

  photosBucket: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  videoLinks: z
    .array(
      z.object({
        url: z.string().url(),
      }),
    )
    .optional(),

  trophies: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
      }),
    )
    .optional(),

  thumbnail: z.instanceof(File).optional(),

  images: z.array(z.instanceof(File)).optional(),

  festivals: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        location: z.string(),
      }),
    )
    .optional(),
});

export const updatePlaySchema = z.object({
  name: z.string().min(1, "Play name is required").max(100),
  bio: z.string().optional(),
  writer: z.string().min(1, "Writer is required"),
  director: z.string().min(1, "Director is required"),
  playDate: z.string().min(1, "Play date is required"),
  photosBucket: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  videoLinks: z
    .array(
      z.object({
        url: z.string().url(),
      }),
    )
    .optional(),
  trophies: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
      }),
    )
    .optional(),
  festivals: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        location: z.string(),
      }),
    )
    .optional(),
});
