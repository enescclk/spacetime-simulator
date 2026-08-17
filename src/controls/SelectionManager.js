import * as THREE from 'three';

export class SelectionManager {

    constructor({
        camera,
        renderer,
        bodies,
        onSelectionChange
    }) {

        this.camera =
            camera;

        this.renderer =
            renderer;

        this.bodies =
            bodies;

        this.onSelectionChange =
            onSelectionChange;


        this.raycaster =
            new THREE.Raycaster();


        this.pointer =
            new THREE.Vector2();


        this.selectedBody =
            null;


        this.enabled =
            true;


        // Pointer hareketini takip ediyoruz.
        // Böylece drag sonunda oluşan pointerup'ı
        // yanlışlıkla "click" olarak algılamıyoruz.

        this.pointerDownPosition = {
            x: 0,
            y: 0
        };


        this.renderer.domElement.addEventListener(
            'pointerdown',
            (event) =>
                this.onPointerDown(event)
        );


        this.renderer.domElement.addEventListener(
            'pointerup',
            (event) =>
                this.onPointerUp(event)
        );
    }


    // =============================================
    // POINTER DOWN
    // =============================================

    onPointerDown(event) {

        if (
            event.button !== 0
        ) {
            return;
        }


        this.pointerDownPosition.x =
            event.clientX;


        this.pointerDownPosition.y =
            event.clientY;
    }


    // =============================================
    // POINTER UP
    // =============================================

    onPointerUp(event) {

        if (
            !this.enabled
        ) {
            return;
        }


        if (
            event.button !== 0
        ) {
            return;
        }


        const dx =
            event.clientX -
            this.pointerDownPosition.x;


        const dy =
            event.clientY -
            this.pointerDownPosition.y;


        const movement =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /*
         * Mouse gerçekten sürüklendiyse
         * seçim değiştirmiyoruz.
         */

        if (
            movement > 5
        ) {
            return;
        }


        this.updatePointer(
            event
        );


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        const meshes =
            this.bodies.map(
                (body) =>
                    body.getMesh()
            );


        const intersections =
            this.raycaster.intersectObjects(
                meshes,
                true
            );


        // Boşluğa tıklama
        if (
            intersections.length === 0
        ) {

            this.clearSelection();

            return;
        }


        const body =
            this.findBodyFromObject(
                intersections[0].object
            );


        if (!body) {

            this.clearSelection();

            return;
        }


        this.selectBody(
            body
        );
    }


    // =============================================
    // POINTER
    // =============================================

    updatePointer(event) {

        const rect =
            this.renderer.domElement
                .getBoundingClientRect();


        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) * 2 - 1;


        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) * 2 + 1;
    }


    // =============================================
    // FIND BODY
    // =============================================

    findBodyFromObject(object) {

        for (
            const body of this.bodies
        ) {

            const mesh =
                body.getMesh();


            let current =
                object;


            while (current) {

                if (
                    current === mesh
                ) {

                    return body;
                }


                current =
                    current.parent;
            }
        }


        return null;
    }


    // =============================================
    // SELECT
    // =============================================

    selectBody(body) {

        if (
            this.selectedBody === body
        ) {
            return;
        }


        this.selectedBody =
            body;


        if (
            this.onSelectionChange
        ) {

            this.onSelectionChange(
                body
            );
        }
    }


    // =============================================
    // CLEAR
    // =============================================

    clearSelection() {

        if (
            !this.selectedBody
        ) {
            return;
        }


        this.selectedBody =
            null;


        if (
            this.onSelectionChange
        ) {

            this.onSelectionChange(
                null
            );
        }
    }


    // =============================================
    // GET SELECTED
    // =============================================

    getSelectedBody() {

        return this.selectedBody;
    }


    // =============================================
    // ENABLE / DISABLE
    // =============================================

    setEnabled(enabled) {

        this.enabled =
            enabled;
    }
}