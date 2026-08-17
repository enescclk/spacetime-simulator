import * as THREE from 'three';


export class BodyControls {

    constructor({
        camera,
        renderer,
        bodies,
        getSpaceSize,
        onBodyMove,
        onBodySelected,
        onMoveStart,
        onMoveEnd,
        isTransformDragging
    }) {

        this.camera =
            camera;

        this.renderer =
            renderer;

        this.bodies =
            bodies;

        this.getSpaceSize =
            getSpaceSize;

        this.onBodyMove =
            onBodyMove;

        this.onBodySelected =
            onBodySelected;

        this.onMoveStart =
            onMoveStart;

        this.onMoveEnd =
            onMoveEnd;

        this.isTransformDragging =
            isTransformDragging;


        this.raycaster =
            new THREE.Raycaster();


        this.mouse =
            new THREE.Vector2();


        this.dragPlane =
            new THREE.Plane(
                new THREE.Vector3(
                    0,
                    1,
                    0
                ),
                0
            );


        this.dragPoint =
            new THREE.Vector3();


        this.dragOffset =
            new THREE.Vector3();


        this.selectedBody =
            null;


        this.isDragging =
            false;


        this.dragStartPosition =
            null;


        // =========================================
        // EVENTS
        // =========================================

        this.renderer.domElement.addEventListener(
            'pointerdown',
            (event) =>
                this.onPointerDown(event)
        );


        window.addEventListener(
            'pointermove',
            (event) =>
                this.onPointerMove(event)
        );


        window.addEventListener(
            'pointerup',
            () =>
                this.onPointerUp()
        );
    }


    // =============================================
    // MOUSE
    // =============================================

    updateMouse(event) {

        const rect =
            this.renderer.domElement
                .getBoundingClientRect();


        this.mouse.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) * 2 - 1;


        this.mouse.y =
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
    // POINTER DOWN
    // =============================================

    onPointerDown(event) {

        if (
            event.button !== 0
        ) {
            return;
        }


        if (
            this.isTransformDragging &&
            this.isTransformDragging()
        ) {
            return;
        }


        this.updateMouse(
            event
        );


        this.raycaster.setFromCamera(
            this.mouse,
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


        if (
            intersections.length === 0
        ) {
            return;
        }


        const body =
            this.findBodyFromObject(
                intersections[0].object
            );


        if (!body) {
            return;
        }


        this.selectedBody =
            body;


        if (
            this.onBodySelected
        ) {

            this.onBodySelected(
                body
            );
        }


        // =========================================
        // DRAG PLANE
        // =========================================

        this.dragPlane.set(
            new THREE.Vector3(
                0,
                1,
                0
            ),

            -body.getMesh()
                .position.y
        );


        const hit =
            this.raycaster.ray
                .intersectPlane(
                    this.dragPlane,
                    this.dragPoint
                );


        if (!hit) {

            this.selectedBody =
                null;

            return;
        }


        // =========================================
        // OFFSET
        // =========================================

        this.dragOffset.set(

            body.getPosition().x -
                this.dragPoint.x,

            0,

            body.getPosition().z -
                this.dragPoint.z

        );


        this.dragStartPosition = {

            x:
                body.getPosition().x,

            z:
                body.getPosition().z

        };


        if (
            this.onMoveStart
        ) {

            this.onMoveStart(
                body,
                this.dragStartPosition
            );
        }


        this.isDragging =
            true;


        document.body.style.cursor =
            'grabbing';
    }


    // =============================================
    // POINTER MOVE
    // =============================================

    onPointerMove(event) {

        if (
            !this.isDragging ||
            !this.selectedBody
        ) {
            return;
        }


        if (
            this.isTransformDragging &&
            this.isTransformDragging()
        ) {

            this.cancelDrag();

            return;
        }


        this.updateMouse(
            event
        );


        this.raycaster.setFromCamera(
            this.mouse,
            this.camera
        );


        const hit =
            this.raycaster.ray
                .intersectPlane(
                    this.dragPlane,
                    this.dragPoint
                );


        if (!hit) {
            return;
        }


        // =========================================
        // SPACE LIMIT
        // =========================================

        const spaceSize =
            this.getSpaceSize
                ? this.getSpaceSize()
                : 100;


        const margin =
            Math.max(
                1,
                spaceSize * 0.01
            );


        const limit =
            spaceSize / 2 -
            margin;


        // =========================================
        // POSITION
        // =========================================

        const x =
            THREE.MathUtils.clamp(

                this.dragPoint.x +
                    this.dragOffset.x,

                -limit,
                limit
            );


        const z =
            THREE.MathUtils.clamp(

                this.dragPoint.z +
                    this.dragOffset.z,

                -limit,
                limit
            );


        this.selectedBody.position.x =
            x;


        this.selectedBody.position.z =
            z;


        if (
            this.onBodyMove
        ) {

            this.onBodyMove(
                this.selectedBody
            );
        }
    }


    // =============================================
    // POINTER UP
    // =============================================

    onPointerUp() {

        if (
            !this.isDragging
        ) {
            return;
        }


        const body =
            this.selectedBody;


        const startPosition =
            this.dragStartPosition;


        let endPosition =
            null;


        if (body) {

            endPosition = {

                x:
                    body.getPosition().x,

                z:
                    body.getPosition().z

            };
        }


        this.isDragging =
            false;


        this.selectedBody =
            null;


        this.dragStartPosition =
            null;


        document.body.style.cursor =
            'default';


        if (
            body &&
            startPosition &&
            endPosition &&
            this.onMoveEnd
        ) {

            this.onMoveEnd(
                body,
                startPosition,
                endPosition
            );
        }
    }


    // =============================================
    // CANCEL DRAG
    // =============================================

    cancelDrag() {

        this.isDragging =
            false;


        this.selectedBody =
            null;


        this.dragStartPosition =
            null;


        document.body.style.cursor =
            'default';
    }


    // =============================================
    // STATE
    // =============================================

    getIsDragging() {

        return this.isDragging;
    }
}