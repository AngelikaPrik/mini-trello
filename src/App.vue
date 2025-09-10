<template>
  <Header :user="user" />
  <div v-if="user">
    <BoardPage />
  </div>
</template>

<script setup lang="ts">
import BoardPage from './pages/BoardPage.vue'
import { supabase } from '@/lib/supabase'
import { ref, onMounted } from 'vue'
import { Header } from '@/components/widgets'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
})
</script>
