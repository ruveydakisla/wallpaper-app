import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiCall } from "../../api";
import Categories from "../../components/categories";
import FiltersModal from "../../components/filterModal";
import ImageGrid from "../../components/imageGrid";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
var page = 1;
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState("");
  const [isEndReached, setIsEndReached] = useState(false);
  const modalRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    fetchImages();
  }, []);
  const openFiltersModal = () => {
    modalRef?.current.present();
  };
  const closeFiltersModal = () => {
    modalRef?.current.close();
  };
  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    console.log("applying filters");
    closeFiltersModal();
  };
  const resetFilters = () => {
    console.log("resetting filters");

    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);

      let params = {
        page: 1,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };
  const fetchImages = async (params = { page: 1 }, append = false) => {
    console.log(("params:", params, append));

    let res = await apiCall(params);
    console.log(res.data.hits.length);

    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else setImages([...res.data.hits]);
    }
  };

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (category) params.category = category;
    fetchImages(params, false);
  };

  const searchInputRef = useRef();
  const paddingTop = top > 0 ? top + 10 : 30;
  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      //search for this text
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text == "") {
      //reset results
      page = 1;
      searchInputRef?.current.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
    console.log("searching for:", text);
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current.clear();
  };
  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters(filterz);
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset > bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log("reached the bottom of scrollview!");
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, true);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };
  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={[styles.container, { paddingTop: paddingTop }]}>
          <StatusBar style="dark" />

          <View style={styles.header}>
            <Pressable onPress={handleScrollUp}>
              <Text style={styles.title}>Pixels</Text>
            </Pressable>
            <Pressable onPress={openFiltersModal}>
              <FontAwesome6
                name="bars-staggered"
                size={22}
                color={theme.colors.neutral(0.7)}
              />
            </Pressable>
          </View>

          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={5} //how often scroll event will fire while scrolling
            ref={scrollRef}
            contentContainerStyle={{ gap: 15 }}
          >
            <View style={styles.searchBar}>
              <View style={styles.searchIcon}>
                <Feather
                  name="search"
                  size={24}
                  color={theme.colors.neutral(0.4)}
                />
              </View>
              <TextInput
                ref={searchInputRef}
                // value={search}
                onChangeText={handleTextDebounce}
                placeholder="Search for photos..."
                style={styles.searchInput}
              />
              {search && (
                <Pressable
                  onPress={() => handleSearch("")}
                  style={styles.closeIcon}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.neutral(0.6)}
                  />
                </Pressable>
              )}
            </View>

            {/* Categories */}

            <View style={styles.categories}>
              <Categories
                activeCategory={activeCategory}
                handleChangeCategory={handleChangeCategory}
              />
            </View>
            {/**filters */}
            {filters && (
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filters}
                >
                  {Object.keys(filters).map((key, index) => {
                    return (
                      <View key={key} style={styles.filterItem}>
                        {key == "colors" ? (
                          <View
                            style={{
                              height: 20,
                              width: 30,
                              borderRadius: 7,
                              backgroundColor: filters[key],
                            }}
                          />
                        ) : (
                          <Text style={styles.filterItemText}>
                            {filters[key]}
                          </Text>
                        )}

                        <Pressable
                          style={styles.filterCloseIcon}
                          onPress={() => clearThisFilter(key)}
                        >
                          <Ionicons
                            name="close"
                            size={14}
                            color={theme.colors.neutral(0.9)}
                          />
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
            {/*Images masonry grid */}
            <View>{images.length > 0 && <ImageGrid images={images} />}</View>

            {/**loading */}
            <View
              style={{
                marginBottom: 70,
                marginTop: images.length > 0 ? 10 : 70,
              }}
            >
              <ActivityIndicator size={"large"} />
            </View>
          </ScrollView>
          {/** filters modal*/}
          <FiltersModal
            filters={filters}
            setFilters={setFilters}
            onClose={closeFiltersModal}
            onApply={applyFilters}
            onReset={resetFilters}
            modalRef={modalRef}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: 15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    borderWidth: 1,
    alignItems: "center",
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
    padding: 8,
  },
  categories: {},
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.neutral(0.06),
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.7),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
export default HomeScreen;
