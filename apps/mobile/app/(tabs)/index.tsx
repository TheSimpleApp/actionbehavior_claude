import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-16">
        <Text className="text-3xl font-bold mb-2">ABC Summit 2025</Text>
        <Text className="text-gray-600 mb-8">Welcome to the conference</Text>

        <View className="bg-primary rounded-lg p-6 mb-4">
          <Text className="text-white text-xl font-semibold mb-2">
            Event Information
          </Text>
          <Text className="text-white/80">
            Stay tuned for event details and updates
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
