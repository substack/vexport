var three = require('./three');

module.exports = function () {
    var g = new three.Geometry();
    g.vertices.push({ position : new three.Vector3( -10, 10, 0 ) });
    g.vertices.push({ position : new three.Vector3( -10, -10, 0 ) });
    g.vertices.push({ position : new three.Vector3( 10, -10, 0 ) });
    g.faces.push(new three.Face3( 0, 1, 2 ));
    g.computeBoundingSphere();
    
    var m = new three.Mesh(g, new three.MeshLambertMaterial({
        color: 0x8030a5
    }));
    return m;
};
