import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);
gsap.config({ nullTargetWarn: false });
ScrollTrigger.config({ ignoreMobileResize: true });

// The same two curves as --ease-out and --ease-in-out in global.css
CustomEase.create('uiOut', '0.23,1,0.32,1');
CustomEase.create('uiInOut', '0.77,0,0.175,1');

export const root = document.documentElement;

/** Set by the head script unless the visitor asked for reduced motion. */
export const motionOn = (): boolean => root.classList.contains('motion');

export const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Mouse or trackpad: touch screens fire fake hovers on tap. */
export const finePointer = (): boolean => matchMedia('(hover: hover) and (pointer: fine)').matches;

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export { gsap, ScrollTrigger, Flip };
