const store = new Vuex.Store({
  state: {
    edition: false
  },
  mutations: {
    enable: state => state.edition = true,
    disable: state => state.edition = false
  }
})
new Vue({
  el: '#vue-app',
  computed: {
    edition() {
      return store.state.edition
    }
  },
  data: {
    products: [],
    currentProduct: '',
    message: ''
  },
  methods: {
    getData: function() {
      let xmlhttp = new XMLHttpRequest()
      let self = this
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          self.products = JSON.parse(this.responseText)
        }
      };
      xmlhttp.open("GET", "data.json", true)
      xmlhttp.setRequestHeader('Cache-Control', 'no-cache')
      xmlhttp.setRequestHeader("Content-type", "application/json")
      xmlhttp.send()
    },
    saveData: function() {
      let self = this
      return new Promise(function(resolve, reject) {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) resolve()
          else if (this.readyState == 4 && this.status != 200) reject()
        };
        xmlhttp.open("POST", "save.php", true)
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        let data = 'products=' + encodeURIComponent(JSON.stringify(self.products))
        xmlhttp.send(data)
      });
    },
    savingPromise: function() {
      this.message = "Saving in progress..."
      let self = this
      this.saveData().then(function(res) {
        self.message = "Data saved successfully!"
        self.disableEdition()
      }).catch(function(error) {
        self.message = "We're sorry. Save error occured."
      });
    },
    getProductFromURL: function() {
      let query = window.location.search.substring(1)
      let product = query.split('=')
      if (product[1] !== undefined) this.currentProduct = product[1]
    },
    enableEdition: function() {
      store.commit('enable')
      this.message = ''
    },
    disableEdition: function() {
      store.commit('disable')
      this.getData()
    }
  },
  created: function() {
    this.getData()
    this.getProductFromURL()
  }
})
