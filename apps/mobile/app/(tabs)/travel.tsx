import { View, Text, ScrollView } from 'react-native';

export default function TravelScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-16">
        <Text className="text-3xl font-bold mb-2">Travel Hub</Text>
        <Text className="text-gray-600 mb-8">Your consolidated travel information</Text>

        <View className="bg-secondary rounded-lg p-6 mb-4">
          <Text className="text-lg font-semibold mb-2">Flight Information</Text>
          <Text className="text-gray-600">Flight details will appear here</Text>
        </View>

        <View className="bg-secondary rounded-lg p-6 mb-4">
          <Text className="text-lg font-semibold mb-2">Hotel Information</Text>
          <Text className="text-gray-600">Hotel details will appear here</Text>
        </View>

        <View className="bg-secondary rounded-lg p-6 mb-4">
          <Text className="text-lg font-semibold mb-2">Roommate Information</Text>
          <Text className="text-gray-600">Roommate details will appear here</Text>
        </View>
      </View>
    </ScrollView>
  );
}
