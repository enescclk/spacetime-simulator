export class TheoryA {

    static calculateHeight(
        x,
        z,
        bodies
    ) {

        let totalHeight = 0;


        for (const body of bodies) {

            const position =
                body.getPosition();


            const dx =
                x - position.x;

            const dz =
                z - position.z;


            const distanceSquared =
                dx * dx +
                dz * dz;


            const mass =
                body.getMass();


            /*
             * Astronomik kütle farklarını
             * görselleştirme için sıkıştırıyoruz.
             */

            const visualMass =
                Math.pow(
                    mass,
                    0.30
                );


            const depth =
                visualMass * 7.0;


            const width =
                2.0 +
                visualMass * 4.0;


            const deformation =
                -depth *
                Math.exp(
                    -distanceSquared /
                    (
                        2 *
                        width *
                        width
                    )
                );


            totalHeight +=
                deformation;
        }


        return totalHeight;
    }
}