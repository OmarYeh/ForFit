import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  useColorScheme, // Use to detect the current theme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const settingsData = [
  {
    title: 'Personal',
    data: [
      { label: 'Profile', screen: 'Profile' },
      { label: 'Shipping Address', screen: 'ShippingAddress' },
    ],
  },
  {
    title: 'Shop',
    data: [
      { label: 'Country', value: 'Vietnam' },
      { label: 'Currency', value: '$ USD' },
      { label: 'Sizes', value: 'UK' },
      { label: 'Terms and Conditions', screen: 'TermsAndConditions' },
    ],
  },
  {
    title: 'Account',
    data: [
      { label: 'Language', value: 'English' },
      { label: 'About Us', screen: 'AboutUs' },
    ],
  },
];

const SettingsPage = () => {
  const navigation = useNavigation();
  const theme = useColorScheme(); // Detects if the current theme is dark or light
  const isDarkMode = theme === 'dark'; // Boolean for dark mode check

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: isDarkMode ? '#444' : '#ddd' }]} // Dark mode border color
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
    >
      <Text style={[styles.rowLabel, { color: isDarkMode ? '#fff' : '#333' }]}>{item.label}</Text>
      {item.value ? (
        <Text style={[styles.rowValue, { color: isDarkMode ? '#ccc' : '#666' }]}>{item.value}</Text>
      ) : (
        <Text style={[styles.rowArrow, { color: isDarkMode ? '#bbb' : '#999' }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  const renderSection = ({ item }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
      {item.data.map((dataItem, index) => (
        <React.Fragment key={index}>{renderItem({ item: dataItem })}</React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Settings</Text>
      <FlatList
        data={settingsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSection}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Logout')}>
              <Text style={[styles.deleteAccount, { color: isDarkMode ? '#ff5c5c' : 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 70,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center the section title
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 16,
  },
  rowValue: {
    fontSize: 16,
  },
  rowArrow: {
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  deleteAccount: {
    fontSize: 16,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsPage;
