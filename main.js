var HeaderComponent = Vue.extend({
  template: '#header-tpl',
  data: function () {
    return {
      categories: ['Foo', 'Bar', 'Qux']
    }
  }
})

var RecipeItemComponent = Vue.extend({
  template: '#recipe-item-tpl',
  props: ['recipe'],
  data: function () {
    return {
      loved: false
    }
  },
  methods: {
    toggleLove: function () {
      if (this.loved === false) {
        this.loved = true
        this.recipe.love += 1
        // do ajax stuff
      } else {
        this.loved = false
        this.recipe.love -= 1
        // do ajax stuff
      }
    }
  }
})

Vue.component('recipe-row', {
  template: '#recipe-row-tpl',
  props: {
    recipes: {
      type: Array,
      coerce: function (value) {
        return value.slice()
      }
    }
  },
  components: {
    recipeItem: RecipeItemComponent
  }
})

Vue.component('pagination', {
  template: '#pagination-tpl',
  props: ['prevUrl', 'nextUrl'],
  methods: {
    nextPage: function () {
      if (this.nextUrl) {
        this.$dispatch('recipes:next-page')
      }
    },
    prevPage: function () {
      if (this.prevPage) {
        this.$dispatch('recipes:prev-page')
      }
    }
  }
})

Vue.filter('date', function (value) {
  return moment(value).format('MMM D, YYYY - HH:mm').toString()
})

new Vue({
  el: 'body',
  data: {
    recipes: [],
    nextUrl: '',
    prevUrl: ''
  },
  created: function () {
    this.fetchRecipe()
  },
  methods: {
    fetchRecipe: function (url) {
      if (! url) {
        var url = 'http://resepku.eezhal92.com/api/v1/recipes'
      }

      var self = this

      if (localStorage.recipes) {
        self.$set('recipes', JSON.parse(localStorage.recipes))
      } else {
        $.get(url, {limit: 4}).then(function (response) {
          console.log(response)
          self.$set('recipes', response.data)
          self.nextUrl = response.next_page_url
          self.prevUrl = response.prev_page_url
          localStorage.recipes = JSON.stringify(response.data)
        })
      }
    }
  },
  components: {
    headerComp: HeaderComponent
  },
  events: {
    'recipes:next-page': function () {
      this.fetchRecipe(this.nextUrl)
    },
    'recipes:prev-page': function () {
      this.fetchRecipe(this.prevUrl)
    }
  }
})
