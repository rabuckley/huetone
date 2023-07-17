import { TColor } from 'shared/types'
import { colorSpaces } from 'shared/colorFuncs'

const DISPLAY_PRECISION = 3

function isP3Supported() {
  return window.matchMedia('(color-gamut: p3)').matches
}

function is2020Supported() {
  return window.matchMedia('(color-gamut: rec2020)').matches
}

interface ColourComparisionProps {
  colour: TColor
}

const ColourComparsion = ({ colour }: ColourComparisionProps) => {
  const p3Supported = isP3Supported()
  const rec2020Supported = is2020Supported()

  const { lch2color } = colorSpaces['oklch']

  const { within_sRGB, within_P3, within_Rec2020 } = lch2color([
    colour.l,
    colour.c,
    colour.h,
  ])

  if (within_sRGB) {
    return (
      <div className="grid grid-cols-1 p-4 lg:p-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-6">
        <div
          className="w-full h-20 grid place-content-center rounded-lg"
          style={{ backgroundColor: colour.hex }}
        >
          <div className="text-white font-semibold text-center">sRGB</div>
          <div className="text-white font-mono">{colour.hex}</div>
        </div>
      </div>
    )
  }

  if (within_P3) {
    const colourOKLCH = `oklch(${colour.l.toPrecision(
      2
    )}% ${colour.c.toPrecision(3)} ${colour.h.toPrecision(3)})`

    if (p3Supported) {
      return (
        <div className="grid grid-cols-2 p-4 lg:p-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-6">
          <div
            className="w-full h-20 grid place-content-center rounded-lg"
            style={{ backgroundColor: colour.hex }}
          >
            <div className="text-white font-semibold text-center">Fallback</div>
            <div className="text-white font-mono">{colour.hex}</div>
          </div>
          <div
            className="w-full h-20 grid place-content-center rounded-lg"
            style={{ backgroundColor: colourOKLCH }}
          >
            <div className="text-white font-semibold text-center">P3</div>
            <div className="text-white font-mono">{colourOKLCH}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-2 p-4 lg:p-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-6">
          <div
            className="w-full h-20 grid place-content-center rounded-lg"
            style={{ backgroundColor: colour.hex }}
          >
            <div className="text-white font-semibold text-center">Fallback</div>
            <div className="text-white font-mono">{colour.hex}</div>
          </div>
          <div className="w-full h-20 grid place-content-center rounded-lg">
            <div className="text-white font-semibold text-center">P3</div>
            <div className="text-white font-mono">Not supported</div>
          </div>
        </div>
      )
    }
  }

  if (within_Rec2020) {
    if (rec2020Supported) {
      return (
        <div className="grid grid-cols-2 p-4 lg:p-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-6">
          <div
            className="w-full h-20 grid place-content-center rounded-lg"
            style={{ backgroundColor: colour.hex }}
          >
            <div className="text-white font-semibold text-center">Fallback</div>
            <div className="text-white font-mono">{colour.hex}</div>
          </div>
          <div
            className="w-full h-20 grid place-content-center rounded-lg"
            style={{ backgroundColor: colour.hex }}
          >
            <div className="text-white font-semibold text-center">rec2020</div>
            <div className="text-white font-mono">{colour.hex}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-2 p-4 lg:p-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-6">
          <div
            className="w-full h-20 grid place-content-center rounded-lg"
            style={{ backgroundColor: colour.hex }}
          >
            <div className="text-white font-semibold text-center">Fallback</div>
            <div className="text-white font-mono">{colour.hex}</div>
          </div>
          <div className="w-full h-20 grid place-content-center rounded-lg border-dotted border-zinc-400 border-2 text-center font-mono">
            Rec2020 is not supported on this device
          </div>
        </div>
      )
    }
  }

  return (
    <div className="grid grid-cols-2 p-4 lg:p-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-6">
      <div
        className="w-full h-20 grid place-content-center rounded-lg"
        style={{ backgroundColor: colour.hex }}
      >
        <div className="text-white font-semibold text-center">Fallback</div>
        <div className="text-white font-mono">{colour.hex}</div>
      </div>
      <div className="w-full h-20 grid place-content-center rounded-lg border-dotted border-zinc-400 border-2 text-center font-mono">
        Unavailable on any device
      </div>
    </div>
  )
}

export default ColourComparsion
