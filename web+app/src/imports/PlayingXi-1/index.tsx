import svgPaths from "./svg-udxo4mu28o";
import img580B57Fcd9996E24Bc43C4E11 from "./32a3c0649e0c9c5fcab667fc4b0e3e5ab40d86e0.png";
import img580B57Fcd9996E24Bc43C4E71 from "./29a00d887b70ab624fe541b4433ff7143258d3dc.png";

function Clock() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['SF_Pro_Display:Medium',sans-serif] items-center leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap" data-name="clock">
      <p className="relative shrink-0">9</p>
      <p className="relative shrink-0">:</p>
      <p className="relative shrink-0">41</p>
    </div>
  );
}

function Icons() {
  return (
    <div className="content-stretch flex gap-[8.5px] items-center justify-end relative shrink-0" data-name="Icons">
      <div className="h-[10px] relative shrink-0 w-[18px]" data-name="Cellular Signal">
        <div className="absolute inset-[60%_83.33%_0_0]" data-name="Bar 1">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 4">
            <path d={svgPaths.p17f47800} fill="var(--fill-0, #150000)" id="Bar 1" />
          </svg>
        </div>
        <div className="absolute inset-[40%_55.56%_0_27.78%]" data-name="Bar 2">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 6">
            <path d={svgPaths.p18ec7000} fill="var(--fill-0, #150000)" id="Bar 2" />
          </svg>
        </div>
        <div className="absolute inset-[20%_27.78%_0_55.56%]" data-name="Bar 3">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 8">
            <path d={svgPaths.p2ffd5e80} fill="var(--fill-0, #150000)" id="Bar 3" />
          </svg>
        </div>
        <div className="absolute inset-[0_0_0_83.33%]" data-name="Bar 4">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 10">
            <path d={svgPaths.p1cde4f80} fill="var(--fill-0, #150000)" id="Bar 4" />
          </svg>
        </div>
      </div>
      <div className="h-[11.619px] overflow-clip relative shrink-0 w-[16px]" data-name="Wifi">
        <div className="absolute inset-[69.84%_34.38%_-0.01%_34.32%]" data-name="Bar 1">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.00764 3.5052">
            <path d={svgPaths.p3761f300} fill="var(--fill-0, #150000)" id="Bar 1" />
          </svg>
        </div>
        <div className="absolute inset-[33.73%_18.68%_31.83%_18.75%]" data-name="Bar 2">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0118 4.00134">
            <path d={svgPaths.p2a184900} fill="var(--fill-0, #150000)" id="Bar 2" />
          </svg>
        </div>
        <div className="absolute inset-[0.01%_0.01%_56.96%_-0.02%]" data-name="Bar 3">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0014 4.99924">
            <path d={svgPaths.p296b2880} fill="var(--fill-0, #150000)" id="Bar 3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] overflow-clip relative shrink-0 w-[24px]" data-name="Battery">
        <div className="absolute inset-[0_12.5%_0_0]" data-name="border">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.0015 12">
            <path d={svgPaths.p26365380} fill="var(--fill-0, #150000)" id="border" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bg-[#150000] inset-[16.67%_20.83%_16.67%_8.33%] rounded-[1px]" data-name="indicator" />
        <div className="absolute inset-[33.33%_0_33.33%_91.67%]" data-name="cap">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d={svgPaths.p248f4800} fill="var(--fill-0, #150000)" id="cap" opacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0">
      <div className="content-stretch flex h-[48px] items-center justify-between pl-[35px] pr-[16px] py-[16px] relative shrink-0 w-[390px]" data-name="Status Bar/iOS">
        <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Time">
          <Clock />
        </div>
        <Icons />
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[4px] items-start justify-center left-[16px] top-[94px] whitespace-nowrap">
      <p className="font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#322d2d] text-[24px]">Final</p>
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#5b5757] text-[14px]">
        <span className="leading-[normal]">20:00</span>
        <span className="font-['Manrope:Regular',sans-serif] font-normal leading-[normal]">•</span>
        <span className="leading-[normal]">{`18 Dec 2022 `}</span>
      </p>
    </div>
  );
}

function CarbonChevronLeft() {
  return (
    <div className="absolute inset-[6.67%_89.74%_90.83%_4.1%]" data-name="carbon:chevron-left">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 22.025">
        <g id="carbon:chevron-left">
          <path d={svgPaths.p2eb43f00} fill="var(--fill-0, #150000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <div className="relative shrink-0 size-[48px]" data-name="580b57fcd9996e24bc43c4e1 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img580B57Fcd9996E24Bc43C4E11} />
      </div>
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">CHELSEA</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 text-[#150000]">
      <p className="relative shrink-0 text-[16px]">3</p>
      <p className="relative shrink-0 text-[14px]">-</p>
      <p className="relative shrink-0 text-[16px]">3</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex font-['Manrope:SemiBold',sans-serif] font-semibold gap-[24px] items-start relative shrink-0">
      <p className="relative shrink-0 text-[#848181] text-[16px]">(4)</p>
      <Frame34 />
      <p className="relative shrink-0 text-[#848181] text-[16px]">(2)</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center relative shrink-0">
      <p className="relative shrink-0 text-[#848181] text-[12px]">Chelsea win 4-2 penalties</p>
      <p className="relative shrink-0 text-[#150000] text-[14px]">FULL-Time</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center leading-[normal] relative shrink-0 whitespace-nowrap">
      <Frame33 />
      <Frame36 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <div className="h-[48px] relative shrink-0 w-[47.371px]" data-name="580b57fcd9996e24bc43c4e7 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img580B57Fcd9996E24Bc43C4E71} />
      </div>
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">MAN UTD</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-[16px] top-[165px] w-[358px]">
      <Frame20 />
      <Frame35 />
      <Frame24 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b5757] text-[14px] whitespace-nowrap">Overview</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, #FAFAFA)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b5757] text-[14px] whitespace-nowrap">Stats</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, #FAFAFA)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-full items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Playing XI</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, #FF5050)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b5757] text-[14px] whitespace-nowrap">Video</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, #FAFAFA)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pt-[16px] relative shrink-0 w-[358px]">
      <Frame5 />
      <Frame6 />
      <div className="flex flex-row items-center self-stretch">
        <Frame7 />
      </div>
      <Frame3 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] top-[266px]">
      <Frame4 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#d6d5d5] flex-[1_0_0] h-[32px] min-w-px relative">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">CHELSEA</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#ff5050] flex-[1_0_0] h-[32px] min-w-px relative">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">MAN UTD</p>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[24px] content-stretch flex gap-[16px] items-start left-1/2 w-[358px]">
      <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px relative" data-name="Button">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <Frame1 />
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px relative" data-name="Button">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <Frame2 />
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center px-[16px] relative shrink-0 w-[390px]">
      <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[18px] whitespace-nowrap">Goalkeeper</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="[word-break:break-word] bg-white content-stretch flex gap-[16px] items-center leading-[normal] px-[16px] py-[8px] relative shrink-0 w-[390px] whitespace-nowrap">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px]">1</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px]">Saad Alsheed</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame10 />
      <Frame8 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center px-[16px] relative shrink-0 w-[390px]">
      <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[18px] whitespace-nowrap">Defender</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px] w-[17px]">2</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Pedro Miguel</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px] w-[17px]">7</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Bassam Hisham</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px] whitespace-nowrap">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px]">12</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px]">Karim Boudaif</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px] whitespace-nowrap">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px]">12</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px]">Akram Afif</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0">
      <Frame12 />
      <Frame13 />
      <Frame14 />
      <Frame15 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame11 />
      <Frame29 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center px-[16px] relative shrink-0 w-[390px]">
      <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[18px] whitespace-nowrap">Forward</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px] w-[17px]">2</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Pedro Miguel</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px] w-[17px]">7</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Bassam Hisham</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame16 />
      <Frame31 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center px-[16px] relative shrink-0 w-[390px]">
      <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[18px] whitespace-nowrap">Midfield</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px] w-[17px]">2</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Pedro Miguel</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative shrink-0 w-[390px] whitespace-nowrap">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#5b5757] text-[16px]">12</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#150000] text-[14px]">Akram Afif</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0">
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame19 />
      <Frame38 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-0 top-[333px]">
      <Frame27 />
      <Frame28 />
      <Frame30 />
      <Frame32 />
    </div>
  );
}

export default function PlayingXi() {
  return (
    <div className="bg-[#fafafa] relative size-full" data-name="Playing XI">
      <Frame />
      <Frame26 />
      <CarbonChevronLeft />
      <Frame37 />
      <Frame23 />
      <Frame25 />
      <Frame9 />
    </div>
  );
}