<template lang="pug">
  form.write
    button.a11y-hidden(type="submit" @click.prevent="preventSubmitEvent")
    .write-title-container
      .title-container
      .title-text-container
        fieldset.title(:class="{'has-img': wirteTitleImgUrl}")
          legend.a11y-hidden 제목 입력 폼
          label.a11y-hidden(for="write-title") 제목을 입력하세요.
          input#write-title(:value="writeTitleValue" @click="clearInput('title')" @input="setTitleValue" @blur="inputValueCheck('title')" placeholder="제목을 입력하세요.")
          span.title-error(v-show="showTitleErrorMessage") {{ titleErrorMessage }}
        fieldset.tag(:class="{'has-img': wirteTitleImgUrl}")
          legend.a11y-hidden 태그 입력 폼
          label.a11y-hidden(for="write-tag") 태그를 입력하세요.
          input#write-tag(:value="writeTagValue" @click="clearInput('tag')" @input="setTagValue" @blur="inputValueCheck('tag')" placeholder="태그를 입력하세요")
          span.tag-error(v-show="showTagErrorMessage") {{ tagErrorMessage }}
        fieldset.title-image-form
          legend.a11y-hidden 대표이미지 등록 폼
          label(for="title-image-input" :class="{'has-img': wirteTitleImgUrl}")
            i
              svg.feather.feather-image(xmlns='http://www.w3.org/2000/svg', viewbox='0 0 24 24', fill='none', stroke='currentColor', stroke-width='2', stroke-linecap='round', stroke-linejoin='round')
                rect(x='3', y='3', width='18', height='18', rx='2', ry='2')
                circle(cx='8.5', cy='8.5', r='1.5')
                polyline(points='21 15 16 10 5 21')
            | 대표이미지를 등록하세요
          input#title-image-input.a11y-hidden(type="file" name="title-image" @change="imageUpload('title')" accept="image/*")
        span.title-image-error(v-show="showTitleImageProgress") {{imageProgressMessage}}
      .title-image-container
        img(:src="wirteTitleImgUrl")
        .title-background(v-show="wirteTitleImgUrl")
    .write-contents-container
      .warp
        .form-warp
          .country-and-city
            p.selected-country(tabindex="0" @click.prevent="toggleWriteCountryCity('country')" :class="{'default-filter-msg': selectedWriteCity === '여행지를 선택하세요.'}") {{ selectedWriteCity }}
              i.icon-down
            .select-container(v-show="showWriteCountry")
              .background-select-container(@click="toggleWriteCountryCity('country')")
              ul.country-and-city-select
                li.country(v-for="(country, index) in getCountryAndCityName" :key="'country' + index")
                  a(href @click.prevent="toggleWriteCountryCity(country.countryKey)") {{country.country}} 
                  div.city-filter(v-if="selectedWriteCountryKey===country.countryKey" v-show="showWriteCity")
                    ul
                      li.city(v-for="(citygroup, index) in country.citygroup" :key="'city' + index")
                        input.a11y-hidden(type="checkbox" :id="citygroup.city" @change.prevent="setSelectedItem")
                        label(:for="citygroup.city") {{ citygroup.city }}
                    button.city-save-btn(type="submit" @click.prevent="selectComplete(getCountryAndCityName)") 저장
          
          fieldset.date-setting
            legend.a11y-hidden 여행 날짜 입력 폼
            .start-date(role="group")
              label(for="start-date")
                i
                  svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar")
                    rect(x="3" y="4" width="18" height="18" rx="2" ry="2")
                    line(x1="16" y1="2" x2="16" y2="6")
                    line(x1="8" y1="2" x2="8" y2="6")
                    line(x1="3" y1="10" x2="21" y2="10")
                | 여행 시작 : 
              input#start-date(type="date" @change="setDate('start')")
            .end-date(role="group")
              label(for="end-date")
                i
                  svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar")
                    rect(x="3" y="4" width="18" height="18" rx="2" ry="2")
                    line(x1="16" y1="2" x2="16" y2="6")
                    line(x1="8" y1="2" x2="8" y2="6")
                    line(x1="3" y1="10" x2="21" y2="10")
                | 여행 종료 : 
              input#end-date(type="date" @change="setDate('end')")
            span.date-error-message(v-show="showDateErrorMessage") {{ dateErrorMessage }}
        ul.write-contents-view
          li.contents-view-item(v-for="(content, index) in writeContentsData")
            textarea(v-if="content.key === 'text'" @input="addContentsText(index)" @blur="inputValueCheck(index)")
            span.text-error-message(v-if="content.key === 'text' && content.value.length === 0" v-show="showContentErrorMessage") {{ contentErrorMessage }}
            img(v-if="content.key === 'img'" :src="content.value")
            button.delete(type="button" @click="deleteContent(index)" aria-label="삭제") X
        fieldset.input-contents
          legend.a11y-hidden 이미지 텍스트 입력 폼
          .contents-image
            label(for="contents-image") 
              i
                svg.feather.feather-image(xmlns='http://www.w3.org/2000/svg', viewbox='0 0 24 24', fill='none', stroke='currentColor', stroke-width='2', stroke-linecap='round', stroke-linejoin='round')
                  rect(x='3', y='3', width='18', height='18', rx='2', ry='2')
                  circle(cx='8.5', cy='8.5', r='1.5')
                  polyline(points='21 15 16 10 5 21')
              span 이미지를 추가하세요
            input#contents-image.a11y-hidden(type="file" @change="imageUpload('content')" accept="image/*")
          .contents-text
            button(type="button" @click="setContentsText") 
              i
                svg(xmlns='http://www.w3.org/2000/svg', viewbox='0 0 24 24', fill='none', stroke='currentColor', stroke-width='2', stroke-linecap='round', stroke-linejoin='round')
                  polygon(points='14 2 18 6 7 17 3 17 3 13 14 2')
                  line(x1='3', y1='22', x2='21', y2='22')
              span 텍스트를 추가하세요
        span.image-progress(v-show="showContentImageProgress") {{imageProgressMessage}}
        .write-button
          fieldset
            legend.a11y-hidden 글 저장 및 취소 폼
            button(type="submit" @click.prevent="saveWriteData") 저장
            transition(name="fade")
              span.error-message(v-show="showWriteErrorMessage") {{ writeErrorMessage }}
            router-link.save-btn(to="/" tag="button") 취소
