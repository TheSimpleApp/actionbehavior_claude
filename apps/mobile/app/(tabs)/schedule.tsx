import { View, Text, ScrollView } from 'react-native';

export default function ScheduleScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-16">
        <Text className="text-3xl font-bold mb-2">My Schedule</Text>
        <Text className="text-gray-600 mb-8">Your bookmarked sessions</Text>

        <View className="bg-secondary rounded-lg p-6">
          <Text className="text-gray-600">No sessions bookmarked yet</Text>
        </View>
      </View>
    </ScrollView>
  );
}
