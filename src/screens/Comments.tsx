import React, { useState, useEffect, } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CommentProps {
    artId: string;
    username: string;
}

interface Comments {
    _id: string;
    commentFromUserId: string;
    commentToArtId: String,
    commentContent: String,
  }

const CommentsSection: React.FC<CommentProps> = ({artId, username}) => {
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

    const [filteredComments, setFilteredComments] = useState<Comments[]>([]);

    useEffect(() => {
        const filtered = comments.filter(comment => comment.commentToArtId === artId);
        setFilteredComments(filtered);
      }, [comments, artId]);

  return (
    <View style={{paddingTop: 10}}>
        {(filteredComments.length === 0) ? (
            <Text style={{marginTop: 5, fontSize: 15}}>
                It's looking a little empty...
            </Text>
        ) : (
            filteredComments.map((item) => (

                <View key={item._id} style={styles.commentTexture}>
                    <Ionicons name="person-circle-sharp" size={40} style={{marginTop: 5}}/>
                    <View>
                        {(username === item.commentFromUserId) ? (                        
                            <Text style={{marginTop:5, marginLeft: 5, fontSize: 15, fontWeight:'bold'}}>
                                You
                            </Text>) 
                        :(
                            <Text style={{marginTop:5, marginLeft: 5, fontSize: 15, fontWeight:'bold'}}>
                                Anonymous User
                            </Text>
                        )}
                        <Text style={styles.commentText}>{item.commentContent}</Text>
                    </View>
                </View>
            ))
        )}
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
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    }
})

export default CommentsSection;

