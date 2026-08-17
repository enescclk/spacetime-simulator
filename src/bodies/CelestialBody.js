import * as THREE from 'three';

export class CelestialBody {
    constructor({
        name = 'Celestial Body',
        mass = 1,
        radius = 1,
        position = new THREE.Vector3(0, 0, 0)
    } = {}) {
        this.name = name;
        this.mass = mass;
        this.radius = radius;

        this.position = position.clone();

        this.mesh = null;
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z);

        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }

    getPosition() {
        return this.position;
    }

    getMass() {
        return this.mass;
    }

    getMesh() {
        return this.mesh;
    }
}