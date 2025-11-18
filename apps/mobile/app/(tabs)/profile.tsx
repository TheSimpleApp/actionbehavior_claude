import { View, Text, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-16">
        <Text className="text-3xl font-bold mb-2">Profile</Text>
        <Text className="text-gray-600 mb-8">Your event profile and QR code</Text>

        <View className="bg-secondary rounded-lg p-6 mb-4">
          <Text className="text-lg font-semibold mb-4">User Information</Text>
          <View className="mb-2">
            <Text className="text-gray-600 text-sm">Name</Text>
            <Text className="text-lg">John Doe</Text>
          </View>
        </View>

        <View className="bg-secondary rounded-lg p-6 items-center">
          <Text className="text-lg font-semibold mb-4">Check-in QR Code</Text>
          <View className="w-48 h-48 bg-white rounded-lg items-center justify-center">
            <Text className="text-gray-400">QR Code will appear here</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
