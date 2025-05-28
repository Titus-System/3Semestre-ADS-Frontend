// "use client";

// import { useEffect, useRef, useState } from "react";
// import NET from "vanta/dist/vanta.net.min";
// import * as THREE from "three";

// export default function WaveSection() {
//   const vantaRef = useRef<HTMLDivElement>(null);
//   const [vantaEffect, setVantaEffect] = useState<any>(null);

//   useEffect(() => {
//     if (!vantaEffect && vantaRef.current) {
//       setVantaEffect(
//         NET({
//           el: vantaRef.current,
//           THREE,
//           color: 0xd72c38, // Vermelho
//           backgroundColor: 0x0e0e10,
//           points: 20.0,
//           maxDistance: 25.0,
//           spacing: 18.0,
//           showDots: true,
//           mouseControls: true,
//           touchControls: true,
//           gyroControls: false,
//         })
//       );
//     }

//     return () => {
//       if (vantaEffect) vantaEffect.destroy();
//     };
//   }, [vantaEffect]);

//   return (
//     <div
//       ref={vantaRef}
//       className="relative w-full h-[400px] z-0"
//     >
//       {/* Se quiser adicionar conteúdo centralizado sobre a animação, insira aqui */}
//     </div>
//   );
// }
