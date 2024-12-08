import { StatusBar as StatusBarRN, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBar: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 5,
    marginTop: StatusBarRN.currentHeight,
  },
  undoButtonWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  topSection: { flexDirection: 'row' },
  content: {
    flex: 1,
    width: "100%",
    fontSize: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  }
})