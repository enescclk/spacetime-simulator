import * as THREE from 'three';

import { Curvature } from './Curvature.js';

import { TheoryA } from '../curvature/TheoryA.js';
import { TheoryB } from '../curvature/TheoryB.js';

import { GridMaterial } from './GridMaterial.js';


export class SpacetimeMesh {

    constructor(
        size = 100
    ) {

        this.size =
            size;


        this.segments =
            250;


        this.gridMaterial =
            new GridMaterial();


        this.createGeometry();
    }


    // =============================================
    // CREATE GEOMETRY
    // =============================================

    createGeometry() {

        this.geometry =
            new THREE.PlaneGeometry(
                this.size,
                this.size,
                this.segments,
                this.segments
            );


        this.geometry.rotateX(
            -Math.PI / 2
        );


        this.storeBasePositions();


        this.mesh =
            new THREE.Mesh(
                this.geometry,
                this.gridMaterial.getMaterial()
            );
    }


    // =============================================
    // STORE BASE POSITIONS
    // =============================================

    storeBasePositions() {

        const positions =
            this.geometry.attributes.position;


        this.basePositions =
            new Float32Array(
                positions.array.length
            );


        this.basePositions.set(
            positions.array
        );
    }


    // =============================================
    // SIZE
    // =============================================

    setSize(
        newSize,
        bodies
    ) {

        this.size =
            newSize;


        this.geometry.dispose();


        this.geometry =
            new THREE.PlaneGeometry(
                this.size,
                this.size,
                this.segments,
                this.segments
            );


        this.geometry.rotateX(
            -Math.PI / 2
        );


        this.storeBasePositions();


        this.mesh.geometry =
            this.geometry;


        this.updateCurvature(
            bodies
        );
    }


    // =============================================
    // UPDATE CURVATURE
    // =============================================

    updateCurvature(
        bodies
    ) {

        const theory =
            Curvature.getTheory();


        if (
            theory === 'theoryB'
        ) {

            TheoryB.apply(
                this.geometry,
                bodies,
                this.basePositions
            );

            return;
        }


        this.applyTheoryA(
            bodies
        );
    }


    // =============================================
    // THEORY A
    // =============================================

    applyTheoryA(
        bodies
    ) {

        const positions =
            this.geometry.attributes.position;


        /*
         * ÖNEMLİ:
         *
         * Theory B'den A'ya geri geçerken
         * geometry'yi önce orijinal düzleme
         * döndürüyoruz.
         */

        for (
            let i = 0;
            i < positions.count;
            i++
        ) {

            const x =
                this.basePositions[
                    i * 3
                ];


            const z =
                this.basePositions[
                    i * 3 + 2
                ];


            const y =
                TheoryA.calculateHeight(
                    x,
                    z,
                    bodies
                );


            positions.setXYZ(
                i,
                x,
                y,
                z
            );
        }


        positions.needsUpdate =
            true;


        this.geometry.computeVertexNormals();
    }


    // =============================================
    // HEIGHT
    // =============================================

    getHeightAt(
        x,
        z,
        bodies
    ) {

        /*
         * Theory A için analitik yükseklik
         * hesaplayabiliyoruz.
         */

        if (
            Curvature.getTheory() ===
            'theoryA'
        ) {

            return TheoryA.calculateHeight(
                x,
                z,
                bodies
            );
        }


        /*
         * Theory B artık height-map değil.
         *
         * Şimdilik cismin ekrandaki Y konumu için
         * en yakın vertex'i buluyoruz.
         */

        return this.findNearestHeight(
            x,
            z
        );
    }


    // =============================================
    // NEAREST HEIGHT
    // =============================================

    findNearestHeight(
        x,
        z
    ) {

        const positions =
            this.geometry.attributes.position;


        let bestDistance =
            Infinity;


        let bestY =
            0;


        for (
            let i = 0;
            i < positions.count;
            i++
        ) {

            const dx =
                positions.getX(i) -
                x;


            const dz =
                positions.getZ(i) -
                z;


            const distance =
                dx * dx +
                dz * dz;


            if (
                distance <
                bestDistance
            ) {

                bestDistance =
                    distance;


                bestY =
                    positions.getY(i);
            }
        }


        return bestY;
    }


    // =============================================
    // GET SIZE
    // =============================================

    getSize() {

        return this.size;

    }


    // =============================================
    // GET MESH
    // =============================================

    getMesh() {

        return this.mesh;

    }
}