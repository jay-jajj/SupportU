import React from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import styled, { css } from '@emotion/native'
const Filter = ({
    categoryList,
    setFilterFunc,
    currentCategory,
    textColor
}) => {

  const CategoryModalBoxContainer = styled.View`
    background-color: ${({theme}) => theme.backgroundColor};
    align-items : center;
    border-radius : 8px;
    justify-content : space-between;
    height : 50%;
    `

    const [showFilter, onChangeShowFilter] = React.useState(false);

    const styles = StyleSheet.create({
      filterContainer: {
        flexDirection : 'row',
        alignItems : 'center',
      },
      currentCategory : {
          height : 40,
          fontSize : 30,
          textAlign : 'center',
          justifyContent : "center",
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#E5E5E5',
          borderRadius : 10,
          minWidth : '35%',
          marginRight : 10,
          paddingRight : 5,
          paddingLeft : 5,
          color : textColor
      },
      categoryItem : {
          minWidth : 200,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          
      },
    });
    return (
        <View>
             <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onChangeShowFilter(!showFilter)}
              style={styles.filterContainer}
              >
                <Text style={styles.currentCategory}>
                  {currentCategory}
                </Text>
                <FontAwesome name="filter" color={'#E0E0E0'} size={20} />
            </TouchableOpacity>
          <Modal
          isVisible={showFilter}
          onBackdropPress={() => onChangeShowFilter(false)}
          onBackButtonPress={() => onChangeShowFilter(false)}
          animationIn={"zoomIn"}
          style={css`align-items : center; justify-content : center;`}
          >
            <CategoryModalBoxContainer>
              <FlatList
                data={categoryList}
                renderItem={({ item }) => {
                  return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.categoryItem}
                    onPress={()=>{
                      setFilterFunc(item)
                    }}
                  >
                      <Text style={{fontSize:25, padding : 10,color : textColor}}>{item}</Text>
                  </TouchableOpacity>)
                    }
                }
                keyExtractor= {(_, index) => {
                  return `${index}`
                }}
              />
            </CategoryModalBoxContainer>
          </Modal>
          
           
        </View>
    )
}



  
export default Filter