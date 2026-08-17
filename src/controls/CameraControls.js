import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraControls {
    constructor(camera, renderer) {
        this.camera = camera;

        this.controls =
            new OrbitControls(
                camera,
                renderer.domElement
            );

        // =========================================
        // TARGET
        // =========================================

        this.controls.target.set(
            0,
            0,
            0
        );


        // =========================================
        // SMOOTH MOVEMENT
        // =========================================

        this.controls.enableDamping =
            true;

        this.controls.dampingFactor =
            0.06;


        // =========================================
        // ZOOM
        // =========================================

        this.controls.enableZoom =
            true;

        // Ne kadar yaklaşabileceğimiz
        this.controls.minDistance =
            2;

        /*
         * Önceden 80'di.
         *
         * Artık çok büyük spacelerde de
         * tamamen zoom-out yapabiliriz.
         */
        this.controls.maxDistance =
            5000;

        /*
         * Mouse wheel zoom hızını biraz artır.
         * Büyük alanlarda dışarı çıkmak kolaylaşır.
         */
        this.controls.zoomSpeed =
            1.25;


        // =========================================
        // PAN
        // =========================================

        this.controls.enablePan =
            true;

        this.controls.panSpeed =
            1.0;


        // =========================================
        // ROTATION
        // =========================================

        this.controls.enableRotate =
            true;

        this.controls.rotateSpeed =
            0.7;


        // =========================================
        // CAMERA ANGLE
        // =========================================

        /*
         * Kameranın çarşafın altına geçmesini
         * engelliyoruz.
         */

        this.controls.maxPolarAngle =
            Math.PI / 2 - 0.03;


        // =========================================
        // UPDATE
        // =========================================

        this.controls.update();
    }


    // =============================================
    // UPDATE
    // =============================================

    update() {
        this.controls.update();
    }


    // =============================================
    // SET MAX DISTANCE
    // =============================================

    setMaxDistance(distance) {
        this.controls.maxDistance =
            distance;
    }
}