<template lang="pug">
  .list-view
    ul.grid
      router-link.blog-list.col.col-d-4.col-t-4(tag="li" :to="{ name: 'View', params: { id: getFilteredList[index].key }}" v-for="(list, index) in getFilteredList" v-if="startShowItem <= index && index < endShowItem" key="getFilteredList[index].key" @click.native="gotoBlogView(getFilteredList[index].key)" )
        a(href)
          figure
            img.list-img(:src="list.title_img")
            figcaption.list-item
              p.title {{ list.title }}
              p.content {{ list.write_date.substr(0, 4) + '.' + list.write_date.substr(4, 2) + '.' + list.write_date.substr(6, 2) }} | {{ list.country_kr}} | {{ list.name}} | 조회수 {{ list.view}}
                i.icon-next
    p.listNotFound(v-show="listNotFound && !listLoading") 관련 글이 존재하지 않습니다.
    .listLoading(v-show="listLoading")
      .loding
        span
        span
        span
      p 글을 불러오고 있습니다.
    .page
      a.first-page.page-btn(href @click.prevent="changePagePosition('first')" v-show="activePage !== 0") 처음페이지
      a.last-page.page-btn(href @click.prevent="changePagePosition('last')" v-show="activePage !== pageAmount-1") 마지막페이지
      a.prev-page.page-btn(href @click.prevent="changePagePosition('prev')" v-show="activePage !== 0") 이전
      a.next-page.page-btn(href @click.prevent="changePagePosition('next')" v-show="activePage !== pageAmount-1") 다음
      ul.page-number
        li(v-for="(page, index) in pageAmount" :class="{'active-page': activePage === index}" v-if="minPageNum <= index && index < maxPageNum") 
          a(href @click.prevent="changePageNumber(index + 1)") {{ page }}     
</template>

