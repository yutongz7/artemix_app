import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CustomTimePickerProps {
  selectedTime: Date;
  onTimeChange: (newTime: Date) => void;
}

const TimePicker: React.FC<CustomTimePickerProps> = ({ selectedTime, onTimeChange }) => {
  const [selectedHours, setSelectedHours] = useState(selectedTime.getHours());
  const [selectedMinutes, setSelectedMinutes] = useState(selectedTime.getMinutes());

  const handleTimeChange = () => {
    const newTime = new Date();
    newTime.setHours(selectedHours);
    newTime.setMinutes(selectedMinutes);
    onTimeChange(newTime);
  };

  const renderPickerItems = (maxValue: number, isHour: boolean) => {
    const items = [];
    for (let i = 0; i <= maxValue; i++) {
      items.push(
        <TouchableOpacity
          key={i}
          style={[styles.pickerItem, isHour && styles.hourPickerItem]}
          onPress={() => (isHour ? setSelectedHours(i) : setSelectedMinutes(i))}
        >
          <Text style={styles.pickerItemText}>{i < 10 ? `0${i}` : `${i}`}</Text>
        </TouchableOpacity>
      );
    }
    return items;
  };

  return (
    <View style={styles.everythingContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Hours</Text>
        <Text style={styles.headerText}>Minutes</Text>
      </View>

      <View style={styles.pickerContainer}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {renderPickerItems(23, true)}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {renderPickerItems(59, false)}
        </ScrollView>
      </View>

      <TouchableOpacity onPress={handleTimeChange} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 5
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    height: 100,
  },
  pickerItem: {
    padding: 8,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 8,
  },
  hourPickerItem: {
    marginRight: 16,
  },
  pickerItemText: {
    fontSize: 18,
    color: 'white',
  },
  confirmButton: {
    margin: 16,
    padding: 10,
    backgroundColor: '#3D1C51',
    borderRadius: 15,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  everythingContainer: {
    backgroundColor: '#D7798B',
    borderRadius: 15
  }
});

export default TimePicker;