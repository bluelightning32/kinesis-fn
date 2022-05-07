const jscad = require('@jscad/modeling')
const { geom2 } = jscad.geometries
const { mat4 } = jscad.maths
const { circle, cuboid, cylinder } = jscad.primitives
const { mirrorY, rotateX, translate, translateZ } = jscad.transforms
const { union, subtract } = jscad.booleans
const { extrudeFromSlices, extrudeLinear, slice } = jscad.extrusions

const main = () => {
  const baseHeight = 4.8
  const baseHighYPoints = [
    [123.9, 16.2],
    [114.75, 16.2],
    [113.75, 17.2],
    [-1.9, 17.2]
  ]
  const baseLowYPoints = [
    [-5.70, -3.25],
    [-0.5, -9.3],
    [100.4, -9.3],
    [101.4, -8.3],
    [123.9, -8.3]
  ]
  const baseBottomHighYPoints = baseHighYPoints.map(p => [p[0], p[1] + 2.5])
  baseBottomHighYPoints[3][0] += (baseBottomHighYPoints[3][0] - baseLowYPoints[0][0]) / (baseBottomHighYPoints[3][1] - baseLowYPoints[0][1]) * 2.5
  const baseTop = geom2.fromPoints(baseLowYPoints.concat(baseHighYPoints))
  const baseBottom = geom2.fromPoints(baseLowYPoints.concat(baseBottomHighYPoints))
  const base = extrudeFromSlices({
    callback: (progress, index, base) => {
      if (progress == 0) {
        return slice.fromSides(geom2.toSides(baseBottom))
      } else {
        return slice.transform(
          mat4.fromTranslation(mat4.create(), [0, 0, baseHeight]),
          slice.fromSides(geom2.toSides(baseTop))
          )
      }
    }
  }, 0)


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

  const screwAnchorOuter = 6
  const screwAnchorOuter4 = 5.1
  const screwAnchorInner = 2.6
  const screwAnchorHeight = 6.5

  const screwTaper = extrudeFromSlices({
    callback: (progress, index, base) => {
      if (progress == 0) {
        return slice.transform(
          mat4.fromTranslation(mat4.create(), [0, 0, baseHeight]),
          slice.fromSides(geom2.toSides(circle({radius: screwAnchorInner/2})))
          )
      } else {
        return slice.transform(
          mat4.fromTranslation(mat4.create(), [0, 0, screwAnchorHeight]),
          slice.fromSides(geom2.toSides(circle({radius: (screwAnchorInner + 1)/2})))
          )
      }
    }
  }, 0)

  const screwAnchor1 = cylinder({center: [-1.7, -1.0, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2})

  const screwHole1 = cylinder({center: [-1.7, -1.0, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2})
  const screwCut1 = translateZ(
    baseHeight - 0.001,
    extrudeLinear({height: screwAnchorHeight - baseHeight + 0.001},
                   geom2.fromPoints([[-1.7 + .9 - 10, -1.0 + .8 + 10],
                                     [-1.7 + .9 + 10, -1.0 + .8 - 10],
                                     [-1.7 + .9 + 10, -1.0 + .8 + 10]])))
  const screwTaper1 = translate([-1.7, -1.0, 0], screwTaper)

  const centerScrewY = -6.2

  const screwAnchor2 = cylinder({center: [26.2, centerScrewY, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2})
  const screwHole2 = cylinder({center: [26.2, centerScrewY, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2})
  const screwCut2 = cuboid({center: [26.2, centerScrewY + screwAnchorInner/2 - .4 + 5, baseHeight + 5],
                            size: [10, 10, 10]})
  const screwTaper2 = translate([26.2, centerScrewY, 0], screwTaper)

  const screwAnchor3 = cylinder({center: [78.6, centerScrewY, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter/2})
  const screwHole3 = cylinder({center: [78.6, centerScrewY, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2})
  const screwCut3 = cuboid({center: [78.6, centerScrewY + screwAnchorInner/2 - .4 + 5, baseHeight + 5],
                            size: [10, 10, 10]})
  const screwTaper3 = translate([78.6, centerScrewY, 0], screwTaper)

  const screwAnchor4 = cylinder({center: [118.8, 0.85, screwAnchorHeight/2],
                                 height: screwAnchorHeight, radius: screwAnchorOuter4/2})
  const screwHole4 = cylinder({center: [118.8, 0.85, screwAnchorHeight/2],
                               height: screwAnchorHeight, radius: screwAnchorInner/2})
  const screwTaper4 = translate([118.8, 0.85, 0], screwTaper)

  const rightSupport =
    subtract(
      union(base, screwAnchor1, screwAnchor2, screwAnchor3, screwAnchor4),
      centerHole, slot1, slotCut1, slot2, slotCut2, slot3, slotCut3,
      screwHole1, screwCut1, screwTaper1,
      screwHole2, screwCut2, screwTaper2,
      screwHole3, screwCut3, screwTaper3,
      screwHole4, screwTaper4)
  const leftSupport = translate([0, -20, 0], mirrorY(rightSupport))
  return [rightSupport, leftSupport]
}

module.exports = { main }
