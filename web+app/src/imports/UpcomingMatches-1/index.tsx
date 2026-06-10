import svgPaths from "./svg-h68o6awah";
import imgPngwing from "./caf39c91b1e17395683d9183a301519f03a26079.png";
import imgImage22 from "./a883caf573867632713fa03b19c03143d5ad31d1.png";
import imgPngItem4106574 from "./21d030c6f129d1b9ba359b22bf95948794a632f9.png";
import imgPngwing1 from "./8d1bdbe1d670b5064cc53eae70f95547c4092786.png";
import img58419Ca3A6515B1E0Ad75A64 from "./93125d83f2e5029678e0afca4895bc74927d179b.png";
import img58419Bf3A6515B1E0Ad75A59 from "./13773bc0ae62509a9edf511754f235ec5514a44b.png";
import img58419C8Da6515B1E0Ad75A63 from "./b07583d37abde2240d3c6415d348fb17cb822556.png";
import img58419D0Aa6515B1E0Ad75A6C from "./bb68a2dc4f8fe4d7a4ccb7a29d6c0556fa7c3431.png";

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

function Frame1() {
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

function Frame2() {
  return (
    <div className="bg-[#ff5050] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
      <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Basketball</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="carbon:chevron-sort-down">
        <div className="absolute inset-[33.33%_16.67%_26.67%_16.67%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 6.4">
            <path d={svgPaths.p314fd380} fill="var(--fill-0, #FAFAFA)" id="Vector" stroke="var(--stroke-0, #FAFAFA)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[60px] w-[358px]">
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[24px] whitespace-nowrap">Matches</p>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Drop down">
        <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Button">
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
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[80px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute left-[16px] size-[48px] top-[16px]" data-name="pngwing">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPngwing} />
        </div>
      </div>
      <div aria-hidden className="absolute border-[#eeeded] border-[1.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0">
      <Frame3 />
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[12px] text-center w-[79px]">Premier League</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[80px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute left-[16px] size-[48px] top-[16px]" data-name="image 22">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage22} />
        </div>
      </div>
      <div aria-hidden className="absolute border-[#eeeded] border-[1.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0">
      <Frame4 />
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[12px] text-center w-[63px]">FIBA League</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[80px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute h-[47.644px] left-[16px] top-[16px] w-[48px]" data-name="PngItem_4106574">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPngItem4106574} />
        </div>
      </div>
      <div aria-hidden className="absolute border-[#eeeded] border-[1.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0">
      <Frame5 />
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[12px] text-center w-[44px]">NBL League</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 size-[80px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute left-[16px] size-[48px] top-[16px]" data-name="pngwing 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPngwing1} />
        </div>
      </div>
      <div aria-hidden className="absolute border-[#eeeded] border-[1.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0">
      <Frame6 />
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[12px] text-center w-[79px]">Brooklyn League</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start left-[16px] top-[117px]">
      <Frame10 />
      <Frame9 />
      <Frame11 />
      <Frame7 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#150000] text-[16px] whitespace-nowrap">Upcoming</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 78 2">
            <line id="Line 2" stroke="var(--stroke-0, #FF5050)" strokeWidth="2" x2="78" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#5b5757] text-[16px] whitespace-nowrap">Past Matches</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104 2">
            <line id="Line 2" stroke="var(--stroke-0, #FAFAFA)" strokeWidth="2" x2="104" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex gap-[27px] items-center left-[16px] top-[261px]">
      <Frame13 />
      <Frame15 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[134px]">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] min-w-px relative text-[#322d2d] text-[14px]">76ers</p>
      <div className="relative shrink-0 size-[48px]" data-name="58419ca3a6515b1e0ad75a64">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img58419Ca3A6515B1E0Ad75A64} />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[134px]">
      <div className="relative shrink-0 size-[48px]" data-name="58419bf3a6515b1e0ad75a59">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img58419Bf3A6515B1E0Ad75A59} />
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] min-w-px relative text-[#322d2d] text-[14px]">TR raptor</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-start justify-between px-[16px] relative shrink-0 w-[358px]">
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[20px] text-white">95</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#d6d5d5] text-[12px]">22-9</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 text-[#d6d5d5]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[20px]">92</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[12px]">22-9</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="[word-break:break-word] bg-[#1e1e1e] content-stretch flex items-center justify-between leading-[normal] px-[24px] py-[8px] relative shrink-0 w-[358px] whitespace-nowrap">
      <Frame33 />
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[16px] text-white">Final</p>
      <Frame32 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#eeeded] content-stretch flex flex-col gap-[24px] items-start overflow-clip pt-[16px] relative shrink-0">
      <div className="absolute flex h-[218.518px] items-center justify-center left-[165.54px] top-[-36.7px] w-[226.222px]">
        <div className="flex-none rotate-[12.73deg]">
          <div className="bg-[#e3e3e3] h-[180.859px] relative w-[191.062px]" />
        </div>
      </div>
      <Frame21 />
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#322d2d] text-[14px] w-[59px]">Cavalers</p>
      <div className="h-[38.081px] relative shrink-0 w-[72px]" data-name="58419c8da6515b1e0ad75a63">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img58419C8Da6515B1E0Ad75A63} />
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <div className="h-[40.989px] relative shrink-0 w-[64px]" data-name="58419d0aa6515b1e0ad75a6c">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img58419D0Aa6515B1E0Ad75A6C} />
      </div>
      <p className="[word-break:break-word] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#322d2d] text-[14px] w-[59px]">Lakers</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] relative shrink-0 w-[358px]">
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[20px] text-white">95</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#d6d5d5] text-[12px]">22-9</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 text-[#d6d5d5]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[20px]">92</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[12px]">22-9</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="[word-break:break-word] bg-[#1e1e1e] content-stretch flex items-center justify-between leading-[normal] px-[24px] py-[8px] relative shrink-0 w-[358px] whitespace-nowrap">
      <Frame34 />
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[16px] text-white">Final</p>
      <Frame35 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#eeeded] content-stretch flex flex-col gap-[24px] items-start overflow-clip pt-[16px] relative shrink-0">
      <div className="absolute flex h-[218.518px] items-center justify-center left-[160.54px] top-[-36.7px] w-[226.222px]">
        <div className="flex-none rotate-[12.73deg]">
          <div className="bg-[#e3e3e3] h-[180.859px] relative w-[191.062px]" />
        </div>
      </div>
      <Frame23 />
      <Frame24 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[16px] top-[361px]">
      <Frame26 />
      <Frame22 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[134px]">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] min-w-px relative text-[#322d2d] text-[14px]">76ers</p>
      <div className="relative shrink-0 size-[48px]" data-name="58419ca3a6515b1e0ad75a64">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img58419Ca3A6515B1E0Ad75A64} />
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[134px]">
      <div className="relative shrink-0 size-[48px]" data-name="58419bf3a6515b1e0ad75a59">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img58419Bf3A6515B1E0Ad75A59} />
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] min-w-px relative text-[#322d2d] text-[14px]">TR raptor</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-start justify-between px-[16px] relative shrink-0 w-[358px]">
      <Frame29 />
      <Frame30 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[20px] text-white">95</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#d6d5d5] text-[12px]">22-9</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 text-[#d6d5d5]">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[20px]">92</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[12px]">22-9</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="[word-break:break-word] bg-[#1e1e1e] content-stretch flex items-center justify-between leading-[normal] px-[24px] py-[8px] relative shrink-0 w-[358px] whitespace-nowrap">
      <Frame36 />
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[16px] text-white">Final</p>
      <Frame37 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute bg-[#eeeded] content-stretch flex flex-col gap-[24px] items-start left-[16px] overflow-clip pt-[16px] top-[742px]">
      <div className="absolute flex h-[218.518px] items-center justify-center left-[165.54px] top-[-36.7px] w-[226.222px]">
        <div className="flex-none rotate-[12.73deg]">
          <div className="bg-[#e3e3e3] h-[180.859px] relative w-[191.062px]" />
        </div>
      </div>
      <Frame28 />
      <Frame31 />
    </div>
  );
}

function RiHome6Line() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ri:home-6-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ri:home-6-line">
          <path d={svgPaths.p15c71780} fill="var(--fill-0, #150000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IonNewspaperSharp() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ion:newspaper-sharp">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ion:newspaper-sharp">
          <g id="Vector" />
          <path d={svgPaths.p2bebfc80} fill="var(--fill-0, #FF5050)" id="Vector_2" />
          <path d={svgPaths.p166a7000} fill="var(--fill-0, #FF5050)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function MdiClipboardPlayMultipleOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi:clipboard-play-multiple-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:clipboard-play-multiple-outline">
          <path d={svgPaths.p16ad9400} fill="var(--fill-0, #150000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function RiUser3Line() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ri:user-3-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ri:user-3-line">
          <path d={svgPaths.p2c831180} fill="var(--fill-0, #150000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white flex-[1_0_0] h-[48px] min-w-px relative">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] py-[8px] relative size-full">
          <RiHome6Line />
          <IonNewspaperSharp />
          <MdiClipboardPlayMultipleOutline />
          <RiUser3Line />
        </div>
      </div>
    </div>
  );
}

