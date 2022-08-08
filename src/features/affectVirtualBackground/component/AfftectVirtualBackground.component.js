/* eslint-disable import/namespace */
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { RTCView } from "react-native-webrtc";
import { useSelector } from "react-redux";

import { NavButtonComponent } from "../../../components/Button";
import { Font } from "../../../components/Font";
import AsyncStorage, {
  SELECTED_FILTER,
  SELECTED_FILTER_ITEM,
  FILTER_ITEMS,
} from "../../asyncStorage";
import { selectBackground } from "../functions/banubaNativeModule";
import { resourceList, backgroundList } from "../resource";

import styles from "./AffectVirtualBackground.styles";

const AffectVirtualBackground = (props) => {
  const [selectedId, setSelectedId] = useState(null);
  const [resources, setResources] = useState([
    ...backgroundList,
    ...resourceList,
  ]);
  const listFilterRef = useRef(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [widthContent, setWidthContent] = useState(0);
  const [heightContent, setHeightContent] = useState(0);
  const localStream = _.get(props, "route.params.stream", null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async (newResources) => {
    let selectedFilter = await AsyncStorage.getItem(SELECTED_FILTER);
    const filterItem = await AsyncStorage.getItem(SELECTED_FILTER_ITEM);
    const filterItemObj = JSON.parse(filterItem);
    setSelectedItem(filterItemObj);
    if (selectedFilter == null) {
      await AsyncStorage.setItem(SELECTED_FILTER, "None");
      selectedFilter = "None";
    } else if (selectedFilter === "Custom") {
      selectedFilter = filterItemObj?.id;
    }
    const findIndex = newResources.findIndex((d) => selectedFilter == d.id);
    scrollToIndexFlatList(findIndex >= 0 ? findIndex : 0);
    if (selectedFilter === "Custom") {
      setSelectedId(filterItemObj?.id);
      selectBackground("Custom", filterItemObj?.uri, filterItemObj?.isRotate);
    } else if (selectedFilter !== null && selectedFilter !== "Custom") {
      setSelectedId(selectedFilter);
      selectBackground(selectedFilter);
    } else {
      setSelectedId("None");
      selectBackground("None");
      await AsyncStorage.setItem(SELECTED_FILTER, "None");
      await AsyncStorage.setItem(
        SELECTED_FILTER_ITEM,
        JSON.stringify(backgroundList[0])
      );
    }
  };

  const getFilterItems = async () => {
    const items = await AsyncStorage.getItem(FILTER_ITEMS);
    let filterItems = items ? JSON.parse(items) : [];
    if (filterItems.length) {
      // filterItems = await readFiles(filterItems)
      // await AsyncStorage.setItem(FILTER_ITEMS, JSON.stringify(filterItems))
    }
    let newResources = [...backgroundList, ...filterItems, ...resourceList];
    setResources(newResources);
    fetchData(newResources);
  };
  useEffect(() => {
    getFilterItems();
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const scrollToIndexFlatList = (position) => {
    setTimeout(() => {
      listFilterRef &&
        listFilterRef.current &&
        listFilterRef.current?.scrollToIndex({
          index: position < 0 ? 0 : position,
          viewPosition: 0.5,
        });
    }, 500);
  };
  const Item = ({ item, onPress }) => {
    const borderColor = item.id === selectedId ? "#FFFFFF" : "transparent";
    return !_.isEmpty(item) ? (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.item, { borderColor }]}
      >
        {item.type == "upload" ? (
          <Image
            source={{ uri: `${item.uri}` }}
            resizeMode="cover"
            style={styles.imageEffect}
          />
        ) : item.image ? (
          <Image
            source={item.image}
            resizeMode="contain"
            style={styles.imageEffect}
          />
        ) : (
          <View style={styles.backgroundOption}>
            {!!item.icon && (
              <View style={styles.iconContent}>
                <Image
                  source={item.icon}
                  resizeMode="contain"
                  style={styles.iconBackground}
                />
              </View>
            )}
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      </TouchableOpacity>
    ) : null;
  };

  const renderItem = ({ item, index }) => {
    return <Item item={item} onPress={() => _handleOnPress(item, index)} />;
  };

  const setFilterItems = async (item) => {
    const items = await AsyncStorage.getItem(FILTER_ITEMS);
    const filterItems = items ? JSON.parse(items) : [];
    let newFilterItems = [item, ...filterItems];
    //limit upload 24 items VB
    if (newFilterItems.length > 24) {
      newFilterItems.pop();
    }
    await AsyncStorage.setItem(FILTER_ITEMS, JSON.stringify(newFilterItems));
  };

  const onOpenLibrary = async () => {
    try {
      const rs = await launchImageLibrary({ mediaType: "photo", quality: 1 });
      if (rs.didCancel) {
        return;
      }
      if (rs.assets?.[0].fileSize / 1000000 > 15) {
        return Alert.alert(
          "Error!",
          "File does not support. File size must be less than 8MB."
        );
      }
      const filename = rs.assets[0].fileName;
      const extension = `${filename}`.split(".").pop();
      if (extension === "gif") {
        return Alert.alert("Error!", "This file type is not supported.");
      }
      const fileUri = rs.assets[0].uri;
      const id = moment().format("x");
      const height = Math.round(rs.assets[0].height);
      const width = Math.round(rs.assets[0].width);
      const ratioImage = width / height;
      const isRotate = ratioImage == 0.75 ? "1" : "0";
      const objValue = {
        id: id,
        type: "upload",
        fileName: filename,
        uri: fileUri.replace("file://", ""),
        isRotate,
      };
      const newResources = [...resources];
      if (newResources.length > 38) {
        newResources.splice(27, 1);
      }
      newResources.splice(4, 0, objValue);
      setResources(newResources);
      scrollToIndexFlatList(4);
      setFilterItems(objValue);
      setSelectedId(id);
      selectBackground("Custom", `${objValue.uri}`, `${isRotate}`);
      setSelectedItem(objValue);
    } catch (error) {}
  };

  const _handleOnPress = async (item, index) => {
    const findIndex = resources.findIndex((d) => item.id == d.id);
    if (findIndex > -1) {
      scrollToIndexFlatList(findIndex);
    }

    if (item.id === "Custom") {
      onOpenLibrary();
    } else if (item.type == "upload") {
      setSelectedId(item.id);
      selectBackground("Custom", `${item.uri}`, `${item.isRotate}`);
      setSelectedItem(item);
    } else {
      setSelectedId(item.id);
      selectBackground(item.id);
      setSelectedItem(item);
    }

    setTimeout(() => {
      listFilterRef &&
        listFilterRef.current &&
        listFilterRef.current?.scrollToIndex({
          index: index,
          viewPosition: 0.5,
        });
    }, 500);
  };

  const backButton = async () => {
    try {
      const selectedFilter = await AsyncStorage.getItem(SELECTED_FILTER);
      const filterItem = await AsyncStorage.getItem(SELECTED_FILTER_ITEM);
      const filterItemObj = JSON.parse(filterItem);
      if (selectedId !== selectedFilter && selectedFilter !== null) {
        Alert.alert(
          t("FilersPage.dialogTitle"),
          t("FilersPage.dialogContent"),
          [
            {
              text: t("FilersPage.btnKeep"),
              style: "default",
            },
            {
              text: t("FilersPage.btnCancel"),
              onPress: () => {
                if (selectedFilter == "Custom") {
                  selectBackground(
                    "Custom",
                    filterItemObj?.uri,
                    filterItemObj?.isRotate
                  );
                } else {
                  selectBackground(selectedFilter);
                }
                navigation.goBack();
              },
              style: "default",
            },
          ]
        );
      } else {
        navigation.goBack();
      }
    } catch (e) {}
  };

  const applyFilter = async () => {
    try {
      let id = selectedId;
      if (selectedItem?.type === "upload") {
        id = "Custom";
      }
      await AsyncStorage.setItem(SELECTED_FILTER, id.toString());
      await AsyncStorage.setItem(
        SELECTED_FILTER_ITEM,
        JSON.stringify(selectedItem)
      );
      navigation.goBack();
    } catch (error) {
      console.log("[chooseFilterAction][error]: ", error);
    }
  };

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    if (!_.inRange(width, widthContent - 1, widthContent + 1)) {
      setWidthContent(width);
    }
    if (!_.inRange(height, heightContent - 1, heightContent + 1)) {
      setHeightContent(height);
    }
  }, []);
  const contentLayout = useMemo(
    () => ({ width: widthContent, height: heightContent }),
    [widthContent, heightContent]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="#182026" />
      <SafeAreaView>
        <View style={styles.viewNavBar}>
          <View style={styles.viewNavBarLeft}>
            <NavButtonComponent
              svg="BackWhite"
              styleImage={styles.iconBack}
              onPress={backButton}
              style={styles.back}
            />
          </View>
          <View style={styles.viewNavBarCenter}>
            <Font style={styles.textTitle} weight={700}>
              {t("FilersPage.titleNavBar")}
            </Font>
          </View>
          <View style={styles.viewNavBarRight}>
            <Font style={styles.confirmButton} onPress={applyFilter}>
              {t("FilersPage.confirmBtn")}
            </Font>
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView style={[styles.viewThumbnail]}>
        <View style={styles.viewContent} onLayout={onLayout}>
          <View style={[styles.viewThumbnaiContainer]}>
            <View
              style={[
                styles.viewThumbnaiContent,
                {
                  width: contentLayout.width,
                  height: contentLayout.height - 8,
                },
              ]}
            >
              <RTCView
                mirror={true}
                streamURL={localStream?.toURL()}
                style={[
                  styles.streamContent,
                  {
                    width: contentLayout.width,
                    height: contentLayout.height - 8,
                  },
                ]}
                objectFit={"cover"}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <View>
        <View style={[styles.filterObjectsPortrait]}>
          <FlatList
            data={resources}
            ref={listFilterRef}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            extraData={selectedId}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listFilter}
            bounces={false}
          />
        </View>
      </View>
    </View>
  );
};

export default AffectVirtualBackground;
