"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/* ─── SectionHeading ─────────────────────────────────────────── */

export function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-amber-400/60 text-xs tracking-[0.25em] uppercase font-light">
        {label}
      </span>
      <div className="flex-1 h-px bg-stone-800" />
    </div>
  );
}

/* ─── Modal Shell ─────────────────────────────────────────────── */
// Wraps shadcn <Dialog> so all modals share one consistent open/close pattern.

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-stone-950 border border-stone-800 text-stone-100 rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-stone-100 text-base font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/* ─── ModalInput ─────────────────────────────────────────────── */
// shadcn Label + Input pair, styled to match the dark theme.

export function ModalInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  id?: string;
}) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={inputId}
        className="text-xs text-stone-500 uppercase tracking-wider"
      >
        {label}
      </Label>
      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-stone-900 border-stone-700 text-stone-200 placeholder:text-stone-600 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/50"
      />
    </div>
  );
}

/* ─── ModalActions ───────────────────────────────────────────── */

export function ModalActions({
  onClose,
  onSubmit,
  loading,
  disabled,
  submitLabel,
  loadingLabel,
}: {
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  disabled?: boolean;
  submitLabel: string;
  loadingLabel: string;
}) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        className="text-stone-400 hover:text-stone-200 hover:bg-stone-800"
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={loading || disabled}
        className="bg-amber-400 text-stone-950 font-semibold hover:bg-amber-300 disabled:opacity-40"
      >
        {loading ? loadingLabel : submitLabel}
      </Button>
    </div>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────── */

export function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { id: string; imageUrl: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X className="w-7 h-7" />
      </button>

      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-stone-400 text-sm tracking-widest">
        {index + 1} / {images.length}
      </span>

      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft className="w-9 h-9" />
        </button>
      )}

      <div
        className="relative max-w-5xl w-full max-h-[85vh] mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index].imageUrl}
          alt="Preview"
          width={1200}
          height={800}
          className="object-contain w-full max-h-[85vh] rounded-lg"
        />
      </div>

      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight className="w-9 h-9" />
        </button>
      )}
    </div>
  );
}