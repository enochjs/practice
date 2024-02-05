<template>
  <div>
    home
  </div>
  <p ref="p"> My name is {{  ninjaOne.name }} and my age is {{ ninjaOne.age }} - {{ nameOne }}</p>
  <button @click="handleClick">click me</button>
  <button @click="updateNinjaOne">update ninja one</button>
  
  <h2>reactive</h2>
  <p>
    {{  ninjaTwo.name }} - {{ ninjaTwo.age }}- {{ nameTwo }}
  </p>
  <button @click="updateNinjaTwo">update ninja two</button>
  <h2>=========================</h2>
  <input type="text" v-model="search" />
  <p>search term - {{ search }}</p>
  <div v-for="name in matchingNames" :key="name">
    {{ name }}
  </div>
  <h2>========================</h2>
  
  <button @click="showPosts = !showPosts">toggle posts</button>
  <button @click="postList.pop()">delete a post</button>
  <p v-if="error">{{ error }}</p>
  <div v-if="postList.length">
    <PostList v-if="showPosts" :posts="postList" />
  </div>
  <div v-else>Loading...</div>
</template>

<script>
  import PostList from '@/components/PostList.vue'
  import getPosts from "../composables/getPosts";
  import { computed, reactive, ref, watch, watchEffect } from 'vue'
  export default {
    name: 'Home',
    components: {
      PostList,
    },  
    setup() {
        const p = ref(null);
        const ninjaOne = ref({
            name: 'mario',
            age: 30,
        });
        const ninjaTwo = reactive({
            name: 'yoshi',
            age: 25
        });
        const handleClick = () => {
            ninjaOne.value.name = 'luigi';
        };
        const updateNinjaOne = () => {
            ninjaOne.value.name = 'luigi';
            ninjaOne.value.age = 40;
            nameOne.value = 'fenghe';
        };
        const updateNinjaTwo = () => {
            ninjaTwo.name = 'luigi';
            ninjaTwo.age = 40;
            nameTwo = 'fenghe';
        };
        const nameOne = ref('mario');
        // not work with premite value 
        const nameTwo = reactive('luigi');
        // ===================== //
        const search = ref('');
        const names = ref(['mario', 'luigi', 'yoshi', 'toad', 'peach', 'bowser', 'shaun']);
        const stopWatch = watch(search, () => {
            console.log(search.value);
        });
        const stopEffect = watchEffect(() => {
            console.log('watch effect function ran', search);
        });
        const matchingNames = computed(() => {
            return names.value.filter(name => {
                return name.includes(search.value);
            });
        });
        // =======================// 
        const showPosts = ref(true)

        // const postList = ref([
        //     // { id: 1, title: 'post one', body: 'this is post one' },
        //     // { id: 2, title: 'post two', body: 'this is post two' },
        //     // { id: 3, title: 'post three', body: 'this is post three' },
        // ])
        // const error = ref(null)
        // // ==================== //
        // onMounted(() => {
        //     console.log('mounted');
        // })
        // const load = async () => {
        //     try {
        //         const res = await fetch('http://localhost:3000/posts')
        //         if (!res.ok) {
        //             throw Error('no data available')
        //         }
        //         const data = await res.json()
        //         postList.value = data
        //     } catch (err) {
        //       error.value = err.message
        //     }
        // }
        // load()
        const { posts: postList, error, load  } = getPosts()
        load()
        return {
            handleClick,
            p,
            ninjaOne,
            ninjaTwo,
            updateNinjaOne,
            updateNinjaTwo,
            nameOne,
            nameTwo,
            names,
            search,
            matchingNames,
            postList,
            showPosts,
            error,
        };
    },
    components: { PostList }
}
</script>

<style scoped>

</style>