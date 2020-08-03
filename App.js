import React, {PureComponent} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import io from 'socket.io-client';
const socket = io('http://47.115.155.212:3000');

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      userName: '',
      msgVal: '',
      msgList: [
        {
          id: 1234,
          nickName: 'LavaC',
          msg: 'Hello World！',
        },
      ],
    };
  }
  changeUserName = (e) => {
    this.setState({
      userName: e.nativeEvent.text,
    });
  };
  changeMsgVal = (e) => {
    this.setState({
      msgVal: e.nativeEvent.text,
    });
  };
  setName = () => {
    if (this.state.userName.trim() === '') {
      alert('请输入非空白的字符！');
      return;
    }
    this.startSocket();
    this.setState({
      isLogin: true,
    });
  };
  startSocket = () => {
    let that = this;
    socket.on('connect', () => {
      socket.emit('join', that.state.userName.trim());
    });
    // 接收信息
    socket.on('msg', (userName, msg) => {
      that.setState({
        msgList: [
          ...that.state.msgList,
          {
            id: Date.parse(new Date()) + Math.ceil(Math.random() * 10),
            nickName: userName,
            msg: msg,
          },
        ],
      });
    });
  };
  sendMsg = () => {
    let {userName, msgVal, msgList} = this.state;
    if (msgVal.trim() === '') {
      alert('请不要发送空白信息！');
      return;
    }
    this.msgIpt.focus();
    socket.send(userName, msgVal);
    this.setState({
      msgVal: '',
    });
  };
  // 保持聊天窗滚动在最底部
  scrollBottom = () => {
    this.scrollView.scrollToEnd({animated: true});
  };
  render() {
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.container}>
          {this.state.isLogin ? (
            <View style={styles.chatCon}>
              <ScrollView
                style={styles.msgCon}
                ref={(r) => (this.scrollView = r)}
                onContentSizeChange={this.scrollBottom}
                showsVerticalScrollIndicator={false}>
                {this.state.msgList.map((item) => {
                  return (
                    <View style={styles.chatBox} key={item.id}>
                      <View style={styles.avatar}>
                        <Text style={styles.nameFirst}>
                          {item.nickName.substring(0, 1).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.nameCon}>
                        <Text style={styles.nickName}>{item.nickName}</Text>
                        <View style={styles.msgBox}>
                          <Text style={styles.msgText}>{item.msg}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              <View style={styles.sendCon}>
                <TextInput
                  style={styles.msgIpt}
                  value={this.state.msgVal}
                  onChange={this.changeMsgVal}
                  maxLength={100}
                  returnKeyType="go"
                  onSubmitEditing={this.sendMsg}
                  ref={(r) => (this.msgIpt = r)}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={this.sendMsg}>
                  <Text style={styles.sendBtnText}>发送</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <TextInput
                placeholder={'请输入你的昵称'}
                value={this.state.userName}
                maxLength={6}
                onChange={this.changeUserName}
                style={styles.nameIpt}
              />
              <View>
                <Button
                  title="确定"
                  onPress={this.setName}
                  style={styles.nameBtn}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#333',
    borderWidth: 1,
    fontFamily: 'Helvetica',
  },
  nameIpt: {
    width: 300,
    height: 60,
    fontSize: 25,
    lineHeight: 40,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  nameBtn: {
    height: 40,
  },
  chatCon: {
    width: '100%',
  },
  msgCon: {
    width: '100%',
    height: '90%',
    backgroundColor: '#EFEFEF',
  },
  sendCon: {
    width: '100%',
    height: '10%',
    minHeight: 100,
    backgroundColor: '#DFDFDF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  msgIpt: {
    width: '70%',
    height: '70%',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 30,
    paddingLeft: 10,
  },
  sendBtn: {
    width: '20%',
    height: '65%',
    backgroundColor: 'green',
    borderRadius: 10,
    textAlign: 'center',
  },
  sendBtnText: {
    color: '#fff',
    lineHeight: 60,
    fontSize: 25,
    textAlign: 'center',
  },
  chatBox: {
    width: 300,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#DFDFDF',
  },
  nameFirst: {
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 55,
  },
  nameCon: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  nickName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  msgBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginTop: 5,
  },
  msgText: {
    lineHeight: 23,
    fontSize: 22,
  },
});
