/// <reference types="vite/client" />

declare module '*.glb' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module 'meshline' {
    import { BufferGeometry, Material, ShaderMaterial } from 'three';

    export class MeshLineGeometry extends BufferGeometry {
        constructor();
        setPoints(points: any[]): void;
    }

    export class MeshLineMaterial extends ShaderMaterial {
        constructor(parameters?: any);
        color: any;
        map: any;
        useMap: any;
        alphaMap: any;
        useAlphaMap: any;
        resolution: any;
        sizeAttenuation: any;
        lineWidth: any;
        near: any;
        far: any;
        dashArray: any;
        dashOffset: any;
        dashRatio: any;
        visibility: any;
        alphaTest: any;
        repeat: any;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: any;
            meshLineMaterial: any;
        }
    }
}
