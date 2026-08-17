import * as THREE from 'three';

export class StarField {
    constructor({
        count = 2500,
        radius = 180
    } = {}) {
        this.count = count;
        this.radius = radius;

        this.create();
    }

    create() {
        const positions =
            new Float32Array(
                this.count * 3
            );

        for (
            let i = 0;
            i < this.count;
            i++
        ) {
            const r =
                this.radius *
                (
                    0.45 +
                    Math.random() * 0.55
                );

            const theta =
                Math.random() *
                Math.PI *
                2;

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );

            const x =
                r *
                Math.sin(phi) *
                Math.cos(theta);

            const y =
                r *
                Math.cos(phi);

            const z =
                r *
                Math.sin(phi) *
                Math.sin(theta);

            positions[
                i * 3
            ] = x;

            positions[
                i * 3 + 1
            ] = y;

            positions[
                i * 3 + 2
            ] = z;
        }

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        const material =
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.18,
                sizeAttenuation: true,
                transparent: true,
                opacity: 0.8,
                depthWrite: false
            });

        this.points =
            new THREE.Points(
                geometry,
                material
            );
    }

    getMesh() {
        return this.points;
    }
}