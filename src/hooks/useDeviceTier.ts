import { useMemo } from 'react';

export type DeviceTier = 'high' | 'low';

export function useDeviceTier(): DeviceTier {
    return useMemo(() => {
        // Check for mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
            .test(navigator.userAgent);

        // Check for low memory (if available)
        const lowMemory = (navigator as any).deviceMemory !== undefined &&
            (navigator as any).deviceMemory < 4;

        // Check for low core count
        const lowCores = navigator.hardwareConcurrency !== undefined &&
            navigator.hardwareConcurrency < 4;

        if (isMobile || lowMemory || lowCores) return 'low';
        return 'high';
    }, []);
}
