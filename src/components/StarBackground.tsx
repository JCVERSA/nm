import { useState, useEffect } from "react";

export default function StarBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true" style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s ease" }}>
      <style>{`
        @keyframes animStar { from { transform: translateY(0); } to { transform: translateY(-2000px); } }
        @keyframes introFadeUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        .star-field { position:absolute; inset:0; background: radial-gradient(ellipse at bottom, #0f172a 0%, #020617 100%); overflow:hidden; }
        .star-field .stars-1 { position:absolute; width:1px; height:1px; background:transparent; animation:animStar 100s linear infinite; box-shadow:
          501px 811px rgba(255,255,255,0.4), 1450px 1324px rgba(255,255,255,0.4), 1093px 1780px rgba(255,255,255,0.4), 1469px 678px rgba(255,255,255,0.4), 904px 741px rgba(255,255,255,0.4), 1160px 781px rgba(255,255,255,0.4), 1841px 1962px rgba(255,255,255,0.4), 1630px 1667px rgba(255,255,255,0.4), 1788px 676px rgba(255,255,255,0.4), 367px 1734px rgba(255,255,255,0.4), 1343px 156px rgba(255,255,255,0.4), 1283px 1142px rgba(255,255,255,0.4), 1062px 378px rgba(255,255,255,0.4), 1395px 467px rgba(255,255,255,0.4), 1017px 1891px rgba(255,255,255,0.4), 137px 1114px rgba(255,255,255,0.4), 1767px 1403px rgba(255,255,255,0.4), 1543px 11px rgba(255,255,255,0.4), 1078px 181px rgba(255,255,255,0.4), 1189px 1574px rgba(255,255,255,0.4), 1697px 1551px rgba(255,255,255,0.4), 439px 472px rgba(255,255,255,0.4), 1491px 677px rgba(255,255,255,0.4), 1364px 599px rgba(255,255,255,0.4), 34px 382px rgba(255,255,255,0.4), 1221px 1584px rgba(255,255,255,0.4), 1266px 1499px rgba(255,255,255,0.4), 169px 1907px rgba(255,255,255,0.4), 1219px 1125px rgba(255,255,255,0.4), 659px 18px rgba(255,255,255,0.4), 1731px 1959px rgba(255,255,255,0.4), 332px 1216px rgba(255,255,255,0.4), 1913px 788px rgba(255,255,255,0.4), 80px 712px rgba(255,255,255,0.4), 326px 1605px rgba(255,255,255,0.4), 574px 1502px rgba(255,255,255,0.4), 473px 1653px rgba(255,255,255,0.4), 404px 975px rgba(255,255,255,0.4), 322px 1797px rgba(255,255,255,0.4), 425px 1321px rgba(255,255,255,0.4), 1121px 1797px rgba(255,255,255,0.4), 731px 647px rgba(255,255,255,0.4), 891px 1584px rgba(255,255,255,0.4), 1523px 109px rgba(255,255,255,0.4), 1379px 244px rgba(255,255,255,0.4), 865px 1064px rgba(255,255,255,0.4), 493px 956px rgba(255,255,255,0.4), 624px 1380px rgba(255,255,255,0.4), 440px 619px rgba(255,255,255,0.4), 1630px 767px rgba(255,255,255,0.4), 955px 1196px rgba(255,255,255,0.4), 62px 729px rgba(255,255,255,0.4), 126px 946px rgba(255,255,255,0.4), 1256px 896px rgba(255,255,255,0.4), 1444px 256px rgba(255,255,255,0.4), 661px 1628px rgba(255,255,255,0.4), 1078px 1716px rgba(255,255,255,0.4), 300px 737px rgba(255,255,255,0.4), 1734px 413px rgba(255,255,255,0.4), 1296px 129px rgba(255,255,255,0.4), 1771px 1678px rgba(255,255,255,0.4), 977px 1764px rgba(255,255,255,0.4), 1879px 549px rgba(255,255,255,0.4), 665px 1531px rgba(255,255,255,0.4), 89px 701px rgba(255,255,255,0.4), 1084px 1183px rgba(255,255,255,0.4), 1597px 1576px rgba(255,255,255,0.4), 1354px 1774px rgba(255,255,255,0.4), 554px 1471px rgba(255,255,255,0.4), 1469px 287px rgba(255,255,255,0.4), 887px 106px rgba(255,255,255,0.4), 1962px 766px rgba(255,255,255,0.4), 638px 805px rgba(255,255,255,0.4), 1651px 741px rgba(255,255,255,0.4), 1517px 1826px rgba(255,255,255,0.4), 24px 1152px rgba(255,255,255,0.4), 507px 558px rgba(255,255,255,0.4), 1262px 652px rgba(255,255,255,0.4), 246px 1048px rgba(255,255,255,0.4), 1077px 421px rgba(255,255,255,0.4), 1866px 1847px rgba(255,255,255,0.4), 1986px 1561px rgba(255,255,255,0.4), 704px 632px rgba(255,255,255,0.4), 1991px 1875px rgba(255,255,255,0.4), 1227px 395px rgba(255,255,255,0.4), 45px 1116px rgba(255,255,255,0.4);
      animation: animStar 100s linear infinite;
    }
    #title { position: absolute; top: 50%; left: 0; right: 0; color: #fbf5ff; text-align: center; font-family: "Inter", sans-serif; font-weight: 300; font-size: 2.2rem; letter-spacing: 0.35em; margin-top: -3rem; opacity: 0; animation: introFadeUp 1.2s ease-out forwards; }
    @keyframes introFadeUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
  `}</style>
      <div id="stars" className="absolute top-0 left-0 w-full h-full" aria-hidden="true" />
      <div id="stars2" className="absolute top-0 left-0 w-full h-1/2" aria-hidden="true" style={{ opacity: 0.6 }} />
      <div id="stars3" className="absolute top-0 left-0 w-full h-full" aria-hidden="true" style={{ opacity: 0.4 }} />
      <div id="title" className="absolute top-1/2 left-0 right-0 text-center pointer-events-none select-none">Nebula</div>
    </div>
  );
}
