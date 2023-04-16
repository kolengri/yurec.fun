// https://tailwindcss.com/docs/customizing-colors

const palette = require("./src/styles/palette.js")

// https://tailwindcss.com/docs/customizing-colors
const withOpacityValue = (v) => {
  const variable = v.replace(",", "")
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

const colors = Object.fromEntries(
  Object.entries(palette).map(([colorName, colorVar]) => [colorName, withOpacityValue(colorVar)])
)

module.exports = colors
