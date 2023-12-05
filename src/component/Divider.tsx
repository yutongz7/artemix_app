import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 800,
        width: '100%',
        backgroundColor: 'black',
    },
});

export default Divider;