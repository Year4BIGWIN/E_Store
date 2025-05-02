import { ref, computed, onUnmounted } from 'vue';
import QRCode from "qrcode";

export default function usePayment(apiUrl, getAuthHeaders) {
  const paymentInfo = ref(null);
  const qrCode = ref(null);
  const md5Hash = ref(null);
  const transactionStatus = ref(null);
  
  const qrCodeExpirySeconds = ref(60);
  const remainingSeconds = ref(0);
  let countdownIntervalId = null;
  let intervalId = null;
  let timeoutId = null;
  
  const checkout = async () => {
    const headers = getAuthHeaders();
    if (!headers) return false;

    try {
      const res = await fetch(`${apiUrl}/order/checkout`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      
      if (res.ok && data.data?.qr) {
        paymentInfo.value = data.data;
        md5Hash.value = data.data.md5;
        transactionStatus.value = data.responseMessage;
        qrCode.value = await QRCode.toDataURL(data.data.qr);
        startTransactionPolling();
        startCountdownTimer();
        return true;
      } 
      return false;
    } catch (err) {
      console.error("Checkout error:", err);
      return false;
    }
  };

  const checkTransactionStatus = async () => {
    try {
      const res = await fetch(`${apiUrl}/order/confirm-payment?md5=${md5Hash.value}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        console.error(`Error: Received status ${res.status} from /confirm-payment`);
        transactionStatus.value = "Error checking transaction status";
        return;
      }

      const contentType = res.headers.get("Content-Type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      if (typeof data === "string") {
        if (data.toLowerCase() === "success") {
          transactionStatus.value = "Success";
          clearAllTimers();
          return true;
        } else if (data.toLowerCase() === "pending") {
          transactionStatus.value = "Pending";
        } else {
          transactionStatus.value = data || "Unknown status";
        }
      } else if (data.responseMessage?.toLowerCase() === "success") {
        transactionStatus.value = "Success";
        clearAllTimers();
        return true;
      } else if (data.responseMessage?.toLowerCase() === "pending") {
        transactionStatus.value = "Pending";
      } else {
        transactionStatus.value = data.responseMessage || "Unknown status";
      }
      return false;
    } catch (err) {
      console.error("Error checking transaction status:", err);
      transactionStatus.value = "Error checking transaction status";
      return false;
    }
  };

  const startTransactionPolling = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    intervalId = setInterval(checkTransactionStatus, 3000);
    timeoutId = setTimeout(() => clearInterval(intervalId), 60000);
  };

  const startCountdownTimer = () => {
    clearInterval(countdownIntervalId);
    remainingSeconds.value = qrCodeExpirySeconds.value;
    
    countdownIntervalId = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
      } else {
        clearInterval(countdownIntervalId);
      }
    }, 1000);
  };

  const clearAllTimers = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    clearInterval(countdownIntervalId);
  };

  onUnmounted(() => {
    clearAllTimers();
  });
  
  return {
    paymentInfo,
    qrCode,
    transactionStatus,
    remainingSeconds,
    formattedCountdown: computed(() => {
      const minutes = Math.floor(remainingSeconds.value / 60);
      const seconds = (remainingSeconds.value % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }),
    countdownColorClass: computed(() => {
      if (remainingSeconds.value < 10) return 'text-red-600';
      if (remainingSeconds.value < 30) return 'text-orange-500';
      return 'text-blue-600';
    }),
    isQrExpired: computed(() => 
      remainingSeconds.value <= 0 && transactionStatus.value !== 'Success'
    ),
    isTransactionSuccess: computed(() => 
      transactionStatus.value === 'Success'
    ),
    checkout,
    restartPaymentProcess: async () => {
      qrCode.value = null;
      paymentInfo.value = null;
      md5Hash.value = null;
      transactionStatus.value = null;
      
      return checkout();
    }
  };
}