import { useLayoutEffect, useRef, useCallback, ReactNode } from 'react';
import Lenis from 'lenis';

interface ScrollStackItemProps {
    children: ReactNode;
    itemClassName?: string;
}

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
    <div className={`scroll-stack-card group origin-top shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] min-h-[50vh] w-full my-8 p-6 md:p-10 rounded-[40px] box-border relative [will-change:transform,filter] [backface-visibility:hidden] [transform-style:preserve-3d] transition-all duration-300 hover:-translate-y-2 ${itemClassName}`.trim()}>
        {children}
    </div>
);

interface ScrollStackProps {
    children: ReactNode;
    className?: string;
    itemDistance?: number;
    itemScale?: number;
    itemStackDistance?: number;
    stackPosition?: string | number;
    scaleEndPosition?: string | number;
    baseScale?: number;
    scaleDuration?: number;
    rotationAmount?: number;
    blurAmount?: number;
    useWindowScroll?: boolean;
    onStackComplete?: () => void;
}

const ScrollStack = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    rotationAmount = 0,
    blurAmount = 0,
    useWindowScroll = false,
    onStackComplete
}: ScrollStackProps) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const stackCompletedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const cardOffsetsRef = useRef<number[]>([]);
    const lastTransformsRef = useRef(new Map());
    const isUpdatingRef = useRef(false);

    const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return typeof value === 'string' ? parseFloat(value) : value;
    }, []);

    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
            };
        } else {
            const scroller = scrollerRef.current!;
            return {
                scrollTop: scroller.scrollTop,
                containerHeight: scroller.clientHeight,
            };
        }
    }, [useWindowScroll]);

    const measureOffsets = useCallback(() => {
        if (!cardsRef.current.length) return;

        cardOffsetsRef.current = cardsRef.current.map(card => {
            if (useWindowScroll) {
                const rect = card.getBoundingClientRect();
                return rect.top + window.scrollY;
            } else {
                return card.offsetTop;
            }
        });
    }, [useWindowScroll]);

    const updateCardTransforms = useCallback((customScroll?: number) => {
        if (!cardsRef.current.length || isUpdatingRef.current) return;

        isUpdatingRef.current = true;

        const { scrollTop: currentScroll, containerHeight } = getScrollData();
        const scrollTop = customScroll ?? currentScroll;

        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        const endElement = scrollerRef.current?.querySelector('.scroll-stack-end');

        // Measure end element offset (rarely changes, but for stability)
        const endElementTop = endElement ? (useWindowScroll ? (endElement.getBoundingClientRect().top + window.scrollY) : (endElement as HTMLElement).offsetTop) : 0;

        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const cardTop = cardOffsetsRef.current[i] || 0;
            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
            // Stop pinning a bit before the end marker hits to allow smooth unpinning
            const pinEnd = endElementTop - containerHeight;

            // Calculate progress for scaling
            let scaleProgress = 0;
            if (scrollTop >= triggerStart) {
                scaleProgress = Math.min(1, (scrollTop - triggerStart) / (triggerEnd - triggerStart));
            }

            const targetScale = baseScale + i * itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

            let blur = 0;
            if (blurAmount) {
                let topCardIndex = 0;
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jCardTop = cardOffsetsRef.current[j] || 0;
                    const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                }

                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * blurAmount);
                }
            }

            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
            }

            const newTransform = {
                translateY: translateY,
                scale: scale,
                rotation: rotation,
                blur: blur
            };

            const lastTransform = lastTransformsRef.current.get(i);
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.01 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.0001 ||
                Math.abs(lastTransform.rotation - newTransform.rotation) > 0.01 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.01;

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

                card.style.transform = transform;
                card.style.filter = filter;

                lastTransformsRef.current.set(i, newTransform);
            }

            if (i === cardsRef.current.length - 1) {
                const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
                if (isInView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    onStackComplete?.();
                } else if (!isInView && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        });

        isUpdatingRef.current = false;
    }, [
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        parsePercentage,
        getScrollData
    ]);

    const handleScroll = useCallback(({ scroll }: any) => {
        updateCardTransforms(scroll);
    }, [updateCardTransforms]);

    const setupLenis = useCallback(() => {
        const lenisOptions: any = {
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            autoRaf: false
        };

        if (!useWindowScroll) {
            lenisOptions.wrapper = scrollerRef.current;
            lenisOptions.content = scrollerRef.current?.querySelector('.scroll-stack-inner') as HTMLElement;
        }

        const lenis = new Lenis(lenisOptions);
        lenis.on('scroll', handleScroll);

        const raf = (time: number) => {
            lenis.raf(time);
            animationFrameRef.current = requestAnimationFrame(raf);
        };
        animationFrameRef.current = requestAnimationFrame(raf);

        lenisRef.current = lenis;
        return lenis;
    }, [handleScroll, useWindowScroll]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        // Localize card selection to this specific instance
        const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLElement[];

        cardsRef.current = cards;

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                card.style.marginBottom = `${itemDistance}px`;
            }
            card.style.willChange = 'transform, filter';
            card.style.transformOrigin = 'top center';
            card.style.backfaceVisibility = 'hidden';
            card.style.transform = 'translate3d(0,0,0)';
        });

        // Measure after a short delay and on resize
        const handleResize = () => {
            measureOffsets();
            updateCardTransforms();
        };

        const timer = setTimeout(() => {
            measureOffsets();
            setupLenis();
            updateCardTransforms();
            window.addEventListener('resize', handleResize);
        }, 100);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            stackCompletedRef.current = false;
            cardsRef.current = [];
            lastTransformsRef.current.clear();
            isUpdatingRef.current = false;
        };
    }, [
        itemDistance,
        useWindowScroll,
        setupLenis,
        measureOffsets,
        updateCardTransforms
    ]);

    return (
        <div
            className={`scroll-stack-scroller relative w-full ${useWindowScroll ? 'overflow-visible' : 'h-full overflow-y-auto overscroll-contain scroll-smooth'} ${className}`.trim()}
            ref={scrollerRef}
        >
            <div className={`scroll-stack-inner pt-[1px] px-0 md:px-0 pb-[100vh] min-h-screen overflow-visible`}>
                {children}
                <div className="scroll-stack-end w-full h-1" />
            </div>
        </div>
    );
};

export default ScrollStack;
