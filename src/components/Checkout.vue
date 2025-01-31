<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">Generate KHQR</h1>
    <div class="border rounded-lg w-96 h-96 p-3">
      <button
        class="bg-yellow-400 text-black py-2 px-6 rounded-full hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105"
        @click="handleCheckout"
      >
        Generate QR Code
      </button>
      <!-- Show QR -->
      <qrcode-vue
        v-if="qrCode"
        :value="qrCode"
        :size="size"
        level="H"
        render-as="svg"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { KHQR, CURRENCY, COUNTRY, TAG } from "ts-khqr";
import QrcodeVue from "qrcode.vue";

const qrCode = ref("");
const size = ref(256);

const handleCheckout = async () => {
  try {
    const result = KHQR.generate({
      tag: TAG.INDIVIDUAL, // TAG.MERCHANT
      accountID: "sunneng_sen@aclb",
      merchantName: "Sunneng Sen",
      merchantID: "012345678",
      acquiringBank: "Dev Bank",
      merchantCity: "Phnom Penh",
      currency: CURRENCY.KHR,
      amount: 100,
      countryCode: COUNTRY.KH,
      additionalData: {
        mobileNumber: "855978531358",
        billNumber: "INV-2022-12-25",
        storeLabel: "Ishin Shop",
        terminalLabel: "012345",
        purposeOfTransaction: "Payment",
      },
      languageData: {
        languagePreference: "ZH",
        merchantNameAlternateLanguage: "文山",
        merchantCityAlternateLanguage: "金边",
      },
      upiMerchantAccount: "",
    });

    qrCode.value = result.data.qr;
  } catch (error) {
    console.error("Error generating QR:", error);
  }
};
</script>

<style>
/* Add custom styles here if needed */
</style>
