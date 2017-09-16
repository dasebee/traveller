const userApi = 'https://traveller-in-blog.firebaseio.com/users.json'
// const listApi = 'https://traveller-in-blog.firebaseio.com/lists.json'
import axios from 'axios'
export default {
  state: {
    view_reply_data: {
      date: '',
      id: '',
      name: '',
      user_uid: '',
      reply_text: '댓글을 작성해주세요'
    }
  },
  getters: {
    viewReplyData (state) {
      return state.view_reply_data
    }
  },
  mutations: {
    inputReplyText (state, payload) {
      state.view_reply_data.reply_text = event.target.value
      let times = new Date()
      let month = (times.getMonth() + 1) < 10 ? '0' + (times.getMonth() + 1).toString() : (times.getMonth() + 1).toString()
      let day = times.getDate() < 10 ? '0' + times.getDate() : times.getDate()
      let hours = times.getHours() < 10 ? '0' + times.getHours() : times.getHours()
      let minute = times.getMinutes() < 10 ? '0' + times.getMinutes() : times.getMinutes()
      let second = times.getSeconds() < 10 ? '0' + times.getSeconds() : times.getSeconds()
      state.view_reply_data.date = times.getFullYear() + month + day + hours + minute + second
      if (state.view_reply_data.user_uid === '') {
        state.view_reply_data.id = payload.id
        state.view_reply_data.name = payload.name
        state.view_reply_data.user_uid = payload.uid
      }
    },
    resetReplytext (state) {
      if (state.view_reply_data.reply_text === '댓글을 작성해주세요' || state.view_reply_data.reply_text === '댓글이 입력되지 않았습니다. 댓글을 입력해주세요') {
        state.view_reply_data.reply_text = ''
        return
      }
    },
    checkReplyText (state) {
      let textCheck = state.view_reply_data.reply_text.trim().length
      if (textCheck === 0) {
        state.view_reply_data.reply_text = '댓글이 입력되지 않았습니다. 댓글을 입력해주세요'
        return
      }
    },
    clearReplyData (state) {
      state.view_reply_data.reply_text = '댓글을 작성해주세요'
    },
    askDeleteReply (state) {
      state.show_delete_reply = true
    }
  },
  actions: {
    inputReplyText ({commit, state}) {
      if (state.view_reply_data.user_uid === '') {
        let user = JSON.parse(localStorage.getItem('user_uid'))
        axios.get(userApi).then(response => {
          for (let prop in response.data) {
            if (response.data[prop].uid === user) {
              commit('inputReplyText', response.data[prop])
            }
          }
        })
      } else {
        commit('inputReplyText')
      }
    },
    editReply () {
    },
    deleteReply ({commit}, payload) {
      console.log(payload)
      let replyApi = 'https://traveller-in-blog.firebaseio.com/lists/' + payload.id + '/reply/' + payload.key + '.json'
      console.log(replyApi)
      // let URL = 'https://traveller-in-blog.firebaseio.com/lists/' + this.$route.params.id + '/reply.json'
      // axios.delete(repylApi).then(response => {
      // })
    }
  }
}
