import { StyleSheet } from "react-native";
import { colorThemes, fontThemes } from "../../../themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#182026",
  },
  viewThumbnail: {
    flex: 1,
    backgroundColor: "#212121",
  },
  cameraZonePortrait: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  cameraZoneLandscape: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 150.35,
    marginLeft: 146.82,
    marginTop: 16,
    marginBottom: 34,
  },
  cameraZonePortraitTablet: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  cameraZoneLandscapeTablet: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 16,
    marginLeft: 18,
    marginTop: 16,
    marginBottom: 19,
  },
  filterObjectsPortrait: {
    marginLeft: 16,
    marginVertical: 30,
  },
  filterObjectsLandscape: {
    marginLeft: 16,
    marginVertical: 20,
  },
  flatlistLanscape: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    position: "absolute",
    bottom: 0,
    paddingTop: 16,
    alignSelf: "center",
  },
  marginTabletPortrait: {
    marginRight: 121.5,
    marginLeft: 121.5,
  },
  marginTabletLandscape: {
    marginRight: 297.5,
    marginLeft: 303,
  },
  item: {
    backgroundColor: "#424242",
    width: 80,
    height: 80,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
  },
  backgroundOption: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContent: {
    marginBottom: 5,
  },
  iconBackground: {
    width: 16,
    height: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: fontThemes.FONT_SIZE_XXS,
  },
  confirmButton: {
    fontWeight: "400",
    fontSize: 16,
    color: "#FF6666",
  },
  viewNavBar: {
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  viewNavBarLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  viewNavBarCenter: {
    flex: 3,
    alignItems: "center",
  },
  textTitle: {
    fontSize: fontThemes.FONT_SIZE_S,
    color: colorThemes.white,
  },
  viewNavBarRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10,
  },
  listFilter: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageEffect: {
    borderRadius: 8,
    width: 80,
    height: 80,
  },
  back: {
    width: 35,
  },
  iconBack: {
    width: 15.85,
    height: 18.18,
  },
  viewContent: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  viewThumbnaiContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewThumbnaiContent: {
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  streamContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
