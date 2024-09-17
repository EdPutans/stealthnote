import { StatusBar as StatusBarRN, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1},
  statusBar: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 5,
    marginTop: StatusBarRN.currentHeight,
  },
  undoButtonWrapper: {
    padding: 5,
  },
  topSection:{ flexDirection: 'row' },
  content: {
    flex: 1,
    width: "100%",
          fontSize: 20,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
  }
})