import * as THREE from 'three';

class Sun {
    constructor(group) {
        let distance_to_sun = 150e6; // km
        let sun_radius = 695700; // km
        this.sun_angular_radius = Math.atan(sun_radius / distance_to_sun);
        this.distance = 100; // m
        this.diameter = 2 * this.distance * Math.tan(this.sun_angular_radius);

        // Fixed 10 degrees towards south
        this.angles = new THREE.Spherical(this.distance, (90-10)*THREE.MathUtils.DEG2RAD, 90*THREE.MathUtils.DEG2RAD); // (radius, phi, theta)
        
        // Light source parameters
        this.light = new THREE.DirectionalLight(0xffffff, 2, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.set(2**13, 2**13);
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 250;
        this.light.shadow.camera.left = -this.distance;
        this.light.shadow.camera.right = this.distance;
        this.light.shadow.camera.top = this.distance;
        this.light.shadow.camera.bottom = -this.distance;
        //this.cameraHelper = new THREE.CameraHelper(this.light.shadow.camera);
        //group.add(this.cameraHelper);
        this.light.shadow.bias = -0.0001; // Reduce self-shadowing
        this.lightHelper = new THREE.DirectionalLightHelper(this.light, this.diameter);

        // Global light source
        this.globalLightMaxIntensity = 0.8;
        this.globalLight = new THREE.AmbientLight( 0xffffff, this.globalLightMaxIntensity ); // soft white light
        group.add(this.globalLight);
        
        // Add a sphere to represent the sun
        let sun_geometry = new THREE.SphereGeometry(this.diameter / 2, 32, 32);
        let sun_material = new THREE.MeshBasicMaterial({color: 0xffff00});
        this.sun_sphere = new THREE.Mesh(sun_geometry, sun_material);
        this.sun_sphere.position.copy(this.light.position);
        group.add(this.sun_sphere);
        
        this.setPosition(90*THREE.MathUtils.DEG2RAD);

        group.add(this.light);
        group.add(this.lightHelper);
    }

    setPosition(angle) {
        this.angles.theta = THREE.MathUtils.clamp(angle, 0, Math.PI);
        this.globalLight.intensity = this.globalLightMaxIntensity * Math.sin(this.angles.theta);
        //Rotate clockwise around the z axis, starting from noon
        const position_spherical = new THREE.Vector3().setFromSpherical(this.angles);
        this.light.position.set(position_spherical.z, position_spherical.x, position_spherical.y);
        this.sun_sphere.position.copy(this.light.position);        
        this.lightHelper.update();
    }

    addPosition(angle) {
        this.set_position(this.angle + angle);
    }

    disableHelper() {
        this.lightHelper.visible = false;
    }

}

export { Sun };
