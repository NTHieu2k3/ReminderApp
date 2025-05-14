import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Reminder } from "models/Reminder";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface RItemProps {
  readonly reminder: Reminder;
  readonly completed?: boolean;
  readonly onPress?: () => void;
}

type RootStackParam = {
  DetailReminder: { id: string };
};

export default function RItem({ reminder, completed, onPress }: RItemProps) {
  const [isSelected, setIsSelected] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  function prioriryTitle(p: any) {
    if (p === "Low") return `! ${reminder.title}`;
    else if (p === "Medium") return `!! ${reminder.title}`;
    else if (p === "High") return `!!! ${reminder.title}`;
    else return `${reminder.title}`;
  }
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => navigation.navigate("DetailReminder", { id: reminder.id })}
    >
      <Pressable
        style={[isSelected ? styles.icon : null]}
        onPress={() => [
          setIsSelected((prev) => !prev),
          console.log(reminder.details.photoUri),
        ]}
      >
        <Ionicons
          name={isSelected ? "ellipse-sharp" : "ellipse-outline"}
          size={isSelected ? 25 : 30}
          color={isSelected ? "#6060ed" : "#dfdfe6"}
        />
      </Pressable>

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>
            {prioriryTitle(reminder.details.priority)}
          </Text>

          {reminder.note && <Text style={styles.note}>{reminder.note}</Text>}

          {(reminder.details.date || reminder.details.time) && (
            <Text style={styles.dateTime}>
              Reminders -{" "}
              {reminder.details.date ? reminder.details.date + "," : ""}{" "}
              {reminder.details.time}
            </Text>
          )}

          {reminder.details.photoUri && (
            <Image src={reminder.details.photoUri} style={styles.image} />
          )}
        </View>
        {reminder.details.flagged?.toString() === "true" && (
          <View>
            <Ionicons
              name="flag-sharp"
              size={25}
              color="#ef893a"
              style={{ marginLeft: 10 }}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderColor: "#6060ed",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#d2d2d5",
    borderBottomWidth: 1,
    paddingVertical: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1C1C1E",
  },

  note: {
    fontSize: 15,
    color: "#8E8E93",
    marginTop: 2,
  },

  dateTime: {
    fontSize: 15,
    color: "#FF3B30",
    marginTop: 4,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginTop: 8,
  },

  pressed: {
    opacity: 0.5,
    backgroundColor: "#F2F2F7",
  },
});
