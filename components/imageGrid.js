import { MasonryFlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import { getColumnCount, wp } from "../helpers/common";
import ImageCard from "./imageCard";

const ImageGrid = ({ images }) => {
  const columns = getColumnCount();
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} columns={columns} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainer: {
    paddingHorizontal: wp(4),
  },
});
export default ImageGrid;
