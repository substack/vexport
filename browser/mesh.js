var three = require('./three');

module.exports = function () {
    var g = new three.Geometry();
    g.vertices.push(new three.Vector3( -10, 10, 0 ));
    g.vertices.push(new three.Vector3( -10, -10, 0 ));
    g.vertices.push(new three.Vector3( 10, -10, 0 ));
    g.faces.push(new three.Face3( 0, 1, 2 ));
    g.computeBoundingSphere();
    return g;
    
    return new three.Mesh(g, new three.MeshLambertMaterial({
        color: 0x8030a5
    }));
};
