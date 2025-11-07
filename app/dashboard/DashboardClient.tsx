'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Card } from '@heroui/card';

import { generateWithFal, type ImageSize } from '@/lib/fal-client';
import { PROMPT_LIBRARY, type PromptCategory } from '@/lib/prompt-presets';
import { ErrorBoundary } from '@/components/error-boundary';
import { useSession } from '@/lib/auth-client';
import { useCreditsStore } from '@/lib/credits-store';
import { ImageUploadSection } from '@/components/dashboard/ImageUploadSection';
import { GenerationSettingsPanel } from '@/components/dashboard/GenerationSettingsPanel';
import { GeneratedGallery } from '@/components/dashboard/GeneratedGallery';
import { FirstTimeUserModal } from '@/components/first-time-user-modal';
import { API_CONFIG, CREDITS_CONFIG } from '@/config/app-config';

type GeneratedItem = {
  id: string;
  url: string;
  originalUrl: string;
  generationId: string;
  imageIndex: number;
};

export function DashboardClient() {
  const { data: session } = useSession();
  const { creditInfo, fetchCredits } = useCreditsStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [category, setCategory] = useState<PromptCategory>('Professional');
  const [imageSize, setImageSize] = useState<ImageSize>(
    CREDITS_CONFIG.DEFAULT_IMAGE_SIZE
  );
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingSpinners, setLoadingSpinners] = useState<string[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  const canGenerate = useMemo(() => {
    return (
      !!previewUrl &&
      !!referenceUrl &&
      creditInfo !== null &&
      creditInfo.total > 0
    );
  }, [previewUrl, referenceUrl, creditInfo]);

  // Define loadRandomPrompt before the useEffect that uses it
  const loadRandomPrompt = useCallback(() => {
    const categoryPresets = PROMPT_LIBRARY[category] || [];

    if (categoryPresets.length > 0) {
      const randomPreset =
        categoryPresets[Math.floor(Math.random() * categoryPresets.length)];

      setPrompt(randomPreset?.prompt || '');
    }
  }, [category]);

  // Load existing generations and credits on component mount
  useEffect(() => {
    if (session?.user.id) {
      loadExistingGenerations();
      fetchCredits();
    }
  }, [session?.user.id]);

  // Auto-populate prompt when category changes
  useEffect(() => {
    if (category) {
      loadRandomPrompt();
    }
  }, [category, loadRandomPrompt]);

  const loadExistingGenerations = async () => {
    try {
      setIsLoadingExisting(true);
      const response = await fetch(API_CONFIG.ENDPOINTS.USER_GENERATIONS);

      if (response.ok) {
        const data = await response.json();
        // Convert generations to items format, preferring upscaled URLs when available
        const existingItems: GeneratedItem[] = data.generations.flatMap(
          (gen: {
            id: string;
            imageUrls: string[];
            upscaledImageUrls?: string[];
          }) =>
            gen.imageUrls.map((url: string, idx: number) => ({
              id: `${gen.id}-${idx}`,
              originalUrl: url,
              url:
                gen.upscaledImageUrls?.[idx] &&
                gen.upscaledImageUrls[idx] !== ''
                  ? gen.upscaledImageUrls[idx]
                  : url,
              generationId: gen.id,
              imageIndex: idx,
            }))
        );

        setItems(existingItems);
      }
    } catch (error) {
      console.error('Error loading existing generations:', error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    // Ensure we have a reference image
    if (!referenceUrl) {
      setError(
        'Please upload an image first. A reference image is required for generation.'
      );

      return;
    }

    // Double-check credits before starting
    if (creditInfo === null || creditInfo.total <= 0) {
      setError(
        'Insufficient credits. Please purchase more credits to continue generating images.'
      );

      return;
    }

    setIsGenerating(true);
    setError(null);

    // Create single loading spinner
    const spinnerId = `loading-${Date.now()}`;

    setLoadingSpinners([spinnerId]);

    try {
      const promptToUse = prompt.trim() || 'professional headshot';

      // Credits are now checked and deducted in the FAL proxy
      // This will throw an error if insufficient credits
      const result = await generateWithFal({
        prompt: promptToUse,
        imageSize: imageSize,
        referenceImageUrl: referenceUrl, // Always required now
      });

      if (
        result?.images &&
        Array.isArray(result.images) &&
        result.images.length > 0
      ) {
        // Record the generation metadata in the database first to get the generationId
        // Credits were already deducted in the proxy, so this just saves the record
        let generationId = '';

        try {
          const response = await fetch(API_CONFIG.ENDPOINTS.RECORD_GENERATION, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: promptToUse,
              category,
              numImages: CREDITS_CONFIG.DEFAULT_NUM_IMAGES,
              imageUrls: [result.images[0].url],
              imageSize: imageSize,
              style: 'N/A', // No longer used with Seedream v4
              renderingSpeed: 'N/A', // No longer used with Seedream v4
              falRequestId: result.requestId,
            }),
          });

          if (response.ok) {
            const data = await response.json();

            generationId = data.generationId || '';
            // Refresh credits from server to get accurate breakdown
            await fetchCredits();
          }
        } catch (dbError) {
          console.error('Error recording generation metadata:', dbError);
          // Don't throw here - the generation was successful and credits were deducted
          // Refresh credits anyway to show the deduction
          await fetchCredits();
        }

        const newItem = {
          id: `${result.requestId}-0`,
          url: result.images[0].url,
          originalUrl: result.images[0].url,
          generationId: generationId || result.requestId,
          imageIndex: 0,
        };

        setItems(prev => [newItem, ...prev]); // Add to beginning for newest first
        setLoadingSpinners([]); // Clear loading spinners
      } else {
        throw new Error('Invalid response from FAL API');
      }
    } catch (err) {
      console.error('Generation error:', err);

      // Handle insufficient credits error from the proxy
      if (err instanceof Error && err.message.includes('402')) {
        setError(
          'Insufficient credits. Please purchase more credits to continue.'
        );
      } else {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to generate images. Please try again.';

        setError(errorMessage);
      }

      // Refresh credits in case they were deducted before an error
      await fetchCredits();
    } finally {
      setIsGenerating(false);
      setLoadingSpinners([]); // Clear loading spinners on error too
    }
  }, [
    canGenerate,
    referenceUrl,
    creditInfo,
    prompt,
    category,
    imageSize,
    fetchCredits,
  ]);

  return (
    <ErrorBoundary>
      {session?.user.id && <FirstTimeUserModal userId={session.user.id} />}
      <section className='w-full min-h-screen'>
        <div className='w-full px-6 py-8'>
          <div className='container mx-auto max-w-7xl'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
              <div className='lg:col-span-4 xl:col-span-3'>
                <div className='lg:sticky lg:top-20 flex flex-col gap-6'>
                  <ImageUploadSection
                    error={error}
                    previewUrl={previewUrl}
                    onPreviewChange={setPreviewUrl}
                    onReferenceChange={setReferenceUrl}
                  />
                  <Card className='bg-content1/60 border border-default-100'>
                    <div className='p-6 flex flex-col gap-6'>
                      <GenerationSettingsPanel
                        canGenerate={canGenerate}
                        category={category}
                        credits={creditInfo?.total ?? null}
                        imageSize={imageSize}
                        isGenerating={isGenerating}
                        prompt={prompt}
                        onCategoryChange={setCategory}
                        onGenerate={handleGenerate}
                        onImageSizeChange={setImageSize}
                        onLoadRandomPrompt={loadRandomPrompt}
                        onPromptChange={setPrompt}
                      />
                    </div>
                  </Card>
                </div>
              </div>

              <div className='lg:col-span-8 xl:col-span-9'>
                <GeneratedGallery
                  isLoadingExisting={isLoadingExisting}
                  items={items}
                  loadingSpinners={loadingSpinners}
                  onItemDeleted={itemId => {
                    // Remove the deleted item from the list
                    setItems(prevItems =>
                      prevItems.filter(item => item.id !== itemId)
                    );
                  }}
                  onItemUpdated={(itemId, newUrl) => {
                    // Update the item with the upscaled URL
                    setItems(prevItems =>
                      prevItems.map(item =>
                        item.id === itemId ? { ...item, url: newUrl } : item
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
