import React, { useRef, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import UnityView from "@azesmway/react-native-unity";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
const UnityScreen = () => {
  const unityRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
 /* const reloadUnity = async () => {
    setIsLoading(true);
    await unityRef.current?.unloadUnity();
    unityRef.current?.resumeUnity();
    setTimeout(() => setIsLoading(false), 1000);
  };
  useFocusEffect(
    React.useCallback(() => {
      reloadUnity();
      
      return () => {
        unityRef.current?.unloadUnity();
      };
    }, [])
  );
  */
  const reloadUnity = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(()=>{
    reloadUnity();
  },[]);
  
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ flex: 1, justifyContent: "center" }}
        />
      ) : (
        <UnityView
          ref={unityRef}
          style={{ flex: 1 }}
          androidKeepPlayerMounted={false}
        />
      )}
    </View>
  );
};
export default UnityScreen;
