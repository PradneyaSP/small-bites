import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Menu", headerTitleAlign: "center" }} />
            <Stack.Screen name="add" options={{ title: "Add New Item", headerTitleAlign: "center" }} />
            <Stack.Screen name="editItem" options={{ title: "Edit Item", headerTitleAlign: "center" }} />
        </Stack>
    );
}