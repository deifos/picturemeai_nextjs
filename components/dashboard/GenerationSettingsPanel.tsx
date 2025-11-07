'use client';

import type { Selection } from '@react-types/shared';

import { memo, useState, useEffect } from 'react';
import { Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Select, SelectItem } from '@heroui/select';
import { Spinner } from '@heroui/spinner';

import { type ImageSize } from '@/lib/fal-client';
import { ALL_CATEGORIES, type PromptCategory } from '@/lib/prompt-presets';
import { RefreshIcon } from '@/components/icons';

interface GenerationSettingsPanelProps {
  category: PromptCategory;
  imageSize: ImageSize;
  prompt: string;
  credits: number | null;
  canGenerate: boolean;
  isGenerating: boolean;
  onCategoryChange: (category: PromptCategory) => void;
  onImageSizeChange: (size: ImageSize) => void;
  onPromptChange: (prompt: string) => void;
  onLoadRandomPrompt: () => void;
  onGenerate: () => void;
}

export const GenerationSettingsPanel = memo(function GenerationSettingsPanel({
  category,
  imageSize,
  prompt,
  credits,
  canGenerate,
  isGenerating,
  onCategoryChange,
  onImageSizeChange,
  onPromptChange,
  onLoadRandomPrompt,
  onGenerate,
}: GenerationSettingsPanelProps) {
  const showCreditsWarning = credits !== null && credits <= 0;

  // Local state for instant typing feedback
  const [localPrompt, setLocalPrompt] = useState(prompt);

  // Sync local state when prop changes (e.g., category change or random prompt)
  useEffect(() => {
    setLocalPrompt(prompt);
  }, [prompt]);

  // Sync to parent only when user is done editing (onBlur)
  const handleBlur = () => {
    onPromptChange(localPrompt);
  };

  // Sync to parent before generating
  const handleGenerate = () => {
    onPromptChange(localPrompt);
    onGenerate();
  };

  return (
    <>
      <div className='flex w-full flex-col gap-4'>
        <Select
          className='w-full'
          label='Category'
          selectedKeys={[category]}
          onSelectionChange={(keys: Selection) => {
            const key = Array.from(keys as Set<string>)[0] as PromptCategory;

            onCategoryChange(key);
          }}
        >
          {ALL_CATEGORIES.map(cat => (
            <SelectItem key={cat}>{cat}</SelectItem>
          ))}
        </Select>

        <div className='flex flex-col gap-2'>
          <label
            className='text-sm font-medium text-foreground'
            htmlFor='image-size-buttons'
          >
            Image Size
          </label>
          <div
            aria-labelledby='image-size-label'
            className='flex  gap-2 justify-center'
            id='image-size-buttons'
            role='group'
          >
            {[
              { value: 'portrait_16_9' as ImageSize, label: 'Portrait' },
              { value: 'square_hd' as ImageSize, label: 'Square' },
              { value: 'landscape_16_9' as ImageSize, label: 'Landscape' },
            ].map(sizeOption => (
              <Button
                key={sizeOption.value}
                aria-pressed={imageSize === sizeOption.value}
                className='min-w-[80px]'
                color={imageSize === sizeOption.value ? 'primary' : 'default'}
                size='sm'
                variant={imageSize === sizeOption.value ? 'solid' : 'bordered'}
                onPress={() => onImageSizeChange(sizeOption.value)}
              >
                {sizeOption.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className='relative'>
        <Textarea
          disableAutosize
          aria-label='Custom prompt'
          description='Auto-generated prompt from selected category. Edit or refresh for variations.'
          label='Prompt'
          rows={5}
          value={localPrompt}
          onBlur={handleBlur}
          onChange={e => setLocalPrompt(e.target.value)}
        />
        <Button
          isIconOnly
          className='absolute top-1 right-1 z-10'
          size='sm'
          title='Get a different prompt from this category'
          variant='light'
          onPress={onLoadRandomPrompt}
        >
          <RefreshIcon />
        </Button>
      </div>

      <Button
        color='primary'
        isDisabled={!canGenerate || isGenerating}
        size='lg'
        onPress={handleGenerate}
      >
        {isGenerating ? (
          <div className='flex items-center gap-2'>
            <Spinner size='sm' />
            Generating…
          </div>
        ) : !canGenerate ? (
          'Upload image to generate'
        ) : credits === null || credits <= 0 ? (
          'No credits available'
        ) : (
          'Generate'
        )}
      </Button>

      {showCreditsWarning && (
        <div className='text-center'>
          <p className='text-danger text-sm mb-2'>
            You have no credits remaining.
          </p>
          <Button
            as={Link}
            color='primary'
            href='/#pricing'
            size='lg'
            variant='bordered'
          >
            Buy Credits
          </Button>
        </div>
      )}
    </>
  );
});
