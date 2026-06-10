import svgPaths from "./svg-6u50czikng";
import imgFrame1 from "./7d95a7636d7f5f1e95297bef4ceca467eef04bf8.png";

export default function LiveMatch({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex flex-col gap-[8px] items-start relative"} data-name="Live match">
      <div className="h-[208px] overflow-clip relative shrink-0 w-[357px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame1} />
        <div className="absolute content-stretch flex items-start left-0 top-[14px]">
          <div className="bg-[#ff5050] content-stretch flex gap-[4px] h-[22px] items-center px-[8px] relative shrink-0">
            <div className="relative shrink-0 size-[12px]">
              <div className="absolute h-[9.833px] left-[-5px] top-[1.08px] w-[18.353px]">
                <div className="absolute inset-[-2.38%_0]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3531 10.3006">
                    <g id="Frame 43845">
                      <path d={svgPaths.p38c8ae80} id="Rectangle 13 (Stroke)" stroke="var(--stroke-0, white)" />
                      <path d={svgPaths.p24e3dcc0} id="Rectangle 13 (Stroke)_2" stroke="var(--stroke-0, white)" />
                      <path d={svgPaths.p405a20} id="Rectangle 13 (Stroke)_3" stroke="var(--stroke-0, white)" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Bebas_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Watch live now</p>
          </div>
          <div className="relative self-stretch shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 22">
              <path d="M0 0L8 11L0 22V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] p-[4px] relative shrink-0 text-[#150000] w-[357px]">
        <p className="font-['Bebas_Neue:Bold',sans-serif] not-italic relative shrink-0 text-[20px] w-full">keep an eye on the stadium</p>
        <p className="font-['Manrope:Regular',sans-serif] font-normal relative shrink-0 text-[12px] w-full">Watch sports live or highlights, read every news from your smartphone</p>
      </div>
    </div>
  );
}