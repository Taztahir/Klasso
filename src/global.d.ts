// Allows TypeScript to accept bare CSS side-effect imports
// (e.g. `import '@/index.css'` in layout.tsx)
declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}
