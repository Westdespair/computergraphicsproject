class Ground {
    constructor(pos, width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;

        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = new THREE.MeshPhongMaterial({ color: this.color , specular: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position = pos;
        this.mesh.rotation.x = -Math.PI / 2;
        
        group.add(this.mesh);
    }
}
