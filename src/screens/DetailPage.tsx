import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';

type DetailPageRouteProp = RouteProp<RootStackParamList, 'DetailPage'>;
type DetailPageNavigationProp = NavigationProp<RootStackParamList, 'DetailPage'>;

interface DetailPageProps {
  route: DetailPageRouteProp;
}



const DetailPage: React.FC<DetailPageProps> = ({route}) => {

    const pressedArtData = route.params.data;
    const navigation = useNavigation<DetailPageNavigationProp>();
    const [isLiked, setIsLiked] = useState(false);
    const [commentsBarOpacity, setCommentsBarOpacity] = useState(0.3)

    const tags: string[] = (pressedArtData.artTags as unknown) as string[];

    const toggleLike = () => {
      // Toggle the like state
      // Update the likes schema
      setIsLiked(!isLiked);
      setCommentsBarOpacity(!isLiked ? 1 : 0.3);
    };

    return (
        <View style={styles.everything}>
            {/* Back Button */}
            <Ionicons name='arrow-back' size={35} style={{ paddingLeft: 10, paddingTop: 45 }}
            onPress={() => navigation.navigate('Home')}/>

            {/* Main Content */}
            <Text style={styles.titleText}> {pressedArtData.artTitle} </Text>
            <View style={styles.imageContainer}>
                <Image 
                    source={{uri: `http://localhost:4000/images/${pressedArtData.artAddress}` }}
                    style={{ width: pressedArtData.width, height: pressedArtData.height, margin: 10, borderRadius: 10 }}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text>
                    {pressedArtData.artContent}
                </Text>
            </View>
            <View style={styles.contentContainer}>
                {tags.map((tag, index) => (
                <Text key={index} style={styles.tagsText}>
                    #{tag}
                </Text>
                ))}
            </View>

            {/* Like Button */}
            <View style={styles.buttonContainer}>
                <Button 
                    icon={<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={30} color="white" />}
                    onPress={toggleLike}
                    buttonStyle={styles.likeButton}
                />
            </View>

            {/* Comments */}
            <View style={[styles.commentsContainer, { opacity: commentsBarOpacity }]} >
                <Ionicons name='chatbubble-ellipses-outline' size={30} style={{ paddingLeft: 10, paddingTop: 1.75 }}/>
                <Text style={{ paddingLeft: 10, alignSelf: 'center' }}>
                    Say Something...
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  everything: {
    height: '95%'
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
  titleText: {
    fontSize: 30,
    paddingLeft: 10,
    paddingTop: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10
  },
  tagsText: {
    color: '#5364B7'
  },
  likeButton: {
    backgroundColor: '#E38F9C',
    width: 200,
    height: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '15%',
    left: '25%',
    paddingTop: 50,
  },
  commentsContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignSelf: 'center',
	  width: '85%',
	  height: 40,
	  borderBottomRightRadius: 25,
	  borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 3
  }
});


export default DetailPage;
