import {
    TransformControls
} from 'three/addons/controls/TransformControls.js';


export class TransformManager {

    constructor({
        camera,
        renderer,
        scene,
        cameraControls,
        onTransform,
        onTransformStart,
        onTransformEnd
    }) {

        this.camera =
            camera;

        this.renderer =
            renderer;

        this.scene =
            scene;

        this.cameraControls =
            cameraControls;

        this.onTransform =
            onTransform;

        this.onTransformStart =
            onTransformStart;

        this.onTransformEnd =
            onTransformEnd;


        this.body =
            null;


        this.isDragging =
            false;


        this.startPosition =
            null;


        // =========================================
        // TRANSFORM CONTROLS
        // =========================================

        this.controls =
            new TransformControls(
                this.camera,
                this.renderer.domElement
            );


        this.controls.setMode(
            'translate'
        );


        this.controls.setSize(
            0.8
        );


        // X / Z only
        this.controls.showX =
            true;

        this.controls.showY =
            false;

        this.controls.showZ =
            true;


        this.helper =
            this.controls.getHelper();


        this.scene.add(
            this.helper
        );


        this.controls.detach();


        // =========================================
        // DRAG START / END
        // =========================================

        this.controls.addEventListener(
            'dragging-changed',
            (event) => {

                const dragging =
                    event.value;


                if (
                    dragging &&
                    this.body
                ) {

                    this.startPosition = {

                        x:
                            this.body
                                .getPosition()
                                .x,

                        z:
                            this.body
                                .getPosition()
                                .z

                    };


                    if (
                        this.onTransformStart
                    ) {

                        this.onTransformStart(
                            this.body,
                            this.startPosition
                        );
                    }
                }


                /*
                 * IMPORTANT:
                 *
                 * Drag bitmeden önce mevcut mesh
                 * koordinatını al.
                 */

                if (
                    !dragging &&
                    this.body &&
                    this.startPosition
                ) {

                    const endPosition = {

                        x:
                            this.body
                                .getPosition()
                                .x,

                        z:
                            this.body
                                .getPosition()
                                .z

                    };


                    if (
                        this.onTransformEnd
                    ) {

                        this.onTransformEnd(
                            this.body,
                            this.startPosition,
                            endPosition
                        );
                    }


                    this.startPosition =
                        null;
                }


                this.isDragging =
                    dragging;


                if (
                    this.cameraControls &&
                    this.cameraControls.controls
                ) {

                    this.cameraControls
                        .controls
                        .enabled =
                            !dragging;
                }
            }
        );


        // =========================================
        // OBJECT CHANGE
        // =========================================

        this.controls.addEventListener(
            'objectChange',
            () => {

                this.handleTransform();

            }
        );
    }


    // =============================================
    // SELECT
    // =============================================

    selectBody(body) {

        this.body =
            body;


        if (!body) {

            this.controls.detach();

            return;
        }


        this.controls.attach(
            body.getMesh()
        );
    }


    // =============================================
    // TRANSFORM
    // =============================================

    handleTransform() {

        if (
            !this.body
        ) {
            return;
        }


        const mesh =
            this.body.getMesh();


        this.body.position.x =
            mesh.position.x;


        this.body.position.z =
            mesh.position.z;


        if (
            this.onTransform
        ) {

            this.onTransform(
                this.body
            );
        }
    }


    // =============================================
    // CLEAR
    // =============================================

    clearSelection() {

        this.body =
            null;


        this.startPosition =
            null;


        this.controls.detach();
    }


    // =============================================
    // STATE
    // =============================================

    getIsDragging() {

        return this.isDragging;
    }


    getBody() {

        return this.body;
    }
}