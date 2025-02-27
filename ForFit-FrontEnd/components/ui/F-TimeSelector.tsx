import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface TimeSelectorProps {
  selectedColor?: string;
  onTimeChange?: (time: string | null) => void;
  verification?: boolean;
}

const FTimeSelector: React.FC<TimeSelectorProps> = ({
  selectedColor = "pink",
  onTimeChange,
  verification = false,
}) => {
  const times = ["8AM - 2PM", "2PM - 4PM", "4PM - 6PM"];
  const [selectedTime, setSelectedTime] = useState<string | null>(times[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (verification && !selectedTime) {
      setError("Time selection is required.");
    } else {
      setError(null);
    }
  }, [selectedTime, verification]);

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(times[0]);
    }
  }, [onTimeChange]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (onTimeChange) {
      onTimeChange(time);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {times.map(time => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeBox,
              selectedTime === time && { borderColor: selectedColor },
            ]}
            onPress={() => handleTimeSelect(time)}
          >
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeBox: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default FTimeSelector;
