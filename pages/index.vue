<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-800">クリッカーゲーム</h1>

    <button
      @click="handleClick"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-2xl transform transition-transform duration-150 active:scale-95 mb-6"
    >
      クリック！
    </button>

    <p class="text-2xl mb-4">所持金: <span class="font-semibold text-green-600">{{ formattedScore }}</span></p>

    <div class="flex gap-4">
      <button
        @click="buyAutoClicker"
        :disabled="score < autoClickerPrice"
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md text-xl transition-colors duration-200"
        :class="{ 'opacity-50 cursor-not-allowed': score < autoClickerPrice }"
      >
        自動収益購入（価格: <span class="font-semibold">{{ autoClickerPrice }}</span>）
      </button>

      <button
        @click="buyAutoClicker10"
        :disabled="score < autoClickerPrice10"
        class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-0.5 px-1.5 rounded-lg shadow-md text-base transition-colors duration-200 w-32 h-16 flex flex-col items-center justify-center"
        :class="{
          'grayscale opacity-50 cursor-not-allowed': score < autoClickerPrice10
        }"
      >
        ×10購入（価格: <span class="font-semibold">{{ autoClickerPrice10 }}</span>）
      </button>
    </div>

    <p class="text-xl mt-4">購入済み: <span class="font-semibold">{{ autoClickerCount }}</span> 個</p>
    <p class="text-xl">1秒あたりの収益: <span class="font-semibold text-blue-700">{{ incomePerSecond }}</span></p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const score = ref(0);
const autoClickerCount = ref(0);
const autoClickerPrice = ref(1);
const incomePerSecond = ref(0);
const incomeValue = ref(1); // 自動収益1つあたりの基本収益

let intervalId = null;

// スコアを見やすくフォーマット
const formattedScore = computed(() => {
  return score.value.toLocaleString();
});

// 10個分の価格を計算（累積価格：等比数列の和）
const autoClickerPrice10 = computed(() => {
  let total = 0;
  let price = autoClickerPrice.value;
  for (let i = 0; i < 10; i++) {
    total += price;
    price = Math.ceil(price * 1.1);
  }
  return total;
});

// クリックイベントハンドラ
const handleClick = () => {
  score.value += 100; // クリックで100増加
};

// 自動収益購入イベントハンドラ（1個）
const buyAutoClicker = () => {
  if (score.value >= autoClickerPrice.value) {
    score.value -= autoClickerPrice.value;
    autoClickerCount.value++;
    incomeValue.value = Math.ceil(incomeValue.value * 1.05); // 自動収益1つあたりの価値を増加
    incomePerSecond.value += incomeValue.value; // 毎秒の収益に加算
    autoClickerPrice.value = Math.ceil(autoClickerPrice.value * 1.1); // 価格を1.1倍に
  }
};

// 自動収益購入イベントハンドラ（10個）
const buyAutoClicker10 = () => {
  if (score.value >= autoClickerPrice10.value) {
    let price = autoClickerPrice.value;
    let totalIncome = 0;
    let newIncomeValue = incomeValue.value;
    for (let i = 0; i < 10; i++) {
      score.value -= price;
      autoClickerCount.value++;
      newIncomeValue = Math.ceil(newIncomeValue * 1.05);
      totalIncome += newIncomeValue;
      price = Math.ceil(price * 1.1);
    }
    incomeValue.value = newIncomeValue;
    incomePerSecond.value += totalIncome;
    autoClickerPrice.value = price;
  }
};

// 1秒ごとに収益を加算するロジック
onMounted(() => {
  intervalId = setInterval(() => {
    score.value += incomePerSecond.value;
  }, 1000);
});

// コンポーネントがアンマウントされるときにインターバルをクリア
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>