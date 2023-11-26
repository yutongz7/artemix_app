import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Art {
  _id: string;
  artAddress: string;
  width: number;
  height: number;
}

const HomePage: React.FC = () => {
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/arts')
      .then((response) => response.json())
      .then((data) => {
        const artsWithDimensions = data.data.map((art: Art) => ({
          ...art,
          width: art.width,
          height: art.height,
        }));
        setArts(artsWithDimensions);
      })
      .catch((error) => console.error('Error fetching arts:', error));
  }, []);

  const handleImagePress = (art: Art) => {
    // Handle the press event for the image here (detail page shows) 
    console.log('Image pressed:', art);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={false}>
      {arts.map((item) => (
        <TouchableOpacity key={item._id} onPress={() => handleImagePress(item)}>
          <Image
            source={{ uri: `http://localhost:4000/images/${item.artAddress}` }}
            style={{ width: item.width, height: item.height, margin: 10, borderRadius: 10 }}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
});

export default HomePage;

/* The code below uses FlatList instead of ScrollView,
 * but that only allows uniform width and height. */
// import React, { useState, useEffect } from 'react';
// import { PixelRatio, View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// interface Art {
//   _id: string;
//   artAddress: string;
// }

// const HomePage: React.FC = () => {
//   const [arts, setArts] = useState<Art[]>([]);

//   useEffect(() => {
//     // Fetch arts data from the server
//     fetch('http://localhost:4000/arts')
//       .then((response) => response.json())
//       .then((data) => {setArts(data.data); console.log(data.data)})
//       .catch((error) => console.error('Error fetching arts:', error));
//   }, []);

//   const handleImagePress = (art: Art) => {
//     // Handle the press event for the image here 
//     console.log('Image pressed:', art);
//   };

//   const renderItem = ({ item }: { item: Art }) => {
//     console.log(item.artAddress);
//     //const fullPath = require(`../assets/art/${item.artAddress}`);
    
//     return (
//       <TouchableOpacity onPress={() => handleImagePress(item)}>
//         <Image source={{uri: `http://localhost:4000/images/${item.artAddress}`}} style={styles.image}/>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {arts.length > 0 && (
//         <FlatList
//           data={arts}
//           renderItem={renderItem}
//           keyExtractor={(item) => item._id.toString()}
//           numColumns={2}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 180,
//     height: 180,
//     margin: 10,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
// });

// export default HomePage;
