import * as THREE from 'three';

export class TheoryB {

    static apply(
        geometry,
        bodies,
        basePositions
    ) {

        const positions =
            geometry.attributes.position;

        const vertexCount =
            positions.count;


        // =========================================
        // RESET TO FLAT SPACE
        // =========================================

        for (
            let i = 0;
            i < vertexCount;
            i++
        ) {

            positions.setXYZ(
                i,

                basePositions[i * 3],

                basePositions[i * 3 + 1],

                basePositions[i * 3 + 2]
            );
        }


        positions.needsUpdate =
            true;


        // =========================================
        // NO BODIES
        // =========================================

        if (
            bodies.length === 0
        ) {

            geometry.computeVertexNormals();

            return;
        }


        /*
         * Buradaki sistem önceki Theory B'den
         * farklı.
         *
         * ESKİ:
         *
         * mesh deform
         *      ↓
         * normal hesapla
         *      ↓
         * normal boyunca tekrar deform
         *      ↓
         * tekrar normal hesapla
         *      ↓
         * ...
         *
         * Bu pozitif feedback oluşturuyordu.
         *
         *
         * YENİ:
         *
         * Her body için:
         *
         * 1. Diğer body'lerin oluşturduğu
         *    yüzey eğimini hesapla.
         *
         * 2. Body'nin bulunduğu noktadaki
         *    surface normal'i hesapla.
         *
         * 3. Body'nin kendi deformasyonunun
         *    tamamını bu SABİT normal yönünde
         *    uygula.
         *
         * Böylece vertexler dönüp kendi
         * normallerini tekrar değiştirmiyor.
         */


        // =========================================
        // BODY NORMALS
        // =========================================

        const bodyNormals =
            new Map();


        for (
            const body of bodies
        ) {

            const normal =
                this.calculateBodyNormal(
                    body,
                    bodies
                );


            bodyNormals.set(
                body,
                normal
            );
        }


        // =========================================
        // CALCULATE VERTICES
        // =========================================

        for (
            let i = 0;
            i < vertexCount;
            i++
        ) {

            /*
             * Her vertex DAİMA orijinal düz
             * koordinatından başlar.
             */

            const baseX =
                basePositions[
                    i * 3
                ];


            const baseY =
                basePositions[
                    i * 3 + 1
                ];


            const baseZ =
                basePositions[
                    i * 3 + 2
                ];


            let finalX =
                baseX;


            let finalY =
                baseY;


            let finalZ =
                baseZ;


            // =====================================
            // APPLY EVERY BODY
            // =====================================

            for (
                const body of bodies
            ) {

                const bodyPosition =
                    body.getPosition();


                const mass =
                    Math.max(
                        body.getMass(),
                        0.0000001
                    );


                // =================================
                // VISUAL MASS
                // =================================

                const visualMass =
                    Math.pow(
                        mass,
                        0.30
                    );


                const depth =
                    visualMass *
                    7.0;


                const width =
                    2.0 +
                    visualMass *
                    4.0;


                // =================================
                // DISTANCE
                // =================================

                /*
                 * Burada mesafeyi deforme edilmiş
                 * koordinattan değil BASE PLANE'den
                 * hesaplıyoruz.
                 *
                 * Bu çok önemli.
                 *
                 * Aksi halde deformasyon kendi
                 * influence alanını değiştirmeye
                 * başlıyor.
                 */

                const dx =
                    baseX -
                    bodyPosition.x;


                const dz =
                    baseZ -
                    bodyPosition.z;


                const distanceSquared =
                    dx * dx +
                    dz * dz;


                // =================================
                // GAUSSIAN INFLUENCE
                // =================================

                const influence =
                    Math.exp(

                        -distanceSquared /

                        (
                            2 *
                            width *
                            width
                        )

                    );


                const deformation =
                    depth *
                    influence;


                // =================================
                // BODY SURFACE NORMAL
                // =================================

                const normal =
                    bodyNormals.get(
                        body
                    );


                /*
                 * Surface normal dışarı doğru.
                 *
                 * Biz yüzeyin içine doğru
                 * deformasyon istediğimiz için
                 * -normal kullanıyoruz.
                 */


                finalX +=
                    -normal.x *
                    deformation;


                finalY +=
                    -normal.y *
                    deformation;


                finalZ +=
                    -normal.z *
                    deformation;
            }


            // =====================================
            // WRITE VERTEX
            // =====================================

            positions.setXYZ(
                i,
                finalX,
                finalY,
                finalZ
            );
        }


        positions.needsUpdate =
            true;


        geometry.computeVertexNormals();


        geometry.computeBoundingBox();

        geometry.computeBoundingSphere();
    }


    // =============================================
    // CALCULATE BODY NORMAL
    // =============================================

    static calculateBodyNormal(
        targetBody,
        bodies
    ) {

        const targetPosition =
            targetBody.getPosition();


        /*
         * Yüzeyi:
         *
         * y = f(x,z)
         *
         * olarak düşünürsek normal:
         *
         * N = (-df/dx, 1, -df/dz)
         *
         * olur.
         *
         * Burada targetBody'nin KENDİSİNİ
         * hesaba katmıyoruz.
         *
         * Çünkü kendi oluşturduğu kuyunun
         * merkezindeki normal zaten tanımsal
         * olarak simetrik olacaktır.
         */


        let gradientX = 0;

        let gradientZ = 0;


        for (
            const body of bodies
        ) {

            if (
                body === targetBody
            ) {

                continue;
            }


            const position =
                body.getPosition();


            const mass =
                Math.max(
                    body.getMass(),
                    0.0000001
                );


            const visualMass =
                Math.pow(
                    mass,
                    0.30
                );


            const depth =
                visualMass *
                7.0;


            const width =
                2.0 +
                visualMass *
                4.0;


            const dx =
                targetPosition.x -
                position.x;


            const dz =
                targetPosition.z -
                position.z;


            const distanceSquared =
                dx * dx +
                dz * dz;


            const gaussian =
                Math.exp(

                    -distanceSquared /

                    (
                        2 *
                        width *
                        width
                    )

                );


            /*
             * Height:
             *
             * h = -D exp(-r² / 2w²)
             *
             *
             * derivative:
             *
             * dh/dx =
             *
             * D * dx / w² *
             * exp(...)
             */


            gradientX +=

                depth *

                (
                    dx /
                    (
                        width *
                        width
                    )
                ) *

                gaussian;


            gradientZ +=

                depth *

                (
                    dz /
                    (
                        width *
                        width
                    )
                ) *

                gaussian;
        }


        // =========================================
        // SURFACE NORMAL
        // =========================================

        const normal =
            new THREE.Vector3(

                -gradientX,

                1,

                -gradientZ

            );


        normal.normalize();


        return normal;
    }
}