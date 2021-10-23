<template>
  <div>
    <div class="form">
      <div class="fullName">
        <label for="fullname" class="mt-3">Ф.И.О.</label>
        <input 
          id="fullname" 
          type="text"
          class="form-control" 
          v-model.trim="fullname" 
          :class="{ 'border-danger': fullNameError.error }">
        <span v-if="fullNameError.error" class="error">{{fullNameError.message}}</span>
      </div>  
      <div class="address">
        <label for="address" class="mt-3">Адрес</label>
        <b-form-input 
          list="address" 
          v-model.trim="address" 
          :class="{ 'border-danger': addressError.error }">
        </b-form-input>
        <datalist id="address">
          <option 
            v-for="(dadataSuggestion, index) in dadataSuggestions" 
            :key="index">
            {{ dadataSuggestion.value }}
          </option>
        </datalist>
        <span v-if="addressError.error" class="error">{{addressError.message}}</span>    
      </div>    
      <div class="datePicker">
        <label class="mt-3" for="datepicker">Дата записи</label>
        <b-form-datepicker
          id="datepicker"
          v-model="date"
          size="sm"
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          locale="ru"
          :state="dateValid"
          label-no-date-selected="Дата не выбрана"
          :min="new Date()" 
          :max="max"
        ></b-form-datepicker>
        <span v-if="dateError.error" class="error">{{dateError.message}}</span>
      </div>
      <button type="button" class="btn btn-danger form-control mt-5" @click="apply">Записаться</button>
    </div>    
  </div>
</template>

<script>
import dadataStyle from '@/styles/dadata.scss'
import { mapActions, mapMutations, mapState } from 'vuex'
import { debounce } from 'lodash'

export default {
  name: 'Home',
  data(){
    return {      
      fullname: '',
      date: '',
      address: '',
      dadataStyle: dadataStyle,  
      fullNameError: {
        error: false,
        message: ''
      },
      dateValid: null,
      dateError: {
        error: false,
        message: ''
      },
      addressError: {
        error: false,
        message: ''
      }      
    }
  },
  created(){
    this.debouncedGetDadata = debounce(this.getDadataSuggestion, 1000)
  },
  computed: {
    ...mapState([
      'dadataSuggestions'
    ]),
    max(){
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + 14)
      return maxDate
    }
  },
  methods: {
    ...mapActions([
      'getDadataSuggestion'
    ]),
    ...mapMutations([
      'SET_DATE',
      'SET_FULLNAME'
    ]),
    apply(){            
      if(!this.validate()) return
      this.$router.push('result')
    },
    validate(){
      let result = true

      if(!this.fullname || this.fullname.split(' ').length < 3){
        this.fullNameError.error = true
        this.fullNameError.message = 'Введите Ф.И.О.'        
        result = false
      }

      if(!this.address){
        this.addressError.error = true
        this.addressError.message = 'Введите адрес'
        result = false
      }

      if(!this.date){
        this.dateError.error = true
        this.dateError.message = 'Дата не выбрана'
        this.dateValid = false
        result = false
      }

      return result
    }
  },
  watch: {
    fullname(value){
      if(value && value.split(' ').length >= 3) {
        this.fullNameError.error = false
        this.fullNameError.message = ''
        this.SET_FULLNAME(value)
      }
    },  
    date(value){
      if(value){
        this.dateError.error = false
        this.dateError.message = ''
        this.dateValid = null
        this.SET_DATE(value)
      }      
    },
    address(value){
      if(value){
        this.addressError.error = false
        this.addressError.message = ''
        this.debouncedGetDadata(this.address)
      }
    }
  }
}
</script>
<style scoped>
  .form{
    margin: 0 auto;
    width: 50%;
  }
  .error {
    color: #EE2B45;
    display: block;
  }
  .border-danger{
    border-color: #EE2B45;
  }
</style>