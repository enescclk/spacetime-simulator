import * as THREE from 'three';

import { CelestialBody } from './CelestialBody.js';

export class CustomBody extends CelestialBody {
    constructor({
        name = 'Custom Body',
        mass = 1,
        radius = 0.5,
        position = new THREE.Vector3(),
        color = '#44aaff',
        type = 'custom'
    } = {}) {
        super({
            name,
            mass,
            radius,
            position
        });

        this.color = color;
        this.type = type;

        this.displayRadius =
            this.calculateDisplayRadius();

        this.createMesh();
    }


    // =============================================
    // DISPLAY RADIUS
    // =============================================

    calculateDisplayRadius() {

        /*
         * Fiziksel radius ile ekranda çizilen radius
         * artık aynı şey değil.
         *
         * Küçük astronomik cisimleri de görebilmek
         * için minimum render boyutu kullanıyoruz.
         */

        if (this.type === 'blackHole') {
            return Math.max(
                this.radius,
                0.55
            );
        }

        if (this.type === 'neutronStar') {
            return Math.max(
                this.radius,
                0.32
            );
        }

        if (this.type === 'earth') {
            return Math.max(
                this.radius,
                0.25
            );
        }

        if (this.type === 'jupiter') {
            return Math.max(
                this.radius,
                0.38
            );
        }

        return Math.max(
            this.radius,
            0.18
        );
    }


    // =============================================
    // CREATE
    // =============================================

    createMesh() {

        if (this.type === 'blackHole') {
            this.createBlackHole();
            return;
        }

        this.createNormalBody();
    }


    // =============================================
    // NORMAL BODY
    // =============================================

    createNormalBody() {

        const geometry =
            new THREE.SphereGeometry(
                this.displayRadius,
                48,
                48
            );

        const material =
            new THREE.MeshBasicMaterial({
                color:
                    new THREE.Color(
                        this.color
                    )
            });

        this.mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        this.mesh.position.copy(
            this.position
        );
    }


    // =============================================
    // BLACK HOLE
    // =============================================

    createBlackHole() {

        this.group =
            new THREE.Group();


        // Event horizon

        const sphereGeometry =
            new THREE.SphereGeometry(
                this.displayRadius,
                64,
                64
            );

        const sphereMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x000000
            });

        const sphere =
            new THREE.Mesh(
                sphereGeometry,
                sphereMaterial
            );

        this.group.add(
            sphere
        );


        // Accretion ring

        const ringGeometry =
            new THREE.RingGeometry(
                this.displayRadius * 1.35,
                this.displayRadius * 2.4,
                96
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffa020,

                side:
                    THREE.DoubleSide,

                transparent: true,

                opacity: 0.9,

                depthWrite: false
            });

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ring.rotation.x =
            Math.PI / 2;

        this.group.add(
            ring
        );


        // Outer glow ring

        const outerGeometry =
            new THREE.RingGeometry(
                this.displayRadius * 2.3,
                this.displayRadius * 3.0,
                96
            );

        const outerMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xff6a00,

                side:
                    THREE.DoubleSide,

                transparent: true,

                opacity: 0.18,

                depthWrite: false
            });

        const outerRing =
            new THREE.Mesh(
                outerGeometry,
                outerMaterial
            );

        outerRing.rotation.x =
            Math.PI / 2;

        this.group.add(
            outerRing
        );


        this.mesh =
            this.group;

        this.mesh.position.copy(
            this.position
        );
    }


    // =============================================
    // DISPLAY RADIUS
    // =============================================

    getDisplayRadius() {
        return this.displayRadius;
    }
}