import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function PasswordInput({ 
  placeholder, 
  value, 
  onChangeText, 
  placeholderTextColor, 
  style, 
  ...props 
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isVisible}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, style]}
        {...props}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={[styles.eyeText, { color: placeholderTextColor || '#666' }]}>
          {isVisible ? '🙈' : '👁️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingRight: 45,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  eyeText: {
    fontSize: 16,
  },
});
