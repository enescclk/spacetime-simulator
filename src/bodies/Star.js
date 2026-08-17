import * as THREE from 'three';

import { CelestialBody } from './CelestialBody.js';

export class Star extends CelestialBody {
    constructor({
        name = 'Star',
        mass = 10,
        radius = 1,
        position = new THREE.Vector3(0, 0, 0),
        color = 0xffaa00
    } = {}) {
        super({
            name,
            mass,
            radius,
            position
        });

        this.color = color;

        this.createMesh();
    }

    createMesh() {
        this.group =
            new THREE.Group();

        // Ana yıldız
        const geometry =
            new THREE.SphereGeometry(
                this.radius,
                64,
                64
            );

        const material =
            new THREE.MeshBasicMaterial({
                color: this.color
            });

        this.starMesh =
            new THREE.Mesh(
                geometry,
                material
            );

        this.group.add(
            this.starMesh
        );

        // İç glow
        const glowGeometry =
            new THREE.SphereGeometry(
                this.radius * 1.18,
                48,
                48
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: this.color,
                transparent: true,
                opacity: 0.18,
                side: THREE.BackSide,
                depthWrite: false
            });

        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        this.group.add(glow);

        // Dış glow
        const outerGlowGeometry =
            new THREE.SphereGeometry(
                this.radius * 1.45,
                48,
                48
            );

        const outerGlowMaterial =
            new THREE.MeshBasicMaterial({
                color: this.color,
                transparent: true,
                opacity: 0.06,
                side: THREE.BackSide,
                depthWrite: false
            });

        const outerGlow =
            new THREE.Mesh(
                outerGlowGeometry,
                outerGlowMaterial
            );

        this.group.add(
            outerGlow
        );

        this.mesh =
            this.group;

        this.mesh.position.copy(
            this.position
        );
    }
}