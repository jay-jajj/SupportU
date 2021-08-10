



const ConfigModalBoxContainer = styled.View`
    width : auto;
    min-width : 170px;    
    height : 100%;
    background-color: ${({theme}) => theme.backgroundColor};
    align-items : center;
    padding: 10px;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;  
    justify-content : space-between;
    `

const Title = styled.Text`
    font-size : 30px; 
    color : ${({theme}) => theme.textColor};
    font-weight : bold;
    margin-bottom : 5%;
`
const SupportText = styled.Text`
font-weight : bold;
color :  #3A1D1D;
background-color: #F7E600 ;
font-size : 23px;
border-radius : 4px;
text-align : center;
margin-left : 2px;
padding : 2px;
margin-bottom : 10px;
`
const CheckBoxText = styled.Text`
color : white;
background-color: ${({theme}) => theme.primaryColor};
font-size : 20px;
border-radius : 4px;
text-align : center;
margin-left : 2px;
padding : 2px;
`
const MainColorText = styled.Text`
color :${({theme}) => theme.primaryColor};
font-size : 25px;
font-weight : bold;
`
const ColorPickerContainer = styled.View`
    width : 80%;
    height : 40%;
    min-height : 300px;
    background-color: ${({theme}) => theme.backgroundColor};
    border-radius : 10px;
    justify-content : space-around;
    align-items : center;
`
const PickerSubmitText = styled.Text`
    color : ${({theme}) => theme.textColor};
    font-size : 23px;
`

import React , {useState} from 'react'
import {
CheckBox, TouchableOpacity, Linking, View, Text
} from 'react-native'
import Modal from 'react-native-modal'

import styled, { css } from '@emotion/native'
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker'


const ConfigModal = ({
    isVisible,
    hide,
    isDarkTheme,
    changeDarkTheme,
    primaryColor,
    changeLockScreen,
    changePirmayColor

}) => {
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [isLockScreen, setLockScreen] = useState(false);
    const [pickerColor, onChangePickerColor] = useState(primaryColor)    
    const PickerText= styled.Text`
    width : 80%;
    color : ${pickerColor};
    border-bottom-width: 3px;
    border-bottom-color : ${pickerColor};
    text-align: center;
    font-size : 30px;
    font-weight : bold;
`   
const PickerSubmitButton = styled.TouchableOpacity`
background-color: ${pickerColor};
justify-content: center;
align-items: center;
min-height: 40px;
height : 6%;
border-radius : 8px;
padding :  3px;
width : 80%;
`
    
    return (
    <Modal
        isVisible={isVisible}
        onBackdropPress={hide}
        onBackButtonPress={hide}
        avoidKeyboard
        animationIn={"slideInRight"}
        style={css`margin : 0; padding-top : 2%; padding-bottom : 2%; align-items : flex-end; justify-content : center;`}
    >
        <ConfigModalBoxContainer>
            <Title>{"<"} ⚙ 환경설정 {">"}</Title>
            <View style={css`flex-direction : row; align-items : center;`}>
            <CheckBox
                value ={isDarkTheme}
                onValueChange = {changeDarkTheme}
                style={css`align-self : center`}
            />
            <CheckBoxText>🌙다크테마 적용</CheckBoxText>
            </View>
            <View style={css`align-items : center;`}>
            <MainColorText>{`<개발중입니다❤>`}</MainColorText>
            <View style={css`flex-direction : row; align-items : center;`}>
            <CheckBox
                value ={isLockScreen}
                style={css`align-self : center`}
            />
            <CheckBoxText>🔒잠금화면 위 표시</CheckBoxText>
            </View>
            </View>
            <TouchableOpacity onPress={()=>{setShowColorPicker(true)}}>
                <MainColorText>{`< 현재색상 : ${primaryColor}>`}</MainColorText>
                <CheckBoxText>🌈 #색상코드 설정</CheckBoxText>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{}}>
                <MainColorText>{`<개발중입니다❤>`}</MainColorText>
                <CheckBoxText>📃 폰트설정</CheckBoxText>
            </TouchableOpacity>
    
            <TouchableOpacity onPress={()=>{
                Linking.openURL('https://qr.kakaopay.com/281006011000005944139810')
                }}>
                <SupportText>💰Kakaopay 후원하기</SupportText>
            </TouchableOpacity>

           
           
        </ConfigModalBoxContainer>
        <Modal
        isVisible={showColorPicker}
        avoidKeyboard
        animationIn={"zoomInDown"}
        onBackdropPress={()=>{setShowColorPicker(false),onChangePickerColor(primaryColor),setPickerText(primaryColor)}}
        onBackButtonPress={()=>{setShowColorPicker(false),onChangePickerColor(primaryColor),setPickerText(primaryColor)}}
        >
            <ColorPickerContainer
            >
                <TriangleColorPicker
                        color={pickerColor}
                        onColorSelected={color => changePirmayColor(color)}
                        style={{width : "80%", height : "60%",}}
                        onColorChange ={(color)=>{
                            onChangePickerColor(fromHsv(color))
                        }}
                        hideControls={true}
                    />
                <PickerText>{pickerColor}</PickerText>
                <PickerSubmitButton onPress={()=>{
                    changePirmayColor(pickerColor);
                }}>
                    <PickerSubmitText>등록하기</PickerSubmitText>
                </PickerSubmitButton>


            </ColorPickerContainer>
        </Modal>
    </Modal>
)
}


export default ConfigModal