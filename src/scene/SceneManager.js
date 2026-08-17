import * as THREE from 'three';

import { createCamera } from './Camera.js';
import { StarField } from './StarField.js';

import { CameraControls } from '../controls/CameraControls.js';
import { BodyControls } from '../controls/BodyControls.js';
import { SelectionManager } from '../controls/SelectionManager.js';
import { TransformManager } from '../controls/TransformManager.js';

import { HistoryManager } from '../history/HistoryManager.js';

import { SpacetimeMesh } from '../spacetime/SpacetimeMesh.js';
import { Curvature } from '../spacetime/Curvature.js';

import { Star } from '../bodies/Star.js';
import { CustomBody } from '../bodies/CustomBody.js';


export class SceneManager {

    constructor() {

        // =========================================
        // SCENE
        // =========================================

        this.scene =
            new THREE.Scene();


        this.scene.background =
            new THREE.Color(
                0x010207
            );


        // =========================================
        // CAMERA
        // =========================================

        this.camera =
            createCamera();


        // =========================================
        // RENDERER
        // =========================================

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        document.body.appendChild(
            this.renderer.domElement
        );


        // =========================================
        // CAMERA CONTROLS
        // =========================================

        this.cameraControls =
            new CameraControls(
                this.camera,
                this.renderer
            );


        // =========================================
        // BODIES
        // =========================================

        this.bodies =
            [];


        this.onBodiesChanged =
            null;


        // =========================================
        // HISTORY
        // =========================================

        this.history =
            new HistoryManager({
                maxHistory: 100
            });


        // =========================================
        // CLIPBOARD
        // =========================================

        this.clipboardBodyData =
            null;


        this.pasteCount =
            0;


        // =========================================
        // WORLD
        // =========================================

        this.createBackground();

        this.createSpacetime();

        this.createSun();

        this.refreshSpacetime();


        /*
         * Başlangıçtaki Sun history'ye
         * dahil değil.
         */

        this.history.clear();


        // =========================================
        // TRANSFORM MANAGER
        // =========================================

        this.transformManager =
            new TransformManager({

                camera:
                    this.camera,

                renderer:
                    this.renderer,

                scene:
                    this.scene,

                cameraControls:
                    this.cameraControls,


                onTransform:
                    (body) => {

                        this.clampBodyToSpace(
                            body
                        );


                        this.refreshSpacetime();

                    },


                onTransformStart:
                    () => {

                        // Position TransformManager'da
                        // zaten saklanıyor.

                    },


                onTransformEnd:
                    (
                        body,
                        startPosition,
                        endPosition
                    ) => {

                        this.recordMove(
                            body,
                            startPosition,
                            endPosition
                        );

                    }

            });


        // =========================================
        // SELECTION MANAGER
        // =========================================

        this.selectionManager =
            new SelectionManager({

                camera:
                    this.camera,

                renderer:
                    this.renderer,

                bodies:
                    this.bodies,

                onSelectionChange:
                    (body) => {

                        this.handleSelection(
                            body
                        );

                    }

            });


        // =========================================
        // FREE BODY CONTROLS
        // =========================================

        this.bodyControls =
            new BodyControls({

                camera:
                    this.camera,

                renderer:
                    this.renderer,

                bodies:
                    this.bodies,

                getSpaceSize:
                    () =>
                        this.spacetime
                            .getSize(),

                onBodyMove:
                    () => {

                        this.refreshSpacetime();

                    },

                onBodySelected:
                    (body) => {

                        this.selectionManager
                            .selectBody(
                                body
                            );

                    },

                onMoveStart:
                    () => {

                        // BodyControls position saklıyor.

                    },

                onMoveEnd:
                    (
                        body,
                        startPosition,
                        endPosition
                    ) => {

                        this.recordMove(
                            body,
                            startPosition,
                            endPosition
                        );

                    },

                isTransformDragging:
                    () =>
                        this.transformManager
                            .getIsDragging()

            });


        // =========================================
        // EVENTS
        // =========================================

        window.addEventListener(
            'resize',
            () =>
                this.onResize()
        );


        window.addEventListener(
            'keydown',
            (event) =>
                this.onKeyDown(event)
        );
    }


    // =============================================
    // BACKGROUND
    // =============================================

    createBackground() {

        this.starField =
            new StarField({
                count: 3000,
                radius: 180
            });


        this.scene.add(
            this.starField.getMesh()
        );
    }


    // =============================================
    // SPACETIME
    // =============================================

