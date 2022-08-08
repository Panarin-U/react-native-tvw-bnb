import React from "react";
import { Text } from "react-native";
import _ from "lodash";
import { fontThemes } from "../../themes";
import PropTypes from "prop-types";

const FontComponent = (props) => {
  const { numberOfLines } = props;
  const weight = _.get(props, "weight", 400);
  const style = _.get(props, "style", style);

  const lang = "en";

  const onpress = _.get(props, "onPress", null);

  return (
    <Text
      onPress={onpress}
      style={[
        {
          fontFamily: fontThemes.NOTO_SANS["EN"][weight],
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {props.children}
    </Text>
  );
};

FontComponent.propTypes = {
  weight: PropTypes.number,
  style: PropTypes.any,
  lang: PropTypes.string,
  onPress: PropTypes.func,
  numberOfLines: PropTypes.number,
};

FontComponent.defaultProps = {
  numberOfLines: undefined,
};

export default FontComponent;
