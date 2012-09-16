var three = require('./three');

module.exports = function (x, y, z) {
    var radius = 3, segments = 0, rings = 0;
    var sphere = new three.Mesh(
        new three.SphereGeometry(radius, segments, rings),
        new three.MeshLambertMaterial({
            color: 0xffffff
        })
    );
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    
    return sphere;
};
