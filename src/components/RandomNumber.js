

/////////////////////////////////////////////////

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

const RandomNumber = ({ id, number, isDisabled, onPress }) => {
  const handlePress = () => {
    if (isDisabled) return;
    onPress(id);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.random, isDisabled && styles.selected]}>
        {number}
      </Text>
    </TouchableOpacity>
  );
};

RandomNumber.propTypes = {
  id: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  random: {
    backgroundColor: '#999',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center',
  },
  selected: {
    opacity: 0.3,
  }
});

export default RandomNumber;