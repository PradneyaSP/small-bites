import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext';
// import { getUserFavorites } from '@/lib/services/userService'; // We'll implement this later

// Sample data for favorites
const SAMPLE_FAVORITES = [
  {
    item_id: "item1",
    name: "Paneer Paratha",
    description: "Tasty and Crispy paratha",
    price: 80,
    rating: 4.8,
    image: require('@/assets/images/menuItems/canteen_1742927702829.jpg'),
    canteenName: "Nescafé"
  },
  {
    item_id: "item2",
    name: "Coffee",
    description: "Hot!!!",
    price: 20,
    rating: 4.6,
    image: require('@/assets/images/menuItems/canteen_1744030815840.jpg')
    ,canteenName: "AMUL"
  },
  {
    item_id: "item3",
    name: "Sandwich",
    description: "Tasty Crispy sandwich.",
    price: 50,
    rating: 4.5,
    image: require('@/assets/images/menuItems/canteen_1742928125132.jpg'),
    canteenName: "Nescafé"
  }
  
];

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState(SAMPLE_FAVORITES);
  const [loading, setLoading] = useState(false); // Set to false since we're using sample data
  const [itemQuantities, setItemQuantities] = useState({});
  const { user } = useAuth();

  // This would be used when connecting to real data
  // useEffect(() => {
  //   fetchFavorites();
  // }, [user]);

  // Placeholder for the real function
  const fetchFavorites = async () => {
    // If using real data, this would be:
    // if (!user) return;
    // setLoading(true);
    // try {
    //   const userFavorites = await getUserFavorites(user.uid);
    //   setFavorites(userFavorites || []);
    // } catch (error) {
    //   console.error('Error fetching favorites:', error);
    // } finally {
    //   setLoading(false);
    // }
    
    // For now, we're simply using sample data
    setFavorites(SAMPLE_FAVORITES);
  };

  const toggleFavorite = async (itemId) => {
    // Remove from favorites immediately for better UX
    setFavorites(favorites.filter(item => item.item_id !== itemId));
    
    // Later, this would call your API
    // try {
    //   await removeFromFavorites(user.uid, itemId);
    // } catch (error) {
    //   console.error('Error removing from favorites:', error);
    //   // Restore the item if the API call fails
    //   fetchFavorites();
    // }
  };

  const updateItemQuantity = (itemId, change) => {
    setItemQuantities(prev => {
      const currentQuantity = prev[itemId] || 1;
      const newQuantity = Math.max(1, currentQuantity + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const addToCart = (item) => {
    const quantity = itemQuantities[item.item_id] || 1;
    // Add your cart logic here
    alert(`Added ${quantity} of ${item.name} to cart`);
    // You would typically call your cart service here
  };

  const renderFavoriteItem = ({ item }) => {
    const quantity = itemQuantities[item.item_id] || 1;

    return (
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
          <Image 
             source={item.image} // Changed from { uri: item.image }
             style={styles.itemImage} 
          //  defaultSource={require('@/assets/images/menuItems/canteen_1742927702829.jpg')} // Add a local placeholder
        
        />
          <View style={styles.imageOverlay} />
          
          <View style={styles.canteenBadge}>
            <Text style={styles.canteenName}>{item.canteenName}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.item_id)}
          >
            <Ionicons
              name="heart"
              size={24}
              color="#FF4D4D"
            />
          </TouchableOpacity>
          
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            
            <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</Text>
            
            <View style={styles.actionContainer}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => updateItemQuantity(item.item_id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateItemQuantity(item.item_id, 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No favorites yet</Text>
      <Text style={styles.emptySubtext}>
        Items you favorite will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Favorites</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD337" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.item_id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  menuItemContainer: {
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  canteenBadge: {
    position: "absolute",
    left: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  canteenName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  favoriteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: "#333",
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD337",
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  quantityButtonText: {
    fontSize: 20,
    color: "#555",
    fontWeight: "bold",
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#FFD337",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default FavoritesScreen;