import svgPaths from "./svg-nthcv9jarj";
import img580B57Fcd9996E24Bc43C4E11 from "./32a3c0649e0c9c5fcab667fc4b0e3e5ab40d86e0.png";
import img580B57Fcd9996E24Bc43C4E71 from "./29a00d887b70ab624fe541b4433ff7143258d3dc.png";
import imgRectangle19 from "./d335713708a202643dc7c9d748a7734dc0f71664.png";
import imgRectangle20 from "./3776bdd52f94bffc2906c592c0c02ccab684b409.png";
import imgRectangle21 from "./027af92036bbb80a4b5d79a253b35d34875de0f3.png";

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

function Frame29() {
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
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 21.1">
        <g id="carbon:chevron-left">
          <path d={svgPaths.pd463200} fill="var(--fill-0, #150000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <div className="relative shrink-0 size-[48px]" data-name="580b57fcd9996e24bc43c4e1 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img580B57Fcd9996E24Bc43C4E11} />
      </div>
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">CHELSEA</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 text-[#150000]">
      <p className="relative shrink-0 text-[16px]">3</p>
      <p className="relative shrink-0 text-[14px]">-</p>
      <p className="relative shrink-0 text-[16px]">3</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex font-['Manrope:SemiBold',sans-serif] font-semibold gap-[24px] items-start relative shrink-0">
      <p className="relative shrink-0 text-[#848181] text-[16px]">(4)</p>
      <Frame31 />
      <p className="relative shrink-0 text-[#848181] text-[16px]">(2)</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center relative shrink-0">
      <p className="relative shrink-0 text-[#848181] text-[12px]">Chelsea win 4-2 penalties</p>
      <p className="relative shrink-0 text-[#150000] text-[14px]">FULL-Time</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center leading-[normal] relative shrink-0 whitespace-nowrap">
      <Frame30 />
      <Frame33 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <div className="h-[48px] relative shrink-0 w-[47.371px]" data-name="580b57fcd9996e24bc43c4e7 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img580B57Fcd9996E24Bc43C4E71} />
      </div>
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">MAN UTD</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-[16px] top-[165px] w-[358px]">
      <Frame26 />
      <Frame32 />
      <Frame28 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Overview</p>
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

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b5757] text-[14px] whitespace-nowrap">Stats</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, white)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-full items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b5757] text-[14px] whitespace-nowrap">Playing XI</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, white)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-[80px]">
      <p className="[word-break:break-word] font-['Manrope:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b5757] text-[14px] whitespace-nowrap">Video</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 2">
            <line id="Line 2" stroke="var(--stroke-0, white)" strokeWidth="2" x2="80" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pt-[16px] relative shrink-0 w-[358px]">
      <Frame23 />
      <Frame24 />
      <div className="flex flex-row items-center self-stretch">
        <Frame25 />
      </div>
      <Frame21 />
    </div>
  );
}

function CarbonChevronRight() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="carbon:chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="carbon:chevron-right">
          <path d={svgPaths.p324f6d00} fill="var(--fill-0, #FF5050)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#ff5050] text-[12px] whitespace-nowrap">View all</p>
      <CarbonChevronRight />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[358px]">
      <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[20px] whitespace-nowrap">Fifa World Cup</p>
      <Frame7 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 text-[#fafafa]">
      <p className="font-['Manrope:Medium',sans-serif] font-medium min-w-full relative shrink-0 text-[12px] w-[min-content]">Qatar World Cup 2022</p>
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] w-[171px]">Messi goals against Switzerland</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#150000] flex-[1_0_0] min-w-px relative">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative size-full">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Read More</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#ff5050] flex-[1_0_0] min-w-px relative self-stretch">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start justify-center px-[12px] py-[16px] relative size-full">
          <Frame12 />
          <div className="content-stretch flex items-center justify-center relative shrink-0 w-[107px]" data-name="Button">
            <div className="flex flex-row items-center self-stretch">
              <div className="flex h-full items-center justify-center relative shrink-0">
                <div className="-scale-y-100 flex-none h-full rotate-180">
                  <div className="h-full relative w-[8px]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 22">
                      <path d="M0 0L8 11L0 22V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <Frame1 />
            <div className="flex flex-row items-center self-stretch">
              <div className="h-full relative shrink-0 w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 22">
                  <path d="M0 0L8 11L0 22V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex h-[124px] items-start relative shrink-0 w-[358px]">
      <div className="relative self-stretch shrink-0 w-[179px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle19} />
      </div>
      <Frame6 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame8 />
      <Frame19 />
    </div>
  );
}

function CarbonPlayFilledAlt() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="carbon:play-filled-alt">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="carbon:play-filled-alt">
          <path d={svgPaths.p109f5e00} fill="var(--fill-0, #FAFAFA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#ff5050] flex-[1_0_0] min-w-px relative">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative size-full">
          <CarbonPlayFilledAlt />
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] h-[12px] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] w-[25px]">04:22</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[52.5px] top-[122px] w-[66px]">
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 20">
                <path d="M0 0L8 10L0 20V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame2 />
      <div className="flex flex-row items-center self-stretch">
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 20">
            <path d="M0 0L8 10L0 20V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <div className="h-[132px] relative shrink-0 w-[171px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle20} />
      </div>
      <Frame9 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 text-center">
      <p className="font-['Manrope:Medium',sans-serif] font-medium min-w-full relative shrink-0 text-[#322d2d] text-[12px] w-[min-content]">Qatar World Cup 2022</p>
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#150000] text-[14px] w-[171px]">Best of Portugal goals against Switzerland</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0">
      <Frame11 />
      <Frame14 />
    </div>
  );
}

function CarbonPlayFilledAlt1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="carbon:play-filled-alt">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="carbon:play-filled-alt">
          <path d={svgPaths.p109f5e00} fill="var(--fill-0, #FAFAFA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#ff5050] flex-[1_0_0] min-w-px relative">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative size-full">
          <CarbonPlayFilledAlt1 />
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] h-[12px] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] w-[25px]">04:22</p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[52.5px] top-[122px] w-[66px]">
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 20">
                <path d="M0 0L8 10L0 20V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame3 />
      <div className="flex flex-row items-center self-stretch">
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 20">
            <path d="M0 0L8 10L0 20V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <div className="h-[132px] relative shrink-0 w-[171px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle21} />
      </div>
      <Frame10 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 text-center">
      <p className="font-['Manrope:Medium',sans-serif] font-medium min-w-full relative shrink-0 text-[#322d2d] text-[12px] w-[min-content]">Qatar World Cup 2022</p>
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#150000] text-[14px] w-[171px]">Messi goals against Switzerland</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <Frame13 />
      <Frame15 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[16px] top-[266px]">
      <Frame22 />
      <Frame20 />
      <Frame16 />
    </div>
  );
}

function Frame4() {
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

function Frame5() {
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

function Frame35() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[16px] top-[788px] w-[358px]">
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
        <Frame4 />
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
        <Frame5 />
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  return (
    <div className="bg-[#fafafa] relative size-full" data-name="Overview">
      <Frame />
      <Frame29 />
      <CarbonChevronLeft />
      <Frame34 />
      <Frame27 />
      <Frame35 />
    </div>
  );
}