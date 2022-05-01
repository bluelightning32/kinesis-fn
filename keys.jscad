const jscad = require('@jscad/modeling')
const { geom2, path2 } = jscad.geometries
const { mat4 } = jscad.maths
const { circle, cuboid, rectangle } = jscad.primitives
const { center, mirrorY, translate, translateX, translateZ } = jscad.transforms
const { colorize } = jscad.colors
const { union, subtract, intersect } = jscad.booleans
const { extrudeFromSlices, extrudeLinear, slice } = jscad.extrusions
const { hullChain } = jscad.hulls
const { vectorText } = jscad.text

const roundedText = (str) => {
  const pen = circle({radius: 0.2})

  return center({},
    colorize(
      [0.7, 0.7, 0.7],
      union(extrudeLinear({height: 1}, 
        vectorText({height: 1.4, letterSpacing: 1.0}, str).map((segment) => {
          return hullChain(segment.map((point) => translate([point[0] * .75, point[1]], pen)))
        })))))
}

const key = (name) => {
  const prism = extrudeFromSlices({
    callback: (progress, index, base) => {
      if (progress == 0) {
        return slice.fromSides(geom2.toSides(
          rectangle({size: [7.75, 11]})))
      } else {
        return slice.transform(
          mat4.fromTranslation(mat4.create(), [0, 0, 6.3]),
          slice.fromSides(geom2.toSides(
            rectangle({size: [7.15, 10.4]})))
          )
      }
    }
  }, 0)
  
  const prongThickness = 1
  const prongOuterSpacing = 6.4
  
  const prong1 = cuboid({center: [0.875, prongOuterSpacing/2 - prongThickness/2, 6.3 - 9.75/2], size: [3.05, prongThickness, 9.75]})
  const prong2 = mirrorY(prong1)
  
  const text = translateZ(6.3, roundedText(name))
  
  return [
    prism,
    prong1,
    prong2,
    text
  ]
}

const main = () => {
  const names = ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PSCN', 'SCLK', '||', 'KPD', 'PRGM']
  let offset = -10
  return names.map((name) => {
    offset += 8.25
    return translateX(offset, key(name))
  })
}

module.exports = { main }
