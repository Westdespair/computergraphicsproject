import * as THREE from 'three';

class Cube {
    constructor(group, pos, scale, color) {
        this.geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
        this.material = new THREE.MeshLambertMaterial({ color: color, shadowSide: THREE.DoubleSide }); // Double sided so that meshes clipping the park plane still casts a shadow underneath itself
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(pos.x, pos.y, pos.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        group.add(this.mesh);
    }
}

export { Cube };
