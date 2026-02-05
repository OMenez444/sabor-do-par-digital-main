/// <reference types="vite/client" />

declare module 'qrcode' {
    export function toDataURL(text: string, options?: any): Promise<string>;
    export function toDataURL(canvas: HTMLCanvasElement, text: string, options?: any): Promise<string>;
}

declare module 'lucide-react';
