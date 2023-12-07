// import React from 'react';
// import { View, Text } from 'react-native';

// const SearchPage: React.FC = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Search Page Content Goes Here</Text>
//     </View>
//   );
// };

// export default SearchPage;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type SearchPageRouteProp = RouteProp<RootStackParamList, 'ArtistProfilePage'>;
type SearchPageNavigationProp = NavigationProp<RootStackParamList, 'ArtistProfilePage'>;

interface ArtistProfilePageProps {
  route: SearchPageRouteProp;
};

interface Tag {
  message: string;
  data: {
    tagName: string;
    artAddresses: string[];
  }[];
};

interface Art {
  _id: string;
  userId: string;
  userName: string;
  artTitle: string;
  artContent: string;
  artAddress: string;
  artTags: {type: [string], default: []};
  width: number;
  height: number;
};

const SearchPage: React.FC = () => {
  const navigation = useNavigation<SearchPageNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [tagData, setTagData] = useState<Tag>();
  const [arts, setArts] = useState<Art[]>([]);
  const [filteredArts, setFilteredArts] = useState<Art []>([]);
  const [state, setState] = useState<String>('noContent') // noContent / getContent
  const [searchQueryContent, setSearchQueryContent] = useState('');

  useEffect(() => {
    // fetch art
    let isMounted = true; // flag to check if component is mounted

    const fetchArts = async () => {
      try {
        const response = await fetch('http://localhost:4000/arts');
        const data = await response.json();
        if (isMounted) {
          const artsWithDimensions = data.data.map((art: Art) => ({
            ...art,
            width: art.width,
            height: art.height,
          }));
          setArts(artsWithDimensions);
        }
      } catch (error) {
        console.error('Error fetching arts:', error);
      }
    };

    fetchArts();

    return () => {
      isMounted = false; // set flag to false when component unmounts
    };
  }, []);

  const handleSearch = async () => {
    if (searchQuery.length === 0) {
      setState("noContent");
    } else {
      setSearchQueryContent(searchQuery);
      const state = await fetchTagData();
      setState(state);
    }
  };

  const fetchTagData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/tags?where={"tagName":"${searchQuery}"}`)
      const data:Tag = await response.json();
      console.log("fetchTagData data: ", data);
      if (data?.message === "GET: no tags found" || !data) {
        setTagData(data);
        return "emptyContent"
      } else {
        const artIds = data.data[0].artAddresses;
        setTagData(data);
        const filtered = arts.filter(art => artIds.includes(art._id));
        setFilteredArts(filtered);
        return "getContent";
      }
    } catch(error) {
      console.error('Error fetching tags:', error);
      return "emptyContent"
    }
  };
  
  

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

  const renderContent = () => {
    if (state === "emptyContent") {
      return (<Text>No art related with {searchQueryContent} yet. Try to search other things!</Text>)
    } else if (state === "getContent") {
      return (<ScrollView contentContainerStyle={styles.container_art} horizontal={false}>
        {filteredArts.map((item) => (
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
      </ScrollView>)
    }
  };

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
        height: art.height
      }
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View>
          <Ionicons name='search-outline' size={30} color='#5364B7' style={styles.searchIcon}/>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 200,
    padding: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 5,
    top: 4,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: 'white',
    // height: 90,
    paddingTop: 56,
    flexDirection: 'row',
    borderRadius: 200,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    width: 320,
    height: 40,
    borderColor: '#5364B7',
    borderWidth: 1,
    paddingLeft: 40,
    paddingVertical: 8,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#D9D9D9'
  },
  searchButton: {
    backgroundColor: '#5364B7',
    padding: 10,
    marginTop: -20,
    marginLeft: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  iconView: {
    // backgroundColor: 'red', 
    width: 40,
    marginRight: 40,
    marginLeft: 8,
    left: 0,
    marginBottom: 10,
  },
  textHeader: {
    // backgroundColor: 'green',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 22,
    marginRight: 18,
    marginTop: 9,
    marginBottom: 10,
  },
  container_art: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    // height: 600,
  },
});

export default SearchPage;
