import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  RefreshControl,
  Platform,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAvatar from "react-native-user-avatar";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://random-data-api.com/api/users/random_user?size=10")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data");
      });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      axios
        .get("https://random-data-api.com/api/users/random_user?size=10")
        .then((response) => {
          setUsers(response.data);
          Toast.show({
            type: "info",
            text1: "Refreshed",
            text2: "Refreshed to generate random 10 users successfully 👋",
            position: "bottom",
            visibilityTime: 1000,
          });
        })
        .catch((err) => {
          Toast.show({
            type: "error",
            text1: "Fail",
            text2: "Fail to refresh the user list 😢",
            position: "bottom",
            visibilityTime: 1000,
          });
        });
      setRefreshing(false);
    }, 1000);
  }, []);

  const addUser = async () => {
    setRefreshing(true);

    try {
      const response = await axios.get(
        "https://random-data-api.com/api/users/random_user?size=1"
      );

      setUsers((prevUsers) => [response.data[0], ...prevUsers]);

      Toast.show({
        type: "success",
        text1: "Hello",
        text2: "Added one new user successfully 👋",
        position: "bottom",
        visibilityTime: 1000,
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Oops",
        text2: "Fail to add new user 😢",
        position: "bottom",
        visibilityTime: 2000,
      });
    } finally {
      setRefreshing(false); // Stop the refresh indicator
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <UserAvatar
        size={50}
        src={item.avatar}
        bgColor={
          [
            "#ccc",
            "#fafafa",
            "#ccaabb",
            "#FF0000",
            "#0000FF",
            "#008000",
            "#FFFF00",
            "#FFA500",
            "#800080",
            "#FFC0CB",
            "#A52A2A",
            "#000000",
            "#FFFFFF",
            "#808080",
            "#00FFFF",
            "#FF00FF",
            "#00FF00",
            "#4B0082",
            "#008080",
            "#800000",
            "#808000",
            "#000080",
            "#FF7F50",
          ][Math.floor(Math.random() * 23)]
        }
      />

      <View>
        <Text style={styles.firstName}>{item.first_name}</Text>
        <Text style={styles.lastName}>{item.last_name}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item) => item.uid.toString();

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <View style={styles.users}>
          <Text>Welcome to the User List</Text>
        </View>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <Toast />
        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={addUser}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 36,
  },
  itemContainer: {
    justifyContent: "space-between",
    flexDirection: Platform.OS === "android" ? "row" : "row-reverse",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    padding: 10,
  },
  users: {
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  firstName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: Platform.OS === "ios" ? "left" : "right",
  },
  lastName: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    textAlign: Platform.OS === "ios" ? "left" : "right",
  },
  fab: {
    position: "absolute",
    right: 10,
    bottom: 40,
    backgroundColor: "#2196F3",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