<script scoped>
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: 'listview',
    mounted () {
      // next Tick을 통해 데이터 갱신후 UI까지 완성되었을 때, callback 함수 실행
      this.$nextTick(function () {
        // 윈도우 사이즈가 변할때 이벤트가 발생하게 연결
        window.addEventListener('resize', this.makePageNumber)
        // 접속했을 때의 윈도우 사이즈를 알아내기 위해 실행
        this.makePageNumber()
      })
    },
    computed: {
      listNotFound () {
        return this.getFilteredList.length === 0
      },
      ...mapGetters(['getFilteredList', 'startShowItem', 'endShowItem', 'pageAmount', 'activePage', 'minPageNum', 'maxPageNum', 'listLoading'])
    },
    methods: {
      makePageNumber () {
        this.$store.commit('makePageNumber', this.getFilteredList.length)
      },
      ...mapMutations(['gotoBlogView', 'changePageNumber', 'changePagePosition'])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../sass/App';
  a {
    color: inherit;
    text-decoration: none;
  }
  
  .blog-list {
    overflow: hidden;
  }
  
  figure {
    position: relative;
    overflow: hidden;
  }
  
  img {
    position: relative;
  }
  
  .listNotFound {
    text-align: center;
  }
  
  .list-item {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(#181818, 0.4);
    .title {
      color: rgb(255, 255, 255);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content {
      font-weight: bold;
      color: rgba(255, 255, 255, 0.7);
    }
    .icon-next {
      position: absolute;
      margin-top: 4px;
    }
  }
  
  .page {
    margin: 40px auto 0 auto;
    display: flex;
    justify-content: center;
    .page-btn {
      position: relative;
      margin: 0 10px 0 0;
      box-sizing: border-box;
      border: 1px solid rgba(#181818, 0.4);
      overflow: hidden;
    }
    .first-page {
      order: 1;
    }
    .first-page::after {
      content: '\66';
      position: absolute;
      transform: rotate(-90deg);
      font-family: "travelericon";
      color: rgba(#181818, 0.4);
    }
    .first-page::before {
      content: '\66';
      position: absolute;
      transform: rotate(-90deg);
      font-family: "travelericon";
      color: rgba(#181818, 0.4);
    }
    .prev-page {
      order: 2;
    }
    .prev-page::before {
      content: '\66';
      position: absolute;
      transform: rotate(-90deg);
      font-family: "travelericon";
      color: rgba(#181818, 0.4);
    }
    .page-number{
      @include clearfix;
      order: 3;
      li {
        float: left;
        margin: 0 10px 0 0;
        text-align: center;
        color: rgba(#181818, 0.7);
        border: 1px solid rgba(#181818, 0.4);
      }
      .active-page {
        color: rgb(244, 67, 11);
        border: 1px solid $color1;
      }
      a {
        outline: none;
      }
      a::after {
        content: '';
        position: relative;
      }
    }
    .next-page {
      order: 4;
    }
    .next-page::before {
      content: '\66';
      position: absolute;
      transform: rotate(90deg);
      font-family: "travelericon";
      color: rgba(#181818, 0.4);
    }
    .last-page {
      order: 5;
    }
    .last-page::after {
      content: '\66';
      position: absolute;
      transform: rotate(90deg);
      font-family: "travelericon";
      color: rgba(#181818, 0.4);
    }
    .last-page::before {
      content: '\66';
      position: absolute;
      transform: rotate(90deg);
      font-family: "travelericon";
      color: rgba(#181818, 0.4);
    }
  }

  .listLoading {
    width: 100%;
    padding-top: 100px;
    text-align: center;
    span{
      display: inline-block;
      width: 20px;
      height: 20px;
      background: $color1;
      margin: 0 10px;
      border-radius: 20px;
      transform-origin: 50% 50%;
      animation: bubble 1.2s -0.6s infinite  ease-out;
      &:nth-of-type(2n){
        animation-delay: -0.3s;
      }
      &:nth-of-type(3n){
        animation-delay: 0s;
      }
    }
    @keyframes bubble {
      0%, 100%{
        transform: scale(0)
      }
      50%{
        transform: scale(1)
      }
    }
    p{
      margin-top: 30px;
      font-size: 20px;
    }
  }

  @include mobile {
    .blog-list {
      padding: 0 0 20px 0;
    }
    figure {
      width: 100%;
      height: 254px;
    }
    img {
      transform: translateX(-10%);
      width: 130%;
      height: auto;
    }
    .list-item {
      padding: 16px;
    }
  }
  
  @include tablet {
    figure {
      width: 100%;
      height: 260px;
    }
    .blog-list {
      padding: 0 20px 20px 0;
    }
    img {
      transform: translate(-20%, -10%);
      width: 200%;
      height: auto;
    }
    .list-item {
      padding: 16px 23px 16px 16px;
    }
  }
  
  @include desktop {
    .list-view {
      margin: 48px 0 0 0;
    }
    .blog-list {
      padding: 0 20px 20px 0;
    }
    figure {
      width: 100%;
      height: 440px;
    }
    img {
      width: auto;
      height: 100%;
    }
    .listNotFound {
      margin: 100px 0;
      font-size: 22px;
    }
    .list-item {
      padding: 24px;
      height: 60px;
      .title {
        padding-right: 30px;
        font-size: 22px;
      }
      .content {
        margin: 14px 0 0 0;
        font-size: 14px;
      }
      .icon-next {
        right: 70px;
        font-size: 20px;
      }
    }
    .page-btn {
      padding-top: 50px;
      width: 50px;
      height: 50px;
    }
    .page-number li {
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
    .first-page {
      font-size: 24px;
    }
    .first-page::before {
      top: 12px;
      left: 8px;
    }
    .first-page::after {
      top: 12px;
      left: 18px;
    }
    .prev-page {
      font-size: 24px;
    }
    .prev-page::before {
      top: 12px;
      left: 14px;
    }
    .next-page {
      font-size: 24px;
    }
    .next-page::before {
      top: 12px;
      left: 8px;
    }
    .last-page {
      font-size: 24px;
    }
    .last-page::before {
      top: 12px;
      right: 8px;
    }
    .last-page::after {
      top: 12px;
      right: 18px;
    }
  }
  
  @include breakpoint(0px, 1199px) {
    .listNotFound {
      margin: 50px 0;
      font-size: 18px;
    }
    .list-view {
      margin: 40px 0 0 0;
    }
    .list-item {
      height: 50px;
      .title {
        padding-right: 30px;
        font-size: 18px;
      }
      .content {
        margin: 13px 0 0 0;
        font-size: 12px;
      }
      .icon-next {
        right: 70px;
        font-size: 18px;
      }
    }
    .page-btn {
      padding-top: 30px;
      width: 30px;
      height: 30px;
    }
    .page-number li {
      width: 30px;
      height: 30px;
      line-height: 30px;
    }
    a::after {
      top: -20px;
      padding: 15px;
    }
    .first-page {
      font-size: 15px;
    }
    .first-page::before {
      top: 7px;
      left: 4px;
    }
    .first-page::after {
      top: -8px;
      left: -5px;
    }
    .prev-page {
      font-size: 15px;
    }
    .prev-page::before {
      top: 7px;
      left: 8px;
    }
    .next-page {
      font-size: 15px;
    }
    .next-page::before {
      top: 7px;
      right: 8px;
    }
    .last-page {
      font-size: 15px;
    }
    .last-page::before {
      top: 7px;
      right: 4px;
    }
    .last-page::after {
      top: -8px;
      right: -5px;
    }
  }
  
  @include breakpoint(0px, 375px) {
    img {
      width: auto;
      height: 130%;
    }
  }

</style>
