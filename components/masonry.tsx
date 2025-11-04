'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import NextImage from 'next/image';
import { Skeleton } from '@heroui/skeleton';

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number
): number => {
  const get = useCallback(
    () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue,
    [queries, values, defaultValue]
  );

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);

    queries.forEach(q => matchMedia(q).addEventListener('change', handler));

    return () =>
      queries.forEach(q =>
        matchMedia(q).removeEventListener('change', handler)
      );
  }, [queries, get]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    ro.observe(ref.current);

    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
};

const preloadImages = async (
  urls: string[]
): Promise<{ [key: string]: { width: number; height: number } }> => {
  const dimensions: { [key: string]: { width: number; height: number } } = {};

  await Promise.all(
    urls.map(
      url =>
        new Promise<void>(resolve => {
          const img = new Image();

          img.src = url;
          img.onload = () => {
            dimensions[url] = {
              width: img.naturalWidth,
              height: img.naturalHeight,
            };
            resolve();
          };
          img.onerror = () => {
            dimensions[url] = { width: 800, height: 600 }; // fallback
            resolve();
          };
        })
    )
  );

  return dimensions;
};

interface PhotoItem {
  id: number;
  url: string;
  filename: string;
  isPlaceholder?: boolean;
}

interface GridItem extends PhotoItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PhotoroomMasonryProps {
  items: PhotoItem[];
  onImageClick?: (index: number) => void;
}

export function PhotoroomMasonry({
  items,
  onImageClick,
}: PhotoroomMasonryProps) {
  const columns = useMedia(
    [
      '(min-width:1500px)',
      '(min-width:1000px)',
      '(min-width:600px)',
      '(min-width:400px)',
    ],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, width] = useMeasure<HTMLDivElement>();
  const [imageDimensions, setImageDimensions] = useState<{
    [key: string]: { width: number; height: number };
  }>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (items.length === 0) return;

    const realItems = items.filter(i => i.url && !(i as any).isPlaceholder);

    if (realItems.length === 0) return;

    preloadImages(realItems.map(i => i.url))
      .then(dimensions => setImageDimensions(dimensions))
      .catch(error => console.error('Error preloading images:', error));
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    const gap = 12;

    return items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const isPlaceholder = (child as any).isPlaceholder || !child.url;

      let height = 300;

      if (isPlaceholder) {
        height = columnWidth * 0.75; // 4:3 aspect ratio
      } else {
        const imgDimensions = imageDimensions[child.url];

        if (imgDimensions) {
          const aspectRatio = imgDimensions.height / imgDimensions.width;

          height = columnWidth * aspectRatio;
        }
      }

      const y = colHeights[col];

      colHeights[col] += height + gap;

      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width, imageDimensions]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (grid.length === 0) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };
      const isPlaceholder = (item as any).isPlaceholder || !item.url;

      if (!hasMounted.current && !isPlaceholder) {
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: item.x,
            y: item.y + 100,
            width: item.w,
            height: item.h,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            ...animationProps,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.05,
          }
        );
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    });

    hasMounted.current = true;
  }, [grid]);

  const handleMouseEnter = (item: GridItem) => {
    gsap.to(`[data-key="${item.id}"]`, {
      scale: 0.98,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (item: GridItem) => {
    gsap.to(`[data-key="${item.id}"]`, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const containerHeight = useMemo(() => {
    if (grid.length === 0) return 0;
    const colHeights = new Array(columns).fill(0);

    grid.forEach(item => {
      const col = Math.floor((item.x || 0) / (width / columns));
      const validCol = Math.max(0, Math.min(col, columns - 1));

      colHeights[validCol] = Math.max(
        colHeights[validCol],
        (item.y || 0) + (item.h || 0)
      );
    });

    return Math.max(...colHeights);
  }, [grid, columns, width]);

  return (
    <div
      ref={containerRef}
      className='relative w-full'
      style={{ height: `${containerHeight}px` }}
    >
      {grid.map((item, index) => {
        const isLoaded = loadedImages.has(item.id);
        const isPlaceholder = (item as any).isPlaceholder || !item.url;

        return (
          <div
            key={item.id}
            className={`absolute will-change-transform z-10 p-2 ${!isPlaceholder ? 'cursor-pointer' : ''}`}
            data-key={item.id}
            style={{ width: item.w, height: item.h, opacity: 1 }}
            role={!isPlaceholder ? 'button' : undefined}
            tabIndex={!isPlaceholder ? 0 : undefined}
            onClick={() => !isPlaceholder && onImageClick?.(index)}
            onKeyDown={(e) => {
              if (!isPlaceholder && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onImageClick?.(index);
              }
            }}
            onMouseEnter={() => !isPlaceholder && handleMouseEnter(item)}
            onMouseLeave={() => !isPlaceholder && handleMouseLeave(item)}
          >
            <div className='relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-full'>
              <div className='relative flex-1 h-full'>
                {(isPlaceholder || !isLoaded) && (
                  <Skeleton className='w-full h-full rounded-lg' />
                )}
                {!isPlaceholder && item.url && (
                  <NextImage
                    fill
                    unoptimized
                    alt={item.filename}
                    className='object-cover'
                    sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                    src={item.url}
                    style={{ opacity: isLoaded ? 1 : 0 }}
                    onLoad={() => {
                      setLoadedImages(prev => new Set(prev).add(item.id));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
