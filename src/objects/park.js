import * as THREE from 'three';

class Park {
    // Heatmap_res is the resolution of the heatmap texture in pixels per meter width
    constructor(group, pos, width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;

        // Visible mesh
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = new THREE.MeshLambertMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.set(pos.x, pos.y, pos.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        group.add(this.mesh);
        
    }

    renderHeatmap(scene) {
        
    }
}

export { Park };
