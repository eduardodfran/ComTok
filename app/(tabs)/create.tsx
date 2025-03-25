import { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { provinces } from '@/services/mockData'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function CreatePostScreen() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showProvinceSelector, setShowProvinceSelector] = useState(false)

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')
  const borderColor = useThemeColor({}, 'border')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const dividerColor = useThemeColor({}, 'divider')
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')
  const shadowColor = useThemeColor({}, 'shadow')

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.actionBar}>
        <TouchableOpacity
          style={[
            styles.postButton,
            { backgroundColor: tintColor },
            (!title || !content || !selectedProvince) && {
              backgroundColor: buttonDisabledColor,
            },
          ]}
          disabled={!title || !content || !selectedProvince}
        >
          <ThemedText style={styles.postButtonText}>Post</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.form}>
        <TouchableOpacity
          style={[
            styles.communitySelector,
            { backgroundColor: inputBgColor, borderColor },
          ]}
          onPress={() => setShowProvinceSelector(true)}
        >
          <Ionicons name="location-outline" size={20} color={iconColor} />
          <ThemedText
            style={[
              styles.communitySelectorText,
              { color: secondaryTextColor },
            ]}
          >
            {selectedProvince && selectedCity
              ? `${selectedProvince} › ${selectedCity}`
              : selectedProvince
              ? selectedProvince
              : 'Select a community'}
          </ThemedText>
          <Ionicons name="chevron-down" size={20} color={iconColor} />
        </TouchableOpacity>

        <TextInput
          style={[
            styles.titleInput,
            { backgroundColor: inputBgColor, color: textColor, borderColor },
          ]}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={secondaryTextColor}
          maxLength={300}
        />

        <TextInput
          style={[
            styles.contentInput,
            { backgroundColor: inputBgColor, color: textColor, borderColor },
          ]}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          placeholderTextColor={secondaryTextColor}
          multiline
          textAlignVertical="top"
        />

        <ThemedView style={styles.attachmentsRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="image-outline" size={24} color={iconColor} />
            <ThemedText
              style={[styles.attachButtonText, { color: secondaryTextColor }]}
            >
              Image
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="link-outline" size={24} color={iconColor} />
            <ThemedText
              style={[styles.attachButtonText, { color: secondaryTextColor }]}
            >
              Link
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="document-outline" size={24} color={iconColor} />
            <ThemedText
              style={[styles.attachButtonText, { color: secondaryTextColor }]}
            >
              Document
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {showProvinceSelector && (
        <ThemedView
          style={[
            styles.selectorModal,
            {
              backgroundColor: cardBgColor,
              shadowColor,
            },
          ]}
        >
          <ThemedView
            style={[styles.selectorHeader, { borderBottomColor: dividerColor }]}
          >
            <ThemedText type="subtitle">Select a Province</ThemedText>
            <TouchableOpacity onPress={() => setShowProvinceSelector(false)}>
              <Ionicons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.provinceList}>
            {provinces.map((province) => (
              <TouchableOpacity
                key={province.id}
                style={[
                  styles.provinceItem,
                  { borderBottomColor: dividerColor },
                ]}
                onPress={() => {
                  setSelectedProvince(province.name)
                  setShowProvinceSelector(false)
                }}
              >
                <Image
                  source={{ uri: province.image }}
                  style={styles.provinceImage}
                />
                <ThemedText style={styles.provinceName}>
                  {province.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // Reduced padding since we have the header
  },
  actionBar: {
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  communitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  communitySelectorText: {
    flex: 1,
    marginLeft: 8,
  },
  titleInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  contentInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
  },
  attachmentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  attachButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonText: {
    marginTop: 4,
    fontSize: 12,
  },
  selectorModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxHeight: '70%',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  provinceList: {
    maxHeight: '90%',
  },
  provinceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  provinceImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  provinceName: {
    fontSize: 16,
  },
})