    createSpacetime() {

        this.spacetime =
            new SpacetimeMesh(
                100
            );


        this.scene.add(
            this.spacetime.getMesh()
        );
    }


    // =============================================
    // SUN
    // =============================================

    createSun() {

        const sun =
            new Star({

                name:
                    'Sun',

                mass:
                    1,

                radius:
                    1,

                position:
                    new THREE.Vector3(
                        0,
                        0,
                        0
                    ),

                color:
                    0xffaa00

            });


        sun.type =
            'sun';


        sun.displayRadius =
            1;


        this.sun =
            sun;


        this.addBodyInternal(
            sun
        );
    }


    // =============================================
    // CUSTOM BODY
    // =============================================

    addCustomBody(data) {

        const body =
            this.createBodyFromData(
                data
            );


        this.addBodyInternal(
            body
        );


        this.refreshSpacetime();

        this.notifyBodiesChanged();


        // =========================================
        // HISTORY
        // =========================================

        if (
            !this.history
                .getIsRestoring()
        ) {

            this.history.push({

                type:
                    'add',

                body,


                undo:
                    () => {

                        this.removeBodyInternal(
                            body
                        );

                    },


                redo:
                    () => {

                        this.addBodyInternal(
                            body
                        );

                    }

            });
        }


        return body;
    }


    // =============================================
    // CREATE BODY FROM DATA
    // =============================================

    createBodyFromData(data) {

        return new CustomBody({

            type:
                data.type ||
                'custom',

            name:
                data.name ||
                'Custom Body',

            mass:
                data.mass,

            radius:
                data.radius,

            position:
                new THREE.Vector3(

                    data.x || 0,

                    0,

                    data.z || 0

                ),

            color:
                data.color ||
                '#44aaff'

        });
    }


    // =============================================
    // INTERNAL ADD
    // =============================================

    addBodyInternal(body) {

        if (
            this.bodies.includes(
                body
            )
        ) {
            return;
        }


        this.bodies.push(
            body
        );


        this.scene.add(
            body.getMesh()
        );


        this.refreshSpacetime();

        this.notifyBodiesChanged();
    }


    // =============================================
    // DELETE BODY
    // =============================================

    deleteBody(body) {

        if (
            !body ||
            !this.bodies.includes(body)
        ) {
            return;
        }


        const index =
            this.bodies.indexOf(
                body
            );


        this.removeBodyInternal(
            body
        );


        if (
            !this.history
                .getIsRestoring()
        ) {

            this.history.push({

                type:
                    'delete',

                body,

                index,


                undo:
                    () => {

                        this.insertBodyInternal(
                            body,
                            index
                        );

                    },


                redo:
                    () => {

                        this.removeBodyInternal(
                            body
                        );

                    }

            });
        }
    }


    // =============================================
    // INTERNAL INSERT
    // =============================================

    insertBodyInternal(
        body,
        index
    ) {

        if (
            this.bodies.includes(
                body
            )
        ) {
            return;
        }


        const safeIndex =
            THREE.MathUtils.clamp(
                index,
                0,
                this.bodies.length
            );


        this.bodies.splice(
            safeIndex,
            0,
            body
        );


        this.scene.add(
            body.getMesh()
        );


        this.refreshSpacetime();

        this.notifyBodiesChanged();
    }


    // =============================================
    // INTERNAL REMOVE
    // =============================================

    removeBodyInternal(body) {

        const index =
            this.bodies.indexOf(
                body
            );


        if (
            index === -1
        ) {
            return;
        }


        if (
            this.selectionManager &&
            this.selectionManager
                .getSelectedBody() === body
        ) {

            this.selectionManager
                .clearSelection();
        }


        this.scene.remove(
            body.getMesh()
        );


        /*
         * ÖNEMLİ:
         *
         * Burada geometry/material dispose
         * ETMİYORUZ.
         *
         * Çünkü Ctrl+Z ile aynı body'yi tekrar
         * sahneye ekleyebilmemiz gerekiyor.
         */


        this.bodies.splice(
            index,
            1
        );


        this.refreshSpacetime();

        this.notifyBodiesChanged();
    }


    // =============================================
    // SELECTION
    // =============================================

    handleSelection(body) {

        if (!body) {

            this.transformManager
                .clearSelection();

            return;
        }


        this.transformManager
            .selectBody(
                body
            );
    }


    // =============================================
    // RECORD MOVE
    // =============================================

