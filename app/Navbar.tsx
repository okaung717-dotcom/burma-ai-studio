"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, Globe, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageContext";

const translations = {
  EN: { home: "Home", services: "Services", portfolio: "Portfolio", contact: "Contact", message: "Message Us", langText: "English", dark: "Dark Mode", light: "Light Mode" },
  MM: { home: "ပင်မစာမျက်နှာ", services: "ဝန်ဆောင်မှုများ", portfolio: "လက်ရာများ", contact: "ဆက်သွယ်ရန်", message: "စကားပြောရန်", langText: "မြန်မာ", dark: "အမှောင်စနစ်", light: "အလင်းစနစ်" }
} as const;

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  return (
    <nav className="relative py-6 px-4 md:px-12 lg:px-24 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center">
        
        {/* Logo (SVG Code) */}
        <Link href="/" className="flex items-center">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" className="h-12 w-auto dark:brightness-[1.2]" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="Gradient1" gradientUnits="userSpaceOnUse" x1="1127.68" y1="1015.71" x2="1119.45" y2="1005.66">
                    <stop className="stop0" offset="0" stopOpacity="1" stopColor="rgb(144,21,30)"/>
                    <stop className="stop1" offset="1" stopOpacity="1" stopColor="rgb(157,72,67)"/>
                </linearGradient>
            </defs>
            <path transform="translate(0,0)" fill="rgb(148,30,37)" d="M 1049.69 710.73 L 1050.61 709.134 C 1054.68 708.005 1055.9 707.62 1063.88 709.129 C 1067.54 726.748 1073.46 737.956 1079.78 754.597 C 1081.87 760.106 1078.95 769.075 1080.61 773.383 C 1083.25 774.116 1084.63 774.42 1087.33 774.87 C 1089.25 777.919 1082.34 793.612 1081.23 799.569 C 1083.79 806.213 1090.89 820.939 1092.07 826.065 C 1089.2 829.848 1088.45 830.63 1089.56 835.605 C 1095.21 860.909 1114.65 877.152 1127.08 898.475 C 1132.25 907.573 1134.43 931.858 1138.84 945.234 C 1151.35 936.156 1156.96 931.413 1167.35 920.02 C 1167.64 944.978 1170.34 973.48 1160.94 996.33 C 1188.67 984.142 1206.84 983.864 1234.66 996.786 C 1220.22 1001.63 1211.72 1007.56 1201.28 1018.7 C 1173.52 1048.32 1147.48 1048.59 1109.04 1046.7 C 1107.77 1043.9 1104.79 1036.76 1103.41 1034.43 C 1107.59 1032.33 1107.13 1031.7 1110.94 1032.17 C 1118.72 1031.76 1129.23 1024.95 1134.61 1019.64 C 1157.88 996.613 1157.05 974.313 1157.6 944.333 C 1141.9 956.487 1106.1 971.911 1102.86 990.152 C 1101.08 1000.14 1101.97 1008.41 1098.48 1022.23 C 1094.79 1011.91 1092.22 999.903 1088.51 990.166 C 1082.71 974.905 1067.6 957.861 1057.23 944.47 C 1034.48 972.898 1014.81 988.705 1026.41 1028.19 L 1019.04 1047.16 C 992.403 1046.78 974.904 1044.59 954.175 1063.91 C 966.951 1063.77 978.426 1067.42 991.144 1067.42 C 997.214 1067.42 1005.42 1062.69 1010.51 1066.04 C 1013.45 1082.98 963.29 1073.21 953.987 1073.39 C 946.7 1073.53 942.623 1074.34 935.522 1075.93 C 943.339 1061.6 948.256 1054.07 963.047 1046.12 C 912.718 1036.68 918.586 1010.49 879.268 996.777 C 905.976 984.648 925.823 983.843 952.664 996.015 C 944.114 969.98 947.1 946.89 946.936 919.535 C 955.737 930.033 964.185 937.063 975.114 945.164 C 979.803 930.686 981.374 909.855 988.122 897.029 C 994.786 884.362 1034.39 841.963 1022.3 827.179 L 1021.74 826.499 C 1023.02 821.724 1030.05 808.097 1032.75 801.06 C 1032.09 795.22 1025.85 776.813 1026.3 774.938 C 1028.82 774.341 1030.79 773.992 1033.33 773.561 C 1034.88 768.517 1031.47 761.891 1033.38 756.526 C 1039.85 738.347 1045.88 730.164 1049.69 710.73 z"/>
          </svg>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.home}</Link>
          <Link href="/services" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.services}</Link>
          <Link href="/portfolio" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.portfolio}</Link>
          <Link href="/contact" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.contact}</Link>
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="hidden md:flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-[#00C2FF] transition-colors px-2">
            <Globe className="w-4 h-4" /> {lang}
          </button>
          <button onClick={toggleTheme} className="hidden md:block text-gray-500 dark:text-gray-300 hover:text-[#00C2FF]">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/contact" className="hidden md:inline-flex bg-[#00C2FF] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors whitespace-nowrap">
            {t.message}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="block md:hidden text-gray-900 dark:text-white focus:outline-none">
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (စနစ်တကျ ပြန်လည်ဖြည့်စွက်ထားပါသည်) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-2xl border-t border-gray-100 dark:border-gray-900 md:hidden flex flex-col px-6 py-8 z-[100]">
          <div className="flex flex-col gap-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.home}</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.services}</Link>
            <Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.portfolio}</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.contact}</Link>
          </div>

          <div className="flex flex-col items-start gap-6 pt-6 mt-6 border-t border-gray-100 dark:border-gray-900">
            {/* Mobile Language Trigger */}
            <button onClick={() => { toggleLang(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-bold text-gray-900 dark:text-white text-base w-full hover:text-[#00C2FF] transition-colors">
              <Globe className="w-5 h-5 text-[#00C2FF]" /> {t.langText} ({lang})
            </button>
            
            {/* Mobile Theme Trigger */}
            <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-bold text-gray-900 dark:text-white text-base w-full hover:text-[#00C2FF] transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5 text-[#00C2FF]" /> : <Moon className="w-5 h-5 text-[#00C2FF]" />}
              {theme === "dark" ? t.light : t.dark}
            </button>
            
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex justify-center items-center bg-[#00C2FF] text-white px-5 py-3 rounded-xl font-bold text-sm w-full shadow-md hover:bg-blue-600 transition-colors">
              {t.message}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}