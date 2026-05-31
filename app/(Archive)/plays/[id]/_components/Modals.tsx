"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  addPlayImage,
  addPlayVideo,
  addPlayTrophy,
  addPlayFestival,
} from "@/drizzle/actions/Plays";
import { Modal, ModalInput, ModalActions } from "./UI";

/* ─── Add Photos Modal ────────────────────────────────────────── */

export function AddPhotosModal({
  playId,
  onClose,
  onAdded,
}: {
  playId: string;
  onClose: () => void;
  onAdded: (imgs: { id: string; imageUrl: string }[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    if (!newFiles.length) return;
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit() {
    if (!files.length) return;
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      // addPlayImage({ playId, files: FormData })
      const result = await addPlayImage({ playId, files: formData });
      if (result?.error) throw new Error(result.message);
      toast.success("Photos added!");
      // Server doesn't return the new image objects; close and let parent revalidate
      onAdded([]);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add photos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add Photos" onClose={onClose}>
      <label className="flex items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-stone-700 hover:border-amber-400/50 rounded-xl cursor-pointer transition-colors text-stone-500 hover:text-stone-300 text-sm">
        <ImagePlus className="w-5 h-5" />
        <span>Click to select images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
              <Image src={src} alt="" fill className="object-cover" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1 h-5 w-5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0"
                onClick={() => removeFile(i)}
              >
                <X className="w-3 h-3 text-white" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ModalActions
        onClose={onClose}
        onSubmit={submit}
        loading={loading}
        disabled={!files.length}
        submitLabel="Upload"
        loadingLabel="Uploading…"
      />
    </Modal>
  );
}

/* ─── Add Video Modal ─────────────────────────────────────────── */

export function AddVideoModal({
  playId,
  onClose,
  onAdded,
}: {
  playId: string;
  onClose: () => void;
  onAdded: (video: { id: string; url: string }) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!url.trim()) return;
    setLoading(true);
    try {
      // addPlayVideo({ playId, url })
      const result = await addPlayVideo({ playId, url: url.trim() });
      if (result?.error) throw new Error(result.message);
      toast.success("Video added!");
      // Parent merges playId in; we just pass id + url here
      onAdded({ id: crypto.randomUUID(), url: url.trim() });
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add video");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add Video Link" onClose={onClose}>
      <ModalInput
        label="Video URL"
        type="url"
        value={url}
        onChange={setUrl}
        placeholder="https://drive.google.com/file/d/... or https://youtube.com/watch?v=..."
      />
      <ModalActions
        onClose={onClose}
        onSubmit={submit}
        loading={loading}
        disabled={!url.trim()}
        submitLabel="Add Video"
        loadingLabel="Saving…"
      />
    </Modal>
  );
}

/* ─── Add Trophy Modal ────────────────────────────────────────── */

export function AddTrophyModal({
  playId,
  onClose,
  onAdded,
}: {
  playId: string;
  onClose: () => void;
  onAdded: (trophy: { id: string; title: string; description?: string | null }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      // addPlayTrophy({ playId, trophy: { title, description? } })
      const result = await addPlayTrophy({
        playId,
        trophy: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      });
      if (result?.error) throw new Error(result.message);
      toast.success("Trophy added!");
      // Parent normalises description to null and adds playId
      onAdded({ id: crypto.randomUUID(), title: title.trim(), description: description.trim() || null });
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add trophy");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add Trophy" onClose={onClose}>
      <div className="space-y-3">
        <ModalInput
          label="Award Title *"
          value={title}
          onChange={setTitle}
          placeholder="Best Drama"
        />
        <ModalInput
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Optional details…"
        />
      </div>
      <ModalActions
        onClose={onClose}
        onSubmit={submit}
        loading={loading}
        disabled={!title.trim()}
        submitLabel="Add Trophy"
        loadingLabel="Saving…"
      />
    </Modal>
  );
}

/* ─── Add Festival Modal ──────────────────────────────────────── */

export function AddFestivalModal({
  playId,
  onClose,
  onAdded,
}: {
  playId: string;
  onClose: () => void;
  onAdded: (festival: { id: string; playId: string; title: string; location: string | null }) => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      // addPlayFestival({ playId, festival: { title, location? } })
      const result = await addPlayFestival({
        playId,
        festival: {
          title: title.trim(),
          location: location.trim() || null,
        },
      });
      if (result?.error) throw new Error(result.message);
      toast.success("Festival added!");
      // Include playId so the object fully satisfies LocalFestival in the parent
      onAdded({ id: crypto.randomUUID(), playId, title: title.trim(), location: location.trim() || null });
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add festival");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add Festival" onClose={onClose}>
      <div className="space-y-3">
        <ModalInput
          label="Festival Name *"
          value={title}
          onChange={setTitle}
          placeholder="Edinburgh Fringe Festival"
        />
        <ModalInput
          label="Location"
          value={location}
          onChange={setLocation}
          placeholder="Edinburgh, Scotland"
        />
      </div>
      <ModalActions
        onClose={onClose}
        onSubmit={submit}
        loading={loading}
        disabled={!title.trim()}
        submitLabel="Add Festival"
        loadingLabel="Saving…"
      />
    </Modal>
  );
}