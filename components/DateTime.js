import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function DateTime({ textColor, primaryColor }) {
  const monthMapper = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  }

  function getDate() {
    const firstSplit = new Date().toLocaleString().split(' ')

    if (firstSplit.length === 5) {
      const time = firstSplit[3].split(':')
      return {
        day: firstSplit[0],
        date: firstSplit[2],
        month: firstSplit[1],
        year: firstSplit[4],
        hour: time[0],
        min: time[1],
        sec: time[2],
      }
    }

    const time = firstSplit[4].split(':')
    return {
      day: firstSplit[0],
      date: firstSplit[3],
      month: firstSplit[1],
      year: firstSplit[5],
      hour: time[0],
      min: time[1],
      sec: time[2],
    }
  }

  function monthTranslater(month) {
    return monthMapper[month] ?? 0
  }

  const [dt, setDt] = useState(getDate())

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(getDate())
    }, 1000)

    return () => clearInterval(secTimer)
  }, [])

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderRadius: 10,
      borderColor: primaryColor,
      paddingLeft: 8,
      paddingRight: 8,
    },
    time: {
      fontWeight: 'bold',
      fontSize: 30,
      color: textColor,
    },
    date: {
      fontSize: 18,
      color: textColor,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {monthTranslater(dt.month.toString())}월 {dt.date ? dt.date : '0'}일{' '}
        {dt.day}
      </Text>
      <Text style={styles.time}>
        {dt.hour ? dt.hour : '00'}:{dt.min ? dt.min : ' 00'}
      </Text>
    </View>
  )
}