export default function UpcomingMatches() {
  return (
    <div className="bg-[#fafafa] relative size-full" data-name="Upcoming matches">
      <Frame1 />
      <Frame12 />
      <Frame8 />
      <Frame14 />
      <p className="[word-break:break-word] absolute font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] left-[17px] text-[#322d2d] text-[16px] top-[315px] whitespace-nowrap">Friday -- February 25</p>
      <Frame25 />
      <Frame27 />
      <p className="[word-break:break-word] absolute font-['Manrope:SemiBold',sans-serif] font-semibold leading-[normal] left-[16px] text-[#322d2d] text-[16px] top-[704px] whitespace-nowrap">Saturday -- February 26</p>
      <div className="absolute content-stretch flex items-start left-[16px] overflow-clip top-[772px] w-[358px]" data-name="Navbar">
        <div className="flex items-center justify-center relative self-stretch shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[13px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 48">
                <foreignObject height="0" width="0" x="0" y="0">
                  <div style={{ backdropFilter: "blur(6px)", clipPath: "url(#bgblur_0_1_2490_clip_path)", height: "100%", width: "100%" }} xmlns="http://www.w3.org/1999/xhtml" />
                </foreignObject>
                <path d="M0 0L13 24L0 48V0Z" fill="var(--fill-0, white)" id="Rectangle 6" data-figma-bg-blur-radius="12" />
                <defs>
                  <clipPath id="bgblur_0_1_2490_clip_path" transform="translate(0 0)">
                    <path d="M0 0L13 24L0 48V0Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <Frame />
        <div className="relative self-stretch shrink-0 w-[13px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 48">
            <foreignObject height="0" width="0" x="0" y="0">
              <div style={{ backdropFilter: "blur(6px)", clipPath: "url(#bgblur_0_1_2481_clip_path)", height: "100%", width: "100%" }} xmlns="http://www.w3.org/1999/xhtml" />
            </foreignObject>
            <path d="M0 0L13 24L0 48V0Z" fill="var(--fill-0, white)" id="Rectangle 5" data-figma-bg-blur-radius="12" />
            <defs>
              <clipPath id="bgblur_0_1_2481_clip_path" transform="translate(0 0)">
                <path d="M0 0L13 24L0 48V0Z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}