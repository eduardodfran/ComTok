import { useState } from 'react'
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

type ReportReason =
  | 'spam'
  | 'harassment'
  | 'violence'
  | 'hate_speech'
  | 'misinformation'
  | 'inappropriate'
  | 'other'

interface ReportModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (reason: ReportReason, details: string) => Promise<void>
  contentType: 'post' | 'comment' | 'user'
}

export function ReportModal({
  visible,
  onClose,
  onSubmit,
  contentType,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  )
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportReasons: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Spam' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'violence', label: 'Violence or dangerous behavior' },
    { value: 'hate_speech', label: 'Hate speech or symbols' },
    { value: 'misinformation', label: 'False information' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'other', label: 'Other' },
  ]

  const handleSubmit = async () => {
    if (!selectedReason) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedReason, details)
      resetForm()
    } catch (error) {
      console.error('Error submitting report:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedReason(null)
    setDetails('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.modalHeader}>
                <ThemedText type="subtitle">Report {contentType}</ThemedText>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#687076" />
                </TouchableOpacity>
              </ThemedView>

              <ScrollView style={styles.content}>
                <ThemedText style={styles.reasonTitle}>
                  Why are you reporting this {contentType}?
                </ThemedText>

                {reportReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.value}
                    style={[
                      styles.reasonOption,
                      selectedReason === reason.value && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedReason(reason.value)}
                  >
                    <ThemedText
                      style={[
                        styles.reasonText,
                        selectedReason === reason.value && styles.selectedText,
                      ]}
                    >
                      {reason.label}
                    </ThemedText>
                    {selectedReason === reason.value && (
                      <Ionicons name="checkmark" size={20} color="#0a7ea4" />
                    )}
                  </TouchableOpacity>
                ))}

                <ThemedText style={styles.detailsLabel}>
                  Additional details (optional)
                </ThemedText>
                <TextInput
                  style={styles.detailsInput}
                  multiline
                  placeholder="Please provide any additional information..."
                  placeholderTextColor="#687076"
                  value={details}
                  onChangeText={setDetails}
                  maxLength={500}
                />

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!selectedReason || isSubmitting) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <ThemedText style={styles.submitButtonText}>
                      Submit Report
                    </ThemedText>
                  )}
                </TouchableOpacity>

                <ThemedText style={styles.disclaimer}>
                  Our team will review this report and take appropriate action
                  according to our community guidelines. Thank you for helping
                  to keep ComTok safe and respectful.
                </ThemedText>
              </ScrollView>
            </ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 16,
  },
  reasonTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  selectedOption: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
  },
  reasonText: {
    fontSize: 16,
  },
  selectedText: {
    fontWeight: '600',
  },
  detailsLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0C4D1',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 30,
    lineHeight: 18,
  },
})
