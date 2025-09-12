/* https://stackoverflow.com/questions/57026963/setting-parents-height-and-width-based-on-child-dimension */

import { useState, useCallback } from 'react'

export function useLayoutDimension() {
  const [dimension, setDimension] = useState(0)
  const layoutDimension = { width: 0, height: 0 }
  const onLayout = useCallback(({ nativeEvent }) => {
    layoutDimension.width = nativeEvent.layout.width
    layoutDimension.height = nativeEvent.layout.height
    if (dimension !== layoutDimension.width && layoutDimension.width > 0) {
      setDimension(layoutDimension)
    }
  }, [])

  return {
    dimension,
    onLayout,
  }
}