    recordMove(
        body,
        startPosition,
        endPosition
    ) {

        if (
            !body ||
            !startPosition ||
            !endPosition
        ) {
            return;
        }


        const epsilon =
            0.0001;


        const dx =
            Math.abs(
                startPosition.x -
                endPosition.x
            );


        const dz =
            Math.abs(
                startPosition.z -
                endPosition.z
            );


        /*
         * Sadece tıklayıp bırakıldıysa
         * history oluşturma.
         */

        if (
            dx < epsilon &&
            dz < epsilon
        ) {
            return;
        }


        const start = {

            x:
                startPosition.x,

            z:
                startPosition.z

        };


        const end = {

            x:
                endPosition.x,

            z:
                endPosition.z

        };


        this.history.push({

            type:
                'move',

            body,


            undo:
                () => {

                    this.setBodyPosition(
                        body,
                        start.x,
                        start.z
                    );

                },


            redo:
                () => {

                    this.setBodyPosition(
                        body,
                        end.x,
                        end.z
                    );

                }

        });
    }


    // =============================================
    // SET BODY POSITION
    // =============================================

    setBodyPosition(
        body,
        x,
        z
    ) {

        if (
            !body ||
            !this.bodies.includes(body)
        ) {
            return;
        }


        body.position.x =
            x;


        body.position.z =
            z;


        this.clampBodyToSpace(
            body
        );


        this.refreshSpacetime();


        /*
         * Seçiliyse gizmo da otomatik olarak
         * mesh'i takip eder.
         */

        this.notifyBodiesChanged();
    }


    // =============================================
    // COPY
    // =============================================

    copySelectedBody() {

        const body =
            this.selectionManager
                .getSelectedBody();


        if (!body) {
            return;
        }


        const position =
            body.getPosition();


        let color =
            '#44aaff';


        const mesh =
            body.getMesh();


        if (
            mesh &&
            mesh.material &&
            mesh.material.color
        ) {

            color =
                `#${mesh.material.color.getHexString()}`;

        } else if (mesh) {

            mesh.traverse(
                (child) => {

                    if (
                        child.material &&
                        child.material.color &&
                        color === '#44aaff'
                    ) {

                        color =
                            `#${child.material.color.getHexString()}`;
                    }
                }
            );
        }


        this.clipboardBodyData = {

            type:
                body.type ||
                'custom',

            name:
                body.name ||
                'Copied Body',

            mass:
                body.getMass(),

            radius:
                body.radius,

            x:
                position.x,

            z:
                position.z,

            color:
                color

        };


        this.pasteCount =
            0;
    }


    // =============================================
    // PASTE
    // =============================================

    pasteBody() {

        if (
            !this.clipboardBodyData
        ) {
            return;
        }


        this.pasteCount++;


        const size =
            this.spacetime.getSize();


        const offset =
            Math.max(
                2,
                size * 0.03
            ) *
            this.pasteCount;


        const data =
            this.clipboardBodyData;


        const body =
            this.addCustomBody({

                type:
                    data.type,

                name:
                    this.createCopyName(
                        data.name
                    ),

                mass:
                    data.mass,

                radius:
                    data.radius,

                x:
                    data.x +
                    offset,

                z:
                    data.z +
                    offset,

                color:
                    data.color

            });


        this.clampBodyToSpace(
            body
        );


        this.refreshSpacetime();


        this.selectionManager
            .selectBody(
                body
            );
    }


    // =============================================
    // DUPLICATE
    // =============================================

    duplicateSelectedBody() {

        const selected =
            this.selectionManager
                .getSelectedBody();


        if (!selected) {
            return;
        }


        this.copySelectedBody();

        this.pasteBody();
    }


    // =============================================
    // COPY NAME
    // =============================================

    createCopyName(name) {

        const baseName =
            name
                .replace(
                    /\sCopy(?:\s\d+)?$/i,
                    ''
                )
                .trim();


        let candidate =
            `${baseName} Copy`;


        let number =
            2;


        while (
            this.bodies.some(
                (body) =>
                    body.name ===
                    candidate
            )
        ) {

            candidate =
                `${baseName} Copy ${number}`;


            number++;
        }


        return candidate;
    }


    // =============================================
    // KEYBOARD
    // =============================================

