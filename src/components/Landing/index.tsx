"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./style.module.scss";
import { images } from "@/lib/data";
import { useLenisScroll } from "@/hooks/useScroll";

const Scene = dynamic(() => import("./scene"), { ssr: false });

export default function Landing() {
    const wrapperRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLenisScroll(wrapperRef, contentRef);

    return (
        <main ref={wrapperRef} className={styles.container}>
            {/* Invisible spacer: gives Lenis a scroll range (one lap of the reel) */}
            <div
                ref={contentRef}
                className={styles.scrollContent}
                style={{ height: `calc(100dvh + ${images.length * 60}vh)` }}
            />

            <div className={styles.canvasWrapper}>
                <Scene />
            </div>

            <div className={styles.overlay}>
                <header className={styles.header}>
                    <div className={styles.brand}>
                        <span>Saurow</span>
                    </div>
                    <span className={styles.crossMark}>+</span>
                </header>

                <footer className={styles.footer}>
                    <div className={styles.counter}>
                        <span>/{images.length} Photos</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}