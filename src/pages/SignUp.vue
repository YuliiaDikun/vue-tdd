<template>
  <div class="max-w-7lx mx-auto px-5 pt-10 text-white">
    <h1 class="text-white text-center mb-6">Sign Up</h1>
    <form action="" class="flex flex-col items-center max-w-[500px] gap-5 justify-center">
      <label for="username">Username</label>
      <input
        id="username"
        data-test="username"
        type="text"
        placeholder="username"
      />

      <label for="email">E-mail</label>
      <input id="email" data-test="email" type="text" placeholder="e-mail" />

      <label for="password">password</label>
      <input
        id="password"
        data-test="password"
        type="password"
        placeholder="password"
      />

      <label for="password-repeat">password repeat</label>
      <input
        id="password-repeat"
        data-test="password-repeat"
        type="password"
        placeholder="password repeat"
      />

      <button class="min-w-[150px] h-[47px] flex items-center justify-center border rounded-sm mx-auto mt-6 disabled:bg-slate-600" type="submit" disabled="disabled">Sign Up</button>
    </form>
  </div>
</template>
<script></script>
