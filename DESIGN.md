# 🎨 StreakClash — Design System & UI/UX Specification Guide (DESIGN.md)

> **Loyiha:** StreakClash (Social Habit Battles & Consistency Tracker)  
> **Versiya:** 2.0 (Production-Ready)  
> **Estetika:** Dark OLED Luxury + Cyberpunk Neon Glassmorphism + Apple iOS 18 Standartlari  

Ushbu hujjat **StreakClash** ilovasining to'liq dizayn tizimi, ranglar palitrasi, tipografiya, komponentlar anatomiyasi, mikro-interaksiyalar va Stitch/Figma ko'rsatmalarini o'z ichiga oladi.

---

## 🌌 1. Dizayn Falsafasi va Emotsional Joylashuv (Brand Identity)

* **Asosiy Falsafa:** Odatlarni zerikarli yolg'iz kundalikdan — do'stlar bilan 1v1 streak raqobatida o'ynaladigan, dofaminga boy va ijtimoiy tarmoqlarda maqtanishga arzigulik o'yinga aylantirish.
* **Vizual Tili:** 
  - **OLED Pure Black (#030406):** Ko'zni charchatmaydigan, batareyani tejaydigan chuqur qora fon.
  - **Glassmorphism:** Nozik shishasimon qatlamlar (`backdrop-blur-24px`, `1px` oq nurli chegaralar).
  - **Jewel-Toned Neon:** Qimmatbaho toshlardek porlovchi yorqin neon urg'ular (Zanjir va Kataklar uchun).

---

## 🎨 2. Ranglar Tizimi va Dizayn Tokenlari (Color Palette)

### Asosiy Fon va Sirt Ranglari (Surfaces)
| Token Nomi | Hex Kodi | Vazifasi / Qo'llanilishi |
| :--- | :--- | :--- |
| `bg-app` | `#030406` | Eng asosiy OLED qora fon |
| `surface-glass` | `rgba(14, 16, 23, 0.75)` | Shishasimon asosiy kartochkalar (Blur: 20px) |
| `surface-dock` | `rgba(10, 12, 18, 0.85)` | Pastki suzuvchi iOS Dock paneli |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Kartochkalarning 1px nozik chegaralari |
| `border-highlight`| `rgba(255, 255, 255, 0.16)` | Hover yoki aktiv holatdagi chegara |

### Neon Urg'u Ranglari (Jewel Accents)
| Rang Nomi | Hex Kodi | Ma'nosi / Qo'llanilishi |
| :--- | :--- | :--- |
| **Electric Violet** | `#8b5cf6` | Bosh brend rangi, faol navigatsiya, zanjir nurlari |
| **Neon Emerald** | `#10b981` | Salomatlik va sport odatlari, bajarilganlik nishoni |
| **Cyber Cyan** | `#06b6d4` | Kod yozish, chuqur ish (Deep work), intizom |
| **Blaze Orange** | `#f97316` | Olovli zanjir (Flame streak), ogohlantirishlar |
| **Gold Royalty** | `#f59e0b` | VIP Crown, yutuqlar, 1-o'rin |
| **Clash Crimson** | `#ef4444` | 1v1 Duellar, raqobat tugmalari |

---

## 🔤 3. Tipografiya Qoidalari (Typography)

* **Asosiy Shrift (UI & Sarlavhalar):** `Plus Jakarta Sans` yoki `SF Pro Display`
* **Hisoblagichlar & Raqamlar (Data & Monospace):** `JetBrains Mono`

| Pog'ona | O'lcham | Og'irlik (Weight) | Ishlatilish Joyi |
| :--- | :--- | :--- | :--- |
| **Display Hero** | `32px - 40px` | Black (900) | Flex Card ulkan streak raqami ("21") |
| **Screen Title (H1)** | `20px - 22px` | ExtraBold (800) | Ekran sarlavhalari ("StreakClash", "Clash Arena") |
| **Card Heading (H2)** | `15px - 16px` | Bold (700) | Odat nomlari, Duel sarlavhasi |
| **Body Regular** | `13px - 14px` | Medium (500) | Tavsiflar, tushuntirish matnlari |
| **Data / Numbers** | `11px - 13px` | Mono Bold (700) | Streak kunlari (`🔥 19 kun`), XP (`1,450 XP`) |
| **Micro Caption** | `10px - 11px` | SemiBold (600) | Kategoriyalar, vaqtlar, teglar |

---

## 🧩 4. Asosiy Komponentlar Anatomiyasi

### A. Odat Kartochkasi (Habit Card)
* **Konteyner:** `glass-panel` (burchak radiusi `16px`, chetlarida odat rangiga mos neon chiziq).
* **Boshqaruv tugmasi:** Katta `44x44px` aylana tugma (bosilganda o'z rangida neon yonadi).
* **Haftalik Mini-Grid:** Kartochkaning o'ng qismida faqat **so'nggi 7 kunlik kapsulalar** (katta xaritani ochish uchun kartochkaning ustiga bosiladi).
* **Streak Pill:** Olov ikonasi bilan joriy ketma-ketlik.

### B. Discrete Heatmap Grid (Katakchalar Xaritasi)
* **Katak o'lchami:** `13px × 13px`.
* **Burchak radiusi:** `3px` (mukammal qirrali kvadrat).
* **Bo'shliq (Gap):** `5px`.
* **Bajarilmagan kun:** `#13151f` (xira qora).
* **Bajarilgan kun:** Odat rangidagi yorqin to'liq kvadrat + `box-shadow: 0 0 10px [color]99`.
* **Bugungi kun:** `1px solid #ffffff` oq ramka.

### C. 1v1 Clash Arena Jang Kartochkasi
* **Chap qism:** Sizning profilingiz, olovli streak va "Bugun bajarildi ✓" yashil nuri.
* **Markaz:** 3D metallik yorug'lik taratuvchi **"VS"** nishoni.
* **O'ng qism:** Raqibingiz profilingiz, olovli streak va "Kutilmoqda ⏳" ogohlantirishi.
* **Progress:** Marafon davomiyligi chizig'i `kun / targetDays` ko'rsatkichi bilan.

### D. Floating Bottom Navigation Dock (Pastki Suzuvchi Panel)
* **O'lchami:** Kengligi `360px`, bo'yi `56px`, radiusi `9999px` (to'liq oval kapsula).
* **Effekt:** `backdrop-filter: blur(24px)`, `box-shadow: 0 20px 50px rgba(0,0,0,0.9)`.
* **Faol tugma:** Silliq gradient pill foni bilan ajralib turadi.

### E. Viral Flex Story Poster (9:16 — 1080x1920)
* **Format:** Instagram Story va Telegram statuslari uchun to'liq ekran.
* **Markaziy qahramon:** Ulkan 3D metallik streak raqami ("21").
* **Isbot:** 11 haftalik to'liq yashil/binafsha kataklar xaritasi.
* **Brending Watermark:** Pastki qismda `clash.app/@username` va `Powered by StreakClash`.

### F. Paywall — "7-Day Risk-Free Timeline"
* **Klassik SaaS narxnomasi emas!**
* **Vaqt chizig'i:**
  - *Day 0 (Bugun):* Cheksiz odat va duellar — $0.00.
  - *Day 5:* Trial tugashidan oldin eslatma xati yuboriladi.
  - *Day 7:* 60% chegirmali yillik obuna boshlanadi (istalgan vaqt 1 bosishda bekor qilinadi).

---

## 🎵 5. Ovozlar va Mikro-interaksiyalar (Dopamine Engine)

1. **Check-in Chime:** Foydalanuvchi odatni bajarganda Web Audio API orqali `C5 -> G5 (523Hz -> 784Hz)` toza synthesizer qo'ng'irog'i yangraydi.
2. **Milestone Fanfare:** 7, 14, 21 yoki 30 kunlik zanjirga yetganda 4 akkordli bayramona yutuq ovozi va konfeti portlashi.
3. **Streak Freeze Qalqoni:** Agar foydalanuvchi odatni bajarmay qoldirsa, animatsiyali qalqon chiqib zanjirni "muzlatadi" va uzilishdan asraydi.

---

## 📋 6. Stitch / Figma Promptlar Indeksi

Barcha ekranlarning to'liq yangilangan, xatolarsiz promptlari:
* **Dashboard:** [stitch_v2_master_prompts.md#1-ekran-onboarding--welcome-screen](file:///C:/Users/ASUS/.gemini/antigravity/brain/f5c27de6-fbf0-4161-87f0-ff47561967e1/stitch_v2_master_prompts.md)
* **1v1 Clash Arena:** [stitch_v2_master_prompts.md#3-ekran-1v1-clash-arena-jang-maydoni](file:///C:/Users/ASUS/.gemini/antigravity/brain/f5c27de6-fbf0-4161-87f0-ff47561967e1/stitch_v2_master_prompts.md)
* **Viral Flex Poster:** [stitch_v2_master_prompts.md#4-ekran-viral-flex-story-poster-instagram-story-916](file:///C:/Users/ASUS/.gemini/antigravity/brain/f5c27de6-fbf0-4161-87f0-ff47561967e1/stitch_v2_master_prompts.md)
* **PRO Paywall Timeline:** [stitch_v2_master_prompts.md#5-ekran-yuqori-konversiyali-pro-paywall-risk-free](file:///C:/Users/ASUS/.gemini/antigravity/brain/f5c27de6-fbf0-4161-87f0-ff47561967e1/stitch_v2_master_prompts.md)

---
*Ushbu hujjat loyihaning har qanday dizayneri, dasturchisi yoki sun'iy intellekti uchun yagona qonuniy dizayn standarti hisoblanadi.*
