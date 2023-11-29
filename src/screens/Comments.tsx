import React, { useState, useEffect, } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface CommentProps {
    artId: string;
}

interface Comments {
    _id: string;
    commentFromUserId: string;
    commentToArtId: String,
    commentContent: String,
  }

const CommentsSection: React.FC<CommentProps> = ({artId}) => {
    const [comments, setComments] = useState<Comments[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/comments')
            .then((response) => response.json())
            .then((data) => {
            const commentsData = data.data.map((comment: Comments) => ({
                ...comment,
                _id: comment._id,
                commentFromUserId: comment.commentFromUserId,
                commentToArtId: comment.commentToArtId,
                commentContent: comment.commentContent
            }));
            setComments(commentsData);
            })
            .catch((error) => console.error('Error fetching comments:', error));
        }, []);

  return (
    <View style={{paddingTop: 10}}>
        {comments.map((item) => (
            ((item.commentToArtId === artId) ?
            (
                <View key={item._id} style={styles.commentTexture}>
                    <Text style={styles.commentText}>{item.commentContent}</Text>
                </View>
            ) : 
            (( 
                <Text style={{marginTop: 5, fontSize: 15}}>
                    It's looking a little empty...
                </Text>
            ))) 
        ))}
    </View>
  ) as React.ReactElement;
};

const styles = StyleSheet.create({
    commentText: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        fontSize: 15
    },
    commentTexture: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: "#5364B7",
        borderWidth: 1,
        backgroundColor: '#DCE5F7',
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    }
})

export default CommentsSection;

