import { TheoryA } from '../curvature/TheoryA.js';

export class Curvature {

    static activeTheory =
        'theoryA';


    // =============================================
    // THEORY
    // =============================================

    static setTheory(
        theory
    ) {

        if (
            theory !== 'theoryA' &&
            theory !== 'theoryB'
        ) {

            return;

        }


        this.activeTheory =
            theory;
    }


    static getTheory() {

        return this.activeTheory;

    }


    // =============================================
    // THEORY A HEIGHT
    // =============================================

    static calculateHeight(
        x,
        z,
        bodies
    ) {

        /*
         * Theory A bir height-map olduğu için
         * doğrudan hesaplanabilir.
         */

        return TheoryA.calculateHeight(
            x,
            z,
            bodies
        );
    }
}