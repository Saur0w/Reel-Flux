"use client";

import { useEffect, useRef } from "react";
import Lenis, { type ScrollCallback } from "lenis";

export function useScroll() {
    const scrollX = useRef(0);
    const targetX = useRef(0);
    const velocity = useRef(0);

    useEffect(() => {
        const lenis = new Lenis({
            orientation: "horizontal",
            gestureOrientation: "both",
            smoothWheel: true,
            syncTouch: true
        });

        lenis.on("scroll", ((e) => {
            targetX.current += e.velocity * 0.005;
        }) as ScrollCallback);

        const handleWheel = (e: WheelEvent) => {
            const delta = e.deltaY || e.deltaX;
            targetX.current += delta * 0.003;
        };

        window.addEventListener("wheel", handleWheel, { passive: true });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        const rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("wheel", handleWheel);
            lenis.destroy();
        };
    }, []);
    return { scrollX, targetX, velocity };
}