    onKeyDown(event) {

        const target =
            event.target;


        const isInput =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement;


        if (isInput) {
            return;
        }


        const commandKey =
            event.ctrlKey ||
            event.metaKey;


        const key =
            event.key.toLowerCase();


        // =========================================
        // UNDO
        // CTRL + Z
        // =========================================

        if (
            commandKey &&
            !event.shiftKey &&
            key === 'z'
        ) {

            event.preventDefault();


            this.history.undo();


            return;
        }


        // =========================================
        // REDO
        // CTRL + SHIFT + Z
        // =========================================

        if (
            commandKey &&
            event.shiftKey &&
            key === 'z'
        ) {

            event.preventDefault();


            this.history.redo();


            return;
        }


        // =========================================
        // REDO
        // CTRL + Y
        // =========================================

        if (
            commandKey &&
            key === 'y'
        ) {

            event.preventDefault();


            this.history.redo();


            return;
        }


        // =========================================
        // COPY
        // =========================================

        if (
            commandKey &&
            key === 'c'
        ) {

            event.preventDefault();


            this.copySelectedBody();


            return;
        }


        // =========================================
        // PASTE
        // =========================================

        if (
            commandKey &&
            key === 'v'
        ) {

            event.preventDefault();


            this.pasteBody();


            return;
        }


        // =========================================
        // DUPLICATE
        // =========================================

        if (
            commandKey &&
            key === 'd'
        ) {

            event.preventDefault();


            this.duplicateSelectedBody();


            return;
        }


        // =========================================
        // DELETE
        // =========================================

        if (
            event.key === 'Delete' ||
            event.key === 'Backspace'
        ) {

            const selected =
                this.selectionManager
                    .getSelectedBody();


            if (selected) {

                event.preventDefault();


                this.deleteBody(
                    selected
                );
            }


            return;
        }


        // =========================================
        // ESC
        // =========================================

        if (
            event.key === 'Escape'
        ) {

            this.selectionManager
                .clearSelection();

        }
    }


    // =============================================
    // CLAMP
    // =============================================

    clampBodyToSpace(body) {

        const size =
            this.spacetime.getSize();


        const margin =
            Math.max(
                1,
                size * 0.01
            );


        const limit =
            size / 2 -
            margin;


        body.position.x =
            THREE.MathUtils.clamp(
                body.position.x,
                -limit,
                limit
            );


        body.position.z =
            THREE.MathUtils.clamp(
                body.position.z,
                -limit,
                limit
            );
    }


    // =============================================
    // THEORY
    // =============================================

    setCurvatureTheory(theory) {

        Curvature.setTheory(
            theory
        );


        this.refreshSpacetime();
    }


    // =============================================
    // SPACE SIZE
    // =============================================

    setSpaceSize(size) {

        this.spacetime.setSize(
            size,
            this.bodies
        );


        for (
            const body of this.bodies
        ) {

            this.clampBodyToSpace(
                body
            );
        }


        this.refreshSpacetime();


        this.cameraControls
            .setMaxDistance(
                Math.max(
                    size * 5,
                    500
                )
            );
    }


    // =============================================
    // REFRESH
    // =============================================

    refreshSpacetime() {

        this.spacetime.updateCurvature(
            this.bodies
        );


        this.placeBodiesOnSpacetime();
    }


    // =============================================
    // PLACE BODIES
    // =============================================

    placeBodiesOnSpacetime() {

        for (
            const body of this.bodies
        ) {

            const position =
                body.getPosition();


            const surfaceY =
                this.spacetime.getHeightAt(
                    position.x,
                    position.z,
                    this.bodies
                );


            const displayRadius =
                body.getDisplayRadius
                    ? body.getDisplayRadius()
                    : body.radius;


            body.getMesh()
                .position
                .set(

                    position.x,

                    surfaceY +
                        displayRadius,

                    position.z

                );
        }
    }


    // =============================================
    // CALLBACK
    // =============================================

    setBodiesChangedCallback(
        callback
    ) {

        this.onBodiesChanged =
            callback;


        this.notifyBodiesChanged();
    }


    notifyBodiesChanged() {

        if (
            this.onBodiesChanged
        ) {

            this.onBodiesChanged(
                this.bodies
            );
        }
    }


    // =============================================
    // RESIZE
    // =============================================

    onResize() {

        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;


        this.camera
            .updateProjectionMatrix();


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }


    // =============================================
    // UPDATE
    // =============================================

    update() {

        const freeDragging =
            this.bodyControls &&
            this.bodyControls
                .getIsDragging();


        const transformDragging =
            this.transformManager &&
            this.transformManager
                .getIsDragging();


        this.cameraControls
            .controls
            .enabled =
                !freeDragging &&
                !transformDragging;


        this.cameraControls.update();
    }


    // =============================================
    // RENDER
    // =============================================

    render() {

        this.renderer.render(
            this.scene,
            this.camera
        );
    }
}