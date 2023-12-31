import React, { useState, useEffect, } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, Text, Modal, Button } from 'react-native';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

interface Art {
  _id: string;
  userId: string;
  userName: string;
  artTitle: string;
  artContent: string;
  artAddress: string;
  artTags: { type: [String], default: [] };
  width: number;
  height: number;
}

interface HomePageProps {
  showOnboarding: boolean;
}

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'OnboardingPage2'>;

interface HomePageProps {
  route: HomeScreenRouteProp;
}

const HomePage: React.FC<HomePageProps> = ({ showOnboarding }) => {
  const [arts, setArts] = useState<Art[]>([]);
  const [modalVisible, setModalVisible] = useState(showOnboarding);
  const [onboardingStep, setOnboardingStep] = useState(1);

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

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleImagePress = (art: Art) => {
    navigation.navigate('DetailPage', {
      data: {
        artId: art._id,
        userId: art.userId,
        userName: art.userName,
        artTitle: art.artTitle,
        artContent: art.artContent,
        artAddress: art.artAddress,
        artTags: art.artTags,
        width: art.width,
        height: art.height,
      }
    })
    console.log('Image pressed:', art);
  };

      // Function to calculate scaled dimensions while maintaining aspect ratio
    const getScaledDimensions = (originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number) => {
        const aspectRatio = originalWidth / originalHeight;
    
        // Calculate scaled dimensions
        let scaledWidth = originalWidth;
        let scaledHeight = originalHeight;
    
        if (scaledWidth > maxWidth) {
          scaledWidth = maxWidth;
          scaledHeight = scaledWidth / aspectRatio;
        }
    
        if (scaledHeight > maxHeight) {
          scaledHeight = maxHeight;
          scaledWidth = scaledHeight * aspectRatio;
        }
    
        return { width: scaledWidth, height: scaledHeight };
      };

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={false}>
      {arts.map((item) => (
        <TouchableOpacity key={item._id} onPress={() => handleImagePress(item)}>
          <Image
            source={{ uri: `http://localhost:4000/images/${item.artAddress}` }}
            style={{
              ...getScaledDimensions(item.width, item.height, 160, 300),
              margin: 10,
              borderRadius: 10,
            }}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingTop: 50,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    marginBottom: 20,
  },
  onboardingText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 300,
    paddingTop: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  nextButtonContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#3D1C51',
    borderRadius: 30,
    width: 110,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 15,
  },
});

export default HomePage;



// import React, { useState, useEffect, } from 'react';
// import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/NavigationTypes';
// import BottomTabNavigator from '../navigation/BottomTabNavigator';

// interface Art {
//   _id: string;
//   userId: string;
//   userName: string;
//   artTitle: string;
//   artContent: string;
//   artAddress: string;
//   artTags: {type: [String], default: []};
//   width: number;
//   height: number;
// }
// interface HomePageProps {
//   showOnboarding: boolean;
// }

// type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;
// const HomePage: React.FC<HomePageProps> = ({ showOnboarding }) => {
//   const [arts, setArts] = useState<Art[]>([]);


//   useEffect(() => {
//     fetch('http://localhost:4000/arts')
//       .then((response) => response.json())
//       .then((data) => {
//         const artsWithDimensions = data.data.map((art: Art) => ({
//           ...art,
//           width: art.width,
//           height: art.height,
//         }));
//         setArts(artsWithDimensions);
//       })
//       .catch((error) => console.error('Error fetching arts:', error));
//   }, []);

//   const navigation = useNavigation<HomeScreenNavigationProp>();

//   const handleImagePress = (art: Art) => {
//     // Handle the press event for the image here (detail page shows)
//     // navigate to the detail page with all the art data passed in
//     // TODO: update seen
//     navigation.navigate('DetailPage', {
//       data: { 
//         artId: art._id,
//         userId: art.userId,
//         userName: art.userName,
//         artTitle: art.artTitle,
//         artContent: art.artContent,
//         artAddress: art.artAddress,
//         artTags: art.artTags,
//         width: art.width,
//         height: art.height
//       }
//     })
//     console.log('Image pressed:', art);
//   };

//     // Function to calculate scaled dimensions while maintaining aspect ratio
//     const getScaledDimensions = (originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number) => {
//         const aspectRatio = originalWidth / originalHeight;
    
//         // Calculate scaled dimensions
//         let scaledWidth = originalWidth;
//         let scaledHeight = originalHeight;
    
//         if (scaledWidth > maxWidth) {
//           scaledWidth = maxWidth;
//           scaledHeight = scaledWidth / aspectRatio;
//         }
    
//         if (scaledHeight > maxHeight) {
//           scaledHeight = maxHeight;
//           scaledWidth = scaledHeight * aspectRatio;
//         }
    
//         return { width: scaledWidth, height: scaledHeight };
//       };

//   return (
//     <ScrollView contentContainerStyle={styles.container} horizontal={false}>
//       {arts.map((item) => (
//         <TouchableOpacity key={item._id} onPress={() => handleImagePress(item)}>
//           <Image
//             source={{ uri: `http://localhost:4000/images/${item.artAddress}` }}
//             style={{
//                 ...getScaledDimensions(item.width, item.height, 160, 300),
//                 margin: 10,
//                 borderRadius: 10,
//               }}
//           />
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     justifyContent: 'center',
//   },
// });

// export default HomePage;