</template>

<script>
  const locationApi = 'https://traveller-in-blog.firebaseio.com/locations.json'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import axios from 'axios'
  export default {
    name: 'write',
    mounted () {
      this.$store.commit('resetTempData', {'start': window.document.querySelector('#start-date'), 'end': window.document.querySelector('#end-date')})
      axios.get(locationApi).then(response => {
        this.$store.dispatch('setCountryAndCity', response.data)
      }).catch(error => console.log(error.message))
    },
    computed: {
      ...mapGetters(['getCountryAndCityName', 'writeTitleValue', 'writeContentsData', 'writeTagValue', 'wirteTitleImgUrl', 'selectedWriteCity', 'selectedWriteCountryKey', 'showWriteCountry', 'showWriteCity', 'writeErrorMessage', 'showWriteErrorMessage', 'writeErrorMessage', 'dateErrorMessage', 'showDateErrorMessage', 'showTitleImageProgress', 'showContentImageProgress', 'imageProgressMessage', 'showTitleErrorMessage', 'titleErrorMessage', 'showTagErrorMessage', 'tagErrorMessage', 'contentErrorMessage', 'showContentErrorMessage'])
    },
    methods: {
      ...mapMutations(['changeEditable', 'toggleWriteCountryCity', 'selectComplete', 'setDate', 'setContentsText', 'addContentsText', 'clearFileValue', 'resetTempData']),
      ...mapActions(['setListsData', 'deleteContent']),
      clearInput (type) {
        let payload = { 'value': event.target.value, 'type': type }
        this.$store.commit('clearInput', payload)
      },
      setTitleValue (event) {
        this.$store.commit('setTitleValue', event.target.value)
      },
      setTagValue (event) {
        this.$store.commit('setTagValue', event.target.value)
      },
      inputValueCheck (type) {
        if (event.target.value === '') {
          this.$store.commit('inputValueCheck', type)
        }
      },
      checkImage (file) {
        if (/.*\.(gif)|(jpeg)|(jpg)|(png)$/.test(file.name.toLowerCase())) {
          return true
        }
      },
      // 타이틀/본문 이미지 업로드
      imageUpload (type) {
        // 사용자가 선택한 이미지 파일
        let file = event.target.files[0]
        let reader = new FileReader()
        if (this.checkImage(file)) {
          this.file = file
          // 파일을 데이터 URL로 표시
          reader.readAsDataURL(file)
          // 파일 읽기가 완료되면
          reader.onload = data => {
            let payload = {'image': data.srcElement.result, 'type': type, 'name': this.file.name}
            this.$store.dispatch('setImageToStorage', payload) // store-post
          }
        }
      },
      setSelectedItem () {
        let payload = {'checked': event.target.checked, 'id': event.target.id}
        this.$store.commit('setSelectedItem', payload)
      },
      setDate (sort) {
        let payload = {'date': event.target.value, 'sort': sort}
        this.$store.commit('setDate', payload)
      },
      saveWriteData () {
        let payload = { 'id': this.$route.query.id }
        this.$store.dispatch('saveWriteData', payload)
      },
      preventSubmitEvent () {
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../sass/App';
  * {
    box-sizing: border-box;
  }
  i{
    display: inline-block;
    width: 30px;
    height: 30px;
    svg{
      width: 100%;
      height: 100%;
    }
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    margin: 3px;
    font-size: 15px;
    background-color: $color1;
    border: 1px solid $color1;
    border-radius: 4px;
    color: #fff;
    font-weight: normal;
  }
  
  [class $="error"] {
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100vw;
    height: 50px;
    line-height: 50px;
    background: $color1;
    color: #fff;
    font-size: 20px;
    display: block;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0
  }
  .write-title-container {
    position: relative;
    width: 100%;
    height: 500px;
    border-bottom: 1px solid rgba(#181818, 0.2);
    .title-text-container {
      position: relative;
      max-width: 900px;
      margin: 55px auto 0 auto;
      input,
      label {
        border: 0 none;
        color: #bababa;
        width: auto;
        background: none;
      }
      #write-title, #write-tag {
        width: 650px;
        height: 40px;
        line-height: 40px;
      }
      .title {
        position: absolute;
        left: 0;
        bottom: -410px;
        font-size: 30px;
      }
      .tag {
        position: absolute;
        left: 0;
        bottom: -450px;
        font-size: 20px;
      }
      .title.has-img, .tag.has-img{
        input{
          color: #fff;
        }
      }
      .title-image-form {
        position: absolute;
        right: 0;
        bottom: -450px;
        label{
          display: block;
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          background: rgba(#fff, 0.3);
          border-radius: 35px;
          color: #b0b0b0;
          border: 1px solid #b0b0b0;
          font-size: 16px;
          i{
            display: block;
            float: left;
            width: 24px;
            height: 24px;
            margin-right: 5px;
            margin-top: 7px;
          }
        }
        label.has-img{
          color: #fff;
        }
      }
    }
  }
  
  .title-image-container {
    z-index: -1;
    position: fixed;
    width: 100vw;
    height: 500px;
    overflow: hidden;
    img{ 
      position: absolute;
      left: 50%;
      top: 54%;
      transform: translate(-50%, -50%);
      width: 120vw; 
      height: auto; 
    } 
    .title-background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 500px;
      background: rgba(#181818, 0.2);
    }
  }
  
  .write-contents-container {
    position: relative;
    z-index: 1;
    overflow: hidden;
    width: 100%;
    height: auto;
    min-height: 450px;
    background: #fff;
    .warp{
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }
    .form-warp{
      position: relative;
      z-index: 10;
      @include clearfix;
      padding-top: 20px;
    }
    .country-and-city {
      float: left;
      width: 250px;
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #b0b0b0;
      border-radius: 2px;
      box-shadow: 0 1px 0px 0 #b0b0b0;
      font-size: 16px;
    }
    .select-container {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 56px;
      width: 250px;
      overflow: hidden;
      border: 1px solid #b0b0b0;
      border-top: 0 none;
      .background-select-container{
        position: fixed;
        z-index: -1;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100%;
      }
    }
    .selected-country {
      width: 250px;
      height: 35px;
      padding: 0 20px;
      line-height: 35px;
      font-weight: bold;
      color: $color1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
    }
    .country-and-city-select {
      width: 270px;
      height: 200px;
      overflow-Y: scroll;
      background: #fff;
      .country {
        margin-top: 20px;
        padding: 0 20px;
        width: 250px;
        font-size: 16px;
      }
      .city-filter {
        font-size: 16px;
        margin-top: 20px;
        border-bottom: 1px solid #dfdfdf;
        padding-bottom: 15px;
        ul{
          border-top: 1px solid #dfdfdf;
          padding-top: 10px;
          @include clearfix;
        }
        .city {
          float: left;
          margin-right: 10px;
          height: 30px;
          line-height: 30px;
          input:checked:checked+label::before {
            content: '✔';
            margin: 2px;
            font-size: 12px;
          }
        }
        .city-save-btn {
          margin: 10px 0 0 0;
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
          display: block;
          border-radius: 4px;
          background-color: $color1;
          border: 1px solid $color1;
          color: #fff;
          font-size: 15px;
          font-weight: normal;
        }
      }
    }
    .icon-down {
      position: relative;
      top: 3px;
      float: right;
      font-size: 18px;
    }
    .date-setting {
      position: relative;
      float: right;
      font-size: 15px;
      height: 35px;
      input {
        float: left;
        display: block;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        border: none;
        background: none;
        color: rgba( #181818, 0.4);
      }
      label {
        float: left;
        display: block;
        height: 35px;
        line-height: 35px;
        margin-right: 5px;
        color: rgba( #181818, 0.4);
        font-weight: bold;
        i{
          display: block;
          float: left;
          width: 15px;
          height: 15px;
          margin: 2px 5px 19px 0;
        }
      }
      .start-date {
        float: left;
        height: 35px;
        line-height: 35px;
        border: 1px solid #b0b0b0;
        padding: 0 5px;
        box-shadow: 0 1px 0px 0 #b0b0b0;
      }
      .end-date {
        float: left;
        margin-left: 10px;
        height: 35px;
        line-height: 35px;
        border: 1px solid #b0b0b0;
        padding: 0 5px;
        box-shadow: 0 1px 0px 0 #b0b0b0;
      }
      .date-btn {
        float: right;
        margin: 3px 0 0 0;
        button {
          margin: 0 5px;
          padding: 0 10px;
          height: 35px;
          line-height: 35px;
        }
      }
    }
    .date-error-message {
      position: absolute;
      left: 0;
      bottom: -20px;
      font-size: 14px;
      color: $color1;
    }
  }
  
  .write-contents-view {
    padding: 30px 0 50px 0;
    min-height: 400px;
    .contents-view-item {
      position: relative;
      z-index: 1;
    }
    textarea {
      margin: 20px 0 0 0;
      padding: 20px;
      width: 100%;
      height: 150px;
      overflow: visible;
      border: 1px solid #b0b0b0;
      font-size: 18px;
    }
    img {
      margin: 15px 0 0 0;
      width: 100%;
    }
    .delete {
      position: absolute;
      top: 25px;
      right: 10px;
      width: 30px;
      height: 30px;
      text-align: center;
      border-radius: none;
      background: none;
      color: $color1;
      border: 0 none;
      font-size: 30px;
      transform: scale(1.5, 1);
    }
    .text-error-message {
      font-size: 16px;
    }
  }
   
  .input-contents {
    position: fixed;
    z-index: 10;
    right: 30px;
    bottom: 20%;
    vertical-align: middle;
    .contents-image{
      margin-bottom: 10px;
    }
    label, button{
      display: inline-block;
      width: 210px;
      height: 40px;
      line-height: 40px;
      padding: 0 5px 0 10px;
      background: #fff;
      border-radius: 35px;
      color: #b0b0b0;
      border: 1px solid #b0b0b0;
      i{
        display: block;
        float: left;
        width: 24px;
        height: 24px;
        margin-right: 5px;
        margin-top: 7px;
        font-size: 16px;
      }
      span{
        display: block;
        float: left;
        font-size: 16px;
        font-family: 'Nanum Square', 'Avenir', Helvetica, Arial, sans-serif;
      }
    }
    .contents-text{
      display: inline-block;
      button{
        border-radius: 35px;
        margin: 0;
      }
    }
  }

  .image-progress {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100vw;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background: $color1;
  }
  
  .write-button {
    text-align: center;
    margin: 40px 0;
    button {
      height: 40px;
      line-height: 40px;
      padding: 0 40px;
    }
    .save-btn{
      margin-left: 20px;
      background: #b0b0b0;
      border: 1px solid #b0b0b0;
    }
    .error-message{
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      width: 100vw;
      height: 50px;
      line-height: 50px;
      display: block;
      text-align: center;
      color: #fff;
      font-size: 20px;
      background: $color1;
    }
  }
  
  @include mobile {
    .write-title-container {
      height: 300px;
      .title-text-container {
        .title {
          left: 10px;
          bottom: -190px;
          font-size: 56px;
          font-size: 24px;
          width: 90%;
        }
        .tag {
          left: 10px;
          bottom: -230px;
          font-size: 18px;
          width: 90%;
        }
        .title-image-form {
          left: 10px;
          bottom: -280px;
          label{
            width: 250px;
          }
        }
        #write-title, #write-tag {
          width: 100%;
          // min-width: 300px;
        }
      }
    }
    .title-image-container {
      height: 300px;
      img{
        width: auto;
        height: 200%;
        padding: 0;
      }
      .title-background{
        height: 300px;
      }
    }
      
    .write-contents-container {
      .warp{
        padding: 10px;
      }
      .country-and-city {
        float: none;
        width: 100%;
        margin-bottom: 10px;
      }
      .select-container {
        overflow: hidden;
        width: 100%;
      }
      .selected-country {
        width: 100%;
        padding: 0 10px;
      }
      .country-and-city-select {
        width: 100%;
        height: 200px;
        .country {
          width: auto;
          padding: 0 10px;
        }
        .city-filter {
          width: 100%;
          ul{
            @include clearfix;
          }
        }
      }
      .date-setting {
        float: none;
        input {
          float: left;
          display: block;
        }
        label {
          float: left;
          display: block;
          i{
            display: none;
          }
        }
        .start-date {
          @include clearfix;
          float: none;
          padding: 0 10px;
        }
        .end-date {
          @include clearfix;
          float: none;
          padding: 0 10px;
          margin: 10px 0 0 0;
        }
        .date-btn {
          float: right;
          margin: 3px 0 0 0;
          button {
            margin: 0 5px;
            padding: 0 10px;
            height: 35px;
            line-height: 35px;
          }
        }
      }
      .date-error-message {
        bottom: -70px;
      }
    }
      
    .write-contents-view {
      margin-top: 40px;
      textarea {
        padding: 10px;
      }
      img {
        margin: 15px 0 0 0;
        width: 100%;
      }
    }
    .input-contents {
      position: relative;
      z-index: 0;
      bottom: 0;
      left: 50%;
      margin-left: -100px;
      vertical-align: bottom;
      text-align: center;
      height: 40px;
      label, button{
        display: block;
        width: 100px;
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        i{
          display: block;
          float: left;
          width: 24px;
          height: 24px;
          margin-right: 0;
          margin-top: 7px;
        }
        span{
          display: block;
          float: left;
          width: 50px;
          height: 40px;
          overflow: hidden;
        }
      }
      .contents-image{
        float: left;
        display: block;
        margin-bottom: 0;
        label{
          border-radius: 35px 0 0 35px;
          border-right: 0 none;
          font-size: 16px;
        }
      }
      .contents-text{
        float: left;
        display: block;
        button{
          border-radius: 0 35px 35px 0;
          font-size: 16px;
        }
      }
    }

    .image-progress {
      position: fixed;
      z-index: 10;
      bottom: 0;
      left: 0;
      text-align: center;
      width: 100vw;
      height: 50px;
      line-height: 50px;
      background: $color1;
      color: #fff;
      font-size: 20px;
    }
      
    .write-button {
      text-align: center;
      margin: 20px 0;
      button {
        height: 40px;
        line-height: 40px;
        padding: 0 40px;
      }
      .save-btn{
        margin-left: 20px;
        background: #b0b0b0;
        border: 1px solid #b0b0b0;
      }
      .error-message{
        position: fixed;
        z-index: 10;
        bottom: 0;
        left: 0;
        text-align: center;
        width: 100vw;
        height: 50px;
        line-height: 50px;
        background: $color1;
        color: #fff;
        font-size: 20px;
      }
    }

  }
  
  @include tablet {
    .write-title-container {
      height: 300px;
      .title-text-container {
        .title {
          left: 10px;
          bottom: -190px;
          font-size: 56px;
          font-size: 24px;
          width: 90%;
        }
        .tag {
          left: 10px;
          bottom: -230px;
          font-size: 18px;
          width: 90%;
        }
        .title-image-form {
          left: 10px;
          bottom: -280px;
          label{
            width: 250px;
          }
        }
        #write-title, #write-tag {
          width: 100%;
        }
      }
    }

    .title-image-container {
      height: 300px;
      img{
        width: 100%;
        height: auto;
        padding: 0;
      }
      .title-background{
        height: 300px;
      }
    }
      

    .write-contents-container {
      .warp{
        padding: 10px;
      }
      .country-and-city {
        float: none;
        width: 100%;
        margin-bottom: 10px;
      }
      .select-container {
        overflow: hidden;
        width: 100%;
      }
      .selected-country {
        width: 100%;
        padding: 0 10px;
      }
      .country-and-city-select {
        width: 100%;
        height: 200px;
        .country {
          width: auto;
          padding: 0 10px;
        }
        .city-filter {
          width: 100%;
          ul{
            @include clearfix;
          }
        }
      }
      .date-setting {
        float: none;
        input {
          float: left;
          display: block;
        }
        label {
          float: left;
          display: block;
          i{
            display: none;
          }
        }
        .start-date {
          @include clearfix;
          float: none;
          padding: 0 10px;
        }
        .end-date {
          @include clearfix;
          float: none;
          padding: 0 10px;
          margin: 10px 0 0 0;
        }
        .date-btn {
          float: right;
          margin: 3px 0 0 0;
          button {
            margin: 0 5px;
            padding: 0 10px;
            height: 35px;
            line-height: 35px;
          }
        }
      }
      .date-error-message {
        bottom: -70px;
      }
    }

    .write-contents-view {
      margin-top: 40px;
      textarea {
        padding: 10px;
      }
      img {
        margin: 15px 0 0 0;
        width: 100%;
      }
    }

    .input-contents {
      position: relative;
      z-index: 0;
      bottom: 0;
      left: 50%;
      margin-left: -100px;
      vertical-align: bottom;
      text-align: center;
      height: 40px;
      label, button{
        display: block;
        width: 100px;
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        i{
          display: block;
          float: left;
          width: 24px;
          height: 24px;
          margin-right: 0;
          margin-top: 7px;
        }
        span{
          display: block;
          float: left;
          width: 50px;
          height: 40px;
          overflow: hidden;
        }
      }
      .contents-image{
        float: left;
        display: block;
        margin-bottom: 0;
        label{
          border-radius: 35px 0 0 35px;
          border-right: 0 none;
          font-size: 16px;
        }
      }
      .contents-text{
        float: left;
        display: block;
        button{
          border-radius: 0 35px 35px 0;
          font-size: 16px;
        }
      }
    }

    .image-progress {
      position: fixed;
      z-index: 10;
      bottom: 0;
      left: 0;
      text-align: center;
      width: 100vw;
      height: 50px;
      line-height: 50px;
      background: $color1;
      color: #fff;
      font-size: 20px;
    }

    .write-button {
      text-align: center;
      margin: 20px 0;
      button {
        height: 40px;
        line-height: 40px;
        padding: 0 40px;
      }
      .save-btn{
        margin-left: 20px;
        background: #b0b0b0;
        border: 1px solid #b0b0b0;
      }
      .error-message{
        position: fixed;
        z-index: 10;
        bottom: 0;
        left: 0;
        text-align: center;
        width: 100vw;
        height: 50px;
        line-height: 50px;
        background: $color1;
        color: #fff;
        font-size: 20px;
      }
    }
  }
</style>