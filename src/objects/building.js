// TODO: yes

class House {
    constructor(name, scale, translation, rotation) {
        this.name = name;
        this.scale = scale;
        this.translation = translation;
        this.rotation = rotation;

        this.modelMatrix = new Matrix4();
        this.modelMatrix.setTranslate(this.translation[0], this.translation[1], this.translation[2]);
        this.modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        this.modelMatrix.rotate(this.rotation, 0, 0, 1);
    }

}