import svgPaths from "./svg-87p6x01nvs";
type DropDownProps = {
  className?: string;
  property1?: "Basketball" | "Football" | "Cricket";
};

export default function DropDown({ className, property1 = "Football" }: DropDownProps) {
  const isBasketball = property1 === "Basketball";
  return (
    <div className={className || "content-stretch flex items-start relative"}>
      <div className={`content-stretch flex h-[32px] items-center justify-center relative shrink-0 ${isBasketball ? "" : "w-[122px]"}`} data-name="Button">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className={`bg-[#ff5050] h-[32px] relative ${isBasketball ? "content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] shrink-0" : "flex-[1_0_0] min-w-px"}`}>
          {["Football", "Cricket"].includes(property1) && (
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative size-full">
                <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">{property1 === "Cricket" ? "Cricket" : "Football"}</p>
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="carbon:chevron-sort-down">
                  <div className="absolute inset-[33.33%_16.67%_26.67%_16.67%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 6.4">
                      <path d={svgPaths.p314fd380} fill="var(--fill-0, #FAFAFA)" id="Vector" stroke="var(--stroke-0, #FAFAFA)" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isBasketball && (
            <>
              <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Basketball</p>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="carbon:chevron-sort-down">
                <div className="absolute inset-[33.33%_16.67%_26.67%_16.67%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 6.4">
                    <path d={svgPaths.p314fd380} fill="var(--fill-0, #FAFAFA)" id="Vector" stroke="var(--stroke-0, #FAFAFA)" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #FF5050)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}