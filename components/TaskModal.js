



    const TaskModalBoxContainer = styled.View`
        height : 40%;
        min-height : 250px;
        background-color: ${({theme}) => theme.backgroundColor};
        align-items : center;
        padding: 16px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;   
    `
    const SubmitButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.primaryColor};
    justify-content: center;
    align-items: center;
    min-height: 40px;
    height : 6%;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;  
    `

    const TaskInput = styled.TextInput`
    color: ${({theme}) => theme.textColor};
    width : 100%;
    font-size : 18px;
    margin-bottom: 10px;
    border-left-width : 5px;
    border-left-color : ${({theme}) => theme.textColor};
    padding-left : 10px;
    `
    const Category = styled.Text`
    color : white;
    background-color: ${({theme}) => theme.primaryColor};
    font-size : 20px;
    border-radius : 4px;
    text-align : center;
    margin-left : 2px;
    padding : 2px;
    `
    const DueDateText = styled.Text`
    color : white;
    background-color: ${({theme}) => theme.primaryColor};
    font-size : 20px;
    border-radius : 4px;
    text-align : center;
    margin-left : 2px;
    padding : 2px;
    `
import React from 'react'
import {
    View,
    StyleSheet,
   Text,
   TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'
import styled, { css } from '@emotion/native'
import DateTimePicker from '@react-native-community/datetimepicker'

const TaskModal = ({
    isVisible,
    hide,
    mode,
    add,
    edit,
    originContent,
    originSubContent,
    originCategories,
    originDday,
}) => {
    const [content, onChangeContent] = React.useState(mode ? "" : originContent);
    const [subContent, onChangeSubContent] = React.useState(mode ? "" : originSubContent);
    const [category, onChangeCategory] = React.useState("")
    const [categories, onChangeCategories]  = React.useState(mode ? [] : ()=>{
        return originCategories ?  originCategories.split(',') : []
    })
    const [showDatetPicker, setShowDatetPicker] = React.useState(false)
    const [date, setDate] = React.useState(mode ? new Date() : ()=>{
        return originDday ? new Date(originDday) : new Date()
    });

    function resetState(){
        onChangeCategories([])
        onChangeCategory("")
        onChangeContent("")
        onChangeSubContent("")
    }

    function addTag(isEnter){
        if (!(category === "")){
            const textValue = isEnter ? category : `${category.substr(0, category.length-1)}`
            onChangeCategories(categories => [...categories, textValue])
            onChangeCategory("")
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatetPicker(Platform.OS === 'ios');
        setDate(currentDate);
      };


    const CategoriesConvert = (categories) =>{
        let converted = "";
        categories.forEach((element, index) => {
            if(index === 0){
                converted += element;
            }else{
                converted += ','
                converted += element;
            }
        });
        return converted;
    }
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={hide}
            onBackButtonPress={hide}
            avoidKeyboard
            style={css`margin : 10px; justify-content : center;`}
        >
            <TaskModalBoxContainer>
                 <TaskInput
                    placeholder="할 일을 적어주세요!"
                    defaultValue = {content}
                    onChangeText={(text) => {
                        onChangeContent(text)
                    }}
                    placeholderTextColor="#a5a5a5"
                    returnKeyType ={'next'}
                    autoFocus ={true}
                    style ={css`font-size : 22px;`}
                />
                <View style={
                    css`
                        align-items : center;
                        width : 100%;
                        flex-direction : row;
                        flex-wrap : wrap;
                        `
                        }>
                {
                    categories ? categories.map((item, index)=>{
                        const tag = `#${item}`;
                        return<Category key={index}>{tag}</Category>
                    }) : null 
                }
                <TaskInput
                    placeholder="태그를 입력하세요"
                    defaultValue = {category}
                    onChangeText = {onChangeCategory}
                    textAlign ="center"
                    textAlignVertical = "top"
                    placeholderTextColor="#a5a5a5"
                    returnKeyType ={'next'}
                    onKeyPress = {(e) => {
                        const key = e.nativeEvent.key
                        if(key == ','){
                                addTag(false)
                        }
                        if(key == 'Backspace' && category === ""){
                            onChangeCategories(categories => categories.slice(0, categories.length-1))
                        }
                        
                    } }
                    style={css`width  :auto; min-width : 20%; border-left-width : 0px;`}
                    //{addTag(true)}로 할시 글자 입력때마다 함수가 실행되는 버그가 있었음 -> 콜백으로 해결
                    onSubmitEditing ={() => addTag(true)}
                />
                 </View>
                
                <TaskInput
                    placeholder="메모하고 싶은 것을 적어주세요!"
                    value = {subContent}
                    onChangeText = {onChangeSubContent}
                    textAlignVertical = "top"
                    multiline = {true}
                    placeholderTextColor="#a5a5a5"
                    style={css`border-left-width : 0px; `}
                />
                <TouchableOpacity onPress={() => {setShowDatetPicker(true)}}>
                    <DueDateText>D-day : {date.toDateString()}</DueDateText>
                </TouchableOpacity>
                    {showDatetPicker && (
                    <DateTimePicker
                    value={date}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    />
                )}

            </TaskModalBoxContainer>
            <SubmitButton
             onPress = {() => {
                if(content === ""){
                    alert("할일 제목은 필수에요!")
                }else{
                    const convertedCategories = CategoriesConvert(categories);
                    const dateString = date.toDateString()
                    hide();
                    mode ? add(content, subContent, convertedCategories, dateString) : edit(content, subContent, convertedCategories, dateString);
                    resetState();
                }
             }}>
                 <Text style={css` color : white; font-size : 20px;`}>등록하기</Text>
            </SubmitButton> 
        </Modal>
    )
}


export default TaskModal