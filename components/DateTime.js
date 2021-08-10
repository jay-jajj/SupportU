import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, View } from 'react-native';

export default function DateTime({textColor, primaryColor}) {
    

    function getDate(){
        const firstSplit = (new Date().toLocaleString()).split(" ");
        if(firstSplit.length === 5){
            const time = firstSplit[3].split(":");
            return {
                 day : firstSplit[0],
                 date : firstSplit[2],
                 month : firstSplit[1],
                 year : firstSplit[4],
                 hour : time[0],
                 min : time[1],
                 sec : time[2]}
        }else{
            const time = firstSplit[4].split(":");
            return {
                 day : firstSplit[0],
                 date : firstSplit[3],
                 month : firstSplit[1],
                 year : firstSplit[5],
                 hour : time[0],
                 min : time[1],
                 sec : time[2]
        }
        }
    }
    function monthTranslater(month) {
        switch (month) {
            case "Jan" :
                return 1
            case "Feb" :
                return 2 
            case "Mar" :
                return 3
            case "Apr" :
                return 4
            case "May" :
                return 5
            case "Jun" :
                return 6
            case "Jul" :
                return 7
            case "Aug" :
                return 8
            case "Sep" :
                return 9
            case "Oct" :
                return 10
            case "Nov" :
                return 11
            case "Dec" :
                return 12
            default : 
                return 0 
        }
    }

    
    const [dt, setDt] = useState(getDate());
    useEffect(() => {
        let secTimer = setInterval( () => {
        setDt(getDate())
        }, 1000)
        return () => clearInterval(secTimer);
    }, []);
    const styles = StyleSheet.create({
        container: {
            alignItems :'center',
            justifyContent : 'center',
            borderWidth : 2,
            borderRadius : 20,
            borderColor : primaryColor,
            paddingLeft : 8,
            paddingRight : 8,
        },
        time : {
            fontWeight : 'bold',
            fontSize : 30,
            color : textColor,
        },
        date : {

            fontSize : 18,
            color : textColor,
        },
      });
    return (
        <View style={styles.container}>
        <Text style={styles.time}>
            {dt.hour ? dt.hour : "00"} : {dt.min ? dt.min :" 00"}
        </Text>
        <Text style={styles.date}>
            {monthTranslater(dt.month.toString())}월 {dt.date ? dt.date : "0"}일 {dt.day}
        </Text>
        </View>
    )
    
}
