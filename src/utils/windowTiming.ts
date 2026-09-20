/**
 * Har hafta dushanba kuni soat 09:00 dan 19:00 gacha bo'lgan VIP API kiritish oynasi hisob-kitoblari.
 */

export interface WindowStatus {
  isOpen: boolean;
  message: string;
  remainingTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  formattedTime: string;
  nextEventDate: Date;
}

export function checkApiWindowStatus(testOpenOverride = false): WindowStatus {
  const now = new Date();

  // Agar test/sinov rejimi yoqilgan bo'lsa
  if (testOpenOverride) {
    return {
      isOpen: true,
      message: "VIP Oyna OCHIQ (Sinov rejimi faol)",
      remainingTime: { days: 0, hours: 8, minutes: 45, seconds: 12 },
      formattedTime: "08:45:12",
      nextEventDate: new Date(now.getTime() + 8 * 3600 * 1000),
    };
  }

  const dayOfWeek = now.getDay(); // 0 = Yakshanba, 1 = Dushanba, ..., 6 = Shanba
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const isMonday = dayOfWeek === 1;
  const isTimeInRange = hours >= 9 && hours < 19;

  if (isMonday && isTimeInRange) {
    // Dushanba 09:00 - 19:00 oralig'ida - Oyna OCHIQ!
    const closeTime = new Date(now);
    closeTime.setHours(19, 0, 0, 0);

    const diffMs = Math.max(0, closeTime.getTime() - now.getTime());
    const totalSecs = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    return {
      isOpen: true,
      message: "VIP Oyna OCHIQ! Dushanba 19:00 gacha shaxsiy kalitingizni ulab oling!",
      remainingTime: { days: 0, hours: h, minutes: m, seconds: s },
      formattedTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      nextEventDate: closeTime,
    };
  }

  // Oyna YOPIQ - keyingi Dushanba soat 09:00 ga qadar qolgan vaqtni hisoblaymiz
  const nextMonday = new Date(now);
  let daysUntilMonday = (1 - dayOfWeek + 7) % 7;

  // Agar bugun dushanba lekin soat 19:00 dan o'tgan bo'lsa, keyingi haftadagi dushanba
  if (dayOfWeek === 1 && hours >= 19) {
    daysUntilMonday = 7;
  } else if (dayOfWeek === 1 && hours < 9) {
    daysUntilMonday = 0; // Bugun soat 09:00 da ochiladi
  }

  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0);

  const diffMs = Math.max(0, nextMonday.getTime() - now.getTime());
  const totalSecs = Math.floor(diffMs / 1000);

  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;

  const formatted = `${d > 0 ? `${d} kun ` : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return {
    isOpen: false,
    message: "VIP Oyna yopiq. Har dushanba soat 09:00 dan 19:00 gacha ochiladi!",
    remainingTime: { days: d, hours: h, minutes: m, seconds: s },
    formattedTime: formatted,
    nextEventDate: nextMonday,
  };
}
