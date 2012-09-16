var three = require('./three');

module.exports = function (objects) {
    return JSON.stringify(objects.map(literalize))
}

function literalize (obj) {
    if (obj.geometry instanceof three.SphereGeometry) {
        return {
            type : 'sphere',
            radius : obj.boundRadius,
            segments : obj.segments,
            rings : obj.rings,
            position : [
                obj.position.x,
                obj.position.y,
                obj.position.z
            ]
        };
    }
    else {
        return {
            type : 'mesh',
            vertices : obj.geometry.vertices,
            faces : obj.geometry.faces.map(function (f) {
                return [ f.a, f.b, f.c ];
            })
        };
    }
}
