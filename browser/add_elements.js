var three = require('./three');

module.exports = function (scene, elements) { 
    var create = {
        sphere : function (m) {
            return new three.Mesh(
                new three.SphereGeometry(m.radius, m.segments, m.rings),
                new three.MeshLambertMaterial({ color: 0xCC0000 })
            );
        },
        mesh : function (m) {
            var g = new three.Geometry();
            
            m.vertices.forEach(function (v) {
                g.vertices.push({
                    position : new three.Vector3(v[0], v[1], v[2])
                });
            });
            
            m.faces.forEach(function (f) {
                g.faces.push(new three.Face3(f[0], f[1], f[2]));
            });
            g.computeBoundingSphere();
            
            return new three.Mesh(g, new three.MeshLambertMaterial({
                color: 0x8030a5
            }));
        }
    };
    
    elements.forEach(function (elem) {
        scene.add(create[elem.type](elem));
    });
};
