'use client';

import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import Image from 'next/image';
import {
    getCachedWatermarkSettings,
    loadWatermarkSettings,
    positionToFlex,
    subscribeWatermarkSettings,
    WatermarkSettings,
} from '@/lib/watermark';

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

const WatermarkOverlay = () => {
    const [settings, setSettings] = useState<WatermarkSettings>(getCachedWatermarkSettings());

    useEffect(() => {
        let active = true;
        loadWatermarkSettings().then((s) => {
            if (active) setSettings(s);
        });
        const unsub = subscribeWatermarkSettings((s) => {
            if (active) setSettings(s);
        });
        return () => {
            active = false;
            unsub();
        };
    }, []);

    const flex = positionToFlex(settings.position);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 overflow-hidden flex p-[4%]"
            style={{ zIndex: 1, ...flex }}
        >
            <span
                className="font-bold whitespace-nowrap"
                style={{
                    color: `rgba(255,255,255,${settings.opacity})`,
                    fontSize: 'clamp(12px, 9%, 40px)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.55)',
                    fontFamily: 'sans-serif',
                    transform: 'rotate(-10deg)',
                }}
            >
                {WATERMARK_TEXT}
            </span>
        </div>
    );
};

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
    const isAlreadyStamped = typeof imageSrc === 'string' && imageSrc.includes('__ns_wm__');
    const isSmall = !fill && (width ?? 400) < WATERMARK_MIN_WIDTH;
    const isRound = typeof className === 'string' && className.includes('rounded-full');
    const showWatermark =
        watermark !== undefined ? watermark : !(isFallback || isSvg || isSmall || isRound || isAlreadyStamped);

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