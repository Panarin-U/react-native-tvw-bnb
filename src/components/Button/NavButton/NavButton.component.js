import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import styles from './NavButton.styles'
import PropTypes from 'prop-types'
import * as Svgs from '../../../../assets/svgs'

const svgKeys = Object.keys(Svgs)

const NavButtonComponent = (props) => {
  const { onPress, svg, style, styleImage } = props
  const isSvg = useMemo(() => svgKeys.includes(svg), [svg])
  const Svg = useMemo(() => (isSvg ? Svgs[svg] : null), [isSvg])

  return svgKeys.includes(svg) ? (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Svg {...styleImage} />
    </TouchableOpacity>
  ) : null
}

NavButtonComponent.propTypes = {
  onPress: PropTypes.func.isRequired,
  svg: PropTypes.oneOf(svgKeys).isRequired,
  style: PropTypes.object,
  styleImage: PropTypes.object,
}

export default NavButtonComponent
