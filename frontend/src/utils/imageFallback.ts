import type { SyntheticEvent } from 'react';

export const FALLBACK_IMAGE = '/404.jpg';

export function handleImageError(
    event: SyntheticEvent<HTMLImageElement, Event>,
    fallback: string = FALLBACK_IMAGE
) {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === 'true') {
        return;
    }
    target.dataset.fallbackApplied = 'true';
    target.src = fallback;
}
