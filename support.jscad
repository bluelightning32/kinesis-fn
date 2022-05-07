const jscad = require('@jscad/modeling')
const { geom2 } = jscad.geometries
const { cuboid, cylinder } = jscad.primitives
const { rotateX, translate, translateZ } = jscad.transforms
const { union, subtract } = jscad.booleans
const { extrudeLinear } = jscad.extrusions

const main = () => {
  const baseHeight = 4.8
  const base2d = geom2.fromPoints([
      [-1.1, -9.3],
      [100.4, -9.3],
      [101.4, -8.3],
      [123.9, -8.3],
      [123.9, 16.2],
      [114.75, 16.2],
      [113.75, 17.2],
      [-1.9, 17.2],
      [-5.82, -3.85]
    ])
  const base = extrudeLinear({height: baseHeight}, base2d)
  
  const centerHoleSizeX = 113.75
  const centerHoleSizeY = 14.8
  const centerHole = cuboid({center: [centerHoleSizeX/2, centerHoleSizeY/2, baseHeight/2],
                             size: [centerHoleSizeX, centerHoleSizeY, baseHeight]})
  
  const slotSizeX = 7
  const slotSizeY = 1.6
  const slotY = -5.75
  
  const slot1 = translate([10.1, slotY, baseHeight/2], rotateX(Math.PI/5, cuboid({
                        size: [slotSizeX, slotSizeY, 2*baseHeight]})))
  const slotCut1 = cuboid({center: [10.1, slotY, 3*baseHeight/4],
                        size: [2*slotSizeX, 15, baseHeight/2]})
  const slot2 = translate([59.8, slotY, baseHeight/2], rotateX(Math.PI/5, cuboid({
                        size: [slotSizeX, slotSizeY, 2*baseHeight]})))
  const slotCut2 = cuboid({center: [59.8, slotY, 3*baseHeight/4],
                        size: [2*slotSizeX, 15, baseHeight/2]})
  const slot3 = translate([94.8, slotY, baseHeight/2], rotateX(Math.PI/5, cuboid({
                        size: [slotSizeX, slotSizeY, 2*baseHeight]})))
  const slotCut3 = cuboid({center: [94.8, slotY, 3*baseHeight/4],
                        size: [2*slotSizeX, 15, baseHeight/2]})
  
  const screwAnchorOuter = 5.1
  const screwAnchorInner = 2.6
  const screwAnchorHeight = 6.5

  const screwAnchor1 = cylinder({center: [-1.55, -1, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2}) 

  const screwHole1 = cylinder({center: [-1.55, -1, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2})
  const screwCut1 = translateZ(
    baseHeight,
    extrudeLinear({height: screwAnchorHeight - baseHeight},
                   geom2.fromPoints([[-1.55 + .9 - 10, -1 + .9 + 10],
                                     [-1.55 + .9 + 10, -1 + .9 - 10],
                                     [-1.55 + .9 + 10, -1 + .9 + 10]])))

  const screwAnchor2 = cylinder({center: [26.2, -5.7, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2}) 
  const screwHole2 = cylinder({center: [26.2, -5.7, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2})
  const screwCut2 = cuboid({center: [26.2, -5.7 + screwAnchorInner/2 - .4 + 5, baseHeight + 5],
                            size: [10, 10, 10]})

  const screwAnchor3 = cylinder({center: [78.6, -5.7, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2}) 
  const screwHole3 = cylinder({center: [78.6, -5.7, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2}) 
  const screwCut3 = cuboid({center: [78.6, -5.7 + screwAnchorInner/2 - .4 + 5, baseHeight + 5],
                            size: [10, 10, 10]})

  const screwAnchor4 = cylinder({center: [118.8, 0.85, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2}) 
  const screwHole4 = cylinder({center: [118.8, 0.85, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2}) 
  
  return [subtract(union(base, screwAnchor1, screwAnchor2, screwAnchor3, screwAnchor4),
                   centerHole, slot1, slotCut1, slot2, slotCut2, slot3, slotCut3,
                   screwHole1, screwCut1, screwHole2, screwCut2, screwHole3, screwCut3, screwHole4)]
}

module.exports = { main }
