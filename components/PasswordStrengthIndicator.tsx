import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ThemedText } from './ThemedText'
import {
  PasswordStrength,
  getPasswordStrengthColor,
} from '@/services/validationService'

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength
  score: number
  feedback?: string[]
  showFeedback?: boolean
}

export function PasswordStrengthIndicator({
  strength,
  score,
  feedback = [],
  showFeedback = true,
}: PasswordStrengthIndicatorProps) {
  const barColor = getPasswordStrengthColor(strength)

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <ThemedText style={styles.label}>Password Strength:</ThemedText>
        <ThemedText style={[styles.strengthText, { color: barColor }]}>
          {strength}
        </ThemedText>
      </View>

      <View style={styles.barContainer}>
        <View
          style={[
            styles.strengthBar,
            { width: `${score}%`, backgroundColor: barColor },
          ]}
        />
      </View>

      {showFeedback && feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {feedback.map((tip, index) => (
            <ThemedText key={index} style={styles.feedbackText}>
              • {tip}
            </ThemedText>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  barContainer: {
    height: 6,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
  },
  feedbackContainer: {
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 12,
    color: '#687076',
    marginVertical: 2,
  },
})
