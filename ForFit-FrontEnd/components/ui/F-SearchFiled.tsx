import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

interface SearchFieldProps {
  onSearch: (searchTerm: string) => void;
}

const FSearchField: React.FC<SearchFieldProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <View>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search"
        style={{
          height: 40,
          width: "100%",
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

export default FSearchField;
