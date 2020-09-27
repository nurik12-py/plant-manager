import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

var mqtt = require("mqtt");

var options = {
  clientId: "espnext01",
  username: "sasha.petrov.olx@gmail.com",
  password: "a6efcb63",
  protocol: "MQTT",
};
var client = mqtt.connect("mqtt://mqtt.dioty.co:8080", options);

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSelectedTab: [true, false, false],
    };
  }
  handlePublish(msg) {
    console.log(msg);
    client.publish("/sasha.petrov.olx@gmail.com/in", msg);
  }
  componentDidMount() {
    client.subscribe("/sasha.petrov.olx@gmail.com/out2", (data) => {
      console.log("brightness+");
    });
    client.subscribe("/sasha.petrov.olx@gmail.com/out1", (data) => {
      console.log("Humidnity+");
    });
    client.on("connect", () => {
      this.setState({ isLoading: false });
      console.log("Connected");
    });
    client.subscribe("/sasha.petrov.olx@gmail.com/out2", (data) => {
      console.log("brightness+");
    });
    client.subscribe("/sasha.petrov.olx@gmail.com/out1", (data) => {
      console.log("Humidnity+");
    });
    client.on("message", (topic, payload) => {
      const data = payload
        .toString()
        .split(":")
        .map((item) => item.trim());
      if (data[0] === "brightness") {
        this.setState({ brightness: data[1] });
      } else if (data[0].toLocaleLowerCase() === "h") {
        this.setState({ humidnity: data[1] });
      }
      console.log(this.state);
    });
    client.on("error", (error) => {
      console.log("MQTT Error:", error);
    });
  }

  handleTabChange(index) {
    let copy = [false, false, false];
    copy[index] = true;
    this.setState({ isSelectedTab: copy });
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navigation}>
          <Text style={styles.titleBold}>Plant </Text>
          <Text style={styles.titleThin}>Control</Text>
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <View>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => this.handleTabChange(0)}>
                <View style={styles.tab}>
                  <Ionicons name="ios-water" size={30} color="#03A9F4" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.handleTabChange(1)}>
                <View style={styles.tab}>
                  <Ionicons name="md-sunny" size={30} color="#FFC107" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.handleTabChange(2)}>
                <View style={styles.tab}>
                  <Ionicons name="md-alarm" size={30} color="#607D8B" />
                </View>
              </TouchableOpacity>
            </View>

            {this.state.isSelectedTab[0] && (
              <View style={styles.tabSection}>
                {this.state.humidnity && (
                  <View>
                    <Text style={{ fontSize: 35, fontWeight: "bold" }}>
                      {this.state.humidnity}%
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#9E9E9E",
                      }}
                    >
                      Humidnity
                    </Text>
                  </View>
                )}

                <TouchableOpacity onLongPress={() => this.handlePublish("r1")}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 75,
                      height: 150,
                      width: 150,
                      borderRadius: 75,
                      borderWidth: 10,
                      borderColor: "#03A9F4",
                    }}
                  >
                    <Ionicons name="md-water" size={50} color="black" />
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    paddingTop: 15,
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#9E9E9E",
                  }}
                >
                  Long press to water
                </Text>
              </View>
            )}
            {this.state.isSelectedTab[1] && (
              <View style={styles.tabSection}>
                {this.state.brightness && (
                  <View>
                    <Text style={{ fontSize: 35, fontWeight: "bold" }}>
                      {this.state.brightness < 512 ? "Low" : "High"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#9E9E9E",
                      }}
                    >
                      Brightness
                    </Text>
                  </View>
                )}
                <TouchableOpacity onLongPress={() => this.handlePublish("l1")}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 75,
                      height: 150,
                      width: 150,
                      borderRadius: 75,
                      borderWidth: 10,
                      borderColor: "#FFC107",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="lightbulb"
                      size={50}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    paddingTop: 15,
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#9E9E9E",
                  }}
                >
                  Long press to turn on light
                </Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    flexDirection: "column",
    paddingTop: 30,
  },
  navigation: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabSection: {
    flex: 0.7,
    flexDirection: "column",
    alignItems: "center",
  },
  titleBold: {
    fontSize: 35,
    fontWeight: "bold",
    paddingLeft: 5,
  },
  titleThin: {
    fontSize: 35,
    fontWeight: "100",
  },
  tabContainer: {
    flex: 1,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  tab: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderBottomColor: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ControlPanel;
