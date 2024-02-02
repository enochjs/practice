<template>
  <form @submit.prevent="handleSubmit">
    <label for="">Email:</label>
    <input type="email" required v-model="email" />

    <label for="">Password:</label>
    <input type="password" required v-model="password" />
    <div class="error" v-if="passwordError">{{ passwordError }}</div>

    <label for="">Role:</label>
    <select v-model="role">
      <option value="developer">WEB Developer</option>
      <option value="designer">WEB Designer</option>
    </select>


    <label for="">Skills:</label>
    <input type="text" required v-model="tempSkill" @keyup="addSkill" />

    <div v-for="(item, index) in skills" :key="item" class="pill">
      <span @click="deleteSkill(item)">{{ item }}</span>
    </div>


    <div class="terms">
      <input type="checkbox"  required  v-model="terms" />
      <label>I agree to the terms and conditions</label>
    </div>

    <div class="submit">
      <button>create an count</button>
    </div>
    
    <!-- <div>
      <input type="checkbox" value="shaun" v-model="names" />
      <label for="">Shaun</label>
    </div>
    <div>
      <input type="checkbox" value="yoshi" v-model="names" />
      <label for="">yoshi</label>
    </div>
    <div>
      <input type="checkbox" value="mario" v-model="names" />
      <label for="">mario</label>
    </div> -->
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: '',
      role: '',
      terms: false,
      tempSkill: '',
      skills: [],
      passwordError: '',
      // names: [],
    }
  },
  methods: {
    addSkill(e) {
      if (e.key === 'Enter') {
        if (this.skills.includes(this.tempSkill)) {
          return
        }
        this.skills.push(this.tempSkill);
        this.tempSkill = '';
      }
    },
    deleteSkill(skill) {
      this.skills = this.skills.filter(item => item !== skill);
    },
    handleSubmit() {
      // todo
      // console.log('====form submitted')

      // validate password
      this.passwordError = this.password.length > 5 ? '' : 'password must be at least 6 characters';
      // if (this.password.length < 6) {
      //   alert('password must be at least 6 characters');
      //   return;
      // }
      if (!this.passwordError) {
        // alert('form submitted');
        console.log('===', this.email, this.password, this.role, this.skills, this.terms)
      }

    }
  }

}

</script>

<style scoped>
form {
  max-width: 420px;
  margin: 30px auto;
  background: #fff;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

label {
  color: #aaa;
  display:  inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input, select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}

input[type="checkbox"] {
  display: inline-block ;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}
.pill {
  display: inline-block;
  margin: 20px 10px 0 0;
  padding: 6px 12px;
  background: #eee;
  border-radius: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color:  #777;
  cursor: pointer;
}
button {
  background: #0b6dff;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
}
.submit {
  text-align: center;
}
.error {
  color: #ff0062;
  margin-top: 10px;
  font-size: 0.8em;
  font-weight: bold;
}

</style>