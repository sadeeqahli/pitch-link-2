import React from 'react';
// Fixed deprecated import - using proper TextInput import
import { TextInput as RNTextInput } from 'react-native';

const TextInput = React.forwardRef((props, ref) => {
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor={props.placeholderTextColor || 'black'}
      {...props}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;