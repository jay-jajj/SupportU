import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { FlatList, TouchableOpacity, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import TaskModal from './components/TaskModal';
import TodoItem from './components/TodoItem';
import DateTime from './components/DateTime';
import Filter from './components/Filter';

import styled, { css } from '@emotion/native'
import { ThemeProvider } from '@emotion/react'

import MenuButton from "./assets/svgs/Menu.svg"



import * as SQLite from 'expo-sqlite'; //sqlite 모듈 임포트
import ConfigModal from './components/ConfigModal';

const db = SQLite.openDatabase('db.db');

export default function App() {
  const [currentCategory, onChangeCurrentCategory] = useState("ALL");
  const [categoriesList, onChangeCategoryList] = useState([])
  const [todoList, onChangeTodoList] = useState([]);
  const [showModal, onChangeshowModal] = useState(false);
  const [showConfig, onChangeShowConfig] = useState(false);
  //true == default, false == editmode
  const [modeModal, onchangeModeModal] = useState(true);
  const [target, onchangetarget] = useState([])
  
  const [darkTheme, setDarkTheme] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#40e0d0")
  
  
  //------------
  const theme = {
    backgroundColor : darkTheme ? "#303030" : "white",
    textColor : darkTheme ? "white" : "black",
    borderColor : "#a5a5a5",
    primaryColor : primaryColor,
  }
  
  const MainContainer = styled.View`
  width : 100%;
  height : 100%;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.backgroundColor};
  `
  const Header = styled.View`
  width : 100%;
  flex-direction : row;
  align-items : center;
  justify-content : space-around;
  margin : 16px;
  margin-top : 7%;
  border-bottom-width : 3px;
  border-bottom-color : ${({theme}) => theme.primaryColor} ;
  
  `

  const PlusButton = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  bottom : 0px;
  margin-bottom: 30px;
  margin-right: 30px;
  justify-content: center;
  align-items: center;
  color : white;
  background-color: ${props => props.theme.primaryColor};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  `
  
//-------------



  function createTable(){
    // db.transaction(tx => {
    //     tx.executeSql('DROP TABLE todolist')
    //     tx.executeSql('DROP TABLE config')
    //   })
      //테이블생성
      db.transaction(tx => {
      //IF NOT EXISTS를 붙이면 테이블 존재하지 않을 경우에만 생성 시킨다.
      tx.executeSql('CREATE TABLE IF NOT EXISTS todolist (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, subContent TEXT, done INTEGER, fixed INTEGER, categories TEXT, dday Text);')
      tx.executeSql('CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT, darktheme INTEGER DEFAULT 0, maincolor DEFAULT "cornflowerblue", LockScrenn INTEGER DEFAULT 0, font TEXT);')
    })
  };
  function insertData(content, subContent, done, fixed, categories, dday=""){
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO todolist(content, subContent, done, fixed, categories, dday) values (?,?,?,?,?,?)', [content, subContent, done, fixed, categories, dday]);
      });
      paintList(currentCategory);
  }
  function paintList(category){
      //db에서 데이터 모두 가져오기 
      let list = []
      const queryString = (category === "ALL" ) ? "SELECT * FROM todolist ORDER BY fixed DESC" : `SELECT * FROM todolist  WHERE categories LIKE '%${category}%'`;
    db.transaction(tx => {
      tx.executeSql(queryString, [], (_, { rows }) => {
         list = rows._array.map(obj =>{
         return {
                  id : obj.id, 
                  content : obj.content, 
                  subContent : obj.subContent, 
                  done : obj.done, 
                  fixed : obj.fixed, 
                  categories : obj.categories,
                  dday : obj.dday,
                }
        })
        onChangeTodoList(list);
        getCategoriesList()
     });
    })
}

  function deleteTodo(id){
    db.transaction(tx => {
      tx.executeSql("DELETE FROM todolist WHERE id == ?",[id])
    })
    paintList(currentCategory);
  }
  function changeDone(done, id){
    db.transaction(tx => {
      tx.executeSql("update todolist set done = ? WHERE id == ?",[!done, id])
    })
    paintList(currentCategory);
  }
  function changeFixed(fixed, id){
    db.transaction(tx => {
      tx.executeSql("update todolist set fixed = ? WHERE id == ?",[!fixed, id])
    })
    paintList(currentCategory);
  }
  function updateContent(id, content, subContent, categories, dday=""){
    db.transaction(tx => {
      tx.executeSql("update todolist set content = ?, subContent = ?, categories = ?, dday = ?  WHERE id == ?",[content, subContent, categories, dday, id])
    })
    paintList(currentCategory);
  }
  function getCategoriesList(){
    db.transaction(tx => {
      tx.executeSql("SELECT DISTINCT categories FROM todolist", [], (_, { rows }) => {
      let categoriesList = ['ALL'];
      rows._array.forEach(obj => {
        const categories = obj.categories;
        if(categories.includes(',')){
          const splitedCategories = categories.split(',');
          splitedCategories.forEach((category)=>{
            categoriesList.push(category);
          })
        }else{
          categoriesList.push(categories);
        }
      })
        const setlist = new Set(categoriesList)
        onChangeCategoryList([...setlist])
      })
    })
  }
  function calculateDday(dueDate, currentDate){
    const distance = new Date(dueDate) - currentDate
    const day = Math.floor(distance/(1000*60*60*24));
    if(day === -1){
      return "D-day"
    }else if(day < -1){
      return `D+${ Math.abs(day)-1}`
    }else{
      return `D-${day+1}`
    }
  }

  function getConfigData(){
     //db에서 데이터 모두 가져오기 
    const defaultInsertQueryString = `INSERT INTO config(darktheme, maincolor, LockScrenn, font) values (0, "#40e0d0", 0, "")`
     const queryString =  "SELECT * FROM config";
   db.transaction(tx => {
     tx.executeSql(queryString, [], (_, { rows }) => {
        const config = rows._array[0]
      if(config){ 
          setPrimaryColor(config.maincolor)
          setDarkTheme(Boolean(config.darktheme))
        }else{
          console.log("없다고!!!!")
          tx.executeSql(defaultInsertQueryString,[])
        }
    });
   })
  }
  function updateDarkTheme(){
    db.transaction(tx => {
      tx.executeSql("update config set darktheme = ? WHERE id == ?",[!darkTheme, 1])
    })
  }
  function updatePrimaryColor(color){
    db.transaction(tx=> {
      tx.executeSql("update config set maincolor = ? WHERE id == ?",[color, 1])
    })
  }
  useEffect(() => {
    createTable();
    getConfigData();
    paintList(currentCategory);
    return () => {
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
      <StatusBar style="auto" />
      <Header>
        <DateTime textColor={theme.textColor} primaryColor={primaryColor}/>
        <Filter categoryList={categoriesList} setFilterFunc={(category)=>{
          onChangeCurrentCategory(category)
          paintList(category)
        }} currentCategory={currentCategory}
        textColor={theme.textColor}
        />
        <TouchableOpacity onPress ={()=>{onChangeShowConfig(true)}}>
          {/* 캐시를 제거하고 svrrc파일을 생성후 실행해야 fill이 적용이 된다. */}
          <MenuButton width={"70px"} height={"70px"} fill={primaryColor}/>
        </TouchableOpacity>
      </Header>
    <FlatList 
          data={todoList}
          renderItem={({ item }) => {
            return (
              <TodoItem
              title={item.content}
              subContent = {item.subContent}
              categories = {item.categories}
              done={Boolean(item.done)}
              fixed = {item.fixed}
              remove={() => {deleteTodo(item.id)}}
              toggle={() =>{changeDone(item.done, item.id)}}
              fixedToggle={() => { changeFixed(item.fixed, item.id)}}
              editPress = {() => {
                onchangeModeModal(false);
                onChangeshowModal(true);
                //0 : id, 1: conetent, 2: subcontent, 3: categories, 4 : dday
                let targetTodo = [item.id, item.content, item.subContent, item.categories, item.dday];
                onchangetarget(targetTodo);
              }}
              primaryColor={primaryColor}
              dday = {calculateDday(item.dday, new Date())}
              />)
            }
          }
          keyExtractor= {(_, index) => {
            return `${index}`
          }}
          />
          <TaskModal 
          //0 : id, 1: conetent, 2: subcontent, 3: categories, 4 : dday
          isVisible={showModal}
          mode = {modeModal} 
          hide = {() => {onChangeshowModal(false), onchangeModeModal(true)}} 
          originContent = {target[1]}
          originSubContent = {target[2]}
          originCategories = {target[3]}
          originDday = {target[4]}

          add={(content, subContent, categories, dday) => {
            insertData(content, subContent, 0, 0, categories, dday);
          }}
          edit={(content, subContent, categories, dday) => {
            updateContent(target[0], content, subContent, categories, dday);
          }}
        />
        <ConfigModal
          isVisible={showConfig}
          hide={() =>onChangeShowConfig(false)}
          isDarkTheme ={darkTheme}
          changeDarkTheme = {() => {
            setDarkTheme(!darkTheme),
            updateDarkTheme()
           }}
           primaryColor={primaryColor}
           changePirmayColor={(color)=>{setPrimaryColor(color), updatePrimaryColor(color)}}
        />
        
        <PlusButton
                  activeOpacity={0.8}                 
                  onPress={() => onChangeshowModal(true)}
                  >
                  <Ionicons name='ios-add' color='#FFFFFF' size={35} />
        </PlusButton>
      </MainContainer>
    </ThemeProvider>   
  );
}


