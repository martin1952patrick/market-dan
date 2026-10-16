'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    loading?: 'lazy' | 'eager';
    unoptimized?: boolean;
    watermark?: boolean;
    [key: string]: any;
}

const WATERMARK_TEXT = 'Nairobi Spot';
const WATERMARK_MIN_WIDTH = 200;

const WatermarkOverlay = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
    >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern
                    id="ns-watermark-pattern"
                    width="170"
                    height="90"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-28)"
                >
                    <text
                        x="85"
                        y="45"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontFamily="sans-serif"
                        fontWeight="700"
                        fontSize="15"
                        fill="rgba(255,255,255,0.45)"
                        stroke="rgba(0,0,0,0.18)"
                        strokeWidth="0.4"
                        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.35))' }}
                    >
                        {WATERMARK_TEXT}
                    </text>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ns-watermark-pattern)" />
        </svg>
        <span
            className="absolute bottom-1.5 right-2 font-bold"
            style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 'clamp(10px, 3.5%, 18px)',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                fontFamily: 'sans-serif',
            }}
        >
            {WATERMARK_TEXT}
        </span>
    </div>
);

const AppImage = memo(function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 85,
    placeholder = 'empty',
    blurDataURL,
    fill = false,
    sizes,
    onClick,
    fallbackSrc = '/assets/images/no_image.png',
    loading = 'lazy',
    unoptimized = false,
    watermark,
    ...props
}: AppImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const isExternalUrl = useMemo(() => typeof imageSrc === 'string' && imageSrc.startsWith('http'), [imageSrc]);
    const resolvedUnoptimized = unoptimized || isExternalUrl;

    const isFallback = imageSrc === fallbackSrc || (typeof imageSrc === 'string' && imageSrc.includes('no_image.png'));
    const isSvg = typeof imageSrc === 'string' && imageSrc.endsWith('.svg');
    const isSmall = !fill && (width ?? 400) < WATERMARK_MIN_WIDTH;
    const isRound = typeof className === 'string' && className.includes('rounded-full');
    const showWatermark =
        watermark !== undefined ? watermark : !(isFallback || isSvg || isSmall || isRound);

    const handleError = useCallback(() => {
        if (!hasError && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
        setIsLoading(false);
    }, [hasError, imageSrc, fallbackSrc]);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
    }, []);

    const imageClassName = useMemo(() => {
        const classes = [className];
        if (isLoading) classes.push('bg-gray-200');
        if (onClick) classes.push('cursor-pointer hover:opacity-90 transition-opacity duration-200');
        return classes.filter(Boolean).join(' ');
    }, [className, isLoading, onClick]);

    const imageProps = useMemo(() => {
        const baseProps: any = {
            src: imageSrc,
            alt,
            className: imageClassName,
            quality,
            placeholder,
            unoptimized: resolvedUnoptimized,
            onError: handleError,
            onLoad: handleLoad,
            onClick,
        };

        if (priority) {
            baseProps.priority = true;
        } else {
            baseProps.loading = loading;
        }

        if (blurDataURL && placeholder === 'blur') {
            baseProps.blurDataURL = blurDataURL;
        }

        return baseProps;
    }, [imageSrc, alt, imageClassName, quality, placeholder, blurDataURL, resolvedUnoptimized, priority, loading, handleError, handleLoad, onClick]);

    if (fill) {
        return (
            <div className="relative" style={{ width: '100%', height: '100%' }}>
                <Image
                    {...imageProps}
                    fill
                    sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                    style={{ objectFit: 'cover' }}
                    {...props}
                />
                {showWatermark && <WatermarkOverlay />}
            </div>
        );
    }

    if (showWatermark) {
        // The overlay is positioned against the nearest positioned ancestor
        // (all photo wrappers in the app are `relative`/`overflow-hidden`),
        // so we use a wrapper that mirrors the image's own sizing classes.
        return (
            <WatermarkedFrame className={className}>
                <Image
                    {...imageProps}
                    width={width || 400}
                    height={height || 300}
                    sizes={sizes}
                    {...props}
                />
            </WatermarkedFrame>
        );
    }

    return (
        <Image
            {...imageProps}
            width={width || 400}
            height={height || 300}
            sizes={sizes}
            {...props}
        />
    );
});

/**
 * Wraps an image with a relatively-positioned frame that carries the layout
 * (size/rounding/grayscale-free) classes so the overlay lines up exactly with
 * the photo, while the <img> itself fills the frame.
 */
function WatermarkedFrame({ className, children }: { className: string; children: React.ReactElement<any> }) {
    const layoutClasses = (className || '')
        .split(/\s+/)
        .filter((c) => /^(w-|h-|sm:w-|sm:h-|md:w-|md:h-|lg:w-|lg:h-|max-|min-|aspect-|rounded|block|inline|flex-shrink)/.test(c))
        .join(' ');
    const hasWidth = /(^|\s)(sm:|md:|lg:)?w-/.test(className || '') && !/(^|\s)w-auto/.test(className || '');
    const hasHeight = /(^|\s)(sm:|md:|lg:)?h-/.test(className || '');
    const child = React.cloneElement(children, {
        style: {
            ...(children.props.style || {}),
            ...(hasWidth ? { width: '100%' } : {}),
            ...(hasHeight ? { height: '100%' } : {}),
        },
    });
    return (
        <span className={`relative inline-block overflow-hidden align-top ${layoutClasses}`} style={{ lineHeight: 0 }}>
            {child}
            <WatermarkOverlay />
        </span>
    );
}

AppImage.displayName = 'AppImage';

export default AppImage;