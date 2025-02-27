import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Modal } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity, View } from "react-native";

interface FDatePickerProps {
  placeholder?: string;
  onChange?: (date: Date) => void;
  selectedDate: Date | undefined;
  value?: Date;
}

const FDatePicker: React.FC<FDatePickerProps> = ({
  placeholder = "Select Date",
  onChange,
  value,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(value || new Date());
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (currentDate < new Date()) {
      setError("Selected date cannot be before the current date.");
    } else {
      setError(null);
      setShowPicker(false);
      setDate(currentDate);
      if (onChange) {
        onChange(currentDate);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(); // Format date without time
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.touchable}
      >
        <TextInput
          value={formatDate(date)}
          placeholder={placeholder}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>
      {showPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()} // Set minimum date to current date
              />
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  touchable: {
    borderWidth: 1,
    borderColor: "grey",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    width: "100%",
    backgroundColor: "white",
    height: 54,
    borderRadius: 12,
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  doneButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default FDatePicker;
