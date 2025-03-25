import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  View,
} from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { provinces } from '@/services/mockData'
import { formatNumber } from '@/utils/formatters'
import { Province } from '@/types/location'
import { useThemeColor } from '@/hooks/useThemeColor'
import { getThemedShadow } from '@/utils/theme'

export default function ExploreScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [filteredProvinces, setFilteredProvinces] =
    useState<Province[]>(provinces)

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const shadowColor = useThemeColor({}, 'shadow')
  const shadow = getThemedShadow(1)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProvinces(provinces)
      return
    }

    const lowercaseQuery = searchQuery.toLowerCase()
    const filtered = provinces.filter(
      (province) =>
        province.name.toLowerCase().includes(lowercaseQuery) ||
        province.description.toLowerCase().includes(lowercaseQuery)
    )

    setFilteredProvinces(filtered)
  }, [searchQuery])

  const navigateToProvince = (provinceId: number, provinceName: string) => {
    router.push({
      pathname: '/province/[id]',
      params: { id: provinceId, name: provinceName },
    })
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <ThemedView style={styles.container}>
      {/* Search bar */}
      <ThemedView
        style={[
          styles.searchContainer,
          {
            backgroundColor: inputBgColor,
            borderColor: isFocused ? tintColor : 'transparent',
          },
          isFocused && styles.searchContainerFocused,
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={iconColor}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search provinces and cities..."
          placeholderTextColor={secondaryTextColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </ThemedView>

      {filteredProvinces.length === 0 ? (
        <ThemedView style={styles.emptyResultsContainer}>
          <Ionicons name="search-outline" size={64} color={iconColor} />
          <ThemedText style={styles.emptyResultsText}>
            No results found for "{searchQuery}"
          </ThemedText>
          <ThemedText
            style={[styles.emptyResultsSubtext, { color: secondaryTextColor }]}
          >
            Try using different keywords or check for typos
          </ThemedText>
        </ThemedView>
      ) : (
        <>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Provinces'}
          </ThemedText>

          <FlatList
            data={filteredProvinces}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.provinceList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.provinceCard,
                  { backgroundColor: cardBgColor, ...shadow },
                ]}
                onPress={() => navigateToProvince(item.id, item.name)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.provinceImage}
                />
                <ThemedView style={styles.provinceInfo}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.provinceName}
                  >
                    {item.name}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.provinceDescription,
                      { color: secondaryTextColor },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </ThemedText>
                  <ThemedView style={styles.statsContainer}>
                    <ThemedView style={styles.stat}>
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color={iconColor}
                      />
                      <ThemedText
                        style={[styles.statText, { color: secondaryTextColor }]}
                      >
                        {formatNumber(item.memberCount)} members
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.stat}>
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color={iconColor}
                      />
                      <ThemedText
                        style={[styles.statText, { color: secondaryTextColor }]}
                      >
                        {formatNumber(item.postCount)} posts
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // Reduced top padding since we have header now
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchContainerFocused: {
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  provinceList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  provinceCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  provinceImage: {
    height: 140,
    width: '100%',
  },
  provinceInfo: {
    padding: 16,
  },
  provinceName: {
    fontSize: 18,
    marginBottom: 4,
  },
  provinceDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyResultsText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
})
