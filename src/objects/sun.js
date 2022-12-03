import * as THREE from 'three';

class Sun {
    constructor(group) {
        let distance_to_sun = 150e6; // km
        let sun_radius = 695700; // km
        this.sun_angular_radius = Math.atan(sun_radius / distance_to_sun);

        this.distance = 100; // m
        this.diameter = 2 * this.distance * Math.tan(this.sun_angular_radius);

        this.angle = 0;
        
        this.light = new THREE.DirectionalLight(0xffffff, 1, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.set(2**16, 2**16);
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 120;
        this.lightHelper = new THREE.DirectionalLightHelper(this.light, this.diameter);
        this.set_position(this.angle);

        group.add(this.light);
        group.add(this.lightHelper);
    }

    set_position(angle) {
        this.angle = angle % 360;
        // Rotate clockwise around the z axis, starting from noon
        this.light.position.set(this.distance * Math.sin(angle * Math.PI / 180.0), -this.distance * Math.cos(this.angle * Math.PI / 180.0, 0));
        this.light.visible = !(angle < 90 || angle > 270); // Hide the light when it's below the horizon            
        this.lightHelper.update();
    }

    add_position(angle) {
        this.set_position(this.angle + angle);
    }

    disable_helper() {
        this.lightHelper.visible = false;
    }

}

export { Sun };
