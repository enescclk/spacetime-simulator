import * as THREE from 'three';

export class GridMaterial {
    constructor() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,

            uniforms: {
                gridColor: {
                    value: new THREE.Color(0x168cff)
                },

                gridSize: {
                    value: 1.0
                },

                lineWidth: {
                    value: 0.035
                }
            },

            vertexShader: `
                varying vec3 vWorldPosition;

                void main() {

                    vec4 worldPosition =
                        modelMatrix *
                        vec4(position, 1.0);

                    vWorldPosition =
                        worldPosition.xyz;

                    gl_Position =
                        projectionMatrix *
                        viewMatrix *
                        worldPosition;
                }
            `,

            fragmentShader: `
                varying vec3 vWorldPosition;

                uniform vec3 gridColor;
                uniform float gridSize;
                uniform float lineWidth;

                void main() {

                    vec2 coord =
                        vWorldPosition.xz /
                        gridSize;

                    vec2 grid =
                        abs(fract(coord - 0.5) - 0.5)
                        / fwidth(coord);

                    float line =
                        min(grid.x, grid.y);

                    float alpha =
                        1.0 -
                        smoothstep(
                            lineWidth,
                            lineWidth + 1.0,
                            line
                        );

                    if (alpha < 0.02) {
                        discard;
                    }

                    gl_FragColor =
                        vec4(
                            gridColor,
                            alpha * 0.85
                        );
                }
            `
        });
    }

    getMaterial() {
        return this.material;
    }
}