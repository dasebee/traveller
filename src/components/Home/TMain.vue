<template lang="pug">
  main#content.grid
    visual
    country-list
    blog-list
    recommendation
</template>

<script>
  import BlogList from './BlogList.vue'
  import Visual from './Visual.vue'
  import CountryList from './CountryList.vue'
  import Recommendation from './Recommendation.vue'
  export default {
    components: {
      BlogList, Visual, CountryList, Recommendation
    }
  }
</script>

<style lang="scss">
  @import '../../sass/App';
  main {
    padding: 56px 0 0 0;
    overflow: hidden;
  }
  
  @include mobile {
  }
  
  @include tablet {
  }
  
  @include desktop {
  }
</style>
