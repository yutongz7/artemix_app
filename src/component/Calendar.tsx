import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarProps {
  onDatePress: (date: Date) => void;
}

const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const generateCalendarMatrix = (month: number, year: number) => {
  const matrix: number[][] = [];
  const firstDay = new Date(year, month, 1).getDay();

  let day = 1;

  for (let i = 0; i < 6; i++) {
    const week: number[] = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDay) || day > daysInMonth(month, year)) {
        week.push(0);
      } else {
        week.push(day);
        day++;
      }
    }
    matrix.push(week);
  }

  return matrix;
};

const Calendar: React.FC<CalendarProps> = ({ onDatePress }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleDatePress = (day: number) => {
    if (day !== 0) {
      const selected = new Date(currentYear, currentMonth, day);
      setSelectedDate(selected);
      onDatePress(selected);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{today.toLocaleDateString('default', { month: 'long' })}</Text>
      <Text style={styles.headerText}>{today.getFullYear()}</Text>
    </View>
  );

  const renderDay = (day: number) => (
    <TouchableOpacity
      key={day}
      style={[styles.day, day === selectedDate?.getDate() && styles.selectedDay]}
      onPress={() => handleDatePress(day)}
    >
        <Text style={[styles.dayText, day === selectedDate?.getDate() && styles.selectedDayText]}>
            {day !== 0 ? day : ''}
        </Text>
    </TouchableOpacity>
  );

  const renderWeek = (week: number[]) => (
    <View key={week[0]} style={styles.week}>
      {week.map(renderDay)}
    </View>
  );

  const calendarMatrix = generateCalendarMatrix(currentMonth, currentYear);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {calendarMatrix.map(renderWeek)}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  day: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  selectedDay: {
    backgroundColor: '#3D1C51',
  },
  dayText: {
    fontSize: 16,
  },
  selectedDayText: {
    color: 'white'
  },
  container: {
    backgroundColor: 'pink',
    borderRadius: 10,
    minWidth: '80%'
  }
});

export default Calendar;
