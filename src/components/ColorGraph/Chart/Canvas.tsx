import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useStore } from '@nanostores/react'
import { Channel, spaceName, TColor } from 'shared/types'
import { paletteStore } from 'store/palette'
import { chartSettingsStore } from 'store/chartSettings'

import {
  // Using singleton worker pool shared between Canvases ensuring total pool size
  channelFuncs,
  ConcurrentSpreadRender,
  RenderStrategyType,
  DrawPartialFn,
  ConcurrentSpreadStrategyParams,
} from './RenderStrategy'
import { drawImageOnCanvasSafe } from './drawImageOnCanvasSafe'

/** 100 is kind of optimal repaint ratio (1% per 'frame-column'). More areas cause more worker overhead */
export const OPTIMAL_SPREAD_AREAS_AMOUNT = 100
export const SUPERSAMPLING_RATIO = 1

const RENDER_STRATEGY_DEBOUNCE: { [K in RenderStrategyType]: number } = {
  basic: 200,
  concurrent: 50,
  spread: 0,
}
const RENDER_STRATEGY_SPREAD: { [K in RenderStrategyType]: number } = {
  basic: 1,
  concurrent: channelFuncs.length,
  spread: OPTIMAL_SPREAD_AREAS_AMOUNT,
}

export function Canvas(props: {
  width: number
  height: number
  channel: Channel
  colors: TColor[]
  renderStrategy?: RenderStrategyType
}) {
  const settings = useStore(chartSettingsStore)
  const { mode } = useStore(paletteStore)
  const {
    width,
    height,
    channel,
    colors,
    renderStrategy = 'concurrent',
  } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const debouncedRepaint = useMemo(() => {
    const debounceRate = RENDER_STRATEGY_DEBOUNCE[renderStrategy]
    const renderSpread = RENDER_STRATEGY_SPREAD[renderStrategy]

    return debounce((colors: TColor[], mode: spaceName) => {
      console.log('🖼 Repaint canvas')
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d', { colorSpace: 'display-p3' })
      if (!ctx) return

      const drawPartialImage: DrawPartialFn = (image, from, to) => {
        ctx.clearRect(from, 0, to - from, height)
        drawImageOnCanvasSafe(ctx, image, from, to, height)
      }

      const renderParams: ConcurrentSpreadStrategyParams = {
        width,
        height,
        mode,
        colors,
        ...settings,
        spread: renderSpread,
        scale: SUPERSAMPLING_RATIO,
      }

      return ConcurrentSpreadRender(
        channelFuncs,
        channel,
        renderParams,
        drawPartialImage
      )
    }, debounceRate)
  }, [channel, height, settings, width, renderStrategy])

  useEffect(() => {
    debouncedRepaint(colors, mode)
    return () => {
      // get previously fired render operation to shortcut execution and to abort any bitmap commits from it
      debouncedRepaint(colors, mode)?.abort()
      debouncedRepaint.cancel()
    }
  }, [colors, debouncedRepaint, mode])
  return (
    <div className="overflow-hidden rounded-lg bg-white bg-striped">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ filter: settings.showColors ? '' : 'var(--canvas-filter)' }}
      />
    </div>
  )
}
