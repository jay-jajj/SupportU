import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import DeleteButton from './DeleteButton'
import styled, { css, theme } from '@emotion/native'



const TodoItem = ({
    title,
    subContent,
    categories,
    done,
    remove,
    toggle,
    editPress,
    fixed,
    fixedToggle,
    primaryColor,
    dday,
}) => {


    const TodoBox = styled.View`
                                display : flex;
                                flex-direction: row;
                                align-items: center;
                                border-bottom-width: 1px;
                                border-color : ${props => props.theme.borderColor};
                                `


    const DoneButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    justify-content : center;
    align-items : center;
    margin-right : 8px;
    border-radius: 20px;
    ${done ? (props) => `border : none; background-color: ${props.theme.primaryColor};` :`border-width : 1px; 
        border-color : #E0E0E0;`}
    `
    //중복 리팩토링할것 
    const TitleText = styled.Text`
    font-size : 30px;
    ${({theme}) => done ? `color: ${theme.borderColor}; text-decoration : line-through;`:  `color : ${theme.textColor};`}
    `
    
    const SubContentText = styled.Text`
    font-size : 17px;
    ${({theme}) => done ? `color: ${theme.borderColor}; text-decoration : line-through;`:  `color : ${theme.borderColor};`}
    `
    const CategoriesText = styled.Text`
    font-size : 17px;
    ${ ({theme}) => done ? `color :${theme.borderColor}; text-decoration : line-through;`:  `color : ${theme.primaryColor};`}
    `
    
    function categoriesConverter(categories){
        return `#${categories.split(",").join(" #")}`
    }
    return (
        
        <Swipeable
            renderRightActions={() =>
                <DeleteButton onPress={remove}/>}
        >
            <View style={css`   padding-right: 16px;
                                padding-left: 16px;
                                `}>
                <TodoBox>
                    <DoneButton
                        activeOpacity={0.8}
                        onPress={toggle}
                    >
                        <FontAwesome name="check" color={done ? '#FFFFFF' : '#E0E0E0'} size={20} />
                    </DoneButton>
                    <TouchableOpacity onLongPress = {editPress}  style={css` width : 80%; justify-content : space-between;  align-items : center; flex-direction : row; padding-right : 5%;`} >
                        <View style={css`max-width : 80%;`}>
                         <TitleText>
                            {title}
                        </TitleText>
                        <CategoriesText>
                            {categoriesConverter(categories)}
                        </CategoriesText>
                        <SubContentText>
                            {subContent}
                        </SubContentText>
                        </View>
                        <CategoriesText>{dday}</CategoriesText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={fixedToggle}
                        style={css`
                                justify-content : center;
                                align-items : center;
                                    `}
                    >
                    <FontAwesome name="thumb-tack" color ={fixed? primaryColor:'#a5a5a5'}  size={20} />
                    </TouchableOpacity>
                </TodoBox>
            </View>
        </Swipeable>
        
        
    )
}



export default TodoItem