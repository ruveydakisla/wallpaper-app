import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { capitalize } from "lodash";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { data } from "../constants/data";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import { ColorFilter, CommonFilterRow, SectionView } from "./filterViews";

function FiltersModal({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      backdropComponent={CustomBackdrop}
      enablePanDownToClose={true}
      ref={modalRef}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filtersText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitalize(sectionName);
            return (
              <Animated.View
                entering={FadeIn.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
                key={index}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}
          {/**action buttons */}
          <Animated.View
            entering={FadeIn.delay(500).springify().damping(11)}
            style={styles.buttons}
          >
            <Pressable onPress={onReset} style={styles.resetButton}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable onPress={onApply} style={styles.applyButton}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });
  const containerStyle = [
    style,
    styles.overlay,
    StyleSheet.absoluteFill,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "red",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: theme.radius.lg,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  filtersText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  content: {
    flex: 1,
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.05),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderColor: theme.colors.grayBG,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: hp(2.2),
  },
});
export default FiltersModal;
