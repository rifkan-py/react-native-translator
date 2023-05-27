import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { languages_list } from "./src/data/languages";
import axios from "axios";

export default function App() {
  const [fieldValue, setFieldValue] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [allTranslations, setAllTranslations] = useState([]);

  const handlePress = async () => {
    if (!fieldValue || !sourceLanguage || !targetLanguage)
      return alert("All the fields are required");
    const formData = {
      text: fieldValue,
      sourceLanguage,
      targetLanguage,
    };

    try {
      const { data } = await axios.post(
        "http://34.229.90.253:5000/api/v1/translate",
        formData
      );
      setAllTranslations((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error:", error.stack);
    }
  };

  useEffect(() => {
    axios("http://34.229.90.253:5000/").then((res) =>
      setAllTranslations(res.data)
    );
  }, []);

  // const languagesName = languages_list.map((language) => language.name);

  return (
    <View style={styles.container}>
      <View style={styles.selectionContainer}>
        <View style={{ flex: 1 }}>
          <Text>Source Language</Text>
          <SelectDropdown
            buttonStyle={{ width: "100%" }}
            data={languages_list}
            onSelect={(selectedItem, index) => {
              setSourceLanguage(selectedItem.code);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text>Target Language</Text>
          <SelectDropdown
            buttonStyle={{ width: "100%" }}
            data={languages_list}
            onSelect={(selectedItem, index) => {
              setTargetLanguage(selectedItem.code);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter Text to Translate"
          onChangeText={(value) => setFieldValue(value)}
        />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemsContainer}>
        {allTranslations && (
          <FlatList
            data={allTranslations}
            renderItem={({ item }) => (
              <View style={styles.singleTranslation}>
                <Text style={styles.translatedText}>{item.translatedText}</Text>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.sourceLanguage}>{item.sourceLanguage}</Text>
                <Text style={styles.targetLanguage}>{item.targetLanguage}</Text>
              </View>
            )}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputField: {
    height: 60,
    borderColor: "#DBDBDB",
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: "#8F00C1",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
  inputGroup: {
    marginTop: 40,
  },
  selectionContainer: {
    marginTop: 30,
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  singleTranslation: {
    borderColor: "#DBDBDB",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  translatedText: {
    fontSize: 30,
    fontWeight: 500,
  },
  text: {
    fontSize: 20,
  },
  itemsContainer: {
    flex: 1,
  },
});
