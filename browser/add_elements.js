var three = require('./three');
var createPoint = require('./point');

module.exports = function (scene, elements) { 
    var create = {
        sphere : function (m) {
            var obj = new three.Mesh(
                new three.SphereGeometry(m.radius, m.segments, m.rings),
                new three.MeshLambertMaterial({ color: 0xCC0000 })
            );
            var pos = m.position || {};
            
            obj.position.x = pos[0] || 0;
            obj.position.y = pos[1] || 0;
            obj.position.z = pos[2] || 0;
            return [obj];
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
            
            var obj = new three.Mesh(g, new three.MeshLambertMaterial({
                color: 0x8030a5
            }));

            var objs = [obj];
            // add points and the associations
            m.vertices.forEach(function (v) {
                var pt = createPoint(v[0], v[1], v[2]);
                pt.refParent = obj;
                obj.refPoints = [];
                obj.refPoints.push(pt);
                objs.push(pt);
            });

            return objs;
        }
    };
    
    var objects = [];
    elements.forEach(function (elem) {
        var results = create[elem.type](elem);
        objects = objects.concat(results);
    });
    objects.forEach(function (obj) { scene.add(obj) });
    return objects;
};
