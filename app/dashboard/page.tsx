"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { generateWithFal, uploadToFal } from "@/lib/fal-client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ALL_CATEGORIES, PROMPT_LIBRARY, getRandomPrompt, type PromptCategory } from "@/lib/prompt-presets";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import type { Selection } from "@react-types/shared";

type GeneratedItem = {
  id: string;
  url: string;
};

const SAMPLE_IMAGES = [
  "/images/sample1.png",
  "/images/sample2.png",
  "/images/sample3.png",
  "/images/sample4.png",
  "/images/sample5.png",
  "/images/sample6.png",
  "/images/sample7.png",
  "/images/sample8.png",
  "/images/sample9.png",
];

export default function DashboardPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [count, setCount] = useState<number>(1);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [category, setCategory] = useState<PromptCategory>("Professional");
  const [prompt, setPrompt] = useState<string>(
    "Ultra-clean studio headshot, soft key light, neutral gray seamless background, natural skin tone, crisp focus, shallow depth of field, editorial lighting, professional portrait",
  );

  const canGenerate = useMemo(() => !!previewUrl && count >= 1 && count <= 4, [previewUrl, count]);

  const handleSelectCount = (value: number) => {
    setCount(value);
  };
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    const clamped = Math.max(1, Math.min(4, val));
    setCount(clamped);
  };

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setReferenceUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Upload to fal storage for use as reference image
    uploadToFal(file)
      .then((remoteUrl) => setReferenceUrl(remoteUrl))
      .catch(() => setReferenceUrl(null));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    try {
      const categoryPresets = PROMPT_LIBRARY[category] || [];
      const randomPreset = categoryPresets[Math.floor(Math.random() * categoryPresets.length)];
      const promptToUse = (prompt && prompt.trim().length > 0) ? prompt : (randomPreset?.prompt || "");
      if (!prompt || prompt.trim().length === 0) {
        setPrompt(promptToUse);
      }
      const result = await generateWithFal({
        prompt: promptToUse,
        numImages: count,
        imageSize: "square_hd",
        style: "AUTO",
        renderingSpeed: "BALANCED",
        referenceImageUrl: referenceUrl ?? undefined,
      });
      setItems((prev) => [
        ...prev,
        ...result.images.map((img, idx) => ({ id: `${result.requestId}-${idx}`, url: img.url })),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setItems([]);
  };

  return (
    <section className="w-full">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left control panel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-20 flex flex-col gap-6">
              <Card className="bg-content1/60 border border-default-100">
                <CardHeader className="text-large font-semibold">Upload</CardHeader>
                <CardBody className="flex flex-col gap-6">
                  <Input
                    ref={fileRef as any}
                    type="file"
                    accept="image/*"
                    aria-label="Upload your image"
                    onChange={handleFileChange}
                  />

                  {previewUrl && (
                    <div className="flex justify-center">
                      <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-default-100 bg-content2/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="object-contain object-center w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                      className="max-w-xs"
                      label="Category"
                      selectedKeys={[category]}
                      onSelectionChange={(keys: Selection) => {
                        const key = Array.from(keys as Set<string>)[0] as PromptCategory;
                        setCategory(key);
                        const first = PROMPT_LIBRARY[key][0];
                        if (first) setPrompt("");
                      }}
                    >
                      {ALL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat}>{cat}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Textarea
                    aria-label="Custom prompt"
                    label="Prompt"
                    minRows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <Input
                    type="number"
                    label="Images per run"
                    labelPlacement="outside"
                    size="sm"
                    min={1}
                    max={4}
                    step={1}
                    value={String(count)}
                    onChange={handleCountChange}
                    classNames={{
                      base: "w-24 mx-auto",
                      inputWrapper: "h-8",
                      input: "text-center",
                      label: "text-center",
                    }}
                  />

                  <Button color="primary" size="lg" isDisabled={!canGenerate || isGenerating} onPress={handleGenerate}>
                    {isGenerating ? "Generating…" : "Generate"}
                  </Button>

                  <Button variant="light" size="sm" onPress={handleClear} isDisabled={items.length === 0}>
                    Clear results
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Right results panel */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50"
                >
                  <Image src={it.url} alt="Generated" fill className="object-contain object-center" />
                </div>
              ))}

              {items.length === 0 && (
                <div className="col-span-full">
                  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center">
                    <p className="text-default-500 text-sm">
                      Your generated images will appear here in a 3-column grid. Upload an image and click Generate to
                      get started.
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          aria-hidden
                          className="relative aspect-square rounded-xl border-2 border-dashed border-default-200 bg-content2/40"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


