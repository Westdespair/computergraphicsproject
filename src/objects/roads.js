import * as THREE from 'three';

class Road {
    // Heatmap_res is the resolution of the heatmap texture in pixels per meter width
    constructor(group, pos, width, height, color, number, distance) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.distance = distance;
        this.number = number;

        // Visible mesh
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = new THREE.MeshLambertMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);


        if (this.number === 1) {
            this.mesh.rotation.x = -Math.PI / 2;
            this.mesh.rotation.z = -Math.PI / 2;
        }
        else {this.mesh.rotation.x = -Math.PI / 2;}
        this.mesh.position.set(pos.x, pos.y, pos.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        group.add(this.mesh);




    }

}

export { Road };
