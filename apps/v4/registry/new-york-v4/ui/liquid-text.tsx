"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface LiquidTextProps {
    /** Text to display */
    text?: string;
    /** Font size in pixels */
    fontSize?: number;
    /** Font family */
    font?: string;
    /** Fixed text color (overrides theme colors) */
    color?: string;
    /** Text color in light mode */
    lightColor?: string;
    /** Text color in dark mode */
    darkColor?: string;
    /** Additional CSS classes */
    className?: string;
}

const createTextTexture = (text: string, size: number, font: string, color: string): THREE.Texture => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
};

const vertexShader = `
    varying vec2 vUv;
    uniform vec3 uDisplacement;

    float easeInOutCubic(float x) {
        return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    void main() {
        vUv = uv;
        vec3 displaced = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        float dist = length(uDisplacement - worldPosition.rgb);
        float minDistance = 3.0;

        if (dist < minDistance) {
            float mapped = map(dist, 0.0, minDistance, 1.0, 0.0);
            displaced.z += easeInOutCubic(mapped);
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`;

export function LiquidText({
    text = "Liquid Text",
    fontSize = 200,
    font = "Inter, sans-serif",
    color,
    lightColor = "#000000",
    darkColor = "#ffffff",
    className,
}: LiquidTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width || 1;
        const height = rect.height || 1;
        if (height === 0) return;

        const scene = new THREE.Scene();
        scene.background = null;

        const cameraDistance = 5;
        const aspect = width / height;
        const camera = new THREE.OrthographicCamera(
            -cameraDistance * aspect, cameraDistance * aspect,
            cameraDistance, -cameraDistance, 0.01, 1000
        );
        camera.position.set(0, -10, 5);
        camera.lookAt(0, 0, 0);

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
            const fallback = document.createElement("div");
            fallback.className = "flex h-full w-full items-center justify-center text-5xl font-bold text-neutral-950 dark:text-white md:text-7xl";
            fallback.textContent = text;
            container.appendChild(fallback);

            return () => {
                fallback.remove();
            };
        }

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        container.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(15, 15, 100, 100);
        const getActiveColor = () => color || (document.documentElement.classList.contains("dark") ? darkColor : lightColor);

        let currentColor = getActiveColor();
        let textTexture = createTextTexture(text, fontSize, font, currentColor);

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: textTexture },
                uDisplacement: { value: new THREE.Vector3(0, 0, 0) },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });

        const plane = new THREE.Mesh(geometry, shaderMaterial);
        plane.rotation.z = Math.PI / 4;
        scene.add(plane);

        const hitPlaneGeometry = new THREE.PlaneGeometry(500, 500);
        const hitPlaneMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        const hitPlane = new THREE.Mesh(hitPlaneGeometry, hitPlaneMaterial);
        scene.add(hitPlane);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const onPointerMove = (e: PointerEvent) => {
            const bounds = container.getBoundingClientRect();
            pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const [hit] = raycaster.intersectObject(hitPlane);
            if (hit) (shaderMaterial.uniforms.uDisplacement.value as THREE.Vector3).copy(hit.point);
        };

        container.addEventListener("pointermove", onPointerMove);

        const handleResize = () => {
            const r = container.getBoundingClientRect();
            if (r.height === 0) return;
            const a = r.width / r.height;
            camera.left = -cameraDistance * a;
            camera.right = cameraDistance * a;
            camera.updateProjectionMatrix();
            renderer.setSize(r.width, r.height, false);
        };

        window.addEventListener("resize", handleResize);

        let animationId = 0;
        const render = () => {
            animationId = requestAnimationFrame(render);
            renderer.render(scene, camera);
        };
        render();

        const observer = new MutationObserver(() => {
            const next = getActiveColor();
            if (next !== currentColor) {
                const tex = createTextTexture(text, fontSize, font, next);
                shaderMaterial.uniforms.uTexture.value = tex;
                textTexture.dispose();
                textTexture = tex;
                currentColor = next;
            }
        });
        if (!color) observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => {
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("pointermove", onPointerMove);
            cancelAnimationFrame(animationId);
            observer.disconnect();
            if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
            renderer.renderLists.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            textTexture.dispose();
            geometry.dispose();
            hitPlaneGeometry.dispose();
            hitPlaneMaterial.dispose();
            shaderMaterial.dispose();
        };
    }, [text, fontSize, font, color, lightColor, darkColor]);

    return <div ref={containerRef} className={cn("relative w-full h-[600px]", className)} />;
}

export default LiquidText;
